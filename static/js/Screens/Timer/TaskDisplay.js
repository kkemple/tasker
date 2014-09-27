;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Timer', function(Mod, App, Backbone, Marionette, $, _) {

        var TaskDisplay = App.Screens.JIRA.TaskView.extend({
            template: 'Screens/Timer/TaskDisplay',
            className: 'timer-task'
        });

        Mod.TaskDisplay = TaskDisplay;
    });
})(TA, Backbone, Marionette, jQuery, _);