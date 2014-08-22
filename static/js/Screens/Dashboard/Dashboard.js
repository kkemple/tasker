;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Dashboard', function(Mod, App, Backbone, Marionette, $, _) {

        var DashboardLayout = Marionette.ItemView.extend({
            template: 'Screens/Dashboard/Main'
        });

        Mod.DashboardLayout = DashboardLayout;

        Mod.addInitializer(function() {
            App.execute('registerScreen', {
                position: 1,
                screenKey: 'dashboard',
                iconClass: 'fa-dashboard',
                anchorText: 'Dashboard',
                initializer: function() {
                    new DashboardLayout();
                }
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);
