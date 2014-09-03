;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    $(function() {
        // start app
        TA.start();

        // start history
        Backbone.history.start();

        // load default route, unless route is present
        if (Backbone.history.fragment === '') {
            TA.router.navigate('#/dashboard/');
        }
    });

})(TA, Backbone, Marionette, jQuery, _);