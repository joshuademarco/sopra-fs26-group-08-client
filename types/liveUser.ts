export interface LiveUser {
  id: string | number
  email: string
  username: string
  status: string | null
  characterType?: string | null
  level?: number | null
  health?: number | null
  strength?: number | null
  intelligence?: number | null
  resilience?: number | null
}