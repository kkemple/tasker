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
            resetTimer: function() {

                App.execute('stats:jira:tracked', {
                    taskName: this.model.get('taskName'),
                    key: this.model.get('key'),
                    count: this.model.get('count'),
                    date: moment()
                });

                this.model.clearCount();
            },
            saveWorklog: function(e) {
                var self = this;

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
                    var type = 'default', sticky = false;

                    if (data.error) {
                        type = 'danger';
                        sticky = true;
                        console.log('Worklog failed to save: ' + self.model.get('key'), data.response);
                    } else {
                        /* stats collecting */
                        App.execute('stats:jira:project', {
                            taskName: self.model.get('taskName'),
                            key: self.model.get('key'),
                            project: self.model.get('project'),
                            date: moment()
                        });

                        App.execute('stats:jira:status', {
                            taskName: self.model.get('taskName'),
                            key: self.model.get('key'),
                            status: self.model.get('status'),
                            date: moment()
                        });

                        App.execute('stats:jira:priority', {
                            taskName: self.model.get('taskName'),
                            key: self.model.get('key'),
                            priority: self.model.get('priority'),
                            date: moment()
                        });

                        App.execute('stats:jira:logged', {
                            taskName: self.model.get('taskName'),
                            key: self.model.get('key'),
                            count: self.model.get('count'),
                            date: moment()
                        });

                        App.execute('stats:jira:tracked', {
                            taskName: self.model.get('taskName'),
                            key: self.model.get('key'),
                            count: self.model.get('count'),
                            date: moment()
                        });

                        // good save, clear count
                        self.model.clearCount();
                        console.log('Worklog saved for task: ' + self.model.get('key'), data.response);
                    }


                    TA.Growler.growl({
                        type: type,
                        title: 'JIRA worklog',
                        message: (data.error) ? data.message + data.response : data.message,
                        isSticky: sticky
                    });

                    $target.removeClass('fa-spin');
                });
            }
        });

        Mod.TaskView = TaskView;
    });
})(TA, Backbone, Marionette, jQuery, _);