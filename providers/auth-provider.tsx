'use client'

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

type AuthUser = {
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

type LoginInput = {
  email: string
  password: string
}

type RegisterInput = {
  email: string
  username: string
  password: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (input: LoginInput) => Promise<AuthUser>
  register: (input: RegisterInput) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readReason(payload: unknown): string | null {
  if (payload && typeof payload === 'object' && 'reason' in payload) {
    const reason = (payload as { reason?: unknown }).reason
    if (typeof reason === 'string' && reason.length > 0) {
      return reason
    }
  }

  return null
}

async function parseError(res: Response, fallback: string): Promise<never> {
  try {
    const payload = await res.json()
    const reason = readReason(payload)
    throw new Error(reason ?? fallback)
  } catch {
    throw new Error(fallback)
  }
}

function buildAuthUrl(path: string): string {
  return `/api${path}`
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let ignore = false

    const loadCurrentUser = async () => {
      try {
        const response = await fetch(buildAuthUrl('/auth/me'), {
          method: 'GET',
          credentials: 'include',
        })

        if (!response.ok) {
          if (!ignore) {
            setUser(null)
          }
          return
        }

        const nextUser = (await response.json()) as AuthUser
        if (!ignore) {
          setUser(nextUser)
        }
      } catch {
        if (!ignore) {
          setUser(null)
        }
      } finally {
        if (!ignore) {
          setIsLoading(false)
        }
      }
    }

    void loadCurrentUser()

    return () => {
      ignore = true
    }
  }, [])

  const persistSession = useCallback((nextUser: AuthUser) => {
    setUser(nextUser)
  }, [])

  const clearSession = useCallback(() => {
    setUser(null)
  }, [])

  const login = useCallback(
    async (input: LoginInput) => {
      const res = await fetch(buildAuthUrl('/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(input),
      })

      if (!res.ok) {
        await parseError(res, 'Login failed')
      }

      const payload = (await res.json()) as AuthUser
      persistSession(payload)
      return payload
    },
    [persistSession],
  )

  const register = useCallback(
    async (input: RegisterInput) => {
      const res = await fetch(buildAuthUrl('/auth/register'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(input),
      })

      if (!res.ok) {
        await parseError(res, 'Registration failed')
      }

      const payload = (await res.json()) as AuthUser
      persistSession(payload)
      return payload
    },
    [persistSession],
  )

  const logout = useCallback(async () => {
    try {
      await fetch(buildAuthUrl('/auth/logout'), {
        method: 'POST',
        credentials: 'include',
      })
    } finally {
      clearSession()
    }
  }, [clearSession])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      login,
      register,
      logout,
    }
  }, [isLoading, login, logout, register, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within AuthProvider')
  }

  return context
}
