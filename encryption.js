var fs = require('fs'),
    crypto = require('crypto'),
    prompt = require('prompt'),
    shell = require('shelljs');

// check for .password file, if not there do the encryption thing
if (!shell.test('-f', '.password')) {

    prompt.logger.info('Creating encryption passkey for JIRA login');
    shell.exec('openssl rand -base64 48 > .password');
}

var passKey = fs.readFileSync('.password').toString('utf8').trim();

module.exports = {
    encrypt: function (text) {
        var cipher = crypto.createCipher('aes-256-cbc', passKey);
        var crypted = cipher.update(crypto.randomBytes(10).toString('base64') + '.' + text,'utf8','hex');
        crypted += cipher.final('hex');
        return crypted;
    },
    decrypt: function (text) {
        var decipher = crypto.createDecipher('aes-256-cbc', passKey);
        var dec = decipher.update(text,'hex','utf8');
        dec += decipher.final('utf8');
        dec = dec.split('.')[1];
        return dec;
    }
};
