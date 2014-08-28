;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('DateTime', function(Mod, App, Backbone, Marionette, $, _) {

        Mod.parseSeconds = function(count) {

            if (count === 0 || count === undefined) {
                return {hour: 0, minute: 0, second: 0};
            }

            var hours = Math.floor(count / (60 * 60));

            var divisorForMinutes = count % (60 * 60);
            var minutes = Math.floor(divisorForMinutes / 60);

            var divisorForSeconds = divisorForMinutes % 60;
            var seconds = Math.ceil(divisorForSeconds);

            return {hour: hours, minute: minutes, second: seconds};
        };

        Mod.timeStringToSeconds = function(input) {
            var parts = input.split(/\s+/);

            var hours, minutes, seconds;
            _(parts).each(function(part) {
                part = part.toLowerCase();

                if (part.indexOf('h') > -1) {
                    hours = parseInt(part.replace('h', ''), 10);
                } else if (part.indexOf('m') > -1) {
                    minutes = parseInt(part.replace('m', ''), 10);
                } else if (part.indexOf('s') > -1) {
                    seconds = parseInt(part.replace('s', ''), 10);
                }
            });

            seconds = (seconds) ? seconds : 0;
            seconds += (hours) ? hours * (60 * 60) : 0;
            seconds += (minutes) ? minutes * 60 : 0;

            return (isNaN(seconds)) ? 0 : seconds;
        };

        Mod.formatTime = function(timeObj, formatter) {
            return moment(timeObj).format(formatter);
        };

        Mod.formatDate = function(dateString, formatter) {
            return moment(dateString).format(formatter);
        };
    });
})(TA, Backbone, Marionette, jQuery, _);