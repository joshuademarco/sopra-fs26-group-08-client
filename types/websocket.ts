export interface RaidUpdateMessage {
  type: 'RAID_UPDATE'
  raidId: number
  groupId: number
  health: number
  maxHealth: number
  status: string
  members?: Array<{ userId: number; health: number | null; maxHealth: number | null }>
}
