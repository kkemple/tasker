var shell = require('shelljs'),
    fs = require('fs'),
    path = require('path'),
    _ = require('underscore'),
    moment = require('moment'),
    exec = require('child_process').exec,
    spawn = require('child_process').spawn,
    captures = require('../../data/captures.json'),
    child;

var saveCaptures = function(captures) {
    var updatedStats;

    try {
        updatedCaptures = JSON.stringify(captures, null, 4);
    } catch ( e ) {

        console.log(e);
        return false;
    }

    try {

        fs.writeFileSync(path.resolve(__dirname, '../../data/captures.json'), updatedCaptures, 'utf8');
    } catch ( e ) {

        console.log(e);
        return false;
    }

    return true;
};

module.exports = function(app) {
    "use strict";

    app.get('/captures', function(req, res) {
        res.json(captures);
    });

    app.post('/captures', function(req, res) {
        req.body.id = moment(req.body.timestamp).format('YYYY-MM-DD--HH-mm-ss');

        var fullPath = path.resolve(__dirname, '../../static/' + req.body.fullSrc);
        var thumbPath = path.resolve(__dirname, '../../static/' + req.body.thumbSrc);

        shell.exec('screencapture -x ' + fullPath, {silent:true});

        if (!shell.test('-f', fullPath)) { res.json({message: 'failed to capture screen'}); }

        shell.cp(fullPath, thumbPath);

        shell.exec('sips -Z 200 ' + thumbPath, {silent:true});

        if (!shell.test('-f', thumbPath)) { res.json({message: 'failed to capture screen'}); }

        captures.push(req.body);
        saveCaptures(captures);

        res.json(req.body);
    });

    app.get('/captures/:id', function(req, res) {
        return _(captures).findWhere({id: req.params.id});
    });

    app.delete('/captures/:id', function(req, res) {
        var index = -1;

        _(captures).each(function(capture, i) {
            if (capture.id === req.params.id) {
                index = i;
            }
        });

        if (index > -1) {
            var toRemove = captures.splice(index, 1);
            saveCaptures(captures);

            var fullPath = path.resolve(__dirname, '../../static/' + toRemove[0].fullSrc);
            var thumbPath = path.resolve(__dirname, '../../static/' + toRemove[0].thumbSrc);

            shell.rm(fullPath, thumbPath);

            res.json({message: 'capture deleted'});
        } else {
            res.json({message: 'no capture found with id: ' + req.params.id});
        }
    });
};