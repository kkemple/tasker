var fs = require('fs');


module.exports = function(app) {

    // restore localstorage from backup
    app.get('/app/backup', function(req, res) {
        "use strict";

        fs.readFile('backup.json', 'utf-8', function(err, content) {
            res.json(content);
        });
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
};
