;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.TodaysTasks', function(Mod, App, Backbone, Marionette, $, _) {


        var TodaysTasksLayout = Marionette.Layout.extend({
            template: 'Screens/TodaysTasks/TodaysTasks',
            className: 'todays-tasks',
            regions: {
                note: '.note',
                jira: '.jira-tasks-today',
                custom: '.custom-tasks-today'
            },
            onRender: function() {
                var self = this;

                var todaysJiraTasks, todaysCustomTasks;

                this.note.show(App.Loader.get());

                App.request('jiraSettings').done(function(jiraSettings) {

                    $.when(App.request('jiraTasks'), App.request('tasks')).done(function(jiraTasks, tasks) {

                        self.todaysJiraTasks = new App.Data.JiraTasks(jiraTasks.where({today: true}), {jiraSettings: jiraSettings});

                        var jiraTasksView = new App.Screens.JIRA.TasksView({collection: self.todaysJiraTasks});
                        self.jira.show(jiraTasksView);


                        self.todaysCustomTasks = new App.Data.Tasks(tasks.where({today: true}));

                        var tasksView = new App.Screens.Tasks.TasksView({collection: self.todaysCustomTasks});
                        self.custom.show(tasksView);



                        self.listenTo(self.todaysJiraTasks, 'change:today', function() {
                            self.todaysJiraTasks = new App.Data.JiraTasks(jiraTasks.where({today: true}), {jiraSettings: jiraSettings});

                            jiraTasksView = new App.Screens.JIRA.TasksView({collection: self.todaysJiraTasks});
                            self.jira.show(jiraTasksView);

                            self.toggleNote();
                        });

                        self.listenTo(self.todaysCustomTasks, 'change:today', function() {
                            self.todaysCustomTasks = new App.Data.Tasks(tasks.where({today: true}));

                            tasksView = new App.Screens.Tasks.TasksView({collection: self.todaysCustomTasks});
                            self.custom.show(tasksView);

                            self.toggleNote();
                        });

                        self.toggleNote();
                    });
                });
            },
            toggleNote: function() {
                if (!this.todaysJiraTasks.length && !this.todaysCustomTasks.length) {
                    var view = new Marionette.ItemView({
                        template: _.template('<h3>Mark some tasks for today by clicking the calendar.')
                    });

                    this.note.show(view);
                } else {
                    this.note.close();
                }
            }
        });

        Mod.addInitializer(function(opts) {
            App.execute('registerScreen', {
                position: 4,
                screenKey: 'today',
                iconClass: 'fa-calendar',
                anchorText: 'Today\'s Tasks',
                initializer: function() {
                    return new TodaysTasksLayout();
                }
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);