var fs = require('fs'),
    express = require('express'),
    app = express(),
    http = require('http'),
    request = require('request'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    spawn = require('child_process').spawn,
    crypto = require('crypto'),
    passKey = fs.readFileSync('.password').toString('utf8').trim(),
    child;

app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.use(favicon(__dirname + '/static/favicon.ico'));
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/express/views');


// load app
app.get('/', function(req, res) {
    "use strict";

    res.render('index.ejs');
});

// start screencapture
app.get('/screencapture/start', function(req, res) {
    "use strict";

    child = spawn('bash', ['./capture.sh']);
    child.stdout.on('data', function(data) {
        console.log(data.toString());
    });
    res.json({message: 'screen capture started'});
});

// stop screencapture
app.get('/screencapture/stop', function(req, res) {
    "use strict";

    if (child) {
        child.kill('SIGTERM');
    }
    res.json({message: 'screen capture stopped'});
});

app.get('/encrypt', function(req, res) {
    var ret = {};
    var query = req.query;
    for (var i in query) {
        if (query.hasOwnProperty(i)) {
            ret[i] = encrypt(query[i]);
        }
    }
    res.json(ret);
    res.end();
});

// get jira tasks
app.get('/jira/tasks', function(req, res) {
    "use strict";

    var jiraUrl = decodeURIComponent(req.query.jiraUrl),
        username = decodeURIComponent(req.query.username),
        password = decrypt(decodeURIComponent(req.query.password));

    request.get(jiraUrl, function(error, response, body) {
        if (error) {
            res.json(error);
            res.end();
        }
        res.json(body);
        res.end();
    }).auth(username, password, true);

    // fs.readFile('jiraTasks.json', 'utf-8', function(err, content) {
    //     res.json(content);
    // });
});

// log jira work
app.post('/jira/tasks/worklog', function(req, res) {

});

// backup localstorage
app.post('/app/backup', function(req, res) {
    "use strict";

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
    "use strict";

    fs.readFile('backup.json', 'utf-8', function(err, content) {
        res.json(content);
    });
});

// create and run the server
http.createServer(app).listen(app.get('port'), function() {
    "use strict";

    console.log('Express server listening on port ' + app.get('port'));
});

function encrypt(text) {
  var cipher = crypto.createCipher('aes-256-cbc', passKey)
  var crypted = cipher.update(crypto.randomBytes(10).toString('base64') + '.' + text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher('aes-256-cbc', passKey);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  dec = dec.split('.')[1];
  return dec;
}

