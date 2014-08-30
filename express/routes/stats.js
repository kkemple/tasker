var fs = require('fs'),
    path = require('path'),
    stats = require('../../data/stats.json');

var saveStats = function(stats) {
    var updatedStats;

    try {
        updatedStats = JSON.stringify(stats, null, 4);
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
        _(stats.jira.tracked).each(function(t, i) {
            if (t.id === req.params.id) {
                t = req.body;
            }
        });

        if (saveStats(stats)) {
            res.json({message: 'Statistic updated'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/tracked/:id', function() {
       var index = -1;

        _(stats.jira.tracked).each(function(t, i) {
            if (t.id === req.params.id) {
                index = i;
            }
        });

        if (index > -1) {
            stats.jira.tracked = stats.jira.tracked.splice(index, 1);
            saveStats(stats);

            res.json({message: 'stat deleted'});
        } else {
            res.json({message: 'no tracked stat found with id: ' + req.params.id});
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
        _(stats.jira.logged).each(function(l, i) {
            if (l.id === req.params.id) {
                l = req.body;
            }
        });

        if (saveStats(stats)) {
            res.json({message: 'Statistic updated'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/logged/:id', function() {
        var index = -1;

        _(stats.jira.logged).each(function(t, i) {
            if (t.id === req.params.id) {
                index = i;
            }
        });

        if (index > -1) {
            stats.jira.logged = stats.jira.logged.splice(index, 1);
            saveStats(stats);

            res.json({message: 'stat deleted'});
        } else {
            res.json({message: 'no logged stat found with id: ' + req.params.id});
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
        _(stats.jira.project).each(function(p, i) {
            if (p.id === req.params.id) {
                p = req.body;
            }
        });

        if (saveStats(stats)) {
            res.json({message: 'Statistic updated'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/project/:id', function() {
        var index = -1;

        _(stats.jira.project).each(function(t, i) {
            if (t.id === req.params.id) {
                index = i;
            }
        });

        if (index > -1) {
            stats.jira.project = stats.jira.project.splice(index, 1);
            saveStats(stats);

            res.json({message: 'stat deleted'});
        } else {
            res.json({message: 'no project stat found with id: ' + req.params.id});
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
        _(stats.jira.priority).each(function(p, i) {
            if (p.id === req.params.id) {
                p = req.body;
            }
        });

        if (saveStats(stats)) {
            res.json({message: 'Statistic updated'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/priority/:id', function() {
        var index = -1;

        _(stats.jira.priority).each(function(t, i) {
            if (t.id === req.params.id) {
                index = i;
            }
        });

        if (index > -1) {
            stats.jira.priority = stats.jira.priority.splice(index, 1);
            saveStats(stats);

            res.json({message: 'stat deleted'});
        } else {
            res.json({message: 'no priority stat found with id: ' + req.params.id});
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
        _(stats.jira.status).each(function(s, i) {
            if (s.id === req.params.id) {
                s = req.body;
            }
        });

        if (saveStats(stats)) {
            res.json({message: 'Statistic updated'});
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/status/:id', function() {
        var index = -1;

        _(stats.jira.status).each(function(t, i) {
            if (t.id === req.params.id) {
                index = i;
            }
        });

        if (index > -1) {
            stats.jira.status = stats.jira.status.splice(index, 1);
            saveStats(stats);

            res.json({message: 'stat deleted'});
        } else {
            res.json({message: 'no status stat found with id: ' + req.params.id});
        }
    });
};