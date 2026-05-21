import { BossRaid, Monster } from '@/types/raids'
import { OutcomeShell } from './outcome'

export function VictoryCard({ raid }: { raid: BossRaid }) {
  const totalDamage = raid.members.reduce((sum, m) => sum + (m.damageDealt ?? 0), 0)
  const totalXp = raid.members.reduce((sum, m) => sum + (m.xpChange ?? 0), 0)
  const totalTasksCompleted = raid.members.reduce((sum, m) => sum + (m.tasksCompleted ?? 0), 0)
  const totalTasks = raid.members.reduce((sum, m) => sum + (m.totalTasks ?? 0), 0)
  const stageMonster: Monster = { ...raid.monster, hpPercent: 0 }

  return (
    <OutcomeShell
      raid={raid}
      kind='victory'
      outcomeVar='[--outcome-color:var(--primary)]'
      eyebrow='★ ★ ★  Raid cleared  ★ ★ ★'
      title='VICTORY'
      titleClass='text-emerald-600'
      subtitle={`${raid.monster.name} has been defeated. Your guild gains XP and the streak grows.`}
      summaryTitle='Battle summary'
      summaryCells={[
        { label: 'Total damage', value: String(totalDamage) },
        { label: 'Tasks complete', value: `${totalTasksCompleted}/${totalTasks}`, tone: 'success' },
        { label: 'Boss HP left', value: '0', tone: 'success' },
        { label: 'Group XP', value: `+${totalXp}`, tone: 'gold' },
      ]}
      stageMonster={stageMonster}
    />
  )
}
