;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * @module Data
     * @namespace  TA
     *
     */
    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {


        /**
         * ## Settings
         *
         * The model behind all App settings
         *
         *
         * @class Settings
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Model
         * @private
         */
        var Settings = Backbone.Model.extend({
            url: '/settings',
            defaults: {
                allowBrowserNotifications: false,
                allowVoiceNotifications: false,
                allowVoiceCommands: false,
                notificationDuration: 10,
                backupDuration: 60,
                allowScreenCapture: false,
                screenCaptureDuration: '',
                screenCaptureStartTime: '',
                screenCaptureEndTime: '',
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