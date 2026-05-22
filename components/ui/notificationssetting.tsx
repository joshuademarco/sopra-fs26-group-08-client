'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { NotificationType } from '@/providers/auth-provider'
import { buildApiUrl } from '@/utils/domain'
import { useState } from 'react'
import { toast } from 'sonner'

export function NotificationSettings() {
  const { user, updateNotifications } = useAuth()
  const [type, setType] = useState<NotificationType>((user?.notificationType ?? 'NONE') as NotificationType)
  const [userKey, setUserKey] = useState(user?.pushoverUserKey ?? '')
  const [isSaving, setIsSaving] = useState(false)
  const [isSendingTest, setIsSendingTest] = useState(false)
  const savedType = (user?.notificationType ?? 'NONE') as NotificationType

  async function handleSave() {
    if (type === 'PUSHOVER' && !userKey.trim()) {
      toast.error('Pushover User Key is required')
      return
    }
    setIsSaving(true)
    try {
      await updateNotifications({
        notificationType: type,
        ...(type === 'PUSHOVER' && { pushoverUserKey: userKey }),
      })
      toast.success('Notification preferences saved')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to save notification preferences')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className='grid gap-4'>
      <div className='grid gap-2'>
        <Label>Choose your Notification Type</Label>
        <Select value={type} onValueChange={(v) => setType(v as NotificationType)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='NONE'>None</SelectItem>
            <SelectItem value='EMAIL'>Email</SelectItem>
            <SelectItem value='PUSHOVER'>Pushover</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {type === 'PUSHOVER' && (
        <div className='grid gap-2'>
          <Label htmlFor='pushoverUserKey'>Pushover User Key</Label>
          <Input
            id='pushoverUserKey'
            value={userKey}
            onChange={(e) => setUserKey(e.target.value)}
            placeholder='Your Pushover user key'
          />
        </div>
      )}
      <div className='flex flex-wrap gap-2'>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save notification settings'}
        </Button>
        <Button
          type='button'
          variant='outline'
          onClick={handleSendTest}
          disabled={isSendingTest || savedType === 'NONE'}
          title={savedType === 'NONE' ? 'Save a notification type first' : undefined}
        >
          {isSendingTest ? 'Sending…' : 'Send test notification'}
        </Button>
      </div>
    </div>
  )

  async function handleSendTest() {
    setIsSendingTest(true)
    try {
      const res = await fetch(buildApiUrl('/auth/test-notification'), {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        const payload = await res.json().catch(() => null)
        const reason =
          payload && typeof payload === 'object'
            ? (payload as { reason?: string; message?: string }).reason ??
              (payload as { reason?: string; message?: string }).message
            : null
        throw new Error(reason ?? 'Failed to send test notification')
      }
      toast.success('Test notification sent')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to send test notification')
    } finally {
      setIsSendingTest(false)
    }
  }
}