;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Dashboard', function(Mod, App, Backbone, Marionette, $, _) {

        var DashboardView = Marionette.ItemView.extend({
            template: 'Screens/Dashboard/Main'
        });

        Mod.DashboardView = DashboardView;

        Mod.addInitializer(function() {
            App.execute('registerScreen', {
                position: 1,
                screenKey: 'dashboard',
                iconClass: 'fa-dashboard',
                anchorText: 'Dashboard',
                initializer: function() {
                    return new DashboardView();
                }
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);
