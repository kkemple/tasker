var fs = require('fs'),
    express = require('express'),
    app = express(),
    http = require('http'),
    bodyParser = require('body-parser'),
    favicon = require('serve-favicon'),
    shell = require('shelljs');


app.use(bodyParser.json());
app.use(express.static(__dirname + '/static'));
app.use(favicon(__dirname + '/static/favicon.ico'));
app.set('port', process.env.PORT || 8888);
app.set('views', __dirname + '/express/views');

// load endpoints
var routes = shell.find('express/routes').filter(function(file) {
    return file.match(/\.js$/);
});

routes.forEach(function(route) {
    require('./' + route)(app);
});

// create and run the server
http.createServer(app).listen(app.get('port'), function() {
    "use strict";

    console.log('Express server listening on port ' + app.get('port'));
});



