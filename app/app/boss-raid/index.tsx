'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Popover, PopoverAnchor, PopoverContent } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useWebsocketContext } from '@/hooks/useWebsocketContext'
import { GroupWithRaids, RaidData, RaidTaskData } from '@/types/raids'
import { RaidSocketMessage, RaidUpdateMessage } from '@/types/websocket'
import { ArrowLeft, Moon } from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { toast } from 'sonner'
import { DefeatCard } from './cards/defeat-card'
import { VictoryCard } from './cards/victory-card'
import { PastRaidsList } from './past-raids'
import { RaidView } from './raid-view'
import { toRaidCard } from './utils'

function modifyRaidState(raid: RaidData, msg: RaidUpdateMessage): RaidData {
  if (raid.id !== msg.raidId) return raid

  const memberPatchesByUserId = msg.members
    ? new Map(msg.members.map((memberPatch) => [memberPatch.userId, memberPatch]))
    : null

  const users = memberPatchesByUserId
    ? raid.users.map((user) => {
        const memberPatch = memberPatchesByUserId.get(user.userId)
        return memberPatch
          ? {
              ...user,
              health: memberPatch.health,
              maxHealth: memberPatch.maxHealth,
              knockedOut: memberPatch.knockedOut ?? user.knockedOut,
            }
          : user
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

function applyRaidDeletion(groups: GroupWithRaids[], groupId: number, raidId: number): GroupWithRaids[] {
  return groups.map((group) => {
    if (group.groupId !== groupId) return group
    return {
      ...group,
      raids: group.raids.filter((raid) => raid.id !== raidId),
    }
  })
}

function computeStats(groupsData: GroupWithRaids[], userId: number) {
  const endedRaids: RaidData[] = []
  for (const group of groupsData) {
    for (const raid of group.raids) {
      if (raid.status === 'DEFEATED' || raid.status === 'FAILED') endedRaids.push(raid)
    }
  }

  endedRaids.sort((a, b) => {
    const aTime = a.startedAt ? new Date(a.startedAt).getTime() : 0
    const bTime = b.startedAt ? new Date(b.startedAt).getTime() : 0
    return aTime - bTime
  })

  let wins = 0
  let losses = 0
  let totalXp = 0
  let totalDamage = 0
  let raidsWithMember = 0
  let bestStreak = 0
  let currentStreak = 0

  for (const raid of endedRaids) {
    const me = raid.users.find((u) => u.userId === userId)
    if (!me) continue
    raidsWithMember += 1
    totalXp += me.xpEarned ?? 0
    totalDamage += me.damageDealt ?? 0
    if (raid.status === 'DEFEATED') {
      wins += 1
      currentStreak += 1
      if (currentStreak > bestStreak) bestStreak = currentStreak
    } else {
      losses += 1
      currentStreak = 0
    }
  }

  const avgDamage = raidsWithMember > 0 ? Math.round(totalDamage / raidsWithMember) : 0
  return { wins, losses, totalXp, bestStreak, avgDamage }
}

export default function BossRaidPage() {
  const auth = useAuth()
  const currentUser = auth.user
  const api = useApi()
  const { onlineUsers, subscribeToRaidUpdates } = useWebsocketContext()

  const [groupsData, setGroupsData] = useState<GroupWithRaids[]>([])
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null)
  const [, setTick] = useState(0)
  const [adminVisible, setAdminVisible] = useState(false)
  const [openRaid, setOpenRaid] = useState<RaidData | null>(null)
  const [dismissedOutcomeIds, setDismissedOutcomeIds] = useState<Set<number>>(() => {
    if (typeof window === 'undefined') return new Set()
    try {
      const stored = window.localStorage.getItem('dismissedRaidOutcomes')
      return new Set(stored ? (JSON.parse(stored) as number[]) : [])
    } catch {
      return new Set()
    }
  })
  const titleClickCount = useRef(0)

  // Derive onlineUserIds from context
  const onlineUserIds = useMemo(
    () => new Set(onlineUsers.map((u) => (typeof u.id === 'number' ? u.id : parseInt(u.id, 10)))),
    [onlineUsers],
  )

  const fetchAllRaids = useCallback(async () => {
    try {
      const groups = await api.get<Array<{ id: number; name: string }>>('/groups')
      const results: GroupWithRaids[] = []
      for (const group of groups) {
        let raids: RaidData[] = []
        try {
          raids = await api.get<RaidData[]>(`/groups/${group.id}/raids`)
        } catch {}
        results.push({ groupId: group.id, groupName: group.name, raids })
      }
      setGroupsData(results)
      setSelectedGroupId((prev) => prev ?? results[0]?.groupId ?? null)
    } catch {}
  }, [api])

  useEffect(() => {
    void fetchAllRaids()
  }, [fetchAllRaids])

  const refreshRaids = useCallback(
    async (groupId: number) => {
      try {
        const raids = await api.get<RaidData[]>(`/groups/${groupId}/raids`)
        setGroupsData((prev) => prev.map((group) => (group.groupId === groupId ? { ...group, raids } : group)))
      } catch {}
    },
    [api],
  )

  const lastRefetchByGroupRef = useRef<Map<number, number>>(new Map())
  const REFETCH_THROTTLE_MS = 1500

  useEffect(() => {
    let ignore = false

    const unsubscribe = subscribeToRaidUpdates((msg: RaidSocketMessage) => {
      if (ignore) return
      if (msg.type === 'RAID_DELETED') {
        setGroupsData((prev) => applyRaidDeletion(prev, msg.groupId, msg.raidId))
        return
      }

      let statusChanged = false
      setGroupsData((prev) => {
        const group = prev.find((g) => g.groupId === msg.groupId)
        const existing = group?.raids.find((r) => r.id === msg.raidId)
        if (!existing || existing.status !== msg.status) statusChanged = true
        return applyRaidUpdate(prev, msg)
      })

      const last = lastRefetchByGroupRef.current.get(msg.groupId) ?? 0
      const now = Date.now()
      if (statusChanged || now - last > REFETCH_THROTTLE_MS) {
        lastRefetchByGroupRef.current.set(msg.groupId, now)
        refreshRaids(msg.groupId)
      }
    })

    return () => {
      ignore = true
      unsubscribe()
    }
  }, [refreshRaids, subscribeToRaidUpdates])

  useEffect(() => {
    const id = setInterval(() => {
      setTick((tick) => tick + 1)
    }, 1000)

    return () => clearInterval(id)
  }, [])

  const selectedGroup = groupsData.find((g) => g.groupId === selectedGroupId)

  const liveRaid = useMemo(() => {
    if (!selectedGroup) return null
    return (
      selectedGroup.raids.find((r) => r.status === 'ACTIVE') ??
      selectedGroup.raids.find((r) => r.status === 'SCHEDULED') ??
      null
    )
  }, [selectedGroup])

  const currentRaid = liveRaid ?? selectedGroup?.raids.at(-1) ?? null

  const latestEndedRaid = useMemo(() => {
    if (!selectedGroup) return null
    const ended = selectedGroup.raids.filter((r) => r.status === 'DEFEATED' || r.status === 'FAILED')
    if (ended.length === 0) return null
    return ended.reduce((latest, raid) => {
      const latestTime = latest.startedAt ? new Date(latest.startedAt).getTime() : 0
      const raidTime = raid.startedAt ? new Date(raid.startedAt).getTime() : 0
      return raidTime > latestTime ? raid : latest
    })
  }, [selectedGroup])

  const autoShownOutcomeRaid =
    !liveRaid && latestEndedRaid && !dismissedOutcomeIds.has(latestEndedRaid.id) ? latestEndedRaid : null

  const dismissOutcome = (raidId: number) => {
    setDismissedOutcomeIds((prev) => {
      const next = new Set(prev)
      next.add(raidId)
      try {
        window.localStorage.setItem('dismissedRaidOutcomes', JSON.stringify([...next]))
      } catch {}
      return next
    })
  }

  const handleRsvp = async (raidId: number, groupId: number, accepted: boolean) => {
    try {
      await api.post(`/raids/${raidId}/rsvp?accepted=${accepted}`, {})
      await refreshRaids(groupId)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update RSVP')
    }
  }

  const handleJoin = async (raidId: number, groupId: number) => {
    try {
      await api.post(`/raids/${raidId}/join`, {})
      await refreshRaids(groupId)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not join raid')
    }
  }

  const handleTitleClick = () => {
    titleClickCount.current += 1
    if (titleClickCount.current >= 5) {
      titleClickCount.current = 0
      setAdminVisible((v) => !v)
    }
  }

  const adminAutoSchedule = async () => {
    if (!selectedGroupId) return
    try {
      const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000).toISOString()
      await api.post(`/admin/groups/${selectedGroupId}/schedule?earliest=${encodeURIComponent(fiveMinutesFromNow)}`, {})
    } catch {}
    await fetchAllRaids()
  }

  const adminStartRaid = async () => {
    if (!selectedGroupId) return
    try {
      await api.post(`/admin/groups/${selectedGroupId}/start-raid`, {})
    } catch {}
    await fetchAllRaids()
  }

  const adminFastForward = async () => {
    if (!currentRaid) return
    try {
      await api.post(`/admin/raids/${currentRaid.id}/fast-forward?seconds=10`, {})
    } catch {}
    await refreshRaids(currentRaid.groupId)
  }

  const adminForceComplete = async () => {
    if (!currentRaid) return
    try {
      await api.post(`/admin/raids/${currentRaid.id}/force-complete`, {})
    } catch {}
    await refreshRaids(currentRaid.groupId)
  }

  const adminClearRaids = async () => {
    if (!selectedGroupId) return
    try {
      await api.delete(`/admin/groups/${selectedGroupId}/raids`)
    } catch {}
    await fetchAllRaids()
  }

  const handleCompleteTask = async (raidId: number, task: RaidTaskData, success: boolean, groupId: number) => {
    try {
      await api.post(`/raids/${raidId}/tasks/${task.id}/complete?success=${success}`, {})
      await refreshRaids(groupId)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not complete task')
    }
  }

  if (!currentUser) {
    return <div className='flex items-center justify-center p-8 text-muted-foreground'>Loading…</div>
  }

  return (
    <main className='flex flex-col gap-4'>
      <div className='flex items-center justify-between gap-4'>
        <Popover open={adminVisible} onOpenChange={setAdminVisible}>
          <PopoverAnchor asChild>
            <Button onClick={handleTitleClick} variant='ghost' className='size-4 absolute' />
          </PopoverAnchor>
          <PopoverContent align='start' className='w-auto'>
            <p className='mb-3 text-xs font-semibold uppercase tracking-wide text-destructive'>Admin Panel</p>
            <div className='flex flex-col gap-2'>
              <Button size='sm' variant='outline' onClick={adminAutoSchedule} disabled={!selectedGroupId}>
                Schedule (5 min delay)
              </Button>
              <Button size='sm' variant='outline' onClick={adminStartRaid} disabled={!selectedGroupId}>
                Start raid immediately
              </Button>
              <Button size='sm' variant='outline' disabled={currentRaid?.status !== 'SCHEDULED'} onClick={adminFastForward}>
                Fast-forward 10s
              </Button>
              <Button
                size='sm'
                variant='outline'
                disabled={!currentRaid || currentRaid.status === 'DEFEATED' || currentRaid.status === 'FAILED'}
                onClick={adminForceComplete}
              >
                Force complete
              </Button>
              <Button size='sm' variant='destructive' disabled={!selectedGroupId} onClick={adminClearRaids}>
                Clear all raids
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        <div className='flex items-center gap-2'>
          {groupsData.length > 1 && (
            <Select value={selectedGroupId?.toString()} onValueChange={(value) => setSelectedGroupId(Number(value))}>
              <SelectTrigger aria-label='Select group' className='min-w-44'>
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

      {!selectedGroup ? (
        <Card>
          <CardContent className='flex items-center justify-center py-12'>
            <p className='text-sm text-muted-foreground'>
              You are not in any group. Join a group to participate in boss raids.
            </p>
          </CardContent>
        </Card>
      ) : liveRaid ? (
        <RaidView
          raid={liveRaid}
          currentUserId={currentUser.id}
          onlineUserIds={onlineUserIds}
          onJoin={() => handleJoin(liveRaid.id, liveRaid.groupId)}
          onRsvp={(accepted) => handleRsvp(liveRaid.id, liveRaid.groupId, accepted)}
          onCompleteTask={(task, success) => handleCompleteTask(liveRaid.id, task, success, liveRaid.groupId)}
        />
      ) : (
        (() => {
          const stats = computeStats(groupsData, Number(currentUser.id))
          const displayedEndedRaid = openRaid ?? autoShownOutcomeRaid
          if (displayedEndedRaid) {
            const cardData = toRaidCard(displayedEndedRaid, currentUser.id, onlineUserIds)
            const isAutoShown = openRaid === null
            const handleBack = () => {
              if (openRaid) {
                setOpenRaid(null)
              } else {
                dismissOutcome(displayedEndedRaid.id)
              }
            }
            return (
              <div className='flex flex-col gap-4'>
                {cardData.state === 'victory' ? <VictoryCard raid={cardData} /> : <DefeatCard raid={cardData} />}
                <Button className='self-start' onClick={handleBack}>
                  <ArrowLeft className='size-4' /> {isAutoShown ? 'Continue' : 'Back to history'}
                </Button>
              </div>
            )
          }
          return (
            <div className='flex flex-col gap-6'>
              <div className='grid gap-4 md:grid-cols-[20rem_1fr]'>
                <div className='flex flex-col gap-4'>
                  <Card>
                    <CardHeader>
                      <CardTitle className='text-lg'>Statistics</CardTitle>
                    </CardHeader>
                    <CardContent className='grid grid-cols-2 gap-x-4 gap-y-4'>
                      <div className='flex flex-col gap-1'>
                        <span className='text-xs uppercase tracking-wider text-muted-foreground'>All Wins</span>
                        <span className='text-2xl font-semibold text-emerald-500'>{stats.wins}</span>
                        <span className='text-xs text-muted-foreground'>
                          vs {stats.losses} {stats.losses === 1 ? 'loss' : 'losses'}
                        </span>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <span className='text-xs uppercase tracking-wider text-muted-foreground'>Total XP</span>
                        <span className='text-2xl font-semibold text-amber-600'>{stats.totalXp.toLocaleString()}</span>
                        <span className='text-xs text-muted-foreground'>from raids</span>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <span className='text-xs uppercase tracking-wider text-muted-foreground'>Best Streak</span>
                        <span className='text-2xl font-semibold'>{stats.bestStreak}</span>
                        <span className='text-xs text-muted-foreground'>consecutive Wins</span>
                      </div>
                      <div className='flex flex-col gap-1'>
                        <span className='text-xs uppercase tracking-wider text-muted-foreground'>Avg Damage</span>
                        <span className='text-2xl font-semibold'>{stats.avgDamage}</span>
                        <span className='text-xs text-muted-foreground'>per raid</span>
                      </div>
                    </CardContent>
                  </Card>
                  <PastRaidsList raids={selectedGroup ? selectedGroup.raids : []} onSelect={setOpenRaid} />
                </div>
                <Card className='relative overflow-hidden'>
                  <div aria-hidden className='outcome-glow pointer-events-none absolute inset-0 opacity-50' />
                  <CardContent className='relative flex flex-col items-center gap-4 py-16 text-center'>
                    <div className='flex size-16 items-center justify-center rounded-2xl border bg-muted text-muted-foreground'>
                      <Moon className='size-7' />
                    </div>
                    <h2 className='text-2xl font-bold tracking-tight'>The dungeon is quiet</h2>
                    <p className='max-w-md text-sm text-muted-foreground'>
                      Bosses are scheduled by the system based on your guild&apos;s habit cadence. The next one will appear here
                      when it spawns.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          )
        })()
      )}
    </main>
  )
}
