var encryption = require('../../encryption.js');

module.exports = function(app) {
    app.get('/encrypt', function(req, res) {
        var ret = {};
        var query = req.query;
        for (var i in query) {
            if (query.hasOwnProperty(i)) {
                ret[i] = encryption.encrypt(query[i]);
            }
        }
        res.json(ret);
        res.end();
    });
};
