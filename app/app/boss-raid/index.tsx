'use client'

import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { GroupWithRaids, RaidData, RaidTaskData } from '@/types/raids'
import { RaidUpdateMessage } from '@/types/websocket'
import { getWebSocketDomain } from '@/utils/domain'
import { useEffect, useMemo, useRef, useState } from 'react'
import { RaidView } from './raid-view'
import { RECONNECT_DELAY_MS } from './utils'

function isRaidUpdate(msg: unknown): msg is RaidUpdateMessage {
  return typeof msg === 'object' && msg !== null && (msg as RaidUpdateMessage).type === 'RAID_UPDATE'
}

function modifyRaidState(raid: RaidData, msg: RaidUpdateMessage): RaidData {
  if (raid.id !== msg.raidId) return raid

  const memberPatchesByUserId = msg.members
    ? new Map(msg.members.map((memberPatch) => [memberPatch.userId, memberPatch]))
    : null

  const users = memberPatchesByUserId
    ? raid.users.map((user) => {
        const memberPatch = memberPatchesByUserId.get(user.userId)
        return memberPatch ? { ...user, health: memberPatch.health, maxHealth: memberPatch.maxHealth } : user
      })
    : raid.users

  return {
    ...raid,
    health: msg.health,
    maxHealth: msg.maxHealth,
    status: msg.status as RaidData['status'],
    users,
  }
}

function applyRaidUpdate(groups: GroupWithRaids[], msg: RaidUpdateMessage): GroupWithRaids[] {
  return groups.map((group) => {
    if (group.groupId !== msg.groupId) return group

    return {
      ...group,
      raids: group.raids.map((raid) => modifyRaidState(raid, msg)),
    }
  })
}

export default function BossRaidPage() {
  const auth = useAuth()
  const currentUser = auth.user

  const [groupsData, setGroupsData] = useState<GroupWithRaids[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [onlineUserIds, setOnlineUserIds] = useState<Set<number>>(new Set())
  const [, setTick] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const currentRaidRef = useRef<RaidData | null>(null)
  const wsConnectedRef = useRef(false)

  const socketUrl = useMemo(() => new URL('/api/ws/presence', getWebSocketDomain()).toString(), [])

  const fetchAllRaids = async () => {
    try {
      const groupsRes = await fetch(`/api/groups`, { credentials: 'include' })

      if (!groupsRes.ok) return
      const groups = (await groupsRes.json()) as Array<{ id: number; name: string }>

      const results: GroupWithRaids[] = []

      for (const group of groups) {
        const raidsRes = await fetch(`/api/groups/${group.id}/raids`, { credentials: 'include' })
        const raids: RaidData[] = raidsRes.ok ? ((await raidsRes.json()) as RaidData[]) : []
        results.push({ groupId: group.id, groupName: group.name, raids })
      }

      setGroupsData(results)
      setSelectedGroupId((prev) => prev ?? results[0]?.groupId ?? null)
    } catch {}
  }

  useEffect(() => {
    void fetchAllRaids()
  }, [])

  const refreshRaids = async (groupId: number) => {
    try {
      const res = await fetch(`/api/groups/${groupId}/raids`, { credentials: 'include' })
      if (!res.ok) return
      const raids = (await res.json()) as RaidData[]
      setGroupsData((prev) => prev.map((group) => (group.groupId === groupId ? { ...group, raids } : group)))
    } catch {}
  }

  useEffect(() => {
    let ignore = false
    let socket: WebSocket | null = null
    let reconnectTimer: ReturnType<typeof setTimeout> | undefined

    const connect = () => {
      if (ignore) return
      socket = new WebSocket(socketUrl)

      socket.onopen = () => {
        wsConnectedRef.current = true
      }

      socket.onmessage = (event) => {
        try {
          const payload: unknown = JSON.parse(event.data as string)

          if (isRaidUpdate(payload)) {
            setGroupsData((prev) => applyRaidUpdate(prev, payload))
            void refreshRaids(payload.groupId)
          } else if (Array.isArray(payload)) {
            setOnlineUserIds(new Set((payload as Array<{ id: number }>).map((u) => u.id)))
          }
        } catch {}
      }

      socket.onclose = () => {
        wsConnectedRef.current = false
        if (!ignore) {
          reconnectTimer = setTimeout(connect, RECONNECT_DELAY_MS)
        }
      }

      socket.onerror = () => {
        wsConnectedRef.current = false
      }
    }

    connect()
    return () => {
      ignore = true
      wsConnectedRef.current = false
      clearTimeout(reconnectTimer)
      socket?.close(1000, 'unmounted')
    }
  }, [socketUrl])

  // 1-second ticker for active countdown; falls back to polling when WebSocket is unavailable
  useEffect(() => {
    let pollTick = 0
    const id = setInterval(() => {
      setTick((t) => t + 1)
      pollTick++

      const raid = currentRaidRef.current

      if (!wsConnectedRef.current && pollTick % 3 === 0) {
        if (raid) void refreshRaids(raid.groupId)
        else void fetchAllRaids()
      }

      if (!raid) return

      if (raid.status === 'ACTIVE' && raid.startedAt) {
        const elapsed = Math.floor((Date.now() - new Date(raid.startedAt).getTime()) / 1000)
        if (elapsed >= raid.durationSeconds) refreshRaids(raid.groupId)
      } else if (raid.status === 'SCHEDULED' && raid.scheduledTime) {
        if (Date.now() >= new Date(raid.scheduledTime).getTime()) void refreshRaids(raid.groupId)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [])

  const selectedGroup = groupsData.find((g) => g.groupId === selectedGroupId)

  const currentRaid = useMemo(() => {
    if (!selectedGroup) {
      return null
    }
    const raids = selectedGroup.raids

    return raids.find((r) => r.status === 'ACTIVE') ?? raids.find((raid) => raid.status === 'SCHEDULED') ?? raids.at(-1) ?? null
  }, [selectedGroup])

  currentRaidRef.current = currentRaid

  const handleJoin = async (raidId: number, groupId: number) => {
    setError(null)
    try {
      const res = await fetch(`/api/raids/${raidId}/join`, { method: 'POST', credentials: 'include' })

      if (!res.ok) {
        const err = await res.json()
        setError((err as { message?: string }).message ?? 'Could not join raid')
        return
      }

      await refreshRaids(groupId)
    } catch {
      setError('Network error')
    }
  }

  const handleQuickStart = async (groupId: number) => {
    setError(null)
    try {
      const res = await fetch(`/api/groups/${groupId}/raids/quick`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        const err = await res.json()
        setError((err as { message?: string }).message ?? 'Could not start raid')
        return
      }
      const raid = (await res.json()) as { id: number }
      await fetch(`/api/raids/${raid.id}/join`, { method: 'POST', credentials: 'include' })
      await refreshRaids(groupId)
    } catch {
      setError('Network error')
    }
  }

  const handleCompleteTask = async (raidId: number, task: RaidTaskData, success: boolean, groupId: number) => {
    setError(null)
    try {
      const res = await fetch(`/api/raids/${raidId}/tasks/${task.id}/complete?success=${success}`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        const err = await res.json()
        setError((err as { message?: string }).message ?? 'Could not complete task')
        return
      }

      await refreshRaids(groupId)
    } catch {
      setError('Network error')
    }
  }

  if (!currentUser) {
    return <div className='flex items-center justify-center p-8 text-muted-foreground'>Loading…</div>
  }

  return (
    <div className='flex flex-col gap-4 p-4'>
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h2>Boss Raid</h2>
          <p className='text-sm text-muted-foreground'>Fight together, defeat the boss</p>
        </div>

        <div className='flex items-center gap-2'>
          {selectedGroupId && (
            <Button
              size='sm'
              variant='outline'
              disabled={currentRaid?.status === 'ACTIVE'}
              onClick={() => handleQuickStart(selectedGroupId)}
            >
              Quick Start
            </Button>
          )}

          {groupsData.length > 1 && (
            <Select value={selectedGroupId?.toString()} onValueChange={(value) => setSelectedGroupId(Number(value))}>
              <SelectTrigger aria-label='Select group' className='h-9 min-w-44 rounded-md text-sm'>
                <SelectValue placeholder='Select group' />
              </SelectTrigger>
              <SelectContent>
                {groupsData.map((group) => (
                  <SelectItem key={group.groupId} value={group.groupId.toString()}>
                    {group.groupName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
      </div>

      {error && (
        <div className='rounded-lg border border-destructive px-4 py-3'>
          {/* TODO: Implement shadcn sonner */}
          <p className='text-sm text-destructive'>{error}</p>
        </div>
      )}

      {!selectedGroup || selectedGroup.raids.length === 0 ? (
        <div className='rounded-xl border border-dashed p-12 text-center text-muted-foreground'>
          {groupsData.length === 0
            ? 'You are not in any group. Join a group to participate in boss raids.'
            : 'No raids scheduled for this group yet. Use Quick Start above.'}
        </div>
      ) : currentRaid ? (
        <RaidView
          raid={currentRaid}
          currentUserId={currentUser.id}
          onlineUserIds={onlineUserIds}
          onJoin={() => handleJoin(currentRaid.id, currentRaid.groupId)}
          onCompleteTask={(task, success) => handleCompleteTask(currentRaid.id, task, success, currentRaid.groupId)}
        />
      ) : null}
    </div>
  )
}
