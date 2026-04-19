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
|                    | [27.03.2026]   | [https://github.com/joshuademarco/sopra-fs26-group-08-client/commit/2f995b8de42fb4e264838c24fe87990d0a1bb3b3] | [implementation of sidebar on application page] | [important for navigation to different tabs] |

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

## Contributions Week 3 - [Begin Date] to [End Date]

| **Student**        | **Date** | **Link to Commit** | **Description**                 | **Relevance**                       |
| ------------------ | -------- | ------------------ | ------------------------------- | ----------------------------------- |
| **[@githubUser1]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser2]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@githubUser3]** | [date]   | [Link to Commit 1] | [Brief description of the task] | [Why this contribution is relevant] |
|                    | [date]   | [Link to Commit 2] | [Brief description of the task] | [Why this contribution is relevant] |
| **[@alemicap]** | [17.04]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/pull/99/changes/67fcbfd9cabff759a67f1850647e69c5d5d8a6b6] | [Implemented Character Class] | [important so that stats and other chracter properties get updated by for example ticking off habits] |
|                    | [19.04]   | [https://github.com/joshuademarco/sopra-fs26-group-08-server/pull/102/changes/6a17212e056fb763ed2841a75377e232edcfd726 https://github.com/joshuademarco/sopra-fs26-group-08-server/pull/102/changes/ac84adc392b1206595b98fb7888e83e8397ff7c9 https://github.com/joshuademarco/sopra-fs26-group-08-server/pull/102/changes/b48ad8a64d2fd02e557f7a30acc8d40cf06ef897] | [Implemented Group Class + resolved merge conflicts] | [important so that users can create and join groups and use all the group features] |

---

## Contributions Week 4 - [Begin Date] to [End Date]

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
