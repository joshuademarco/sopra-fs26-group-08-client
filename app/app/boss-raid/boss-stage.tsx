import { CharacterImage } from '@/components/character-avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Monster, RaidMember } from '@/types/raids'
import { motion, useAnimate } from 'framer-motion'
import { useEffect, useMemo, useRef, useState } from 'react'
import { BossSprite } from './boss-sprite'
import { getBossDefinition } from './bosses'

const SPRITE_PX = 88
const DEAD_FRAMES = 14
const DEAD_SHEET_W = SPRITE_PX * DEAD_FRAMES
const DEAD_DURATION_MS = 1200

type MemberEffect = 'joining' | 'dying'

function MemberSprite({ member, dim = false, effect }: { member: RaidMember; dim?: boolean; effect?: MemberEffect }) {
  const hp = member.health
  const maxHp = member.maxHealth
  const hasHp = hp != null && maxHp != null && maxHp > 0
  const percent = hasHp ? Math.max(0, Math.min(100, (hp / maxHp) * 100)) : 0
  const isDead = hasHp && hp <= 0
  const barColor = isDead
    ? 'bg-muted-foreground/40'
    : percent <= 25
      ? 'bg-red-500'
      : percent <= 50
        ? 'bg-yellow-400'
        : 'bg-green-500'

  const animClass = effect === 'joining' ? 'dead-reverse' : effect === 'dying' ? 'dead-forward' : null

  return (
    <div className={`flex w-24 flex-col items-center gap-1 ${dim || (isDead && !effect) ? 'opacity-40 grayscale' : ''}`} title={member.name}>
      {animClass ? (
        <div
          className={`[image-rendering:pixelated] ${animClass}`}
          style={{
            width: SPRITE_PX,
            height: SPRITE_PX,
            backgroundImage: "url('/map/effects/dead.png')",
            backgroundSize: `${DEAD_SHEET_W}px ${SPRITE_PX}px`,
            backgroundRepeat: 'no-repeat',
              ['--sheet-w' as string]: `${DEAD_SHEET_W}px`,
          }}
        />
      ) : (
        <CharacterImage characterType={member.characterType} alt={member.name} size={SPRITE_PX} rotation='north' />
      )}
      <span className={`text-[10px] ${member.isCurrentUser ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
        {member.isCurrentUser ? 'You' : member.name}
      </span>
      {hasHp && (
        <>
          <Progress value={percent} className='h-1.5 w-full' innerClassName={barColor} />
          <span className='text-[9px] text-muted-foreground'>{isDead ? 'KO' : `${hp}/${maxHp}`}</span>
        </>
      )}
    </div>
  )
}

export function BossStage({
  monster,
  members,
  dim = false,
  dimDeadMembers = false,
  glare = false,
}: {
  monster: Monster
  members: RaidMember[]
  dim?: boolean
  dimDeadMembers?: boolean
  glare?: boolean
}) {
  const [scope, animate] = useAnimate()
  const prevHpRef = useRef<number | undefined>(undefined)
  const [damage, setDamage] = useState<number | null>(null)
  const [hitKey, setHitKey] = useState(0)
  const bossDef = getBossDefinition(monster.name)
  const isDefeated = monster.hp !== undefined && monster.hp <= 0

  const visibleMembers = useMemo(() => members.filter((m) => m.joined), [members])

  const aliveHistoryRef = useRef<Map<number, boolean>>(new Map())
  const [memberEffects, setMemberEffects] = useState<Map<number, { effect: MemberEffect; startedAt: number }>>(
    () => new Map(),
  )

  useEffect(() => {
    if (monster.hp === undefined) return
    const prevHp = prevHpRef.current
    prevHpRef.current = monster.hp
    if (prevHp === undefined || monster.hp >= prevHp) return

    setDamage(prevHp - monster.hp)
    setHitKey((k) => k + 1)
    animate(scope.current, { x: [-10, 10, -7, 7, -4, 4, 0] }, { duration: 0.45 })
    animate('.hit-overlay', { opacity: [0.75, 0] }, { duration: 0.4 })
  }, [animate, monster.hp, scope])

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

  return (
    <div className='flex w-full flex-col gap-3 px-4 pb-6'>
      <div ref={scope} className='relative mx-auto flex flex-col items-center gap-2'>
        <div className='flex items-center gap-3'>
          <span className='text-3xl font-extrabold text-foreground'>{monster.name}</span>
          <Badge variant='destructive'>LVL {monster.level}</Badge>
        </div>
        <div className='relative flex items-center justify-center'>
          {glare && (
            <div
              aria-hidden
              className='outcome-rays pointer-events-none absolute left-1/2 top-1/2 size-130 -translate-x-1/2 -translate-y-1/2'
            />
          )}
          <div
            className={`relative flex size-56 items-center justify-center overflow-hidden rounded-lg bg-muted select-none ${dim ? 'opacity-50' : ''}`}
          >
            <BossSprite
              idle={bossDef.idle}
              hit={bossDef.hit}
              defeated={bossDef.defeated}
              hitKey={hitKey}
              isDefeated={isDefeated}
              size={224}
            />
            <div className='hit-overlay pointer-events-none absolute inset-0 rounded-lg bg-red-500 opacity-0' />
          </div>
        </div>
        <Progress value={monster.hpPercent} className='h-2 w-56' innerClassName='bg-emerald-500' />

        {damage !== null && (
          <motion.div
            key={hitKey}
            className='pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 select-none whitespace-nowrap text-2xl font-bold text-red-500'
            initial={{ opacity: 1, y: 0 }}
            animate={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.75, ease: 'easeOut' }}
            onAnimationComplete={() => setDamage(null)}
          >
            -{damage}
          </motion.div>
        )}
      </div>

      <div className='flex justify-center gap-3 pt-2'>
        {visibleMembers.map((member, i) => {
          const center = (visibleMembers.length - 1) / 2
          const t = center === 0 ? 0 : ((i - center) / center) ** 2
          const dropPx = (1 - t) * 28
          const effectEntry = memberEffects.get(member.userId)
          return (
            <div key={member.userId} style={{ transform: `translateY(${dropPx}px)` }}>
              <MemberSprite
                member={member}
                dim={dimDeadMembers && !!member.died}
                effect={effectEntry?.effect}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
