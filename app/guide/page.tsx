import { Footer } from '@/components/footer'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'

export default function GuidePage() {
  return (
    <main className='flex flex-col items-center w-full'>
      <section className='w-full max-w-3xl md:p-12 py-12'>
        <h1 className='text-4xl font-bold tracking-tight'>BetterTogeter — User Guide</h1>
        <p className='mt-4 text-base text-muted-foreground md:text-lg'>
          BetterTogeter is a gamified habit tracking app that turns real-world self-improvement into an RPG-style
          adventure. Complete habits, level up your character and fight bosses with your group.
        </p>

        <h2 className='text-2xl font-semibold mt-10'>Getting Started</h2>

        <h3 className='text-xl font-medium mt-6'>Creating an Account</h3>
        <ul className='list-disc list-inside mt-2 space-y-1 text-base text-muted-foreground'>
          <li>Click <strong>Sign Up</strong> on the homepage</li>
          <li>Enter a username, email address and password</li>
          <li>Choose a character type (this is your in-game avatar)</li>
          <li>You&apos;ll be taken to the home page automatically</li>
        </ul>

        <h3 className='text-xl font-medium mt-6'>Logging In</h3>
        <p className='mt-2 text-base text-muted-foreground'>
          Use your email and password on the Login page.
        </p>

        <h2 className='text-2xl font-semibold mt-10'>Home</h2>
        <p className='mt-2 text-base text-muted-foreground'>The home page is your home base. It shows:</p>
        <ul className='list-disc list-inside mt-2 space-y-1 text-base text-muted-foreground'>
          <li><strong>Live map</strong> (on the map you see active players and their characters)</li>
          <li><strong>Current weather</strong> (this directly affects your XP bonuses)</li>
        </ul>

        <h2 className='text-2xl font-semibold mt-10'>Habits & To-Dos</h2>
        <p className='mt-2 text-base text-muted-foreground'>
          Navigate to the Habits/Todos page to manage your tasks.
        </p>

        <h3 className='text-xl font-medium mt-6'>Habits (Recurring Tasks)</h3>
        <p className='mt-2 text-base text-muted-foreground'>
          Habits repeat on a schedule. When creating one, you configure:
        </p>
        <div className='mt-4'>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Setting</TableHead>
                <TableHead>Options</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Physical (Strength), Cognitive (Intelligence), Emotional (Resilience)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Frequency</TableCell>
                <TableCell>Daily, Weekly, Monthly</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Positive (earn XP) or Negative (track avoidance)</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Difficulty</TableCell>
                <TableCell>Easy (1x), Medium (2x), Hard (3x) (scales your XP reward)</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        <p className='mt-4 text-base text-muted-foreground'>
          Click the check button on a habit to mark it complete. You&apos;ll earn XP and the relevant stat on your
          character increases. Each habit also tracks a streak.
        </p>

        <h3 className='text-xl font-medium mt-6'>To-Dos (One-Time Tasks)</h3>
        <p className='mt-2 text-base text-muted-foreground'>
          Same categories and difficulty settings as habits, but they&apos;re completed once. You can optionally set a due date.
        </p>

        <h2 className='text-2xl font-semibold mt-10'>Weather Multipliers</h2>
        <p className='mt-2 text-base text-muted-foreground'>
          The current weather boosts XP for specific categories.
        </p>
        <p className='mt-2 text-base text-muted-foreground'>
          The multiplier is shown on each habit card so you know when to prioritize.
        </p>

        <h2 className='text-2xl font-semibold mt-10'>Your Character</h2>
        <p className='mt-2 text-base text-muted-foreground'>The Character page shows your RPG identity:</p>
        <ul className='list-disc list-inside mt-2 space-y-1 text-base text-muted-foreground'>
          <li><strong>Level & XP bar</strong></li>
          <li><strong>Three stats</strong> (Strength, Intelligence, Resilience each tied to a habit category)</li>
          <li><strong>Equipment slots</strong> (Hat, Chest, and Handheld items)</li>
          <li><strong>Achievements</strong> (badges for milestones like completing your first habit, hitting streaks or reaching stat thresholds)</li>
        </ul>

        <h2 className='text-2xl font-semibold mt-10'>Groups</h2>
        <p className='mt-2 text-base text-muted-foreground'>Groups let you team up with other players.</p>

        <h3 className='text-xl font-medium mt-6'>Creating or Joining a Group</h3>
        <ul className='list-disc list-inside mt-2 space-y-1 text-base text-muted-foreground'>
          <li><strong>Create:</strong> Pick a group name and set a password</li>
          <li><strong>Join:</strong> Enter an existing group&apos;s name and password</li>
        </ul>
        <p className='mt-2 text-base text-muted-foreground'>
          Once in a group, you can view members, see who&apos;s online and check their achievements.
        </p>

        <h2 className='text-2xl font-semibold mt-10'>Boss Raids</h2>
        <p className='mt-2 text-base text-muted-foreground'>
          Boss Raids are the multiplayer core of BetterTogeter. Groups fight a shared boss together.
        </p>
        <p className='mt-4 text-base text-muted-foreground font-medium'>How it works:</p>
        <ul className='list-disc list-inside mt-2 space-y-1 text-base text-muted-foreground'>
          <li>Open the Boss Raid page and select your group</li>
          <li>Join a scheduled raid</li>
          <li>The raid generates timed tasks, complete them before the timer runs out</li>
          <li>Completing a task deals damage to the boss</li>
          <li>Failing a task deals damage to your character</li>
          <li>The raid ends when the boss&apos;s health reaches zero or the team&apos;s health is depleted</li>
        </ul>

        <h2 className='text-2xl font-semibold mt-10'>Leaderboard</h2>
        <p className='mt-2 text-base text-muted-foreground'>
          The global Leaderboard ranks the top 10 players by level, then XP. It shows each player&apos;s username, level
          and total XP.
        </p>

        <h2 className='text-2xl font-semibold mt-10'>Settings</h2>
        <p className='mt-2 text-base text-muted-foreground'>Go to Settings to:</p>
        <ul className='list-disc list-inside mt-2 space-y-1 text-base text-muted-foreground'>
          <li>Update your username or email</li>
          <li>Change your password</li>
        </ul>

        <div className='mt-10 flex justify-center'>
          <Button asChild variant='secondary'>
            <Link href='/'>Back to Home</Link>
          </Button>
        </div>
      </section>
      <Footer />
    </main>
  )
}
