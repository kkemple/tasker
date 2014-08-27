;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('DateTime', function(Mod, App, Backbone, Marionette, $, _) {

        Mod.parseSeconds = function(count) {

            if (count === 0) {
                return {hour: 0, minute: 0, second: 0};
            }

            var hours = Math.floor(count / (60 * 60));

            var divisorForMinutes = count % (60 * 60);
            var minutes = Math.floor(divisorForMinutes / 60);

            var divisorForSeconds = divisorForMinutes % 60;
            var seconds = Math.ceil(divisorForSeconds);

            return {hour: hours, minute: minutes, second: seconds};
        };

        Mod.formatTime = function(timeObj, formatter) {
            return moment(timeObj).format(formatter);
        };

        Mod.formatDate = function(dateString, formatter) {
            return moment(dateString).format(formatter);
        };
    });
})(TA, Backbone, Marionette, jQuery, _);