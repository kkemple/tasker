;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Tasks', function(Mod, App, Backbone, Marionette, $, _) {

        var MainView = Marionette.Layout.extend({
            template: 'Screens/Tasks/Tasks',
            regions: {
                addTask: '.add-task-region',
                tasks: '.tasks-region'
            },
            onRender: function() {
                var self = this;

                App.request('tasks').done(function(tasksCollection) {
                    var taskForm = new Mod.AddTaskForm();
                    self.addTask.show(taskForm);

                    var tasks = new Mod.TasksView({collection: tasksCollection});
                    self.tasks.show(tasks);
                });
            }
        });

        Mod.MainView = MainView;

        Mod.addInitializer(function(opts) {
            App.execute('registerScreen', {
                position: 3,
                screenKey: 'tasks',
                iconClass: 'fa-tasks',
                anchorText: 'Tasks',
                initializer: function() {
                    TA.execute('showScreen', new MainView());
                }
            });
        });
    });

})(TA, Backbone, Marionette, $, _);