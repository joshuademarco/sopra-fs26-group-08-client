# Contributions

Every member has to complete at least 2 meaningful tasks per week, where a
single development task should have a granularity of 0.5-1 day. The completed
tasks have to be shown in the weekly TA meetings. You have one "Joker" to miss
one weekly TA meeting and another "Joker" to once skip continuous progress over
the remaining weeks of the course. Please note that you cannot make up for
"missed" continuous progress, but you can "work ahead" by completing twice the
amount of work in one week to skip progress on a subsequent week without using
your "Joker". Please communicate your planning **ahead of time**.

Note: If a team member fails to show continuous progress after using their
Joker, they will individually fail the overall course (unless there is a valid
reason).

**You MUST**:

- Have two meaningful contributions per week.

**You CAN**:

- Have more than one commit per contribution.
- Have more than two contributions per week.
- Link issues to contributions descriptions for better traceability.

**You CANNOT**:

- Link the same commit more than once.
- Use a commit authored by another GitHub user.

---

## Contributions Week 1 - [23.03.2026] to [29.03.2026]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@joshuademarco]** | [23.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/590a7e7] | [Set up the initial Shadcn UI stack, prettier config, and frontend tooling baseline.] | [This established the reusable component and formatting foundation for later frontend work.] |
|                    | [25.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/8265597] | [Reorganized the project structure to match Next.js conventions.] | [This made the frontend structure cleaner and reduced friction for continued page development.] |
|                    | [27.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/9e3751f] | [Implemented the default application page with sidebar and navigation components.] | [This created the main in-app layout that users need to move through the application.] |
| **[@yappayappay]** | [27.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/7819e521bc7bbdd2286d6a2146c97c2be098b397] | [implemented client-side registration input validation using shadcn documentation -> react hook form, and zod (Issue #35)] | [enables real-time user feedback on input rules for registration before form submission hence reducing unnecessary API calls] |
|                    | [29.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/ae898d1cfeb6a7b196af198ba9ee67de7f424004] | [implemented backend input validation (jakarta) and adjusted tests (Issue #21)] | [enforces strict data integrity and security at API level. aligns database with new frontend registration input] |
| **[@michaelCHer]** | [27.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/89cfbd4de10ce194c0c33774a0e74e4268530808] | [Implemented register UI] | [A potential user expects a nice register UI] |
|                    | [27.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/24fb65c824408ece4572f3bdba24206bf1174841] | [Implemented Login UI and link between Login and Register Pages] | [A potential user expects a nice login UI] |
| **[@alemicap]** | [27.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/4dbde4816469282c85f87d639cc40c56fb35c88f] | [implementation of character stats (strength, intelligence and resilience)] | [stats of character which get leveled up] |
|                    | [27.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/2f995b8de42fb4e264838c24fe87990d0a1bb3b3] | [implementation of sidebar on application page #52] | [important for navigation to different tabs] |

---

## Contributions Week 2 - [30.03.2026] to [05.04.2026]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@joshuademarco]** | [05.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/0fe22ad6daede0884dba38780cd497f0652bf35b] | [Implemented user registration, login, and logout with updated auth DTOs and entity changes.] | [This established the backend auth flow and aligned the API model with the new frontend login/register screens.] |
|                    | [05.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/405af5874167df740fdc70e7a54d3a9439c19d0d] | [Fixed backend auth integration issues by tightening header exposure and strict imports.] | [This removed request/compile issues that blocked the authentication flow from working reliably.] |
|                    | [05.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/55c02d8a59a653d299fc7abd26488c2af3f53b92] | [Added the /auth/me endpoint and built the backend websocket/live-map groundwork.] | [This enabled authenticated live-user tracking for the map feature.] |
|                    | [05.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/caffda8be2cef16305d8b3dbb2d62ec17078973c] | [Implemented the AuthProvider and useAuth hook for shared client-side authentication state.] | [This centralized auth handling so pages and components could access login state consistently.] |
|                    | [05.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/869abf4b8be0729fdad23c7dec406d69bf9afcdd] | [Added not-found and unauthorized pages and fixed the @/utils module resolution issue.] | [This improved route handling and removed a build error in the frontend.] |
|                    | [05.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/71e89f6724cbd1b86e28eabdb188d89b228fd0d9] | [Reworked authentication flows, login validation, user display, and navigation links.] | [This completed the main client authentication UX and removed the old /users routes.] |
|                    | [05.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/da229b3bb536186ffbc30bda9cd3b59c3c22066f] | [Renamed the notfound route, added server-side auth checks, set auth form defaults, and fixed Next.js links.] | [This cleaned up route conventions and made the auth forms and navigation more robust.] |
|                    | [05.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/4113a31a480088d971367ad0e5a88e9ce7e25c2a] | [Implemented the live online users feature with map display integration.] | [This added the visible live-user map that the backend websocket data feeds into.] |
| **[@yappayappay]** | [05.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/91d6d2c16f8e5eedd3f651755932be5ff6af4d86] | [error message for duplicate username/email] | [ensure unique database requirements with server side validation where user gets visual UI feedback (zod)] |
|                    | [05.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/585a2e7d112bfeee58e2da72806918184bb1a9d1] | [basic structure for habit and todos] | [this will be main the main feature, hence good structure like we predefined in UML diagram are necessary for implementation] |
| **[@michaelCHer]** | [02.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/be08386dbb3d6107e6239a60105971982ef1e715] | [API fetch and data parse] | [For later use of weather data an API fetch is needed. The data parsing is needed to have raw data and not a JSON format] |
|                    | [04.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/42c3f6d3eb1f6f0857e6a113ce5d2b15359aea3b] | [Implemented multiplier calcualtion] | [The influence of the weather on the habit XP rewards is a central feature of our application] |
| **[@alemicap]** | [31.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/925001b2ed028fe1f1ceb77662a6e21d6c467bf5 https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/6974ebfc1302916d33151a70418e9c6d62b54628] | [implementation of characters UI page + adaptation of character stats bars to be more flexible in using them] | [A potential user expects a nice character page] |
|                    | [01.04]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/f58a4e2c1b1de87920a0e3abb43eb5be91016583 https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/403c7e56e9a82b340f698b1adeffd67acb6ad8da] | [character stats added to db and backend endpoint] | [important so that stats and other chracter properties get updated by for example ticking off habits] |

---

## Contributions Week 3 - [13.04.2026] to [19.04.2026]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@joshuademarco]** | [18.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/d70746b] | [Implemented dashboard page navigation (#52).] | [in-app navigation pattern using callbacks in render.] |
|                    | [19.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/ab47750] | [Implemented Google Calendar integration on the backend.] | [Enables scheduling habits and tasks around the user's calendar.] |
|                    | [19.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/4dadaf6 https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/0bfce16 https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/875c484] | [Reviewed and merged feature PRs (#57, #58, #101).] | [Keeps the main branches stable and unblocks teammates.] |
|                    | [17.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/8761dd8] | [Removed the broken `dockerize.yml` workflow.] | [Cleans up CI noise.] |
|                    | [19.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/176f19a https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/233d258 https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/15d2ee2 https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/f35db63] | [Resolved merge conflicts and fixed integration issues across feature branches.] | [Prevents broken merges from reaching main.] |
| **[@yappayappay]** | [14.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/368311b38184c406583045d18cb6b2601eaff67b] | [backend implementation of task, habit with create, complete and delete] | [core functionality that allows a user to e.g. create a new habit, assign to a category, define frequency etc. - important as it is one of the key features of our web app] |
|                    | [17.04.2002]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/036770c3e37880a6f7f157f0aeeaf985ef65deff] | [added character and HabitCompletionEvent classes, corresponding repos and DTOS. had to adjust some task logic] | [now it assigns a habit to the character not to the user, ensures clear structure and allows for habit progress tracking] |
| **[@michaelCHer]** | [15.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/e103e547d2241276ae01c9fa1f33c69d65693dbb] | [Implemented the current weahter display of our API] | [The current weather has an influence on the XP multiplier so it is important that the user knows which conditions are applied now] |
|                    | [17.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/80d7b98a234c75af3bff8036fb59bd3d4c09407c] | [Implemented RaidBoss UI ] | [The RaidBoss feature is on of our key features so it is improtant that it has an UI] |
| **[@alemicap]** | [17.04]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/pull/99/changes/67fcbfd9cabff759a67f1850647e69c5d5d8a6b6] | [Implemented Character Class ] | [important so that stats and other chracter properties get updated by for example ticking off habits] |
|                    | [19.04]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/pull/102/changes/6a17212e056fb763ed2841a75377e232edcfd726 https://github.com/joshuademarco/sopra-fs26-group-08-server/pull/102/changes/ac84adc392b1206595b98fb7888e83e8397ff7c9 https://github.com/joshuademarco/sopra-fs26-group-08-server/pull/102/changes/b48ad8a64d2fd02e557f7a30acc8d40cf06ef897] | [Implemented Group Class + resolved merge conflicts # 100] | [important so that users can create and join groups and use all the group features] |

---

## Contributions Week 4 - [20.04.2026] to [26.04.2026]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@joshuademarco]** | [20.04–24.04.2026] | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/4015712](https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/4015712) [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/3f46009](https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/3f46009) [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/0e4a5fd](https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/0e4a5fd) [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/78efe8a](https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/78efe8a) | Implemented the Boss Raid UI: monster health bar, per-member health bars with damage display, task cards with countdown timers, and WebSocket-driven live state sync. Fixed task updates for other participants and stabilised member list ordering. ([#18](https://github.com/joshuademarco/sopra-fs26-group-08-client/issues/18)) | The raid page is the central multiplayer feature; real-time health and task state are essential for the cooperative gameplay loop. |
|                    | [24.04.2026] | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/4fbb1a6](https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/4fbb1a6) [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/cf63061](https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/cf63061) [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/aba0bf8](https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/aba0bf8) [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/3715fed](https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/3715fed) [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/dd07cbd](https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/dd07cbd) | Added directional character sprite assets for all four team members and the boss. Wired character type selection into the signup form and the live online map avatar display. Propagated the character type field through the backend User entity, DTOs, and mapper. ([#24](https://github.com/joshuademarco/sopra-fs26-group-08-client/issues/24)) | Users can now choose and see their character in-world, connecting the identity system to both the map and the raid view. |
|                    | [21.04–24.04.2026] | [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/8600078](https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/8600078) [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/827504c](https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/827504c) [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/7d37bc0](https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/7d37bc0) [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/9063813](https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/9063813) [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/1bda024](https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/1bda024) [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/934f27c](https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/934f27c) | Implemented the full Boss Raid backend: BossRaid/RaidTask/RaidParticipation entities, repositories, RaidService (join, complete task, apply damage, expire overdue tasks), RaidScheduler for automatic raid activation, and RaidController REST endpoints. Fixed seeder group/user logic and added default seed data. ([#103](https://github.com/joshuademarco/sopra-fs26-group-08-server/issues/103) [#79](https://github.com/joshuademarco/sopra-fs26-group-08-server/issues/79) [#80](https://github.com/joshuademarco/sopra-fs26-group-08-server/issues/80) [#82](https://github.com/joshuademarco/sopra-fs26-group-08-server/issues/82) [#83](https://github.com/joshuademarco/sopra-fs26-group-08-server/issues/83)) | This is the core backend powering the group challenge feature end-to-end, including scheduling, damage calculation, and live broadcast via WebSocket. |
|                    | [24.04.2026] | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/92ea125](https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/92ea125) [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/bd2c4ed](https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/bd2c4ed) [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/44f0e13](https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/44f0e13) [https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/c7344b7](https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/c7344b7) | Fixed two production blockers: routed all API calls through the Next.js proxy (relative paths) so the auth cookie is sent correctly; added a REST polling fallback because App Engine Standard does not support WebSockets. Added a Quick Start endpoint and button (with seeder tasks) so the raid feature can be demoed immediately without waiting for the scheduler. | Without these fixes the raid page was broken in production: groups failed to load and live updates did not arrive. The quick-start button enables the demo flow. |
| **[@githubUser2]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@alemicap]** | [22/23/24.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/a29aef294af979a4e34b0bdf63482d630e2a08d9 https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/5c09f0a6e61080eeac2ccb5545473f4c97c70447 https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/f74da594ff003707685b2a22747377601ac4b633 ] | [frontend and backend groups implementation as well as many fixes regarding previous group implementation #60 # 110 #68 #69 #73 #11] | [important for users to create and join groups to participate together in boss raids] |
|                    | [23.04.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/d455ef784b19d57f3de6cc10f902785eca150d27 https://github.com/joshuademarco/sopra-fs26-group-08-server/commit/81965cd8990fe9eee556b043264fc77958c27c88] | [front and backend leaderboard implementation #22 #4 #39] | [logged-in users want to see a global leaderboard sorted by the total xp gained per user to compare themselves with others to get motivation] |

---

## Contributions Week 5 - [Begin Date] to [End Date]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@githubUser1]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser2]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |

---

## Contributions Week 6 - [Begin Date] to [End Date]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@githubUser1]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser2]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser4]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |