
module.exports = function(app) {
    // load app
    app.get('/', function(req, res) {
        "use strict";

        res.render('index.ejs');
    });
};
