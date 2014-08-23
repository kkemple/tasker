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
        App.request('userSettings').done(function(userSettings) {

            Mod.startCapture = function() {
                var promise = $.get('/screencapture/start');

                promise.then(function(data) {

                    var message = data.message;

                    if (userSettings.get('allowBrowserNotifications')) {
                        new Notification('Tasker Alert', {
                            body: message,
                            icon: 'img/numbered-list.png'
                        });
                    }

                    if (userSettings.get('allowVoiceNotifications')) {
                        var utterance = new SpeechSynthesisUtterance(message);
                        speechSynthesis.speak(utterance);
                    }
                });

                return promise;
            };

            Mod.stopCapture = function() {
                var promise = $.get('/screencapture/stop');

                promise.then(function(data) {

                    var message = data.message;

                    if (userSettings.get('allowBrowserNotifications')) {
                        new Notification('Takser Alert', {
                            body: message,
                            icon: 'img/numbered-list.png'
                        });
                    }

                    if (userSettings.get('allowVoiceNotifications')) {
                        var utterance = new SpeechSynthesisUtterance(message);
                        speechSynthesis.speak(utterance);
                    }
                });

                return promise;
            };
        });
    });
})(TA, Backbone, Marionette, jQuery, _);