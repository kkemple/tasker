;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Config', function(Mod, App, Backbone, Marionette, $, _) {

        var config = {
            chartjs: {
                tooltipFontSize: 11,
                tooltipTitleFontSize: 11,
                tooltipTitleFontStyle: 'normal',
                tooltipYPadding: 4,
                tooltipXPadding: 4,
                tooltipCornerRadius: 3
            },
            notification: {
                icon: 'img/numbered-list.png'
            }
        };

        Mod.get = function(key) {
            return config[key];
        };
    });
})(TA, Backbone, Marionette, jQuery, _);