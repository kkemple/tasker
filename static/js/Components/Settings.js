;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Settings', function(Mod, App, Backbone, Marionette, $, _) {
        var SettingsView = Marionette.ItemView.extend({
            template: 'Widgets/Settings',
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
                var self = this;

                App.request('userSettings').done(function(settings) {
                    self.model = settings;

                    if (self.model.get('allowScreenCapture')) {
                        App.ScreenCapture.startCapture();
                    }
                });
            },
            setBrowserNotifications: function() {
                this.model.set('allowBrowserNotifications', !this.model.get('allowBrowserNotifications'));
                this.model.save();

                if (this.model.get('allowBrowserNotifications') &&
                        ((Notification.permission === 'denied') ||
                        (Notification.permission === 'default'))) {
                    Notification.requestPermission();
                }
            },
            setVoiceNotifications: function() {
                this.model.set('allowVoiceNotifications', !this.model.get('allowVoiceNotifications'));
                this.model.save();

            },
            setNotificationDuration: function() {
                this.model.set('notificationDuration', this.$('#notification-duration').val());
                this.model.save();
            },
            setBackupDuration: function() {
                this.model.set('backupDuration', this.$('#backup-duration').val());
                this.model.save();
            },
            setScreenCapture: function() {
                this.model.set('allowScreenCapture', !this.model.get('allowScreenCapture'));
                this.model.save();

                if (this.model.get('allowScreenCapture')) {
                    App.ScreenCapture.startCapture();
                } else {
                    App.ScreenCapture.stopCapture();
                }
            },
            backUpLocalStorage: function() {
                App.Storage.backup();
            },
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
                initializer: function() {
                    return new SettingsView();
                }
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);