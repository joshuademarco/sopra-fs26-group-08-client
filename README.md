# BetterTogether: A Gamified Habit Tracker (Client)

BetterTogether is a gamified habit tracking app that turns self-improvement into an RPG-style adventure. It solves the tedious nature of traditional habit trackers by blending personal growth with RPG mechanics and social accountability. Users complete habits to earn XP, level up their character, and team up with friends for "Boss Raids". This mix of individual progress and team-based goals makes achieving personal goals a fun, collaborative experience.  

This repository contains the frontend client application, providing the interactive user interface that connects to the backend RESTful API and real-time WebSocket services.

## Technologies Used

- **Framework**: [Next.js](https://nextjs.org/) (React)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn/ui](https://ui.shadcn.com/)
- **State Management**: React Context API
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for validation
- **API Communication**: RESTful API with `fetch`

## High-Level Components

Our frontend is built around a few core concepts that work together to create the user experience.

1. **Authentication & Onboarding**: New users are guided through a multi-step onboarding process that introduces core features and helps them create their first habit. The `useAuth` hook and `AuthProvider` manage user sessions and protect routes, ensuring a secure and seamless experience from login to logout.

2. **Habit & Task Management**: This is the heart of the application. Users can create recurring `Habits` and one-off `To-Dos`. The `HabitForm` component allows users to define a task's category (which maps to a character stat), difficulty, and frequency. Completing habits grants XP, while missing them can result in a health penalty for the user's character.

3. **Character Progression**: Every user has a character whose stats (Strength, Intelligence, Resilience) grow as they complete habits in corresponding categories. This visual representation of progress is a key motivator, with stats and level-ups visible on the character page.

4. **Groups & Boss Raids**: Users can form or join groups to participate in cooperative boss raids. The raid page is a live, interactive view where group members work together to complete a series of timed micro-tasks. Success depends on the combined effort and stats of the group, and victory yields XP and potential item drops.

5. **Live Data Sync with WebSockets**: To support real-time features like the online user map and live raid progress, the client maintains a WebSocket connection to the server. A shared `WebSocketProvider` manages the connection state and dispatches incoming data to relevant components, ensuring the UI is always up-to-date.

## Launch & Deployment

Follow these steps to get the client running locally for development.

### Prerequisites

- Node.js (v18 or later)
- npm or a compatible package manager
- A running instance of the backend server.

### Running Locally

1. **Clone the repository:**
    ```bash
    git clone https://github.com/joshuademarco/sopra-fs26-group-08-client.git
    cd sopra-fs26-group-08-client
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Set up environment variables:**
    Create a file named `.env.local` in the root of the project and add the URL of your running backend server. This ensures the client knows where to send API requests.
    ```
    NEXT_PUBLIC_API_URL=http://localhost:8080
    ```

4. **Run the development server:**
    ```bash
    npm run dev
    ```
    
The application will be available at `http://localhost:3000`.

### Running Tests

To run the automated tests for the project, use the following command:

```bash
npm run test
```

## Illustrations: User Flow

The core user journey is designed to be simple and rewarding.

1. **Onboarding & Habit Creation**: New users are welcomed and guided to create their first habit.

2. **Character Growth**: As users complete habits, their character gains XP and levels up, improving their stats.

3. **Team Up for Raids**: Users can join groups and participate in challenging boss raids, a core social feature.

4. **Climb the Leaderboard**: A global leaderboard encourages friendly competition by ranking users based on their XP and level.

## Roadmap

- **Expanded Item & Shop System**: Introduce a wider variety of cosmetic and functional items that can be earned from raids or purchased with in-game currency.
- **Advanced Social Features**: Implement a friend system, direct messaging between users.
- **Narrative Questlines**: Create multi-step quests with branching paths and unique rewards that go beyond the current daily quest system, adding more depth to the world.
- **Community Challenges and Events**: Introduce server-wide events or group-based competitions. For example, a week-long challenge where all players contribute to a global progress bar by completing physical habits, unlocking a unique reward for everyone if the goal is met.

## Authors & Acknowledgment

This project was brought to life by the dedicated efforts of:
- **@alemicap**
- **@joshuademarco**
- **@michaelCHer**
- **@yappayappay**

## License

Distributed under the MIT License. See `LICENSE` (in server) for more information.
