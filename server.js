var fs = require('fs'),
    express = require('express'),
    app = express(),
    http = require('http'),
    request = require('request'),
    bodyParser = require('body-parser'),
    spawn = require('child_process').spawn,
    child;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/express/views');


// load app
app.get('/', function(req, res) {
    res.render('index.ejs');
});

// start screencapture
app.get('/screencapture/start', function(req, res) {
    child = spawn('bash', ['capture.sh']);
    child.stdout.on('data', function(data) {
        console.log(data.toString());
    });
    res.json({message: 'screen capture started'});
});

// stop screencapture
app.get('/screencapture/stop', function(req, res) {
    if (child) {
        child.kill('SIGTERM');
    }
    res.json({message: 'screen capture stopped'});
});

// get jira tasks
app.get('/jira/tasks', function(req, res) {
    var jiraUrl = decodeURIComponent(req.query.jiraUrl),
        username = decodeURIComponent(req.query.username),
        password = decodeURIComponent(req.query.password);



    request.get(jiraUrl, function(error, response, body) {
        if (error) {
            res.json(error);
            res.end();
        }
        res.json(body);
        res.end();
    }).auth(username, password, true);

    /* for testing purposes
   fs.readFile('jiraTasks.json', 'utf-8', function(err, content) {
        res.json(content);
    });
    */
});

// log jira work
app.post('/jira/tasks/worklog', function(req, res) {

});

// backup localstorage
app.post('/app/backup', function(req, res) {
    fs.writeFile('backup.json', JSON.stringify(req.body), function(err) {
        if(err) {
            res.json(err);
        } else {
            res.json({message: 'Backup written to backup.json in root of application.'});
        }
    });
});

// restore localstorage from backup
app.get('/app/backup', function(req, res) {
    fs.readFile('backup.json', 'utf-8', function(err, content) {
        res.json(content);
    });
});

// create and run the server
http.createServer(app).listen(app.get('port'), function() {
    "use strict";

    console.log('Express server listening on port ' + app.get('port'));
});