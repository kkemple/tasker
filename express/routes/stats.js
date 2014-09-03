var fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    stats = require('../../data/stats.json');

// handle file write
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
        req.body.id = req.body.key;

        stats.jira.tracked.push(req.body);

        if (saveStats(stats)) {
            res.json(req.body);
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.get('/stats/jira/tracked/:id', function(req, res) {
        var stat;

        _(stats.jira.tracked).each(function(t) {
            if (t.id === req.params.id) {
                stat = t;
            }
        });

        if (!stat) {
            res.json({error: true, message: 'stat not found'});
        }

        res.json(stat);
    });

    app.put('/stats/jira/tracked/:id', function(req, res) {
        var stat;
        _(stats.jira.tracked).each(function(t, i) {
            if (t.id === req.params.id) {
                t = req.body;
                stat = t;
            }
        });

        if (saveStats(stats)) {
            res.json(stat);
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
            stats.jira.tracked.splice(index, 1);
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
        req.body.id = req.body.key;

        stats.jira.logged.push(req.body);

        if (saveStats(stats)) {
            res.json(req.body);
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.get('/stats/jira/logged/:id', function(req, res) {
        var stat;

        _(stats.jira.logged).each(function(l) {
            if (l.id === req.params.id) {
                stat = l;
            }
        });

        if (!stat) {
            res.json({error: true, message: 'stat not found'});
        }

        res.json(stat);
    });

    app.put('/stats/jira/logged/:id', function(req, res) {
        var stat;

        _(stats.jira.logged).each(function(l, i) {
            if (l.id === req.params.id) {
                l = req.body;
                stat = l;
            }
        });

        if (saveStats(stats)) {
            res.json(stat);
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/logged/:id', function() {
        var index = -1;

        _(stats.jira.logged).each(function(l, i) {
            if (l.id === req.params.id) {
                index = i;
            }
        });

        if (index > -1) {
            stats.jira.logged.splice(index, 1);
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
        req.body.id = req.body.key;

        stats.jira.project.push(req.body);

        if (saveStats(stats)) {
            res.json(req.body);
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.get('/stats/jira/project/:id', function(req, res) {
        var stat;

        _(stats.jira.project).each(function(p) {
            if (p.id === req.params.id) {
                stat = p;
            }
        });

        if (!stat) {
            res.json({error: true, message: 'stat not found'});
        }

        res.json(stat);
    });

    app.put('/stats/jira/project/:id', function(req, res) {
        var stat;

        _(stats.jira.project).each(function(p, i) {
            if (p.id === req.params.id) {
                p = req.body;
                stat = p;
            }
        });

        if (saveStats(stats)) {
            res.json(stat);
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/project/:id', function() {
        var index = -1;

        _(stats.jira.project).each(function(p, i) {
            if (p.id === req.params.id) {
                index = i;
            }
        });

        if (index > -1) {
            stats.jira.project.splice(index, 1);
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
        req.body.id = req.body.key;

        stats.jira.priority.push(req.body);

        if (saveStats(stats)) {
            res.json(req.body);
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.get('/stats/jira/priority/:id', function(req, res) {
        var stat;

        _(stats.jira.priority).each(function(p) {
            if (p.id === req.params.id) {
                stat = p;
            }
        });

        if (!stat) {
            res.json({error: true, message: 'stat not found'});
        }

        res.json(stat);
    });

    app.put('/stats/jira/priority/:id', function(req, res) {
        var stat;

        _(stats.jira.priority).each(function(p, i) {
            if (p.id === req.params.id) {
                p = req.body;
                stat = p;
            }
        });

        if (saveStats(stats)) {
            res.json(stat);
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/priority/:id', function() {
        var index = -1;

        _(stats.jira.priority).each(function(p, i) {
            if (p.id === req.params.id) {
                index = i;
            }
        });

        if (index > -1) {
            stats.jira.priority.splice(index, 1);
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
        req.body.id = req.body.key;

        stats.jira.status.push(req.body);

        if (saveStats(stats)) {
            res.json(req.body);
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.get('/stats/jira/status/:id', function(req, res) {
        var stat;

        _(stats.jira.status).each(function(s) {
            if (s.id === req.params.id) {
                stat = s;
            }
        });

        if (!stat) {
            res.json({error: true, message: 'stat not found'});
        }

        res.json(stat);
    });

    app.put('/stats/jira/status/:id', function(req, res) {
        var stat;

        _(stats.jira.status).each(function(s, i) {
            if (s.id === req.params.id) {
                s = req.body;
                stat = s;
            }
        });

        if (saveStats(stats)) {
            res.json(stat);
        } else {
            res.json({message: 'Unable to save statistic'});
        }
    });

    app.delete('/stats/jira/status/:id', function() {
        var index = -1;

        _(stats.jira.status).each(function(s, i) {
            if (s.id === req.params.id) {
                index = i;
            }
        });

        if (index > -1) {
            stats.jira.status.splice(index, 1);
            saveStats(stats);

            res.json({message: 'stat deleted'});
        } else {
            res.json({message: 'no status stat found with id: ' + req.params.id});
        }
    });
};