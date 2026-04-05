"use client"

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

type AuthUser = {
  id: string | number
  email: string
  username: string
  status?: string | null
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
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (input: LoginInput) => Promise<AuthUser>
  register: (input: RegisterInput) => Promise<AuthUser>
  logout: () => Promise<void>
}

const AUTH_TOKEN_KEY = "auth_token"
const AUTH_USER_KEY = "auth_user"

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

function readReason(payload: unknown): string | null {
  if (payload && typeof payload === "object" && "reason" in payload) {
    const reason = (payload as { reason?: unknown }).reason
    if (typeof reason === "string" && reason.length > 0) {
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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const storedToken = globalThis.localStorage.getItem(AUTH_TOKEN_KEY)
      const storedUser = globalThis.localStorage.getItem(AUTH_USER_KEY)

      if (storedToken) {
        setToken(storedToken)
      }

      if (storedUser) {
        setUser(JSON.parse(storedUser) as AuthUser)
      }
    } catch {
      setToken(null)
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const persistSession = useCallback((nextToken: string, nextUser: AuthUser) => {
    setToken(nextToken)
    setUser(nextUser)
    globalThis.localStorage.setItem(AUTH_TOKEN_KEY, nextToken)
    globalThis.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(nextUser))
  }, [])

  const clearSession = useCallback(() => {
    setToken(null)
    setUser(null)
    globalThis.localStorage.removeItem(AUTH_TOKEN_KEY)
    globalThis.localStorage.removeItem(AUTH_USER_KEY)
  }, [])

  const login = useCallback(async (input: LoginInput) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })

    if (!res.ok) {
      await parseError(res, "Login failed")
    }

    const payload = (await res.json()) as AuthUser
    const nextToken = res.headers.get("set-authorization")
    if (!nextToken) {
      throw new Error("Missing authorization token in login response")
    }

    persistSession(nextToken, payload)
    return payload
  }, [persistSession])

  const register = useCallback(async (input: RegisterInput) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    })

    if (!res.ok) {
      await parseError(res, "Registration failed")
    }

    const payload = (await res.json()) as AuthUser
    const nextToken = res.headers.get("set-authorization")
    if (!nextToken) {
      throw new Error("Missing authorization token in register response")
    }

    persistSession(nextToken, payload)
    return payload
  }, [persistSession])

  const logout = useCallback(async () => {
    const activeToken = token
    clearSession()

    if (!activeToken) {
      return
    }

    await fetch("/api/auth/logout", {
      method: "POST",
      headers: {
        token: activeToken,
        Authorization: `Bearer ${activeToken}`,
      },
    })
  }, [clearSession, token])

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      token,
      isAuthenticated: Boolean(token),
      isLoading,
      login,
      register,
      logout,
    }
  }, [isLoading, login, logout, register, token, user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider")
  }

  return context
}
