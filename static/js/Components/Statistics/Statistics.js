;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * ## Statistics
     * The Statistics module is responsible for gathering all information that could be deemed useful to the user.
     * Stats are recorded with the `App.execute()` method, all stats follow this namespacing paradigm `stats:{grouping}:{stat}`
     *
     *      App.execute('stats:jira:logged', {
     *          taskName: this.model.get('taskName'),
     *          key: this.model.get('key'),
     *          count: this.model.get('count'),
     *          date: moment()
     *      });
     *
     * @module Statistics
     * @namespace  TA
     *
     */
    TA.module('Statistics', function(Mod, App, Backbone, Marionette, $, _) {


    });
})(TA, Backbone, Marionette, jQuery, _);