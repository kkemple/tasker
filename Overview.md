## Tasker Application Overview

### Overview
Tasker is a timer app for tracking the amount of time you spend on tasks. There are a ton of great timer apps with neat features; however, it seems the one thing they all lack is notifications.

Normally I am good at starting my tasks (have no fear, Tasker has a feature to help you out if you forget to start tracking your time when you start working on a task, for more info see [Screentime](https://github.com/kkemple/tasker/wiki/Screentime)), but I am horrible at stopping them!

Tasker provides desktop, voice, and in app notifications set to a duration of your choosing. You can enable/disable desktop and voice notifications on the [App Settings](https://github.com/kkemple/tasker/wiki/App-Settings) page.

#### Features of Tasker

- **Voice notifications**: Tasker will speak to you when this feature is enabled, letting you know which task you are timing

- **Desktop notifications**: You shouldn't have to keep your task app in view at all times to see what your tracking, if Tasker is not the active browser tab it will provide Chrome notifications

- **Mark for today**: All tasks have a small calendar icon in the actions section, checking this will mark it as work on today, all tasks marked for today can be viewed on the `Today's Tasks` page.

- **JIRA integration**: Simply log in to your JIRA instance (login for is on the `JIRA Tasks` page) and all JIRA tasks assigned to you that are not (Closed|Done|Resolved) will be pulled in for you. Not only that but you can post worklogs to JIRA! Simply click the rocket icon in the actions section and away your worklog goes!

- **Screentime integration**: Sometimes you can forget to even start tracking your time. Have no fear, <a href="https://github.com/sprugman/screentime" target="_blank">Screentime</a> can help with that! It will capture screenshots of your desktop so you can reference them later. Don't worry, the screenshots are local and never leave your computer, for more info head over to the <a href="https://github.com/sprugman/screentime" target="_blank">repo</a> and read up on the app.

- **Backup localStorage**: All data is saved to local storage, sometimes it may be necessary to clear localStorage, whether for upgrades or something else. This allows you to get back the settings you had in no time. Backups are stored in `backup.json` in the root folder of tasker.

- **Restore from backup**: Like it says, it will restore your localStorage to the lastest backup

- **Development Documentation**: Want to add support for Toggl, Basecamp, or some other task software? The [developer documentation](http://localhost:8888/docs/) will get you familiar with the Tasker app in no time! *Make sure to fire up your server to view docs* (or navigate to `file://path/to/tasker/static/docs` to view docs without the server started)

