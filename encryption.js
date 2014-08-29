var fs = require('fs'),
    crypto = require('crypto'),
    passKey = fs.readFileSync('.password').toString('utf8').trim();

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
