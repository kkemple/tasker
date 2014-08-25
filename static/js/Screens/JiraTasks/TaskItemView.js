;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.JIRA', function(Mod, App, Backbone, Marionette, $, _) {
        var TaskView = App.Screens.Tasks.TaskView.extend({
            template: 'Screens/JIRA/Task',
            events: function() {
                return _.extend(App.Screens.Tasks.TaskView.prototype.events, {
                    'click .save-worklog': 'saveWorklog'
                });
            },
            modelEvents: function() {
                return _.extend(App.Screens.Tasks.TaskView.prototype.modelEvents, {

                });
            },
            ui: function() {
                return _.extend(App.Screens.Tasks.TaskView.prototype.ui, {
                    $countContainer: '.count span'
                });
            },
            saveWorklog: function(e) {
                var self = this;

                var $target = $(e.target).addClass('fa-spin');
                var timeSpent = '';
                var displayTime = this.model.buildDisplayTime();

                timeSpent = (displayTime.hour > 0) ? displayTime.hour + 'h ' : '';
                timeSpent = (displayTime.minute > 0) ? displayTime.minute + 'm' : '';
                timeSpent = (displayTime.hour === 0 &&
                                displayTime.minute === 0 &&
                                displayTime.second > 0) ? '1m' : '';

                var data = {
                    timeSpent: timeSpent,
                    comment: 'Worklog added from Tasker',
                    key: this.model.get('key')
                };

                $.ajax({
                    url: 'jira/tasks/worklog',
                    type: 'POST',
                    contentType: 'application/json',
                    data: JSON.stringify(data)
                }).done(function(data) {
                    TA.Growler.growl({
                        title: 'JIRA worklog',
                        message: data.message,
                        isSticky: true
                    });

                    $target.removeClass('fa-spin');
                    console.log('Worklog saved for task: ' + self.model.get('key'), data.response);

                    self.model.clearCount();
                });
            }
        });

        Mod.TaskView = TaskView;
    });
})(TA, Backbone, Marionette, jQuery, _);