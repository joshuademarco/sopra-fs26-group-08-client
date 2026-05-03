'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useLiveOnlineUsers } from '@/hooks/useLiveOnlineUsers'
import { User } from '@/types/user'
import { CheckCircle, Dumbbell, Lightbulb, LucideIcon, Shield, TrendingUp, Trophy } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

const achievementConfig: Record<string, { icon: LucideIcon; color: string }> = {
  FIRST_HABIT: { icon: CheckCircle, color: 'text-emerald-500' },
  STREAK_3: { icon: TrendingUp, color: 'text-orange-400' },
  STREAK_7: { icon: Trophy, color: 'text-yellow-500' },
  STRENGTH_25: { icon: Dumbbell, color: 'text-rose-500' },
  INTELLIGENCE_25: { icon: Lightbulb, color: 'text-sky-400' },
  RESILIENCE_25: { icon: Shield, color: 'text-violet-500' },
}

type Achievement = { id: number; key: string; name: string; description: string }

interface GroupMember extends User {
  level?: number | null
  status: string | null
  character?: {
    level?: number | null
  } | null
}

interface Group {
  id: number
  name: string
  createdBy: string
  createdAt: string | null
  users: GroupMember[]
}

export default function GroupsPage() {
  const auth = useAuth()
  const user = auth.user
  const api = useApi()
  const { users: onlineUsers } = useLiveOnlineUsers()
  const [memberAchievements, setMemberAchievements] = useState<Achievement[]>([])

  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isJoinOpen, setIsJoinOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null)

  const onlineUsernames = useMemo(() => new Set(onlineUsers.map((u) => u.username)), [onlineUsers])

  const getMemberStatus = (member: GroupMember) => {
    if (member.username && onlineUsernames.has(member.username)) return 'Online'
    if (member.status?.toLowerCase() === 'online') return 'Online'
    return 'Offline'
  }

  const getMemberLevel = (member: GroupMember) => member.level ?? member.character?.level ?? null

  const handleOpenProfile = async (member: GroupMember) => {
    setSelectedMember(member)
    setIsProfileOpen(true)
    try {
      const data = await api.get<Achievement[]>(`/users/${member.id}/achievements`)
      setMemberAchievements(data)
    } catch {
      setMemberAchievements([])
    }
  }

  const [groupName, setGroupName] = useState('')
  const [password, setPassword] = useState('')

  async function fetchGroups() {
    setLoading(true)
    try {
      const response = await fetch(`/api/groups`, { method: 'GET', credentials: 'include' })
      if (response.ok) {
        const data = await response.json()
        if (Array.isArray(data)) {
          setGroups(data)
        } else if (Array.isArray(data?.groups)) {
          setGroups(data.groups)
        } else {
          setGroups([])
        }
      }

      setLoading(false)
    } catch (err) {
      console.log('Error:', err)
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  async function handleCreateGroup() {
    setError('')
    try {
      const response = await fetch(`/api/groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: groupName,
          password: password,
        }),
      })
      if (response.ok) {
        setIsCreateOpen(false)
        setGroupName('')
        setPassword('')
        fetchGroups()
      } else {
        setError('Could not create the group.')
      }
    } catch {
      setError('Server error. Please try again.')
    }
  }

  async function handleJoinGroup() {
    setError('')
    try {
      const response = await fetch(`/api/groups/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: groupName,
          password: password,
        }),
      })
      if (response.ok) {
        setIsJoinOpen(false)
        setGroupName('')
        setPassword('')
        fetchGroups()
      } else {
        setError('Could not join the group.')
      }
    } catch {
      setError('Server error. Please try again.')
    }
  }

  if (loading) {
    return (
      <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
        <h1 className='text-3xl font-bold tracking-tight'>Groups</h1>
        <p className='text-muted-foreground'>Loading...</p>
      </main>
    )
  }

  return (
    <main className='flex flex-1 flex-col gap-4 p-4 pt-0'>
      {/* Header */}
      <div className='flex items-center justify-between gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Groups</h1>
          <p className='text-sm text-muted-foreground'>Manage and view your groups</p>
        </div>
        {/* Buttons Join + Create */}
        <div className='flex gap-2'>
          {/* Join */}
          <Dialog
            open={isJoinOpen}
            onOpenChange={(open) => {
              setIsJoinOpen(open)
              setError('')
            }}
          >
            <DialogTrigger asChild>
              <Button variant='outline'>Join Group</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Join a Group</DialogTitle>
              </DialogHeader>
              <div className='flex flex-col gap-4'>
                <Input placeholder='Group Name' value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                <Input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className='text-sm text-destructive'>{error}</p>}
                <Button onClick={handleJoinGroup}>Confirm</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create */}
          <Dialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              setIsCreateOpen(open)
              setError('')
            }}
          >
            <DialogTrigger asChild>
              <Button>Create Group</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new Group</DialogTitle>
              </DialogHeader>
              <div className='flex flex-col gap-4'>
                <Input placeholder='Group Name' value={groupName} onChange={(e) => setGroupName(e.target.value)} />
                <Input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />
                {error && <p className='text-sm text-destructive'>{error}</p>}
                <Button onClick={handleCreateGroup}>Confirm</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Groups */}
      {groups.length === 0 ? (
        <Card>
          <CardContent className='flex items-center justify-center py-12'>
            <p className='text-sm text-muted-foreground'>You have not joined any groups yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className='grid gap-4 md:grid-cols-2 xl:grid-cols-3'>
          {groups.map((g) => {
            const isOwner = g.createdBy === user?.username
            const createdAt = g.createdAt
              ? new Date(g.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
              : 'Unknown'

            return (
              <Card key={g.id}>
                <CardHeader>
                  <div className='flex items-start justify-between gap-2'>
                    <CardTitle className='text-lg font-semibold'>{g.name}</CardTitle>
                    {isOwner && <Badge variant='outline'>Owner</Badge>}
                  </div>
                  <CardDescription>
                    Created by {g.createdBy} · {createdAt}
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-2'>
                  <p className='text-xs font-medium text-muted-foreground'>Members ({g.users?.length || 0})</p>
                  <div className='flex flex-wrap gap-1.5'>
                    {g.users?.map((member) => (
                      <Button
                        key={member.id}
                        size='sm'
                        variant={member.username === g.createdBy ? 'default' : 'secondary'}
                        onClick={() => handleOpenProfile(member)}
                      >
                        {member.username}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      <Dialog
        open={isProfileOpen}
        onOpenChange={(open) => {
          setIsProfileOpen(open)
          if (!open) {
            setSelectedMember(null)
            setMemberAchievements([])
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedMember ? `${selectedMember.username}'s profile` : 'Profile'}</DialogTitle>
          </DialogHeader>

          {selectedMember ? (
            <div className='flex flex-col gap-4'>
              <Card>
                <CardContent className='flex flex-col gap-3'>
                  <div className='flex items-center justify-between gap-4'>
                    <div>
                      <p className='text-xs uppercase text-muted-foreground'>Username</p>
                      <p className='text-lg font-semibold'>{selectedMember.username}</p>
                    </div>
                    <div className='text-right'>
                      <p className='text-xs uppercase text-muted-foreground'>Level</p>
                      <p className='text-lg font-semibold'>{getMemberLevel(selectedMember) ?? '—'}</p>
                    </div>
                  </div>
                  <Badge
                    variant={getMemberStatus(selectedMember) === 'Online' ? 'default' : 'secondary'}
                    className='self-start'
                  >
                    {getMemberStatus(selectedMember)}
                  </Badge>
                </CardContent>
              </Card>

              <Card>
                <CardContent className='flex flex-col gap-3'>
                  <p className='text-xs uppercase text-muted-foreground'>Achievements</p>
                  {memberAchievements.length === 0 ? (
                    <p className='text-sm text-muted-foreground'>No achievements yet.</p>
                  ) : (
                    <div className='flex flex-col gap-2'>
                      {memberAchievements.map((a) => {
                        const { icon: Icon, color } = achievementConfig[a.key] ?? {
                          icon: Trophy,
                          color: 'text-muted-foreground',
                        }
                        return (
                          <div key={a.id} className='flex items-center gap-3'>
                            <Icon className={`size-5 shrink-0 ${color}`} />
                            <div>
                              <p className='text-sm font-medium'>{a.name}</p>
                              <p className='text-xs text-muted-foreground'>{a.description}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>

              <DialogFooter />
            </div>
          ) : (
            <p className='text-sm text-muted-foreground'>Select a member to view their profile.</p>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
