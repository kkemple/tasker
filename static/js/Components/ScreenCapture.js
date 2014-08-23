;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * ## ScreenCapture
     * The ScreenCapture module is responsible for handling screenshot captures for Screentime
     *
     * It has a `startCapture()` method and a `stopCapture()` method that are used to send the calls
     * to the server to start and stop screen, they both return the promise for ajax request
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

            /**
             * Responsible for sending the call to server to start screen captures
             *
             * @method  startCapture
             * @return {Promise} the jQuery ajax promise
             * @for ScreenCapture
             */
            Mod.startCapture = function() {
                var promise = $.get('/screencapture/start');

                promise.then(function(data) {

                    var message = data.message;

                    if (userSettings.get('allowBrowserNotifications')) {
                        new Notification('Time Assistant', {
                            body: message,
                            icon: 'img/time.png'
                        });
                    }

                    if (userSettings.get('allowVoiceNotifications')) {
                        var utterance = new SpeechSynthesisUtterance(message);
                        speechSynthesis.speak(utterance);
                    }
                });

                return promise;
            };

            /**
             * Responsible for sending the call to server to stop screen captures
             *
             * @method  stopCapture
             * @return {Promise} the jQuery ajax promise
             * @for ScreenCapture
             */
            Mod.stopCapture = function() {
                var promise = $.get('/screencapture/stop');

                promise.then(function(data) {

                    var message = data.message;

                    if (userSettings.get('allowBrowserNotifications')) {
                        new Notification('Time Assistant', {
                            body: message,
                            icon: 'img/time.png'
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