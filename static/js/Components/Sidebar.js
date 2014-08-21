;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Sidebar', function(Mod, App, Backbone, Marionette, $, _) {
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
            setActive: function() {
                this.trigger('link:selected');
                this.ui.$anchor.addClass('active');
            }
        });

        var Sidebar = Marionette.CollectionView.extend({
            tagName: 'ul',
            className: 'nav nav-sidebar',
            itemView: SidebarNavItem,
            itemViewContainer: '.nav',
            collection: TA.request('sidebarCollection'),
            initialize: function() {
                var self = this;

                this.on('itemview:link:selected', function() {
                    self.$('a').removeClass('active');
                });
            },
            setActiveLink: function(screenKey) {
                var link = this.collection.findWhere({screenKey: screenKey});
                link.trigger('active');
            }
        });

        App.addInitializer(function() {
            var sidebar = new Sidebar();
            App.sidebar.show(sidebar.render());

            // update active link in sidebar when url changes
            App.router.on('route', function(route) {
                sidebar.setActiveLink(route);
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);