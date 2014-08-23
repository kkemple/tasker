;(function(TA, Backbone, Marionette, $, _) {
    "use strict";


    /**
     * ## Sidebar
     * The Sidebar module is responsible displaying the sidebar view
     *
     *
     * @module Sidebar
     * @namespace  TA
     *
     */
    TA.module('Sidebar', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## SidebarNavItem
         *
         * The view created when a new Screen model is added to the ScreensCollection
         *
         * @class SidebarNavItem
         * @constructor
         * @namespace TA.Sidebar
         * @extends Marionette.ItemView
         * @private
         */
        var SidebarNavItem = Marionette.ItemView.extend({
            template: 'Widgets/SidebarNavItem',
            tagName: 'li',
            events: {
                'click a': 'setActive'
            },
            ui: {
                $anchor: 'a'
            },
            initialize: function() {
                this.listenTo(this.model, 'active', this.setActive);
            },

            /**
             * Responsible for updating the UI when the model's active state is changed
             *
             * @method  setActive
             * @public
             */
            setActive: function() {
                this.trigger('link:selected');
                this.ui.$anchor.addClass('active');
            }
        });

        /**
         * ## SidebarView
         *
         * The view that contains all current SidebarNavItem views
         *
         * @class SidebarView
         * @constructor
         * @namespace TA.Sidebar
         * @extends Marionette.CollectionView
         * @private
         */
        var SidebarView = Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav nav-sidebar',
            itemView: SidebarNavItem,
            itemViewContainer: '.nav',
            collection: TA.request('screens'),
            collectionEvents: {
                'sort': 'render'
            },
            initialize: function() {
                var self = this;

                this.on('itemview:link:selected', function() {
                    self.$('a').removeClass('active');
                });
            },

            /**
             * Sets the link for the current screen to active
             *
             * @method setActiveLink
             * @public
             */
            setActiveLink: function(screenKey) {
                var link = this.collection.findWhere({screenKey: screenKey});
                link.trigger('active');
            }
        });

        App.addInitializer(function() {
            var sidebar = new SidebarView();
            App.sidebar.show(sidebar.render());

            // update active link in sidebar when url changes
            App.router.on('route', function(route) {
                sidebar.setActiveLink(route);
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);