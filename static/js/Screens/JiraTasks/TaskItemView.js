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

                /* stats collecting */
                App.execute('stats:jira:project', {
                    taskName: this.model.get('taskName'),
                    key: this.model.get('key'),
                    project: this.model.get('project'),
                    date: moment()
                });

                App.execute('stats:jira:status', {
                    taskName: this.model.get('taskName'),
                    key: this.model.get('key'),
                    status: this.model.get('status'),
                    date: moment()
                });

                App.execute('stats:jira:priority', {
                    taskName: this.model.get('taskName'),
                    key: this.model.get('key'),
                    priority: this.model.get('priority'),
                    date: moment()
                });

                App.execute('stats:jira:logged', {
                    taskName: this.model.get('taskName'),
                    key: this.model.get('key'),
                    count: this.model.get('count'),
                    date: moment()
                });

                App.execute('stats:jira:tracked', {
                    taskName: this.model.get('taskName'),
                    key: this.model.get('key'),
                    count: this.model.get('count'),
                    date: moment()
                });

                var $target = $(e.target).addClass('fa-spin');
                var timeSpent = '';
                var displayTime = App.DateTime.parseSeconds(this.model.get('count'));

                timeSpent += (displayTime.hour > 0) ? displayTime.hour + 'h ' : '';
                timeSpent += displayTime.minute + 'm';

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