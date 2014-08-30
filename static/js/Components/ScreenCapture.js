;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * ## ScreenCapture
     * The ScreenCapture module is responsible for handling screenshot captures for Screentime
     *
     * It has a `startCapture()` method and a `stopCapture()` method that are used to send the calls
     * to the server to start and stop screen captures, they both return the promise for ajax request
     *
     *      TA.ScreenCapture.startCapture().done(function() { ... });
     *
     *      TA.ScreenCapture.stopCapture().done(function() { ... });
     *
     *
     * @module ScreenCapture
     * @constructor
     * @namespace  TA
     *
     */
    TA.module('ScreenCapture', function(Mod, App, Backbone, Marionette, $, _) {
        var intervalId;

        var startLoop = function(coll, settings) {
            var start = moment(settings.get('screenCaptureStartTime'), 'hh:mm A'),
                end = moment(settings.get('screenCaptureEndTime'), 'hh:mm A'),
                range = moment.range(start, end);

            intervalId = setInterval(function() {

                if (range.contains(moment())) {
                    coll.create({});
                }
            }, settings.get('screenCaptureDuration') * 60 * 1000);
        };

        Mod.startCapture = function() {
            $.when(App.request('userSettings'), App.request('screenshots')).done(function(userSettings, screenshots) {

                startLoop(screenshots, userSettings);

                var message = 'Screen capture enabled';

                if (userSettings.get('allowBrowserNotifications')) {
                    new Notification('Tasker Alert', _.extend({
                        body: message,
                    }, App.Config.get('notification')));
                } else {
                    App.Growler.growl({
                        message: message
                    });
                }

                if (userSettings.get('allowVoiceNotifications')) {
                    var utterance = new SpeechSynthesisUtterance(message);
                    speechSynthesis.speak(utterance);
                }
            });
        };

        Mod.stopCapture = function() {
            clearInterval(intervalId);
        };
    });
})(TA, Backbone, Marionette, jQuery, _);
