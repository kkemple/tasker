;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('JIRA', function(Mod, App, Backbone, Marionette, $, _) {
        var TaskView = App.Tasks.TaskView.extend({
            template: 'Screens/JIRA/Task',
            events: function() {
                return _.extend(App.Tasks.TaskView.prototype.events, {

                });
            },
            modelEvents: function() {
                return _.extend(App.Tasks.TaskView.prototype.modelEvents, {

                });
            },
            ui: function() {
                return _.extend(App.Tasks.TaskView.prototype.ui, {
                    $countContainer: '.count span'
                });
            }
        });

        Mod.TaskView = TaskView;
    });
})(TA, Backbone, Marionette, jQuery, _);