;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    $(function() {
        TA.start();
        Backbone.history.start();
        if (Backbone.history.fragment === '') {
            TA.router.navigate('#/dashboard/');
        }
    });

})(TA, Backbone, Marionette, jQuery, _);