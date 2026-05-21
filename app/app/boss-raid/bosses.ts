export interface BossSpriteSheet {
  src: string
  frames: number
  frameSize: number
  fps: number
  loop: boolean
}

export interface BossDefinition {
  key: string
  name: string
  description: string
  idle: BossSpriteSheet
  hit: BossSpriteSheet
  defeated?: BossSpriteSheet
}

function sheet(src: string, frames: number, frameSize: number, fps = 10, loop = false): BossSpriteSheet {
  return { src, frames, frameSize, fps, loop }
}

export const BOSSES: BossDefinition[] = [
  {
    key: 'bear',
    name: 'Bear Minimum',
    description: 'A hibernating brute who lulls your routine into a permanent winter nap.',
    idle: sheet('/characters/bosses/bear/idle.png', 8, 256, 8, true),
    hit: sheet('/characters/bosses/bear/hit.png', 9, 256, 14),
  },
  {
    key: 'gnome',
    name: 'Procrasti Gnome',
    description: 'A pocket-sized mischief-maker who buries your to-dos under shiny distractions.',
    idle: sheet('/characters/bosses/gnome/idle.png', 8, 192, 8, true),
    hit: sheet('/characters/bosses/gnome/hit.png', 7, 192, 14),
  },
  {
    key: 'paddlefish',
    name: 'Megalo-done Tomorrow',
    description: "A slippery dreamer that pulls you into the current of 'maybe tomorrow'.",
    idle: sheet('/characters/bosses/paddlefish/idle.png', 8, 192, 8, true),
    hit: sheet('/characters/bosses/paddlefish/hit.png', 6, 192, 12),
  },
  {
    key: 'lizard',
    name: 'Temptation Lizard',
    description: "Whispers 'just one more episode' until your evening evaporates.",
    idle: sheet('/characters/bosses/lizard/idle.png', 7, 192, 8, true),
    hit: sheet('/characters/bosses/lizard/hit.png', 2, 192, 10),
  },
  {
    key: 'minotaur',
    name: 'Chaos Minotaur',
    description: 'Charges through your schedule and shatters every careful plan.',
    idle: sheet('/characters/bosses/minotaur/idle.png', 16, 320, 10, true),
    hit: sheet('/characters/bosses/minotaur/hit.png', 12, 320, 16),
  },
  {
    key: 'panda',
    name: 'Couch Panda',
    description: 'Cuddly, cozy, and completely committed to keeping you on the couch.',
    idle: sheet('/characters/bosses/panda/idle.png', 10, 256, 8, true),
    hit: sheet('/characters/bosses/panda/hit.png', 13, 256, 16),
  },
  {
    key: 'snake',
    name: 'Backlog Snake',
    description: 'Coils around your confidence and squeezes until you quit.',
    idle: sheet('/characters/bosses/snake/idle.png', 8, 192, 8, true),
    hit: sheet('/characters/bosses/snake/hit.png', 6, 192, 12),
  },
  {
    key: 'spider',
    name: 'Web crawler',
    description: 'Spins anxious thoughts into webs you keep walking into.',
    idle: sheet('/characters/bosses/spider/idle.png', 8, 192, 8, true),
    hit: sheet('/characters/bosses/spider/hit.png', 8, 192, 14),
  },
  {
    key: 'thief',
    name: 'Time Thief',
    description: 'Steals five minutes here, ten minutes there, until your day is gone.',
    idle: sheet('/characters/bosses/thief/idle.png', 6, 192, 8, true),
    hit: sheet('/characters/bosses/thief/hit.png', 6, 192, 12),
  },
  {
    key: 'troll',
    name: 'Habit Troll',
    description: 'A lumbering grump who eats willpower for breakfast.',
    idle: sheet('/characters/bosses/troll/idle.png', 12, 384, 8, true),
    hit: sheet('/characters/bosses/troll/hit.png', 6, 384, 12),
    defeated: sheet('/characters/bosses/troll/defeated.png', 10, 384, 10),
  },
]

const BOSSES_BY_NAME = new Map(BOSSES.map((b) => [b.name.toLowerCase(), b]))
const BOSSES_BY_KEY = new Map(BOSSES.map((b) => [b.key, b]))

export function getBossDefinition(name: string | null | undefined): BossDefinition {
  if (name) {
    const byName = BOSSES_BY_NAME.get(name.toLowerCase())
    if (byName) return byName
    const byKey = BOSSES_BY_KEY.get(name.toLowerCase())
    if (byKey) return byKey
  }
  return BOSSES[0]
}
