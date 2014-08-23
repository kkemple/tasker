;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * ## Header
     * The Header module is responsible displaying the header and search views
     *
     * The header instance is added to the `App.header` region in an initializer
     *
     * @module Header
     * @namespace  TA
     *
     */
    TA.module('Header', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## HeaderView
         *
         * The layout that is rendered in the the App.header region
         *
         * @class  HeaderView
         * @namespace TA.Header
         * @extends Marionette.Layout
         * @private
         */
        var HeaderView = Marionette.Layout.extend({
            template: 'Widgets/Header',
            regions: {
                search: '#header-search'
            },
            onRender: function() {
                this.search.show(App.Search.get());
            }
        });

        Mod.HeaderView = HeaderView;

        Mod.addInitializer(function() {
            var headerView = new HeaderView();
            App.header.show(headerView.render());
        });
    });
})(TA, Backbone, Marionette, jQuery, _);
