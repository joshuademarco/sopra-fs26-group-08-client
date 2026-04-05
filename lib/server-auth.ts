import 'server-only'


import { cookies } from 'next/headers'
import { getApiDomain } from '@/utils/domain'
import { redirect } from 'next/navigation'
import type { AuthUser } from '@/types/auth'

const AUTH_TOKEN_COOKIE = 'token'

function getAuthMeUrl(): string {
  return new URL('/auth/me', getApiDomain()).toString()
}

async function verifySessionServerSide(token: string): Promise<AuthUser | null> {
  try {
    const response = await fetch(getAuthMeUrl(), {
      method: 'GET',
      headers: {
        Cookie: `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}`,
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      return null
    }

    return (await response.json()) as AuthUser
  } catch {
    return null
  }
}

export async function getServerAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value

  if (!token) {
    return null
  }

  return verifySessionServerSide(token)
}

export async function requireServerAuth(redirectTo = '/'): Promise<AuthUser> {
  const user = await getServerAuthUser()

  if (!user) {
    redirect(redirectTo)
  }

  return user
}
