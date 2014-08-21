;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Notifier', function(Mod, App, Backbone, Marionette, $, _) {

        var ActiveTasks = Backbone.Collection.extend({
            initialize: function() {
                var self = this;

                App.request('userSettings').done(function(userSettings) {
                    self.userSettings = userSettings;

                    userSettings.on('change:notificationDuration', function() {
                        if (self.length) {
                            self.stopNotificationTimer();
                            self.startNotificationTimer();
                        }
                    });
                });

                this.isRunning = false;
                this.notificationTimerId = 0;

                this.on('add', function() {
                    self.startNotificationTimer();
                });

                this.on('remove', function() {
                    if (this.length === 0) {
                        self.stopNotificationTimer();
                    }
                });
            },
            notify: function() {
                var message;

                if (this.length > 1) {
                    message = 'You are currently tracking time for ' + this.length + ' tasks.';
                } else {
                    message = 'You are currently tracking time for task: ' + this.at(0).get('taskName') + '.';
                }

                if (document.hidden) {
                    if (this.userSettings.get('allowBrowserNotifications')) {
                        new Notification('Time Assistant', {
                            body: message,
                            icon: 'img/time.png'
                        });
                    }
                } else {
                    TA.Growler.growl({
                        title: 'Tasker Alert',
                        message: message
                    });
                }

                if (this.userSettings.get('allowVoiceNotifications')) {
                    var utterance = new SpeechSynthesisUtterance(message);
                    speechSynthesis.speak(utterance);
                }
            },
            startNotificationTimer: function() {
                var self = this;

                if (!this.isRunning) {
                    this.notificationTimerId = setInterval(function() {
                        self.notify();
                    }, 1000 * 60 * this.userSettings.get('notificationDuration'));
                    this.isRunning = true;
                }
            },
            stopNotificationTimer: function() {
                if (this.isRunning) {
                    clearInterval(this.notificationTimerId);
                    this.isRunning = false;
                }
            }
        });

        var activeTasks = new ActiveTasks();

        Mod.add = function(task) {
            activeTasks.add(task);
        };

        Mod.remove = function(task) {
            activeTasks.remove(task);
        };
    });
})(TA, Backbone, Marionette, jQuery, _);