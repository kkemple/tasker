var user = require('../../data/user.json'),
    fs = require('fs'),
    path = require('path');

// handle file write
var saveUser = function(user) {
    "use strict";

    var updatedUser;

    try {
        updatedUser = JSON.stringify(user, null, 4);
    } catch ( e ) {

        console.log(e);
        return false;
    }

    try {

        fs.writeFileSync(path.resolve(__dirname, '../../data/user.json'), updatedUser, 'utf8');
    } catch ( e ) {

        console.log(e);
        return false;
    }

    return true;
};

module.exports = function(app) {

    // return settings
    app.get('/settings', function(req, res) {
        res.json(user);
    });

    // update/create user settings
    app.post('/settings', function(req, res) {
        user = req.body;

        if (saveUser(user)) {
            res.json({message: 'Settings updated'});
        } else {
            res.json({message: 'Unable to update settings'});
        }
    });

    // update user settings, same as app.post
    app.put('/settings', function(req, res) {
        user = req.body;

        if (saveUser(user)) {
            res.json(user);
        } else {
            res.json({message: 'Unable to update settings'});
        }
    });

    // delete, never used
    app.delete('/settings', function(req, res) {
        user = {};

        if (saveUser(user)) {
            res.json({message: 'Settings updated'});
        } else {
            res.json({message: 'Unable to update settings'});
        }
    });
};