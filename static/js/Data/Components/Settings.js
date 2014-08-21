;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {

        var Settings = Backbone.Model.extend({
            localStorage: new Backbone.LocalStorage('UserSettings'),
            defaults: {
                allowBrowserNotifications: false,
                allowVoiceNotifications: false,
                allowVoiceCommands: false,
                notificationDuration: 10,
                backupDuration: 60,
                allowScreenCapture: false,
                jiraUsername: '',
                jiraPassword: '',
                hasJiraSettings: false
            }
        });

        var userSettings = new Settings({id: 1});

        App.reqres.setHandler('userSettings', function() {
            var deferred = $.Deferred();

            userSettings.fetch().always(function() {
                deferred.resolve(userSettings);
            });

            return deferred.promise();
        });

        Mod.UserSettings = Settings;
    });
})(TA, Backbone, Marionette, jQuery, _);