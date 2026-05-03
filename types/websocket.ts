export interface RaidUpdateMessage {
  type: 'RAID_UPDATE'
  raidId: number
  groupId: number
  health: number
  maxHealth: number
  status: string
  members?: Array<{ userId: number; health: number | null; maxHealth: number | null; knockedOut?: boolean }>
}

export interface CharacterUpdateMessage {
  type: 'CHARACTER_UPDATE'
  level: number
  health: number
  maxHealth: number
  experience: number
  strength: number
  intelligence: number
  resilience: number
  characterType: string | null
}
