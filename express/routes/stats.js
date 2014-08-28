var fs = require('fs'),
    path = require('path'),
    stats = require('../../data/stats.json');

var saveStats = function(stats) {
    var updatedStats;

    try {
        updatedStats = JSON.stringify(stats, null, 4 );
    } catch ( e ) {

        console.log(e);
        return false;
    }

    try {

        fs.writeFileSync(path.resolve(__dirname, '../../data/stats.json'), updatedStats, 'utf8');
    } catch ( e ) {

        console.log(e);
        return false;
    }

    return true;
};

module.exports = function(app) {
    "use strict";

    /* JIRA time tracked enpoints */
    app.get('/stats/jira/tracked', function(req, res) {
        if (stats.jira.tracked) {
            res.json(stats.jira.tracked);
        } else {
            res.json([]);
        }
    });

    app.post('/stats/jira/tracked', function(req, res) {
        if (!stats.jira.tracked) { stats.jira.tracked = []; }
        stats.jira.tracked.push(req.body);

        if (saveStats(stats)) {
            res.json({message: 'Statistic added'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.get('/stats/jira/tracked/:id', function(req, res) {

        // if not found need to 304 status??
        res.json(stats.jira.tracked[req.params.id]);
    });

    app.put('/stats/jira/tracked/:id', function(req, res) {
        stats.jira.tracked[req.params.id] = req.body;

        if (saveStats(stats)) {
            res.json({message: 'Statistic updated'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/tracked/:id', function() {
        delete stats.jira.tracked[req.params.id];

        if (saveStats(stats)) {
            res.json({message: 'Statistic added'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });


    /* JIRA time logged enpoints */
    app.get('/stats/jira/logged', function(req, res) {
        if (stats.jira.logged) {
            res.json(stats.jira.logged);
        } else {
            res.json([]);
        }
    });

    app.post('/stats/jira/logged', function(req, res) {
        if (!stats.jira.logged) { stats.jira.logged = []; }
        stats.jira.logged.push(req.body);

        if (saveStats(stats)) {
            res.json({message: 'Statistic added'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.get('/stats/jira/logged/:id', function(req, res) {

        // if not found need to 304 status??
        res.json(stats.jira.logged[req.params.id]);
    });

    app.put('/stats/jira/logged/:id', function(req, res) {
        stats.jira.logged[req.params.id] = req.body;

        if (saveStats(stats)) {
            res.json({message: 'Statistic updated'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/logged/:id', function() {
        delete stats.jira.logged[req.params.id];

        if (saveStats(stats)) {
            res.json({message: 'Statistic added'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });



    /* JIRA project enpoints */
    app.get('/stats/jira/project', function(req, res) {
        if (stats.jira.project) {
            res.json(stats.jira.project);
        } else {
            res.json([]);
        }
    });

    app.post('/stats/jira/project', function(req, res) {
        if (!stats.jira.project) { stats.jira.project = []; }
        stats.jira.project.push(req.body);

        if (saveStats(stats)) {
            res.json({message: 'Statistic added'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.get('/stats/jira/project/:id', function(req, res) {

        // if not found need to 304 status??
        res.json(stats.jira.project[req.params.id]);
    });

    app.put('/stats/jira/project/:id', function(req, res) {
        stats.jira.project[req.params.id] = req.body;

        if (saveStats(stats)) {
            res.json({message: 'Statistic updated'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/project/:id', function() {
        delete stats.jira.project[req.params.id];

        if (saveStats(stats)) {
            res.json({message: 'Statistic added'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });


    /* JIRA priority enpoints */
    app.get('/stats/jira/priority', function(req, res) {
        if (stats.jira.priority) {
            res.json(stats.jira.priority);
        } else {
            res.json([]);
        }
    });

    app.post('/stats/jira/priority', function(req, res) {
        if (!stats.jira.priority) { stats.jira.priority = []; }
        stats.jira.priority.push(req.body);

        if (saveStats(stats)) {
            res.json({message: 'Statistic added'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.get('/stats/jira/priority/:id', function(req, res) {

        // if not found need to 304 status??
        res.json(stats.jira.priority[req.params.id]);
    });

    app.put('/stats/jira/priority/:id', function(req, res) {
        stats.jira.priority[req.params.id] = req.body;

        if (saveStats(stats)) {
            res.json({message: 'Statistic updated'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/priority/:id', function() {
        delete stats.jira.priority[req.params.id];

        if (saveStats(stats)) {
            res.json({message: 'Statistic added'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });



    /* JIRA status enpoints */
    app.get('/stats/jira/status', function(req, res) {
        if (stats.jira.status) {
            res.json(stats.jira.status);
        } else {
            res.json([]);
        }
    });

    app.post('/stats/jira/status', function(req, res) {
        if (!stats.jira.status) { stats.jira.status = []; }
        stats.jira.status.push(req.body);

        if (saveStats(stats)) {
            res.json({message: 'Statistic added'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.get('/stats/jira/status/:id', function(req, res) {

        // if not found need to 304 status??
        res.json(stats.jira.status[req.params.id]);
    });

    app.put('/stats/jira/status/:id', function(req, res) {
        stats.jira.status[req.params.id] = req.body;

        if (saveStats(stats)) {
            res.json({message: 'Statistic updated'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/status/:id', function() {
        delete stats.jira.status[req.params.id];

        if (saveStats(stats)) {
            res.json({message: 'Statistic added'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });
};