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
                pink: '#F17CB0',
                purple: '#B276B2',
                ducky: '#7D9F9C',
                lavendar: '#5C557E'
            },
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

        texts.colorKeys = _(texts.colors).map(function(val, key) {
            return key;
        });

        Mod.get = function(key) {
            return texts[key];
        };
    });
})(TA, Backbone, Marionette, jQuery, _);