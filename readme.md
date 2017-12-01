# This repo is deprecated and not recommended for use

# Tasker

Tasker is a very simple task runner that will verbally and visually notify you of currently running tasks. You can enable/disable either notification type (or both). You can also set the duration of time in between notifications.

![Tasker](https://github.com/kkemple/tasker/wiki/img/tasker.gif)

### Quick Start Guide
___

#### Dependencies

The following dependencies are required to run Tasker:

- Node.js: [nodejs.org](http://nodejs.org)
- Grunt.js: [gruntjs.com](http://gruntjs.com)
- Bower.js: [bower.io](http://bower.io)
- JIRA user account

> You need an active JIRA account to install Tasker

**Note: Tasker runs best in Chrome**

___

#### Cloning Tasker

In the terminal, navigate to the directory you wish to install Tasker and run `git clone git@github.com:kkemple/tasker.git tasker && cd tasker`

___

#### Installing Node Dependencies

Simply run `npm install` (if you get access errors look [here](http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo))

___

#### Setting Up Tasker

To set up Tasker run `node install.js`

During the install process you will prompted for your JIRA credentials. You will need to provide:

- username: the username you use to login to JIRA (not your JIRA email)
- password: the password you use to login to JIRA
- url: the url to your JIRA account (include the trailing slash: http://my.jira.com/)

___

#### Starting the Server

To start your server run `npm start` (After running the install script, this is the only step necessary to start Tasker)

In Chrome navigate to `http://localhost:8888` and you will be up and running with Tasker!

___

#### Help / User Documentation

You can view all user documentation on the [wiki](https://github.com/kkemple/tasker/wiki/Overview).

___

#### Development Documentation

- Annotated Source Code: [kkemple.github.io/tasker](http://kkemple.github.io/tasker)
- Module and Class Definitions: `file://path/to/tasker/docs` - or - `http://localhost:8000/docs` if server is running

___

#### Helpful Tips:

- Make sure you have grunt-cli and bower installed before setting up Tasker
- You can enable all of Tasker's great features on the "App Settings" page.
- Use the "Report Bug" link in the header if you discover something amiss! :smiley:

___

Contributions and input are strongly recommended!!
