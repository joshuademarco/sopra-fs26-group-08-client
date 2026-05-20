'use client'

import { Button } from '@/components/ui/button'
import { CalendarConnect } from '@/components/ui/calendar-connect'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useAuth } from '@/hooks/useAuth'
import { buildApiUrl } from '@/utils/domain'
import { FormEvent, useEffect, useState } from 'react'
import { toast } from 'sonner'

export default function SettingsPage() {
  const { user, updateProfile } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [isSavingProfile, setIsSavingProfile] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (user) {
      setUsername(user.username)
      setEmail(user.email)
    }
  }, [user])

  const handleProfileSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!username.trim()) {
      toast.error('Username is required')
      return
    }

    if (!email.trim()) {
      toast.error('Email is required')
      return
    }

    setIsSavingProfile(true)

    try {
      await updateProfile({ username, email })
      toast.success('Profile updated successfully')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update profile')
    } finally {
      setIsSavingProfile(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long')
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(buildApiUrl('/auth/change-password'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      if (!response.ok) {
        const payload = await response.json().catch(() => null)
        const reason =
          payload && typeof payload === 'object'
            ? 'reason' in payload
              ? (payload as any).reason
              : (payload as any).message
            : null
        if (response.status === 401 && !reason) {
          throw new Error('Wrong current password')
        }
        throw new Error(reason ?? 'Unable to update password.')
      }

      toast.success('Password updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Unable to update password')
    } finally {
      setIsSaving(false)
    }
  }

  if (!user) {
    return <div className='rounded-xl border border-input/20 bg-background p-6'>You must be logged in to view your account.</div>
  }

  return (
    <div className='grid gap-6'>
      <section className='rounded-xl border border-input/20 bg-background p-6 shadow-sm'>
        <h2 className='text-lg font-semibold'>Current account</h2>
        <p className='mt-2 text-sm text-muted-foreground'>Current username and email</p>

        <div className='mt-6 grid gap-4 text-sm'>
          <div>
            <Label htmlFor='username'>Username</Label>
            <div className='mt-1 rounded-md border border-input/20 bg-input/10 px-3 py-2 text-sm text-foreground'>
              {user.username}
            </div>
          </div>
          <div>
            <Label htmlFor='email'>Email</Label>
            <div className='mt-1 rounded-md border border-input/20 bg-input/10 px-3 py-2 text-sm text-foreground'>
              {user.email}
            </div>
          </div>
        </div>
      </section>

      <form noValidate onSubmit={handleProfileSubmit} className='rounded-xl border border-input/20 bg-background p-6 shadow-sm'>
        <h2 className='text-lg font-semibold'>Account Settings</h2>
        <p className='mt-2 text-sm text-muted-foreground'>Change your username or email</p>

        <div className='mt-6 grid gap-4 text-sm'>
          <div className='grid gap-2'>
            <Label htmlFor='username'>Username</Label>
            <Input id='username' type='text' value={username} onChange={(event) => setUsername(event.target.value)} required />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='email'>Email</Label>
            <Input id='email' type='email' value={email} onChange={(event) => setEmail(event.target.value)} required />
          </div>

          <div className='mt-2'>
            <Button type='submit' disabled={isSavingProfile}>
              {isSavingProfile ? 'Saving…' : 'Update profile'}
            </Button>
          </div>
        </div>
      </form>

      <form noValidate onSubmit={handleSubmit} className='rounded-xl border border-input/20 bg-background p-6 shadow-sm'>
        <div className='mb-4 space-y-3'>
          <h2 className='text-lg font-semibold'>Change Password</h2>
          <p className='text-sm text-muted-foreground'>Enter current password and choose a new one</p>
        </div>

        <div className='grid gap-4'>
          <div className='grid gap-2'>
            <Label htmlFor='currentPassword'>Current password</Label>
            <Input
              id='currentPassword'
              type='password'
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              required
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='newPassword'>New password</Label>
            <Input
              id='newPassword'
              type='password'
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
            />
          </div>

          <div className='grid gap-2'>
            <Label htmlFor='confirmPassword'>Confirm new password</Label>
            <Input
              id='confirmPassword'
              type='password'
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              required
            />
          </div>
        </div>

        <div className='mt-6'>
          <Button type='submit' disabled={isSaving}>
            {isSaving ? 'Saving…' : 'Change password'}
          </Button>
        </div>
      </form>

      <form noValidate onSubmit={handleProfileSubmit} className='rounded-xl border border-input/20 bg-background p-6 shadow-sm'>
        <h2 className='text-lg font-semibold'>Calendar Connection</h2>
        <p className='mt-2 text-sm text-muted-foreground'>Connect you Google Calendar</p>

        <div className='mt-6 grid gap-4 text-sm'>
          <div className='flex gap-2'>
            <CalendarConnect align="start" />
          </div>
        </div>
      </form>
    </div>
  )
}
