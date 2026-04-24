'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/hooks/useAuth'
import { User } from '@/types/user'
import { useEffect, useState } from 'react'

interface Group {
  id: number
  name: string
  createdBy: string
  createdAt: string | null
  users: User[]
}

export default function GroupsPage() {
  const auth = useAuth()
  const user = auth.user

  const [groups, setGroups] = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isJoinOpen, setIsJoinOpen] = useState(false)

  const [groupName, setGroupName] = useState('')
  const [password, setPassword] = useState('')

  async function fetchGroups() {
    setLoading(true)

    try {
      const response = await fetch(`/api/groups`, {
        method: 'GET',
        credentials: 'include',
      })
      console.log('Response status:', response.status)

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

      if (response.ok === true) {
        setIsCreateOpen(false)
        setGroupName('')
        setPassword('')
        fetchGroups()
      } else {
        setError('Could not create the group.')
      }
    } catch (err) {
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

      if (response.ok === true) {
        setIsJoinOpen(false)
        setGroupName('')
        setPassword('')
        fetchGroups()
      } else {
        setError('Could not join the group.')
      }
    } catch (err) {
      setError('Server error. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className='flex min-h-screen w-full items-center justify-center p-10'>
        <p className='text-muted-foreground'>Loading...</p>
      </div>
    )
  }

  return (
    <div className='flex min-h-screen flex-col p-10 max-w-5xl mx-auto gap-8'>
      {/* Header */}
      <div className='flex justify-between items-center gap-4'>
        <div>
          <h1 className='text-3xl font-bold tracking-tight'>Groups</h1>
          <p className='text-muted-foreground mt-1'>Manage and view your groups</p>
        </div>

        {/* Buttons Join + Create */}
        <div className='flex gap-3'>
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
            <DialogContent className='max-w-md'>
              <DialogHeader>
                <DialogTitle>Join a Group</DialogTitle>
              </DialogHeader>
              <div className='flex flex-col gap-4 mt-4'>
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
            <DialogContent className='max-w-md'>
              <DialogHeader>
                <DialogTitle>Create a new Group</DialogTitle>
              </DialogHeader>
              <div className='flex flex-col gap-4 mt-4'>
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
        <div className='rounded-xl border border-dashed p-12 text-center text-muted-foreground'>
          <p>You have not joined any groups yet</p>
        </div>
      ) : (
        <div className='grid gap-4 grid-cols-3'>
          {groups.map((g) => {
            const isOwner = g.createdBy === user?.username
            const createdAt = g.createdAt
              ? new Date(g.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
              : 'Unknown'

            return (
              <div key={g.id} className='flex flex-col rounded-xl border bg-card text-card-foreground shadow-sm'>
                {/* Group Header */}
                <div className='space-y-1.5 p-6 pb-4'>
                  <div className='flex justify-between items-start'>
                    <h2 className='font-semibold leading-none tracking-tight text-xl'>{g.name}</h2>
                    {isOwner && (
                      <span className='inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary'>
                        Owner
                      </span>
                    )}
                  </div>
                  <p className='text-sm text-muted-foreground pt-1'>Created by {g.createdBy}</p>
                  <p className='text-sm text-muted-foreground pt-1'>Created on {createdAt}</p>
                </div>

                {/* Group Body: Member */}
                <div className='p-6 pt-0'>
                  <h3 className='text-sm font-medium mb-3'>Members ({g.users?.length || 0})</h3>

                  <div className='flex flex-wrap gap-2'>
                    {g.users?.map((user) => (
                      <span
                        key={user.id}
                        className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${
                          user.username === g.createdBy
                            ? 'bg-primary text-primary-foreground ring-primary'
                            : 'bg-muted text-muted-foreground ring-border'
                        }`}
                      >
                        {user.username}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
