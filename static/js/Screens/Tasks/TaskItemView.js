;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Tasks', function(Mod, App, Backbone, Marionette, $, _) {
        var TimeEdit = Marionette.ItemView.extend({
            template: 'Screens/Tasks/TimeEdit',
            tagName: 'span',
            events: {
                'blur input': 'parseTime',
                'keyup input': 'parseTime',
                'click input': 'stopProp'
            },
            onRender: function() {
                var self = this;

                // catch on next tick
                _.delay(function() {
                    self.$('input').focus();
                }, 0);
            },
            stopProp: function(e) {
                e.preventDefault();
                e.stopPropagation();
            },
            parseTime: function(e) {

                if (e && e.which && e.which !== 13) {
                    return false;
                }

                var $target = $(e.target);

                this.model.set('count', App.DateTime.jiraTimeStringToSeconds($target.val()));

                if (this.model.get('count') === 0) { this.model.trigger('change:displayTime'); }
                this.close();
            }
        });

        var TaskView = Marionette.ItemView.extend({
            template: 'Screens/Tasks/Task',
            tagName: 'div',
            className: 'task',
            events: {
                'click .reset-count': 'resetTimer',
                'click .delete-task': 'deleteTask',
                'click .toggle-timer': 'toggleTimer',
                'click .today i': 'markForToday',
                'click .count': 'showTimeEdit'
            },
            modelEvents: {
                'change:displayTime': 'renderTimer',
                'change:isRunning': 'updateUI',
                'change:isFiltered': 'toggleVisibility'
            },
            ui: {
                $toggleTimer: '.toggle-timer',
                $countContainer: '.count span'
            },
            onRender: function() {
                if (!this.model.isViewable()) {
                    this.$el.hide();
                }

                // check to see if model is running, if so update to accomodate
                this.model.toggleRunning();
                this.updateUI();
            },
            renderTimer: function() {
                this.ui.$countContainer.html(this.model.get('displayTime'));
            },
            toggleVisibility: function() {
                var showHide = (this.model.isViewable()) ? 'show' : 'hide';
                this.$el[showHide]();
            },
            toggleTimer: function() {
                this.model.set('isRunning', !this.model.get('isRunning'));
            },
            updateUI: function() {
                if (this.model.get('isRunning')) {
                    this.ui.$toggleTimer.removeClass('fa-play').addClass('fa-pause');
                } else {
                    this.ui.$toggleTimer.removeClass('fa-pause').addClass('fa-play');
                }

                this.$el.toggleClass('active', this.model.get('isRunning'));
            },
            resetTimer: function() {
                this.model.clearCount();
            },
            deleteTask: function() {
                if(confirm('Are you sure you want to delete this task?')) {
                    this.model.destroy();
                }
            },
            markForToday: function(e) {
                var $target = $(e.target);

                this.model.set('today', !this.model.get('today'));
                this.model.save();

                $target.toggleClass('active');
            },
            showTimeEdit: function(e) {
                if (this.model.get('isRunning')) {
                    this.toggleTimer();
                }

                this.ui.$countContainer.empty().append(new TimeEdit({model: this.model}).render().$el);
            },
            noop: function() {}
        });

        Mod.TaskView = TaskView;
    });
})(TA, Backbone, Marionette, jQuery, _);
