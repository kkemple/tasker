;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Dashboard', function(Mod, App, Backbone, Marionette, $, _) {

        var MainView = Marionette.ItemView.extend({
            template: 'Screens/Dashboard/Main'
        });

        Mod.addInitializer(function() {
            App.execute('registerScreen', {
                position: 1,
                screenKey: 'dashboard',
                iconClass: 'fa-dashboard',
                anchorText: 'Dashboard',
                initializer: function() {
                    TA.execute('showScreen', new MainView());
                }
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);
