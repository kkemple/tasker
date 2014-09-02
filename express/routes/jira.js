var request = require('request'),
    encryption = require('../../encryption'),
    settings = require('../../data/jira.json'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    jiraUrl,
    username,
    password;

var saveSettings = function(settings) {
    var updatedSettings;

    try {
        updatedSettings = JSON.stringify(settings, null, 4);
    } catch ( e ) {

        console.log(e);
        return false;
    }

    try {

        fs.writeFileSync(path.resolve(__dirname, '../../data/jira.json'), updatedSettings, 'utf8');
    } catch ( e ) {

        console.log(e);
        return false;
    }

    return true;
};

module.exports = function(app) {
    "use strict";

    // get jira tasks
    app.post('/jira/tasks', function(req, res) {

        var queryParams = req.body.queryParams;
        jiraUrl = req.body.jiraUrl;
        username = req.body.username;
        password = encryption.decrypt(req.body.password);

        request.get(jiraUrl + queryParams, function(error, response, body) {
            if (error) {
                res.json(error);
                res.end();
            }

            res.json(body);

        }).auth(username, password, true);

        /* for testing, load tasks from json file */
        // fs.readFile('jiraTasks.json', 'utf-8', function(err, content) {
        //     res.json(content);
        // });
    });

    // log jira work
    app.post('/jira/tasks/worklog', function(req, res) {

        request.post(jiraUrl + 'rest/api/2/issue/' + req.body.key + '/worklog', function(err, httpResponse, body) {

            if (err) {
                console.log(err);
                res.json(err);
            }

            if (body.errorMessages) {
                var reason = _(body.errors).map(function(error) { return error; });

                res.json({error: true, message: 'Failed to save worklog: ', response: reason.join(', ')});
            }

            res.json({ error: false, message: 'Worklog saved for issue: ' + req.body.key, response: body });

        }).json({

            timeSpent: req.body.timeSpent,
            comment: req.body.comment
        }).auth(username, password, true);
    });

    app.get('/jira/settings', function(req, res) {
        res.json(settings);
    });

    app.post('/jira/settings', function(req, res) {
        settings = req.body;

        if (saveSettings(settings)) {
            res.json({message: 'Settings updated'});
        } else {
            res.json({message: 'Unable to update settings'});
        }
    });

    app.put('/jira/settings', function(req, res) {
        settings = req.body;

        if (saveSettings(settings)) {
            res.json(settings);
        } else {
            res.json({message: 'Unable to update settings'});
        }
    });

    app.delete('/jira/settings', function(req, res) {
        settings = {};

        if (saveSettings(settings)) {
            res.json({message: 'Settings updated'});
        } else {
            res.json({message: 'Unable to update settings'});
        }
    });
};
