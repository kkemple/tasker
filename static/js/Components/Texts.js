;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Texts', function(Mod, App, Backbone, Marionette, $, _) {
        var texts = {
            colors: {
                warning: '#f0ad4e',
                info: '#5bc0de',
                danger: '#d9534f',
                success: '#5cb85c',
                gray: '#4D4D4D',
                blue: '#5DA5DA',
                orange: '#FAA43A',
                green: '#60BD68',
                pink: '#F17CB0',
                brown: '#B2912F',
                purple: '#B276B2',
                yellow: '#DECF3F',
                red: '#F15854',
            },
            colorKeys: [
                'warning',
                'info',
                'danger',
                'success',
                'gray',
                'blue',
                'orange',
                'green',
                'pink',
                'brown',
                'purple',
                'yellow',
                'red'
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