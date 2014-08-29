var prompt = require('prompt'),
    //Q = require('Q'),
    fs = require('fs'),
    //path = require('path'),
    //sys = require('sys'),
    prompt = require('prompt'),
    exec = require('child_process').exec,
    shell = require('shelljs'),
    child;


/**
 *
 * Check for installed required software
 * Warn about sudo issues: give links
 *
 */

prompt.start();

if (!shell.which('grunt')) {
    prompt.logger.error('You need to install grunt-cli globally :: http://gruntjs.com/getting-started');
    prompt.logger.warn('If you get access errors, you need to set the proper permissions on your node_modules folder =>');
    prompt.logger.info('   http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo');
    return;
}

if (!shell.which('bower')) {
    prompt.logger.error('You need to install bower globally :: http://bower.io/');
    prompt.logger.warn('If you get access errors, you need to set the proper permissions on your node_modules folder =>');
    prompt.logger.info('   http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo');
    return;
}


// check for data dir, if not found build files/folders
if (!shell.test('-d', 'data')) {
    prompt.logger.info('Creating `data` directory');
    shell.mkdir('data');

    prompt.logger.info('Creating `data/stats.json` file');
    fs.writeFileSync('data/stats.json', JSON.stringify({
        jira: {}
    }));

    prompt.logger.info('Creating `data/user.json` file');
    fs.writeFile('data/user.json', JSON.stringify({
        id: 1,
        allowBrowserNotifications: false,
        allowVoiceNotifications: false,
        allowVoiceCommands: false,
        notificationDuration: 10,
        backupDuration: 60,
        allowScreenCapture: false
    }));

    prompt.logger.info('Creating `data/jira.json` file');
    fs.writeFile('data/jira.json', JSON.stringify({
        jiraUsername: '',
        jiraPassword: '',
        hasJiraSettings: false,
        isVisible: true
    }));
}

// check for static/img/screens dir, if not found build files/folders
if (!shell.test('-d', 'static/img/screens')) {
    prompt.logger.info('Creating `static/img/screens/full` directory');
    shell.mkdir('-p', 'static/img/screens/full');

    prompt.logger.info('Creating `static/img/screens/thumbs` directory');
    shell.mkdir('static/img/screens/thumbs');

    prompt.logger.info('Creating `static/img/screens/screens-list.txt` file');
    fs.writeFileSync('static/img/screens/screens-list.txt', '');
}


// check for .password file, if not there do the encryption thing
if (!shell.test('-f', '.password')) {

    prompt.logger.info('Creating encryption passkey for JIRA login');
    exec('openssl rand -base64 48 > .password');
}


/**
 *
 * Run commands and pray lol
 *
 * npm install
 * bower install
 * grunt build
 *
 */

exec('npm install', function(code, output) {
  prompt.logger.info('npm install \n', output);

    exec('bower install', function(code, output) {
        prompt.logger.info('bower install \n', output);

        exec('grunt build', function(code, output) {
            prompt.logger.info('grunt build \n', output);
        });
    });
});






