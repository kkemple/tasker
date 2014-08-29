var prompt = require('prompt'),
    //Q = require('Q'),
    fs = require('fs'),
    //path = require('path'),
    //sys = require('sys'),
    exec = require('child_process').exec,
    shell = require('shelljs'),
    child;


/**
 *
 * Check for installed required software
 * Warn about sudo issues: give links
 *
 */

if (!shell.which('grunt')) {
    console.log('Tasker: You need to install grunt and grunt-cli globally :: http://gruntjs.com/getting-started');
    console.log('Tasker: If you get access errors, you need to set the proper permissions on your node_modules folder =>');
    console.log('Tasker:    http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo');
    return;
}

if (!shell.which('bower')) {
    console.log('Tasker: You need to install bower globally :: http://bower.io/');
    console.log('Tasker: If you get access errors, you need to set the proper permissions on your node_modules folder =>');
    console.log('Tasker:    http://stackoverflow.com/questions/16151018/npm-throws-error-without-sudo');
    return;
}


// check for data dir, if not found build files/folders
if (!shell.test('-d', 'data')) {
    console.log('Tasker: Creating `data` directory');
    shell.mkdir('data');

    console.log('Tasker: Creating `data/stats.json` file');
    fs.writeFileSync('data/stats.json', JSON.stringify({
        jira: {}
    }));

    console.log('Tasker: Creating `data/user.json` file');
    fs.writeFile('data/user.json', JSON.stringify({}));

    console.log('Tasker: Creating `data/jira.json` file');
    fs.writeFile('data/jira.json', JSON.stringify({}));
}

// check for static/img/screens dir, if not found build files/folders
if (!shell.test('-d', 'static/img/screens')) {
    console.log('Tasker: Creating `static/img/screens/full` directory');
    shell.mkdir('-p', 'static/img/screens/full');

    console.log('Tasker: Creating `static/img/screens/thumbs` directory');
    shell.mkdir('static/img/screens/thumbs');

    console.log('Tasker: Creating `static/img/screens/screens-list.txt` file');
    fs.writeFileSync('static/img/screens/screens-list.txt', '');
}


// check for .password file, if not there do the encryption thing
if (!shell.test('-f', '.password')) {

    console.log('Tasker: Creating encryption passkey for JIRA login');
    shell.exec('openssl rand -base64 48 > .password');
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
  console.log('Tasker: npm install: \n', output);
});

exec('bower install', function(code, output) {
  console.log('Tasker: bower install: \n', output);
});

exec('grunt build', function(code, output) {
  console.log('Tasker: grunt build: \n', output);
});



