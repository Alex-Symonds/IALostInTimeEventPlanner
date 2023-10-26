## Event Planner: Idle Apocalypse, Lost in Time 
[Link to demo hosted on GitHub pages](https://alex-symonds.github.io/ialitplanner/)

### What is Idle Apocalypse, Lost in Time?
Lost in Time is an event/mini-game in the mobile game Idle Apocalypse. Players are given 72 hours to produce as much "time dust" as possible by purchasing and upgrading workers, toggling resource production and maintaining a timed buff. In-game prizes are awarded at the end depending on how much time dust was produced, with 1st prize requiring at least 10 billion.

### What problem does the Event Planner aim to solve?
Reaching the goal of 10B time dust is tricky. Successful players have kindly shared their strategies online, but since upgrades and switches must be activated manually, many of these strategies won't survive contact with an individual player's schedule.

The Event Planner aims to allow players to bridge the gap between theory and reality by predicting the outcome of the event when given a strategy, the player's schedule (in the form of a list of the player's "offline periods") and, if the event is currently running, the player's current progress.

This allows players to answer questions such as:
* If I'll be busy in the daytime with limited opportunities to check the game, is it still best to begin the event in the morning or should I wait until the evening?
* Is it worth me, in particular, spending premium currency on additional ranks of "all eggs"?
* Should I deviate from the recommended strategy by buying cheaper, lower-priority upgrades before sleeping, so I can benefit from them running overnight?

### How to use the Event Planner
1. Select a mode: "Plan" or "Active", depending on whether or not the event has already started
2. Fill in the form: ad boost, all eggs, then either a start time (Plan mode) or time remaining, stockpiles and levels (Active mode)
3. Enter your "offline periods" by clicking the "add" button in the offline periods panel. (On mobile the panel may start off hidden, but you can unhide it using the toggle at the top)
4. Adjust the order of the upgrades by clicking a position number, an insert button or the upgrade currently occupying the position you want to fill, then selecting which upgrade to "move up" to this spot
5. Switch production as needed by clicking a "switch" button or an existing switch, then setting the toggles according to your preference
6. {optional} Players can also save and load different plans, allowing quick comparisons

The Event Planner will then:
* Display the outcome at the top. If you could produce more dust with the same plan by switching all production to dust at an earlier point, it'll also display the higher total and a "?" icon which, when clicked, will open a tooltip advising you where to add the switch
* Predict the purchase time for every upgrade. Upgrades which share the same purchase time will be grouped, providing the player with a to do list and allowing them identify any blockages[^tipBlocking]
* Clicking the "..." button in a group of upgrades will open a panel containing additional information about dust and egg production

[^tipBlocking]: A "blockage" is when: purchase of Upgrade A is planned before Upgrade B; A and B are upgrading two different things; A and B each cost different types of eggs, with no overlap; the eggs for B will be ready before the eggs for A. In this case, nothing is gained by delaying the purchase of B until after A is ready, so A is said to be "blocking" B.

    <br />If a single time in the planner contains upgrades of more than one unit, there's a chance the "lower" upgrade is being blocked by a "higher" one, so the player may benefit from adjusting the upgrade order.

### Project goals
* Gain more experience with Next, React and TypeScript
* Try some new things: Tailwind, Jest and Next's static page building feature
* Aim for a design that looks a bit more professional than my previous efforts
* Get 1st prize in the event myself, without having to set alarms in the middle of the night or wasting premium currency on unnecessary "all eggs" upgrades (I did! \o/)

### How I worked on this project
* Used feature branches and submitted pull requests, in an attempt to get into the discipline of not making unrelated small changes "while I'm at it"
* Wrote the tests at the end. I considered TDD, but I think that works best when the details of the project are planned in advance: this one was a little more ad hoc, so I would've wasted a lot of time writing tests for features that were dropped or radically altered

### How to navigate this project
* Unit tests in Jest, primarily focussed around the game status modal form [[link]](https://github.com/Alex-Symonds/IALostInTimeEventPlanner/blob/main/app/components/forms/gameState/subcomponents/formActiveMode.test.tsx)
* Tailwind used to create a responsive design, including custom CSS [[link]](https://github.com/Alex-Symonds/IALostInTimeEventPlanner/blob/1162062153b4a8552d1d0fbef594a48f8b4b3d65/app/page.tsx#L64)
* Customised configuration of Tailwind to include my own colour palette and media breakpoint [[link]](https://github.com/Alex-Symonds/IALostInTimeEventPlanner/blob/1162062153b4a8552d1d0fbef594a48f8b4b3d65/tailwind.config.js#L18)
* The "brains" of the Planner, the part that predicts everything [[link]](https://github.com/Alex-Symonds/IALostInTimeEventPlanner/blob/main/app/utils/calcPlanData.tsx)
* Gathered everything working directly with the JSON file in one place, to make maintenance easier [[link]](https://github.com/Alex-Symonds/IALostInTimeEventPlanner/blob/main/app/utils/getDataFromJSON.tsx) 
* Made more of an effort to move logic into hooks / utility functions, leaving the components to focus on display [[link]](https://github.com/Alex-Symonds/IALostInTimeEventPlanner/blob/1162062153b4a8552d1d0fbef594a48f8b4b3d65/app/components/forms/gameState/subcomponents/formActiveMode.tsx#L27)

### Why I built the project this way
* Used React because a lot of reactivity was required: moving an upgrade or switching production affects every subsequent upgrade, not to mention the results banner, the footer and, potentially, the appearance of a "zero production" warning
* Used Tailwind as the next step in my exploration of different approaches to CSS
* I only setup partial test coverage because I judged this was sufficient to meet my primary testing goal (i.e. testing if adding "Jest" to my CV increases callback frequency)
* Mobile-first design because not only are the majority of searches on mobile these days, but this program is intended to support a mobile game: I expect it would have an even higher proportion of mobile users than average
* The ad boost is presented as a toggle even though this isn't how it functions in-game[^adBoostToggle] because I thought the only players who would *plan* to let the ad boost drop off are those who didn't intend to activate it at all, so it would be more efficient to just ask players once if they intended to maintain it

[^adBoostToggle]: It's an 8 hour buff which requires action by the player to refresh it

### If I had more time
* Add support for moving upgrades downwards as well as upwards (this is a UI/UX issue more than anything else: the code to move an upgrade was written with both directions in mind)
* "Save" improvements: add an option to save over the current save file; display the name of the currently active save file
* Improve desktop mode design to make better use of horizontal space
* Initialise the plan to a *good* plan, rather than the current "valid, but junk" plan
* More icons / animations. I'd particularly like icons on the plan / active mode boxes and animation when toggling visibility of the game status and offline periods
* Increase test coverage to gain additional experience (particularly of writing tests for the business logic) and so that if I return to the project, I'll have the tests in place
* Improve accuracy re. ad boost: an offline period of >8 hours would inevitably result in the ad boost dropping off. Accounting for this wouldn't require any additional input from the user

### Running the Project
1. `git clone --recursive https://github.com/Alex-Symonds/IALostInTimeEventPlanner.git`
2. Navigate inside the folder
3. `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result