;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * ## Settings
     * The Settings module is responsible tracking app settings, it is a screen level component
     *
     *
     *
     * @module Settings
     * @namespace  TA
     *
     */
    TA.module('Settings', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## SettingsView
         *
         * The view created when the settings screen is activated
         *
         * @class SettingsView
         * @constructor
         * @namespace TA.Settings
         * @extends Marionette.ItemView
         * @private
         */
        var SettingsView = Marionette.ItemView.extend({
            template: 'Screens/Settings/Settings',
            className: 'settings-view',
            events: {
                'click .allow-browser-notifications': 'setBrowserNotifications',
                'click .allow-voice-notifications': 'setVoiceNotifications',
                'click .allow-screencapture': 'setScreenCapture',
                'click .backup': 'backUpLocalStorage',
                'click .restore': 'restoreLocalStorage',
                'change #notification-duration': 'setNotificationDuration',
                'change #backup-duration': 'setBackupDuration'
            },
            modelEvents: {
                'change:allowBrowserNotifications': 'render',
                'change:allowVoiceNotifications': 'render',
                'change:allowVoiceCommands': 'render',
                'change:allowScreenCapture': 'render'
            },
            initialize: function() {
                if (this.model.get('allowScreenCapture')) {
                    App.ScreenCapture.stopCapture().done(function() {
                        App.ScreenCapture.startCapture();
                    });
                }
            },

            /**
             * Responsible for setting the allowBrowserNotifications prop on model, and getting user permission
             *
             * @method setBrowserNotifications
             * @public
             */
            setBrowserNotifications: function() {
                this.model.set('allowBrowserNotifications', !this.model.get('allowBrowserNotifications'));
                this.model.save();

                if (this.model.get('allowBrowserNotifications') &&
                        ((Notification.permission === 'denied') ||
                        (Notification.permission === 'default'))) {
                    Notification.requestPermission();
                }
            },

            /**
             * Responsible for setting allowVoiceNotifications prop on model
             *
             * @method setVoiceNotifications
             * @public
             */
            setVoiceNotifications: function() {
                this.model.set('allowVoiceNotifications', !this.model.get('allowVoiceNotifications'));
                this.model.save();

            },

            /**
             * Responsible for setting the notificationDuration prop on model
             *
             * @method setNotificationDuration
             * @public
             */
            setNotificationDuration: function() {
                this.model.set('notificationDuration', this.$('#notification-duration').val());
                this.model.save();
            },

            /**
             * Responsible for setting the backupDuration prop on model
             *
             * @method setBackupDuration
             * @public
             */
            setBackupDuration: function() {
                this.model.set('backupDuration', this.$('#backup-duration').val());
                this.model.save();
            },

            /**
             * Responsible for setting the allowScreenCapture prop on model
             *
             * @method setScreenCapture
             * @public
             */
            setScreenCapture: function() {
                this.model.set('allowScreenCapture', !this.model.get('allowScreenCapture'));
                this.model.save();

                if (this.model.get('allowScreenCapture')) {
                    App.ScreenCapture.startCapture();
                } else {
                    App.ScreenCapture.stopCapture();
                }
            },

            /**
             * Responsible for calling the backup method on the Storage module
             *
             * @method backUpLocalStorage
             * @public
             */
            backUpLocalStorage: function() {
                App.Storage.backup();
            },

            /**
             * Responsible for calling the restore method on the Storage module
             *
             * @method restoreLocalStorage
             * @public
             */
            restoreLocalStorage: function() {
                App.Storage.restore();
            }
        });

        Mod.SettingsView = SettingsView;

        Mod.addInitializer(function() {

            App.execute('registerScreen', {
                position: 9,
                screenKey: 'settings',
                iconClass: 'fa-cog',
                anchorText: 'App Settings',
                initializer: function(screen) {
                    App.request('userSettings').done(function(settings) {
                        screen.show(new SettingsView({model: settings}));
                    });
                }
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);