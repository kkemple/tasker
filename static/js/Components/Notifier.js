;(function(TA, Backbone, Marionette, $, _) {
    "use strict";


    /**
     * ## Notifier
     * The Notifier module is responsible for sending task notifications to the user
     *
     * It provides an `add()` method and a `remove()` method for updating the active tasks collection.
     *
     *      TA.Notifier.add(task);
     *
     *      TA.Notifier.remove(task);
     *
     *
     * @module Notifier
     * @namespace  TA
     *
     */
    TA.module('Notifier', function(Mod, App, Backbone, Marionette, $, _) {


        /**
         * ## ActiveTasks
         *
         * The collection of currently active tasks
         *
         * @class ActiveTasks
         * @constructor
         * @namespace TA.Notifier
         * @extends Backbone.Collection
         * @private
         */
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

            /**
             * Responsible for actually sending the notification to the user
             *
             * @method notify
             * @public
             */
            notify: function() {
                var message;

                if (this.length > 1) {
                    message = 'You are currently tracking time for ' + this.length + ' tasks.';
                } else {
                    message = 'You are currently tracking time for task: ' + this.at(0).get('taskName') + '.';
                }

                if (document.hidden && this.userSettings.get('allowBrowserNotifications')) {
                    new Notification('Tasker', {
                        body: message,
                        icon: 'img/numbered-list.png'
                    });
                } else {
                    TA.Growler.growl({
                        title: 'Tasker Alert',
                        message: message,
                        isSticky: true
                    });
                }

                if (this.userSettings.get('allowVoiceNotifications')) {
                    var utterance = new SpeechSynthesisUtterance(message);
                    speechSynthesis.speak(utterance);
                }
            },

            /**
             * Responsible for starting the timer if not already running
             *
             * @method startNotificationTimer
             * @public
             */
            startNotificationTimer: function() {
                var self = this;

                if (!this.isRunning) {
                    this.notificationTimerId = setInterval(function() {
                        self.notify();
                    }, 1000 * 60 * this.userSettings.get('notificationDuration'));
                    this.isRunning = true;
                }
            },

            /**
             * Responsible for stopping the timer if already running
             *
             * @method stopNotificationTimer
             * @public
             */
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