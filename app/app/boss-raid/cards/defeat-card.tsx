import { BossRaid } from '@/types/raids'
import { OutcomeShell } from './outcome'

export function DefeatCard({ raid }: { raid: BossRaid }) {
  const totalDamage = raid.members.reduce((sum, m) => sum + (m.damageDealt ?? 0), 0)
  const totalXp = raid.members.reduce((sum, m) => sum + (m.xpChange ?? 0), 0)
  const tasksMissed = raid.members.reduce((sum, m) => sum + Math.max(0, (m.totalTasks ?? 0) - (m.tasksCompleted ?? 0)), 0)
  const totalTasks = raid.members.reduce((sum, m) => sum + (m.totalTasks ?? 0), 0)

  return (
    <OutcomeShell
      raid={raid}
      kind='defeat'
      outcomeVar=''
      eyebrow='· Raid failed ·'
      title='DEFEATED'
      titleClass='text-destructive'
      subtitle='The boss survived the timer. Your streak resets — but the next raid is always around the corner.'
      summaryTitle='What went wrong'
      summaryCells={[
        { label: 'Damage dealt', value: String(totalDamage) },
        { label: 'HP remaining', value: String(raid.monster.hp ?? 0), tone: 'destructive' },
        { label: 'Tasks missed', value: `${tasksMissed}/${totalTasks}`, tone: 'destructive' },
        { label: 'Group XP', value: `+${totalXp}`, tone: 'gold' },
      ]}
      stageMonster={raid.monster}
    />
  )
}
