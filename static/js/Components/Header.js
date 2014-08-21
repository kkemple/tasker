;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Header', function(Mod, App, Backbone, Marionette, $, _) {
        var HeaderView = Marionette.Layout.extend({
            template: 'Widgets/Header',
            regions: {
                search: '#header-search'
            },
            events: {
                'click .settings': 'showSettings',
                'click .logo': 'showTasks'
            },
            onRender: function() {
                this.search.show(App.Search.get());
            }
        });

        Mod.addInitializer(function() {
            var headerView = new HeaderView();
            App.header.show(headerView.render());
        });
    });
})(TA, Backbone, Marionette, jQuery, _);
