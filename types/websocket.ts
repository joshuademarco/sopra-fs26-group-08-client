export interface RaidUpdateMessage {
  type: 'RAID_UPDATE'
  raidId: number
  groupId: number
  health: number
  maxHealth: number
  status: 'SCHEDULED' | 'ACTIVE' | 'DEFEATED' | 'FAILED'
  members?: Array<{ userId: number; health: number | null; maxHealth: number | null; knockedOut?: boolean }>
}

export interface RaidDeletedMessage {
  type: 'RAID_DELETED'
  raidId: number
  groupId: number
}

export type RaidSocketMessage = RaidUpdateMessage | RaidDeletedMessage

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
