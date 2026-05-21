import { CharacterImage } from '@/components/character-avatar'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Monster, RaidMember } from '@/types/raids'
import { motion, useAnimate } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import { BossSprite } from './boss-sprite'
import { getBossDefinition } from './bosses'

function MemberSprite({ member, dim = false }: { member: RaidMember; dim?: boolean }) {
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

  return (
    <div className={`flex w-24 flex-col items-center gap-1 ${dim || isDead ? 'opacity-40 grayscale' : ''}`} title={member.name}>
      <CharacterImage characterType={member.characterType} alt={member.name} size={88} rotation='north' />
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
        {members.map((member, i) => {
          const center = (members.length - 1) / 2
          const t = center === 0 ? 0 : ((i - center) / center) ** 2
          const dropPx = (1 - t) * 28
          return (
            <div key={member.name} style={{ transform: `translateY(${dropPx}px)` }}>
              <MemberSprite member={member} dim={dimDeadMembers && !!member.died} />
            </div>
          )
        })}
      </div>
    </div>
  )
}
