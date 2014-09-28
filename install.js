var prompt = require('prompt'),
    fs = require('fs'),
    prompt = require('prompt'),
    exec = require('child_process').exec,
    shell = require('shelljs'),
    encryption = require('./encryption');

/**
 *
 * Check for installed required software
 * Warn about sudo issues: give links
 *
 */

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

var schema = {
    properties: {
        username: {
            required: true,
            description: 'Please enter your JIRA username (not email address)'
        },
        password: {
            hidden: true,
            description: 'Please enter your JIRA password (password is encrypted)'
        },
        url: {
            pattern: /.+\/$/,
            message: 'JIRA url must have trailing slash ("/")',
            required: true,
            description: 'Please enter your JIRA url (include the trailing slash ("http://jiraurl.com/")'
        }
    }
}

prompt.logger.info('Starting install...\n');

prompt.get(schema, function (err, result) {

    // check for data dir, if not found build files/folders
    if (!shell.test('-d', 'data')) {
        prompt.logger.info('Creating `data` directory');
        shell.mkdir('data');

        prompt.logger.info('Creating `data/stats.json` file');
        fs.writeFileSync('data/stats.json', JSON.stringify({
            jira: {}
        }));

        prompt.logger.info('Creating `data/user.json` file');
        fs.writeFileSync('data/user.json', JSON.stringify({
            id: 1,
            allowBrowserNotifications: false,
            allowVoiceNotifications: false,
            allowVoiceCommands: false,
            notificationDuration: 10,
            backupDuration: 60,
            screenCaptureDuration: 10,
            allowScreenCapture: false,
            screenCaptureStartTime: '9:00 AM',
            screenCaptureEndTime: '5:00 PM',
            hoursPerWorkWeek: 30
        }));

        prompt.logger.info('Creating `data/jira.json` file');
        fs.writeFileSync('data/jira.json', JSON.stringify({
            id: 1,
            username: result.username,
            password: result.password,
            jiraUrl: result.url,
            hasLoginCreds: true,
            isVisible: false
        }));

        prompt.logger.info('Creating `data/captures.json` file');
        fs.writeFileSync('data/captures.json', JSON.stringify([]));
    }

    // check for static/img/screens dir, if not found build files/folders
    if (!shell.test('-d', 'static/img/screens')) {
        prompt.logger.info('Creating `static/img/screens/full` directory');
        shell.mkdir('-p', 'static/img/screens/full');

        prompt.logger.info('Creating `static/img/screens/thumbs` directory');
        shell.mkdir('static/img/screens/thumbs');
    }

    prompt.logger.info('bower install \n');
    shell.exec('bower install');

    prompt.logger.info('grunt build \n');
    shell.exec('grunt build');
});
