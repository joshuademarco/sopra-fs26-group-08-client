'use client'

import { CharacterImage } from '@/components/character-avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import mapData from '@/public/map/boss-raid/spritefusion.json'
import { Monster, RaidMember } from '@/types/raids'
import { motion, useAnimate } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BossSprite } from './boss-sprite'
import { getBossDefinition } from './bosses'

const MEMBER_PX = 96
const DEAD_FRAMES = 14
const DEAD_SHEET_W = MEMBER_PX * DEAD_FRAMES
const DEAD_DURATION_MS = 1200
type MemberEffect = 'joining' | 'dying'

const TILE = mapData.tileSize
const COLS = mapData.mapWidth
const ROWS = mapData.mapHeight
const MAP_W = COLS * TILE
const MAP_H = ROWS * TILE

// boss-raid spritesheet: 8 tiles wide × 10 tall. Tile id N lives at (N % 8, N / 8).
const ATLAS_COLS = 8
const ATLAS_ROWS = 10
const ATLAS_W = ATLAS_COLS * TILE
const ATLAS_H = ATLAS_ROWS * TILE

const FOAM_PX = 192
const FOAM_FRAMES = 8
const FOAM_SHEET_W = FOAM_PX * FOAM_FRAMES

type Tile = { id: string; x: number; y: number }
type Layer = { name: string; tiles: Tile[]; collider: boolean }

const LAYERS = mapData.layers as Layer[]
const tilesIn = (name: string) => LAYERS.find((l) => l.name === name)?.tiles ?? []
const cellSet = (names: string[]) =>
  new Set(LAYERS.filter((l) => names.includes(l.name)).flatMap((l) => l.tiles.map((t) => `${t.x},${t.y}`)))

// spritefusion stores front -> back, so reverse for DOM
const RENDER_LAYERS = [...LAYERS].reverse().filter((l) => l.name !== 'Background')

// all cells covered by ground
const LAND_CELLS = cellSet(['Sand', 'Rocks', 'Cliff', 'Stairs', 'Bridge - horizontal', 'Bridge - vertical'])

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

// flat rock top tiles on the left half — characters stand on these
const LEFT_SPAWN_CELLS: Array<[number, number]> = (() => {
  const seen = new Set<string>()
  const cells: Array<[number, number]> = []
  for (const t of tilesIn('Rocks')) {
    if (t.id !== '57') continue // 57 is the walkable top-surface variant
    if (t.x > 13) continue // left half only
    if (t.y < 3 || t.y > 6) continue // skip back wall (y=2) and below
    const key = `${t.x},${t.y}`
    if (seen.has(key)) continue
    seen.add(key)
    cells.push([t.x, t.y])
  }
  return cells
})()

// boss sits centered on the right plateau
const BOSS_COL = 23.5 - 300 / 64
const BOSS_ROW = 4.5
const BOSS_SIZE = 448

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
          className='absolute [IMAGE-RENDERING:PIXELATED]'
          style={{
            left: t.x * TILE,
            top: t.y * TILE,
            width: TILE,
            height: TILE,
            backgroundImage: `url('/map/boss-raid/spritefusion.png')`,
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

function pickRandomCell(): [number, number] {
  if (LEFT_SPAWN_CELLS.length === 0) return [5, 4]
  return LEFT_SPAWN_CELLS[Math.floor(Math.random() * LEFT_SPAWN_CELLS.length)]!
}

function MemberMarker({
  member,
  pos,
  dim,
  effect,
}: {
  member: RaidMember
  pos: { left: number; top: number }
  dim: boolean
  effect?: MemberEffect
}) {
  const [scope, animate] = useAnimate()
  const prevHpRef = useRef<number | undefined>(undefined)
  const [damage, setDamage] = useState<number | null>(null)
  const [damageKey, setDamageKey] = useState(0)

  useEffect(() => {
    if (member.health == null) return
    const prev = prevHpRef.current
    prevHpRef.current = member.health
    if (prev === undefined || member.health >= prev) return

    setDamage(prev - member.health)
    setDamageKey((k) => k + 1)
    animate(scope.current, { x: [-6, 6, -4, 4, -2, 2, 0] }, { duration: 0.4 })
    animate('.member-hit-overlay', { opacity: [0.75, 0] }, { duration: 0.4 })
  }, [animate, member.health, scope])

  const hp = member.health
  const maxHp = member.maxHealth
  const hasHp = hp != null && maxHp != null && maxHp > 0
  const percent = hasHp ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0
  const isDead = hasHp && hp <= 0
  const dimMe = (dim || isDead) && !effect
  const barColor = isDead
    ? 'bg-muted-foreground/40'
    : percent <= 25
      ? 'bg-red-500'
      : percent <= 50
        ? 'bg-yellow-400'
        : 'bg-emerald-500'

  const animClass = effect === 'joining' ? 'dead-reverse' : effect === 'dying' ? 'dead-forward' : null

  return (
    <div
      className='absolute flex flex-col items-center gap-1'
      style={{
        left: pos.left,
        top: pos.top,
        transform: 'translate(-50%, -100%)',
        zIndex: 60 + Math.floor(pos.top / TILE),
        opacity: dimMe ? 0.4 : 1,
        filter: dimMe ? 'grayscale(1)' : undefined,
      }}
      title={member.name}
    >
      <div ref={scope} className='relative flex flex-col items-center gap-1'>
        <div className='relative drop-shadow-[0_0_1px_black]'>
          {animClass ? (
            <div
              className={`[image-rendering:pixelated] ${animClass}`}
              style={{
                width: MEMBER_PX,
                height: MEMBER_PX,
                backgroundImage: "url('/map/effects/dead.png')",
                backgroundSize: `${DEAD_SHEET_W}px ${MEMBER_PX}px`,
                backgroundRepeat: 'no-repeat',
                ['--sheet-w' as string]: `${DEAD_SHEET_W}px`,
              }}
            />
          ) : (
            <CharacterImage characterType={member.characterType} alt={member.name} size={MEMBER_PX} rotation='east' />
          )}
          <div className='member-hit-overlay pointer-events-none absolute inset-0 rounded-lg bg-red-500 opacity-0' />
        </div>
        <span
          className={`rounded bg-background/90 px-1.5 text-xs font-semibold ${
            member.isCurrentUser ? 'text-primary' : 'text-foreground'
          }`}
        >
          {member.isCurrentUser ? 'You' : member.name}
        </span>
        {hasHp && (
          <div className='flex w-24 flex-col items-center gap-0.5'>
            <Progress value={percent} className='h-3 w-full' innerClassName={barColor} />
            <span className='text-xs font-extrabold text-background/90 mix-blend-difference'>
              {isDead ? 'KO' : `${hp}/${maxHp}`}
            </span>
          </div>
        )}

        {damage !== null && (
          <motion.div
            key={damageKey}
            className='pointer-events-none absolute -top-8 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-2xl font-bold text-red-500 drop-shadow-[0_0_2px_black]'
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            onAnimationComplete={() => setDamage(null)}
          >
            -{damage}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export function BossRaidMap({
  raidId,
  monster,
  members,
  dim = false,
  dimDeadMembers = false,
  glare = false,
}: {
  raidId: number
  monster: Monster
  members: RaidMember[]
  dim?: boolean
  dimDeadMembers?: boolean
  glare?: boolean
}) {
  const [scope, animate] = useAnimate()
  const prevHpRef = useRef<number | undefined>(undefined)
  const prevMemberHealthRef = useRef<Map<number, number>>(new Map())
  const [damage, setDamage] = useState<number | null>(null)
  const [damageKey, setDamageKey] = useState(0)
  const [attackKey, setAttackKey] = useState(0)
  const bossDef = getBossDefinition(monster.name)
  const isDefeated = monster.hp !== undefined && monster.hp <= 0

  const { ref: frameRef, scale } = useScaleToWidth<HTMLDivElement>(MAP_W)

  const visibleMembers = useMemo(() => members.filter((m) => m.joined), [members])

  const aliveHistoryRef = useRef<Map<number, boolean>>(new Map())
  const [memberEffects, setMemberEffects] = useState<Map<number, { effect: MemberEffect; startedAt: number }>>(() => new Map())

  useEffect(() => {
    const now = Date.now()
    setMemberEffects((prev) => {
      let changed = false
      const next = new Map(prev)
      const currentIds = new Set<number>()

      for (const member of visibleMembers) {
        currentIds.add(member.userId)
        const alive = !(member.health != null && member.health <= 0)
        const prevAlive = aliveHistoryRef.current.get(member.userId)
        const isNew = prevAlive === undefined

        if (isNew) {
          next.set(member.userId, { effect: 'joining', startedAt: now })
          changed = true
        } else if (prevAlive && !alive) {
          next.set(member.userId, { effect: 'dying', startedAt: now })
          changed = true
        }
        aliveHistoryRef.current.set(member.userId, alive)
      }

      for (const userId of aliveHistoryRef.current.keys()) {
        if (!currentIds.has(userId)) {
          aliveHistoryRef.current.delete(userId)
          if (next.delete(userId)) changed = true
        }
      }

      return changed ? next : prev
    })
  }, [visibleMembers])

  useEffect(() => {
    const timers: number[] = []
    for (const [userId, entry] of memberEffects) {
      const remaining = Math.max(0, DEAD_DURATION_MS - (Date.now() - entry.startedAt))
      const t = window.setTimeout(() => {
        setMemberEffects((prev) => {
          if (!prev.has(userId)) return prev
          const next = new Map(prev)
          next.delete(userId)
          return next
        })
      }, remaining)
      timers.push(t)
    }
    return () => timers.forEach((t) => window.clearTimeout(t))
  }, [memberEffects])

  // "player damaged boss" and "boss attacked member" each tick.
  useEffect(() => {
    const currentHp = monster.hp
    const prevHp = prevHpRef.current
    const bossDamaged = prevHp !== undefined && currentHp !== undefined && currentHp < prevHp
    if (currentHp !== undefined) prevHpRef.current = currentHp

    let bossAttacked = false
    for (const m of visibleMembers) {
      if (m.health == null) continue
      const prev = prevMemberHealthRef.current.get(m.userId)
      if (prev !== undefined && m.health < prev) bossAttacked = true
      prevMemberHealthRef.current.set(m.userId, m.health)
    }

    if (bossDamaged) {
      setDamage(prevHp! - currentHp!)
      setDamageKey((k) => k + 1)
      animate(scope.current, { x: [-10, 10, -7, 7, -4, 4, 0] }, { duration: 0.45 })
      animate(
        '.boss-tint',
        {
          filter: [
            'brightness(1.5) sepia(1) saturate(12) hue-rotate(-45deg)',
            'brightness(1) sepia(0) saturate(1) hue-rotate(0deg)',
          ],
        },
        { duration: 0.45 },
      )
    } else if (bossAttacked) {
      setAttackKey((k) => k + 1)
    }
  }, [animate, monster.hp, visibleMembers, scope])

  // random pos for raid participants
  const positionsRef = useRef<Map<number, { left: number; top: number }>>(new Map())
  const usedRef = useRef<Set<string>>(new Set())
  const lastRaidIdRef = useRef<number | null>(null)
  if (lastRaidIdRef.current !== raidId) {
    lastRaidIdRef.current = raidId
    positionsRef.current.clear()
    usedRef.current.clear()
  }
  for (const m of visibleMembers) {
    if (positionsRef.current.has(m.userId)) continue
    // random from cells nobody else has claimed
    const free = LEFT_SPAWN_CELLS.filter(([cx, cy]) => !usedRef.current.has(`${cx},${cy}`))
    const pool = free.length > 0 ? free : LEFT_SPAWN_CELLS
    const cell = pool[Math.floor(Math.random() * pool.length)] ?? pickRandomCell()
    usedRef.current.add(`${cell[0]},${cell[1]}`)
    const jx = (Math.random() - 0.5) * TILE * 0.4
    const jy = (Math.random() - 0.5) * TILE * 0.3
    positionsRef.current.set(m.userId, {
      left: cell[0] * TILE + TILE / 2 + jx,
      top: cell[1] * TILE + TILE / 2 + jy,
    })
  }

  return (
    <div className='flex w-full flex-col gap-3'>
      <div
        ref={frameRef}
        className='relative w-full overflow-hidden [IMAGE-RENDERING:PIXELATED]'
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
          <div className='absolute inset-0' style={{ zIndex: 0 }}>
            {COAST.map(([cx, cy], i) => (
              <div
                key={`foam-${cx}-${cy}`}
                className='absolute [IMAGE-RENDERING:PIXELATED] foam-anim'
                style={{
                  left: cx * TILE + TILE / 2 - FOAM_PX / 2,
                  top: cy * TILE + TILE / 2 - FOAM_PX / 2,
                  width: FOAM_PX,
                  height: FOAM_PX,
                  backgroundImage: "url('/map/foam.png')",
                  backgroundSize: `${FOAM_SHEET_W}px ${FOAM_PX}px`,
                  backgroundRepeat: 'no-repeat',
                  animationDelay: `${-(i % FOAM_FRAMES) * 0.16}s`,
                  ['--sheet-w' as string]: `${FOAM_SHEET_W}px`,
                }}
              />
            ))}
          </div>

          {RENDER_LAYERS.map((layer, i) => (
            <div key={layer.name} className='absolute inset-0' style={{ zIndex: 1 + i }}>
              <TileLayer layer={layer} />
            </div>
          ))}

          <div
            className='absolute -translate-x-1/2 -translate-y-1/2'
            style={{ left: BOSS_COL * TILE, top: BOSS_ROW * TILE, zIndex: 90 }}
          >
            {glare && (
              <div
                aria-hidden
                className='outcome-rays pointer-events-none absolute left-1/2 top-1/2 size-130 -translate-x-1/2 -translate-y-1/2'
              />
            )}
            <div ref={scope} className='relative flex flex-col items-center gap-2'>
              <div className='flex items-center gap-2 rounded-full bg-background/85 px-3 py-1 shadow'>
                <span className='text-xl font-extrabold text-foreground'>{monster.name}</span>
                <Badge variant='destructive'>LVL {monster.level}</Badge>
              </div>
              <div className={`relative ${dim ? 'opacity-50' : ''}`} style={{ transform: 'scaleX(-1)' }}>
                <BossSprite
                  idle={bossDef.idle}
                  hit={bossDef.hit}
                  defeated={bossDef.defeated}
                  hitKey={attackKey}
                  isDefeated={isDefeated}
                  size={BOSS_SIZE}
                  className='boss-tint'
                />
              </div>
              <div className='-mt-10 flex w-56 flex-col items-center gap-0.5'>
                <Progress value={monster.hpPercent} className='h-4 w-full' innerClassName='bg-emerald-500' />
                {monster.hp !== undefined && monster.maxHp !== undefined && (
                  <span className='text-sm font-extrabold text-background/90 mix-blend-difference'>
                    {monster.hp <= 0 ? 'DEFEATED' : `${monster.hp}/${monster.maxHp}`}
                  </span>
                )}
              </div>

              {damage !== null && (
                <motion.div
                  key={damageKey}
                  className='pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-3xl font-bold text-red-500 drop-shadow-[0_0_2px_black]'
                  initial={{ opacity: 1, y: 0 }}
                  animate={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.75, ease: 'easeOut' }}
                  onAnimationComplete={() => setDamage(null)}
                >
                  -{damage}
                </motion.div>
              )}
            </div>
          </div>

          {/* members scattered on left rocks */}
          {visibleMembers.map((member) => {
            const pos = positionsRef.current.get(member.userId)
            if (!pos) return null
            const effectEntry = memberEffects.get(member.userId)
            return (
              <MemberMarker
                key={member.userId}
                member={member}
                pos={pos}
                dim={dimDeadMembers && !!member.died}
                effect={effectEntry?.effect}
              />
            )
          })}
        </div>
      </div>
    </div>
  )
}
