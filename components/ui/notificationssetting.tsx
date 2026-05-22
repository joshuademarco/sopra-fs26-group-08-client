'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useAuth } from '@/hooks/useAuth'
import { NotificationType } from '@/providers/auth-provider'
import { useState } from 'react'
import { toast } from 'sonner'

export function NotificationSettings() {
  const { user, updateNotifications } = useAuth()
  const [type, setType] = useState<NotificationType>((user?.notificationType ?? 'NONE') as NotificationType)
  const [appToken, setAppToken] = useState(user?.pushoverAppToken ?? '')
  const [userKey, setUserKey] = useState(user?.pushoverUserKey ?? '')
  const [isSaving, setIsSaving] = useState(false)

  async function handleSave() {
    if (type === 'PUSHOVER' && (!appToken.trim() || !userKey.trim())) {
      toast.error('Both Pushover App Token and User Key are required')
      return
    }
    setIsSaving(true)
    try {
      await updateNotifications({
        notificationType: type,
        ...(type === 'PUSHOVER' && { pushoverAppToken: appToken, pushoverUserKey: userKey }),
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
        <>
          <div className='grid gap-2'>
            <Label htmlFor='pushoverAppToken'>Pushover App Token</Label>
            <Input
              id='pushoverAppToken'
              value={appToken}
              onChange={(e) => setAppToken(e.target.value)}
              placeholder='Your Pushover application token'
            />
          </div>
          <div className='grid gap-2'>
            <Label htmlFor='pushoverUserKey'>Pushover User Key</Label>
            <Input
              id='pushoverUserKey'
              value={userKey}
              onChange={(e) => setUserKey(e.target.value)}
              placeholder='Your Pushover user key'
            />
          </div>
        </>
      )}
      <div>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Saving…' : 'Save notification settings'}
        </Button>
      </div>
    </div>
  )
}