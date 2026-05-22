'use client'

import { GravatarImage } from '@/components/gravatar-image'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useApi } from '@/hooks/useApi'
import { useAuth } from '@/hooks/useAuth'
import { useLiveOnlineUsers } from '@/hooks/useLiveOnlineUsers'
import {
  CheckCircle,
  Dumbbell,
  Info,
  Lightbulb,
  LogOut,
  LucideIcon,
  Settings,
  Shield,
  TrendingUp,
  Trophy,
  UserRoundCog,
} from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'

const achievementConfig: Record<string, { icon: LucideIcon; color: string }> = {
  FIRST_HABIT: { icon: CheckCircle, color: 'text-emerald-500' },
  STREAK_3: { icon: TrendingUp, color: 'text-orange-400' },
  STREAK_7: { icon: Trophy, color: 'text-yellow-500' },
  STRENGTH_25: { icon: Dumbbell, color: 'text-rose-500' },
  INTELLIGENCE_25: { icon: Lightbulb, color: 'text-sky-400' },
  RESILIENCE_25: { icon: Shield, color: 'text-violet-500' },
}

type Achievement = { id: number; key: string; name: string; description: string }

interface GroupMember {
  id: number
  username: string
  status: string | null
  level: number | null
  completedHabits: number
  totalHabits: number
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

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isJoinOpen, setIsJoinOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [selectedMember, setSelectedMember] = useState<GroupMember | null>(null)
  const [leaveTarget, setLeaveTarget] = useState<Group | null>(null)
  const [editTarget, setEditTarget] = useState<Group | null>(null)
  const [editName, setEditName] = useState('')
  const [editPassword, setEditPassword] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Group | null>(null)

  const onlineUsernames = useMemo(() => new Set(onlineUsers.map((u) => u.username)), [onlineUsers])

  const getMemberStatus = (member: GroupMember) => {
    if (member.username && onlineUsernames.has(member.username)) return 'Online'
    if (member.status?.toLowerCase() === 'online') return 'Online'
    return 'Offline'
  }

  const getMemberLevel = (member: GroupMember) => member.level ?? null

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
      const data = await api.get<Group[] | { groups: Group[] }>('/groups')
      if (Array.isArray(data)) {
        setGroups(data)
      } else if (Array.isArray(data?.groups)) {
        setGroups(data.groups)
      } else {
        setGroups([])
      }
    } catch {
      toast.error('Failed to load groups')
      setGroups([])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchGroups()
  }, [])

  async function handleCreateGroup() {
    try {
      await api.post('/groups', { name: groupName, password })
      setIsCreateOpen(false)
      setGroupName('')
      setPassword('')
      fetchGroups()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not create the group.')
    }
  }

  async function handleJoinGroup() {
    try {
      await api.post('/groups/join', { name: groupName, password })
      setIsJoinOpen(false)
      setGroupName('')
      setPassword('')
      fetchGroups()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not join the group.')
    }
  }

  async function handleLeaveGroup() {
    if (!leaveTarget) return
    try {
      await api.delete(`/groups/${leaveTarget.id}/leave`)
      setLeaveTarget(null)
      toast.success(`You left "${leaveTarget.name}".`)
      fetchGroups()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not leave the group.')
    }
  }

  async function handleUpdateGroup() {
    if (!editTarget) return
    try {
      await api.put(`/groups/${editTarget.id}`, { name: editName, password: editPassword })
      setEditTarget(null)
      toast.success('Group updated.')
      fetchGroups()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not update the group.')
    }
  }

  async function handleDeleteGroup() {
    if (!deleteTarget) return
    try {
      await api.delete(`/groups/${deleteTarget.id}`)
      setDeleteTarget(null)
      toast.success(`"${deleteTarget.name}" has been deleted.`)
      fetchGroups()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not delete the group.')
    }
  }

  if (loading) {
    return (
      <main className='flex flex-1 flex-col gap-4'>
        <p className='text-muted-foreground'>Loading...</p>
      </main>
    )
  }

  return (
    <main className='flex flex-1 flex-col gap-4'>
      {/* Header */}
      <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center gap-2'>
          <Tooltip>
            <TooltipTrigger asChild>
              <Info className='size-5 text-muted-foreground' />
            </TooltipTrigger>
            <TooltipContent className='max-w-sm'>
              Team up with friends to hold each other accountable - see who&apos;s crushing their habits, track your combined
              progress, and click any member to view their level and achievements. Most importantly: once you and your friends
              created/joined a group, you can enter Boss Raids together to slay procrastination monsters like the &quot;Innere
              Schweinehund&quot; and earn epic rewards!
            </TooltipContent>
          </Tooltip>
        </div>
        {/* Buttons Join + Create */}
        <div className='flex gap-2'>
          {/* Join */}
          <Dialog open={isJoinOpen} onOpenChange={setIsJoinOpen}>
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
                <Button onClick={handleJoinGroup}>Confirm</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Create */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
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
            const total = g.users?.reduce((sum, m) => sum + m.totalHabits, 0) ?? 0
            const completed = g.users?.reduce((sum, m) => sum + m.completedHabits, 0) ?? 0
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0

            return (
              <Card key={g.id}>
                <CardHeader>
                  <div className='flex items-start justify-between gap-2'>
                    <CardTitle className='text-lg font-semibold'>{g.name}</CardTitle>
                    <div className='flex shrink-0 items-center gap-1.5'>
                      {isOwner ? (
                        <Button
                          size='sm'
                          variant='ghost'
                          className='gap-1.5 text-muted-foreground'
                          onClick={() => {
                            setEditTarget(g)
                            setEditName(g.name)
                            setEditPassword('')
                          }}
                        >
                          <Settings className='size-3.5' />
                          Manage
                        </Button>
                      ) : (
                        <Button
                          size='sm'
                          variant='ghost'
                          className='gap-1.5 text-muted-foreground hover:text-destructive'
                          onClick={() => setLeaveTarget(g)}
                        >
                          <LogOut className='size-3.5' />
                          Leave Group
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription>
                    Created by {g.createdBy} · {createdAt}
                  </CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-3'>
                  {/* Group progress */}
                  <div className='flex flex-col gap-1'>
                    <div className='flex items-center justify-between text-xs text-muted-foreground'>
                      <span>Group habit progress</span>
                      <span>
                        {completed}/{total} habits
                      </span>
                    </div>
                    <div className='h-2 w-full overflow-hidden rounded-full bg-muted'>
                      <div className='h-2 rounded-full bg-primary transition-all' style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  {/* Member list */}
                  <p className='text-xs font-medium text-muted-foreground'>Members ({g.users?.length || 0})</p>
                  <div className='flex flex-col'>
                    {g.users?.map((member) => {
                      const isOnline = getMemberStatus(member) === 'Online'
                      return (
                        <button
                          key={member.id}
                          onClick={() => handleOpenProfile(member)}
                          className='flex w-full items-center gap-3 rounded-md px-1 py-1.5 text-left transition-colors hover:bg-muted'
                        >
                          <div className='relative shrink-0'>
                            <Avatar className='size-8'>
                              <GravatarImage identifier={member.username} size={32} />
                              <AvatarFallback className='text-xs'>{member.username[0]?.toUpperCase()}</AvatarFallback>
                            </Avatar>
                            {isOnline && (
                              <span className='absolute -bottom-0.5 -right-0.5 size-2 rounded-full bg-emerald-500 ring-2 ring-background' />
                            )}
                          </div>
                          <div className='min-w-0 flex-1'>
                            <div className='flex items-center gap-1'>
                              <p className='truncate text-sm font-medium'>{member.username}</p>
                              {member.username === g.createdBy && <UserRoundCog className='size-4' />}
                            </div>
                            <p className='text-xs text-muted-foreground'>
                              {member.completedHabits}/{member.totalHabits} habits completed
                            </p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Profile dialog */}
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

      {/* Leave group confirmation dialog */}
      <Dialog
        open={!!leaveTarget}
        onOpenChange={(open) => {
          if (!open) setLeaveTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave &quot;{leaveTarget?.name}&quot;?</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>You will need the password to rejoin.</p>
          <DialogFooter>
            <Button variant='outline' onClick={() => setLeaveTarget(null)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleLeaveGroup}>
              Leave Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Manage group dialog (owner only) */}
      <Dialog
        open={!!editTarget}
        onOpenChange={(open) => {
          if (!open) setEditTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage &quot;{editTarget?.name}&quot;</DialogTitle>
          </DialogHeader>
          <div className='flex flex-col gap-3'>
            <Input placeholder='New name' value={editName} onChange={(e) => setEditName(e.target.value)} />
            <Input
              type='password'
              placeholder='New password (leave blank to keep)'
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
            />
          </div>
          <DialogFooter className='flex-col gap-2 sm:flex-col'>
            <Button onClick={handleUpdateGroup}>Save changes</Button>
            <Button
              variant='destructive'
              onClick={() => {
                setEditTarget(null)
                setDeleteTarget(editTarget)
              }}
            >
              Delete Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete group confirmation dialog */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete &quot;{deleteTarget?.name}&quot;?</DialogTitle>
          </DialogHeader>
          <p className='text-sm text-muted-foreground'>This removes the group for all members and cannot be undone.</p>
          <DialogFooter>
            <Button variant='outline' onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button variant='destructive' onClick={handleDeleteGroup}>
              Delete Group
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  )
}
