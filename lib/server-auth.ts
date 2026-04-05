import 'server-only'


import { getApiDomain } from '@/utils/domain'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export type ServerAuthUser = {
  id: string | number
  email: string
  username: string
  status?: string | null
  level?: number | null
  health?: number | null
  strength?: number | null
  intelligence?: number | null
  resilience?: number | null
}

const AUTH_TOKEN_COOKIE = 'auth_token'

function getAuthMeUrl(): string {
  return new URL('/auth/me', getApiDomain()).toString()
}

async function verifySessionServerSide(token: string): Promise<ServerAuthUser | null> {
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

    return (await response.json()) as ServerAuthUser
  } catch {
    return null
  }
}

export async function getServerAuthUser(): Promise<ServerAuthUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_COOKIE)?.value

  if (!token) {
    return null
  }

  return verifySessionServerSide(token)
}

export async function requireServerAuth(redirectTo = '/'): Promise<ServerAuthUser> {
  const user = await getServerAuthUser()

  if (!user) {
    redirect(redirectTo)
  }

  return user
}
