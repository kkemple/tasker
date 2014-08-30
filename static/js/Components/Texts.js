;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Texts', function(Mod, App, Backbone, Marionette, $, _) {
        var texts = {
            colors: {
                warning: '#f0ad4e',
                info: '#5bc0de',
                danger: '#F15854',
                success: '#5cb85c',
                gray: '#4D4D4D',
                blue: '#5DA5DA',
                orange: '#FAA43A',
                pink: '#F17CB0',
                purple: '#B276B2',
            },
            colorKeys: [
                'warning',
                'info',
                'danger',
                'success',
                'gray',
                'blue',
                'orange',
                'pink',
                'purple',
            ],
            weekdays: [
                'Sunday',
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday'
            ]
        };

        Mod.get = function(key) {
            return texts[key];
        };
    });
})(TA, Backbone, Marionette, jQuery, _);