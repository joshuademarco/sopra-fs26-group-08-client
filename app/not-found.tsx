"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function NotFoundScreen() {
	const router = useRouter()

	return (
		<div className='flex min-h-screen items-center justify-center px-10'>
			<Card className='w-full max-w-sm'>
				<CardHeader>
					<CardTitle className='text-center text-3xl'>404 - Not Found</CardTitle>
					<CardDescription className='text-center'>The page you are looking for does not exist.</CardDescription>
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
