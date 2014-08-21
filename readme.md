# Tasker

Time Assistant is a very simple task runner that will verbally and visually notify you of currently running tasks. You can enable/disable either notification type (or both). You can also set the duration of time in between notifications. It will also only notify you if you are running a task.

### Quick Start Guide

*You must use chrome to run this app!*

In the directory you wish to install Tasker run `git clone git@github.com:kkemple/tasker.git Tasker`

Then run `cd Tasker`

In `static/img/` dir create a `screens` dir, and in that create a `thumbs` dir, and a `full` dir. *These are used by the screen capture component.*

If you have Node.js installed run `npm install` (if not go [here](http://nodejs.org) to download Node.js) *You may need to run with sudo*

Now run `bower install`, if you do not have bower installed run `npm install bower -g`

Next run `grunt build`

Now, to start your server run `npm start`

In Chrome navigate to `https://localhost:8888` and you will be up and running with Tasker!

Helpful Tips:
- You can enable all of Tasker's great features on the "App Settings" page.
- In order to get Jira Tasks, on Jira Tasks screen you must enter your JIRA username, password, and JIRA url. (The url of your JIRA instance)
- Time tracking persists through page refreshes for default tasks, but not for JIRA tasks.

TODOS:
- Maybe add projects?? (Although I like the idea of this beinging on the simple side configuration < tracking)
- Add dashboard
- Add overview
- Add reports
- Add exporting
- Add help
- Add support for jira tasks to persist tracking on page refresh

Contributions and input are strongly recommended!!
