import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function UnauthorizedScreen() {
  const router = useRouter()

  return (
    <div className='flex-1 items-center justify-center bg-white px-6'>
      <Card className='w-full max-w-sm'>
        <CardHeader>
          <CardTitle className='text-center text-3xl'>Unauthorized</CardTitle>
          <CardDescription className='text-center'>You do not have permission to view this page.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.replace('/')}>
            <p>Go back home</p>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
