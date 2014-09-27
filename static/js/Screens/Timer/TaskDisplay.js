;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Timer', function(Mod, App, Backbone, Marionette, $, _) {

        var TaskDisplay = App.Screens.JIRA.TaskView.extend({
            template: 'Screens/Timer/TaskDisplay',
            className: 'timer-task',
            modelEvents: function() {
                return _.extend(App.Screens.Tasks.TaskView.prototype.modelEvents, {
                    'change:isFiltered': 'noop'
                });
            },
            noop: function() {}
        });

        Mod.TaskDisplay = TaskDisplay;
    });
})(TA, Backbone, Marionette, jQuery, _);