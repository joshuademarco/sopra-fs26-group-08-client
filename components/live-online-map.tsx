'use client'

import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { useWebsocketContext } from '@/hooks/useWebsocketContext'
import mapData from '@/public/map/spritefusion.json'
import type { LiveUser } from '@/types/liveUser'
import { Users } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'
import { Badge } from './ui/badge'

const TILE = mapData.tileSize
const COLS = mapData.mapWidth
const ROWS = mapData.mapHeight
const MAP_W = COLS * TILE
const MAP_H = ROWS * TILE

// Spritefusion atlas — 8 tiles wide × 26 tall. Tile id N lives at (N % 8, N / 8).
const ATLAS_COLS = 8
const ATLAS_W = ATLAS_COLS * TILE
const ATLAS_H = 26 * TILE

const FOAM_PX = 192
const FOAM_FRAMES = 8
const FOAM_SHEET_W = FOAM_PX * FOAM_FRAMES

const SHEEP_PX = 128
const SHEEP_FRAMES = 8
const SHEEP_SHEET_W = SHEEP_PX * SHEEP_FRAMES
const SHEEP_BOUNCE_FRAMES = 6
const SHEEP_BOUNCE_SHEET_W = SHEEP_PX * SHEEP_BOUNCE_FRAMES

const DEAD_PX = 128
const DEAD_FRAMES = 14
const DEAD_SHEET_W = DEAD_PX * DEAD_FRAMES
const DEAD_DURATION_MS = 1200

type Tile = { id: string; x: number; y: number }
type Layer = { name: string; tiles: Tile[]; collider: boolean }

const LAYERS = mapData.layers as Layer[]
const tilesIn = (name: string) => LAYERS.find((l) => l.name === name)?.tiles ?? []
const cellSet = (names: string[]) =>
  new Set(LAYERS.filter((l) => names.includes(l.name)).flatMap((l) => l.tiles.map((t) => `${t.x},${t.y}`)))

// all cells covered by ground
const LAND_CELLS = cellSet([
  'Sand',
  'Grass',
  'Rocks',
  'Cliff',
  'Buildings',
  'Stairs',
  'Bridge - horizontal',
  'Bridge - vertical',
])

// since spritefusion stores layers front -> back, so reverse for DOM
const RENDER_LAYERS = [...LAYERS].reverse().filter((l) => l.name !== 'Background')

// foam only on Sand tiles that touch a non-land neighbour
const COAST: Array<[number, number]> = tilesIn('Sand')
  .filter(
    ({ x, y }) =>
      !LAND_CELLS.has(`${x + 1},${y}`) ||
      !LAND_CELLS.has(`${x - 1},${y}`) ||
      !LAND_CELLS.has(`${x},${y + 1}`) ||
      !LAND_CELLS.has(`${x},${y - 1}`),
  )
  .map((t) => [t.x, t.y])

// Grass cells with nothing blocking on top for charaters to spawn
const GRASS_SPAWN_CELLS: Array<[number, number]> = (() => {
  const blocked = cellSet(['Buildings', 'Cliff', 'Trees back', 'Trees front', 'Miscs', 'Small rocks'])
  const out: Array<[number, number]> = []
  const seen = new Set<string>()
  for (const t of tilesIn('Grass')) {
    const key = `${t.x},${t.y}`
    if (seen.has(key) || blocked.has(key)) continue
    seen.add(key)
    out.push([t.x, t.y])
  }
  return out
})()

// sheep idle
const SHEEP: Array<{ col: number; row: number; delay: number }> = [
  { col: 5.5, row: 5.5, delay: 0 },
  { col: 15.5, row: 5.5, delay: -0.18 },
  { col: 9.5, row: 10.5, delay: -0.36 },
  { col: 18.5, row: 12.5, delay: -0.54 },
]

// blue knight idle
const KNIGHT_PX = 128
type Knight = { src: string; frames: number; duration: number; col: number; row: number; delay: number }
const KNIGHTS: Knight[] = [
  { src: '/map/knights/warrior-idle.png', frames: 8, duration: 1.2, col: 13.5, row: 5.5, delay: 0 },
  { src: '/map/knights/warrior-idle.png', frames: 8, duration: 1.2, col: 15.5, row: 5.5, delay: -0.3 },
  { src: '/map/knights/archer-idle.png', frames: 6, duration: 1.0, col: 14.5, row: 6.5, delay: -0.15 },
]

// rocks in the water with 4 variants
const WATER_ROCK_FRAMES = 16
const ROCK_01 = '/map/water-rocks/01.png'
const ROCK_02 = '/map/water-rocks/02.png'
const ROCK_03 = '/map/water-rocks/03.png'
const ROCK_04 = '/map/water-rocks/04.png'

type WaterRock = { src: string; size: number; col: number; row: number; delay: number }
const WATER_ROCKS: WaterRock[] = [
  { src: ROCK_01, size: 64, col: 3.5, row: 0.5, delay: 0 },
  { src: ROCK_02, size: 64, col: 25.5, row: 1.5, delay: -0.35 },
  { src: ROCK_03, size: 64, col: 0.5, row: 6.5, delay: -0.7 },
  { src: ROCK_04, size: 64, col: 28.5, row: 9.5, delay: -1.05 },
  { src: ROCK_02, size: 64, col: 6.5, row: 14.5, delay: -1.4 },
  { src: ROCK_03, size: 64, col: 22.5, row: 14.5, delay: -1.75 },
  { src: ROCK_01, size: 128, col: 1.5, row: 2.5, delay: -0.5 },
  { src: ROCK_04, size: 128, col: 27.5, row: 12.5, delay: -1.6 },
]

function tileBgPosition(id: string) {
  const n = Number.parseInt(id, 10)
  return `-${(n % ATLAS_COLS) * TILE}px -${Math.floor(n / ATLAS_COLS) * TILE}px`
}

function TileLayer({ layer }: { layer: Layer }) {
  return (
    <>
      {layer.tiles.map((t, i) => (
        <div
          key={`${layer.name}-${i}`}
          className={`absolute [IMAGE-RENDERING:PIXELATED]`}
          style={{
            left: t.x * TILE,
            top: t.y * TILE,
            width: TILE,
            height: TILE,
            backgroundImage: `url('/map/spritefusion.png')`,
            backgroundPosition: tileBgPosition(t.id),
            backgroundSize: `${ATLAS_W}px ${ATLAS_H}px`,
            backgroundRepeat: 'no-repeat',
          }}
        />
      ))}
    </>
  )
}

function useScaleToWidth<T extends HTMLElement>(designW: number) {
  const ref = useRef<T | null>(null)
  const [scale, setScale] = useState(1)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      if (entry.contentRect.width > 0) setScale(entry.contentRect.width / designW)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [designW])
  return { ref, scale }
}

function UserMarker({ user }: { user: LiveUser }) {
  if (user.characterType) {
    return (
      <div className='relative flex flex-col items-center gap-1'>
        <Image
          src={`/characters/${user.characterType}/rotations/south.png`}
          alt={user.username}
          width={80}
          height={80}
          className='[image-rendering:pixelated] filter-[drop-shadow(0_0_1px_black)_drop-shadow(0_0_1px_black)_drop-shadow(0_0_1px_black)]'
        />
        <Badge variant='secondary' className='px-1.5 py-0 text-xs font-bold'>
          {user.username}
        </Badge>
      </div>
    )
  }

  return (
    <div className='relative flex flex-col items-center gap-1.5'>
      <Avatar className='size-9 ring-2 ring-black/80 shadow-[0_3px_8px_rgba(0,0,0,0.65)]'>
        <AvatarFallback className='bg-foreground text-background'>{user.username.slice(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className='text-xs font-bold text-foreground'>{user.username}</span>
    </div>
  )
}

// random position for character spawn
function randomGrassPosition(): { left: string; top: string } {
  const [c, r] = GRASS_SPAWN_CELLS[Math.floor(Math.random() * GRASS_SPAWN_CELLS.length)] ?? [
    Math.floor(COLS / 2),
    Math.floor(ROWS / 2),
  ]
  const jitter = () => (Math.random() - 0.5) * TILE * 0.6
  const xPx = c * TILE + TILE / 2 + jitter()
  const yPx = r * TILE + TILE / 2 + jitter()
  return { left: `${(xPx / MAP_W) * 100}%`, top: `${(yPx / MAP_H) * 100}%` }
}

type UserEffect = 'joining' | 'idle' | 'leaving'
type UserEntry = { user: LiveUser; effect: UserEffect; startedAt: number }

export function LiveOnlineMap() {
  const userPositionsRef = useRef<Map<LiveUser['id'], { left: string; top: string }>>(new Map())
  const { onlineUsers: users } = useWebsocketContext()
  const [entries, setEntries] = useState<Map<LiveUser['id'], UserEntry>>(new Map())

  for (const user of users) {
    if (!userPositionsRef.current.has(user.id)) {
      userPositionsRef.current.set(user.id, randomGrassPosition())
    }
  }

  // character join and leave event
  useEffect(() => {
    setEntries((prev) => {
      let changed = false
      const next = new Map(prev)
      const incoming = new Set(users.map((u) => u.id))
      const now = Date.now()

      for (const user of users) {
        const existing = next.get(user.id)
        if (!existing || existing.effect === 'leaving') {
          next.set(user.id, { user, effect: 'joining', startedAt: now })
          changed = true
        } else if (existing.user !== user) {
          next.set(user.id, { ...existing, user })
          changed = true
        }
      }

      for (const [id, entry] of next) {
        if (!incoming.has(id) && entry.effect !== 'leaving') {
          next.set(id, { ...entry, effect: 'leaving', startedAt: now })
          changed = true
        }
      }

      return changed ? next : prev
    })
  }, [users])

  // The following useEffect function was suggested by AI since we had issues with stuck animations - Joshua
  // Schedule transition timers based on each entry's startedAt; if entries change mid-animation the cleanup clears stale timers and the next run reschedules with the correct remaining time.
  useEffect(() => {
    const timers: number[] = []
    for (const [id, entry] of entries) {
      if (entry.effect === 'idle') continue
      const remaining = Math.max(0, DEAD_DURATION_MS - (Date.now() - entry.startedAt))
      const t = window.setTimeout(() => {
        setEntries((prev) => {
          const e = prev.get(id)
          if (!e) return prev
          const next = new Map(prev)
          if (e.effect === 'joining') next.set(id, { ...e, effect: 'idle' })
          else if (e.effect === 'leaving') next.delete(id)
          else return prev
          return next
        })
      }, remaining)
      timers.push(t)
    }
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [entries])

  const { ref: frameRef, scale } = useScaleToWidth<HTMLDivElement>(MAP_W)

  return (
    <div className='relative w-full'>
      {/* The following keyframes were generated with AI (i could not have had the patience or time for that) - Joshua */}
      <style>{`
          @keyframes foam-cycle { from { background-position: 0 0; } to { background-position: -${FOAM_SHEET_W}px 0; } }
          .foam-anim { animation: foam-cycle 1.4s steps(${FOAM_FRAMES}) infinite; }
          @keyframes sheep-cycle { from { background-position: 0 0; } to { background-position: -${SHEEP_SHEET_W}px 0; } }
          @keyframes sheep-bounce { from { background-position: 0 0; } to { background-position: -${SHEEP_BOUNCE_SHEET_W}px 0; } }
          .sheep-anim { animation: sheep-cycle 1.1s steps(${SHEEP_FRAMES}) infinite; }
          .sheep-anim:hover {
            background-image: url('/map/sheep-bouncing.png') !important;
            background-size: ${SHEEP_BOUNCE_SHEET_W}px ${SHEEP_PX}px !important;
            animation: sheep-bounce 0.6s steps(${SHEEP_BOUNCE_FRAMES}) infinite;
          }
          @keyframes water-rock-cycle { from { background-position-x: 0; } to { background-position-x: calc(-1 * var(--sheet-w)); } }
          .water-rock-anim { animation: water-rock-cycle 2.4s steps(${WATER_ROCK_FRAMES}) infinite; }
          @keyframes knight-cycle { from { background-position-x: 0; } to { background-position-x: calc(-1 * var(--sheet-w)); } }
          .knight-anim { animation: knight-cycle var(--dur) steps(var(--frames)) infinite; }
          @keyframes dead-forward { from { background-position: 0 0; } to { background-position: -${DEAD_SHEET_W}px 0; } }
          .dead-forward { animation: dead-forward ${DEAD_DURATION_MS}ms steps(${DEAD_FRAMES}) forwards; }
          @keyframes dead-reverse { from { background-position: -${DEAD_SHEET_W}px 0; } to { background-position: 0 0; } }
          .dead-reverse { animation: dead-reverse ${DEAD_DURATION_MS}ms steps(${DEAD_FRAMES}) forwards; }
        `}</style>

      <div
        ref={frameRef}
        className={`relative w-full overflow-hidden [IMAGE-RENDERING:PIXELATED]`}
        style={{
          aspectRatio: `${MAP_W} / ${MAP_H}`,
          backgroundImage: "url('/map/water.png')",
          backgroundRepeat: 'repeat',
          backgroundSize: '64px 64px',
        }}
      >
        <div
          className='absolute top-0 left-0'
          style={{
            width: MAP_W,
            height: MAP_H,
            transform: `scale(${scale})`,
            transformOrigin: '0 0',
          }}
        >
          <div className='absolute inset-0' style={{ zIndex: 1 }}>
            {WATER_ROCKS.map((rock, i) => {
              const sheetW = rock.size * WATER_ROCK_FRAMES
              return (
                <div
                  key={`rock-${i}`}
                  className={`absolute [IMAGE-RENDERING:PIXELATED] water-rock-anim`}
                  style={
                    {
                      left: rock.col * TILE - rock.size / 2,
                      top: rock.row * TILE - rock.size / 2,
                      width: rock.size,
                      height: rock.size,
                      backgroundImage: `url('${rock.src}')`,
                      backgroundSize: `${sheetW}px ${rock.size}px`,
                      backgroundRepeat: 'no-repeat',
                      animationDelay: `${rock.delay}s`,
                      ['--sheet-w' as string]: `${sheetW}px`,
                    } as React.CSSProperties
                  }
                />
              )
            })}
          </div>

          <div className='absolute inset-0' style={{ zIndex: 2 }}>
            {COAST.map(([cx, cy], i) => (
              <div
                key={`foam-${cx}-${cy}`}
                className={`absolute [IMAGE-RENDERING:PIXELATED] foam-anim`}
                style={{
                  left: cx * TILE + TILE / 2 - FOAM_PX / 2,
                  top: cy * TILE + TILE / 2 - FOAM_PX / 2,
                  width: FOAM_PX,
                  height: FOAM_PX,
                  backgroundImage: "url('/map/foam.png')",
                  backgroundSize: `${FOAM_SHEET_W}px ${FOAM_PX}px`,
                  backgroundRepeat: 'no-repeat',
                  animationDelay: `${-(i % FOAM_FRAMES) * 0.16}s`,
                }}
              />
            ))}
          </div>

          {RENDER_LAYERS.map((layer, i) => (
            <div key={layer.name} className='absolute inset-0' style={{ zIndex: 3 + i }}>
              <TileLayer layer={layer} />
            </div>
          ))}

          {SHEEP.map((s, i) => (
            <div
              key={`sheep-${i}`}
              className={`absolute [IMAGE-RENDERING:PIXELATED] sheep-anim`}
              style={{
                left: s.col * TILE - SHEEP_PX / 2,
                top: s.row * TILE - SHEEP_PX / 2,
                width: SHEEP_PX,
                height: SHEEP_PX,
                backgroundImage: "url('/map/sheep.png')",
                backgroundSize: `${SHEEP_SHEET_W}px ${SHEEP_PX}px`,
                backgroundRepeat: 'no-repeat',
                animationDelay: `${s.delay}s`,
                zIndex: 50 + Math.floor(s.row),
              }}
            />
          ))}

          {KNIGHTS.map((k, i) => {
            const sheetW = KNIGHT_PX * k.frames
            return (
              <div
                key={`knight-${i}`}
                className={`absolute [IMAGE-RENDERING:PIXELATED] knight-anim`}
                style={
                  {
                    left: k.col * TILE - KNIGHT_PX / 2,
                    top: k.row * TILE - KNIGHT_PX / 2,
                    width: KNIGHT_PX,
                    height: KNIGHT_PX,
                    backgroundImage: `url('${k.src}')`,
                    backgroundSize: `${sheetW}px ${KNIGHT_PX}px`,
                    backgroundRepeat: 'no-repeat',
                    animationDelay: `${k.delay}s`,
                    zIndex: 50 + Math.floor(k.row),
                    ['--sheet-w' as string]: `${sheetW}px`,
                    ['--frames' as string]: k.frames,
                    ['--dur' as string]: `${k.duration}s`,
                  } as React.CSSProperties
                }
              />
            )
          })}

          {[...entries.values()].map((entry) => {
            const position = userPositionsRef.current.get(entry.user.id) ?? { left: '50%', top: '50%' }
            const animClass = entry.effect === 'joining' ? 'dead-reverse' : entry.effect === 'leaving' ? 'dead-forward' : null
            return (
              <div
                key={entry.user.id}
                className='absolute -translate-x-1/2 -translate-y-1/2'
                style={{ left: position.left, top: position.top, zIndex: 100 }}
                title={`${entry.user.username} is online`}
              >
                {animClass ? (
                  <div
                    className={`[IMAGE-RENDERING:PIXELATED] ${animClass}`}
                    style={{
                      width: DEAD_PX,
                      height: DEAD_PX,
                      backgroundImage: "url('/map/effects/dead.png')",
                      backgroundSize: `${DEAD_SHEET_W}px ${DEAD_PX}px`,
                      backgroundRepeat: 'no-repeat',
                    }}
                  />
                ) : (
                  <UserMarker user={entry.user} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className='absolute top-3 right-3 z-200 flex flex-col items-end gap-1.5 text-xs'>
        <span className='inline-flex items-center gap-2 rounded-full border bg-background/90 px-3 py-1.5 '>
          <Users className='size-3.5' />
          {users.length} online
        </span>
      </div>
    </div>
  )
}
