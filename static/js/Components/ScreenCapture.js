;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('ScreenCapture', function(Mod, App, Backbone, Marionette, $, _) {
        App.request('userSettings').done(function(userSettings) {
            Mod.startCapture = function() {
                $.get('/screencapture/start', function(data) {
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
            };

            Mod.stopCapture = function() {
                $.get('/screencapture/stop', function(data) {
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
            };
        });
    });
})(TA, Backbone, Marionette, jQuery, _);