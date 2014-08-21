;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Loader', function(Mod, App, Backbone, Marionette, $, _) {

        var Loader = Marionette.ItemView.extend({
            template: 'Components/Loader',
            tagName: 'span',
            className: 'app-loader'
        });

        Mod.get = function() {
            return new Loader();
        };
    });
})(TA, Backbone, Marionette, jQuery, _);