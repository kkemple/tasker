var spawn = require('child_process').spawn,
    child;

module.exports = function(app) {
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
};