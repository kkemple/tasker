var user = require('../../data/user.json'),
    fs = require('fs'),
    path = require('path');

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

    app.get('/settings', function(req, res) {
        res.json(user);
    });

    app.post('/settings', function(req, res) {
        user = req.body;

        if (saveUser(user)) {
            res.json({message: 'Settings updated'});
        } else {
            res.json({message: 'Unable to update settings'});
        }
    });

    app.put('/settings', function(req, res) {
        user = req.body;

        if (saveUser(user)) {
            res.json(user);
        } else {
            res.json({message: 'Unable to update settings'});
        }
    });

    app.delete('/settings', function(req, res) {
        user = {};

        if (saveUser(user)) {
            res.json({message: 'Settings updated'});
        } else {
            res.json({message: 'Unable to update settings'});
        }
    });
};