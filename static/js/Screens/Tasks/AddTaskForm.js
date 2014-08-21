;(function(TA, Backbone, Marionette, $, _) {

    TA.module('Tasks', function(Mod, App, Backbone, Marionette, $, _) {
        var AddTaskForm = Marionette.ItemView.extend({
            template: 'Screens/Tasks/AddTaskForm',
            events: {
                'click button[type="submit"]': 'createTask',
                'blur #task-name': 'clearErrors',
                'click .toggle-add-task': 'toggleForm'
            },
            ui: {
                $taskName: '#task-name',
                $tags: '#tags',
                $startTimer: '#start-timer',
                $addTaskForm: 'form',
                $toggleVisibilityIcon: '.toggle-add-task i'
            },
            initialize: function() {
                var self = this;
                this.isVisible = false;

                App.request('tasks').done(function(taskCollection) {
                    self.taskCollection = taskCollection;
                });
            },
            createTask: function(e) {
                e.preventDefault();

                var self = this;

                this.clearErrors();

                var data = {
                    taskName: this.ui.$taskName.val().trim(),
                    isRunning: this.ui.$startTimer.is(':checked')
                };

                if (this.ui.$tags.val() !== '') {
                    data.tags = this.ui.$tags.val().trim().split(/,\s+/);
                }

                if (data.taskName === '') {
                    this.ui.$taskName.addClass('error');
                    return; // EARLY EXIT
                }

                var task = this.taskCollection.create(data);

                this.clearForm();
            },
            clearForm: function() {
                this.ui.$taskName.val('');
                this.ui.$tags.val('');
                this.ui.$startTracker.prop('checked', false);
            },
            clearErrors: function() {
                this.ui.$taskName.removeClass('error');
            },
            toggleForm: function() {
                this.isVisible = !this.isVisible;
                this.ui.$toggleVisibilityIcon.toggleClass('fa-toggle-up fa-toggle-down');
                this.toggleVisibility();
            },
            toggleVisibility: function() {
                var upDown = (this.isVisible) ? 'Down' : 'Up';
                this.ui.$addTaskForm['slide' + upDown]();
            }
        });

        Mod.AddTaskForm = AddTaskForm;
    });
})(TA, Backbone, Marionette, jQuery, _);
