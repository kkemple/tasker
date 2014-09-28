;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Screentime', function(Mod, App, Backbone, Marionette, $, _) {

        var Screenshot = Backbone.Marionette.ItemView.extend({
            template: 'Screens/Screentime/Screenshot',
            className: 'shot',
            events: {
                'click .fa.fa-times': function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.model.destroy();
                },
                'click img': function() {
                    Mod.trigger('screenshot:zoomed', this.model.get('timestamp'));
                }
            }
        });

        var Range = Backbone.Marionette.CompositeView.extend({
            itemView: Screenshot,
            template: 'Screens/Screentime/Activity',
            itemViewContainer: '.shots',
            className: 'shot-group list-group-item',
            ui: {
                $count: '.badge'
            },
            initialize: function() {
                var self = this;

                this.collection = this.model.get('screenshots');

                this.listenTo(this.collection, 'remove', function() {
                    if (self.collection.length === 0) {
                        self.close();
                    } else {
                        self.setCountDisplay();
                    }
                });
            },
            onRender: function() {
                this.setCountDisplay();
            },
            setCountDisplay: function() {
                this.ui.$count.text(this.collection.length);
            }
        });

        var ScreenshotGroup = Backbone.Marionette.CollectionView.extend({
            itemView: Range,
            className: 'list-group'
        });

        Mod.Screenshot = Screenshot;
        Mod.Range = Range;
        Mod.ScreenshotGroup = ScreenshotGroup;
    });
})(TA, Backbone, Marionette, jQuery, _);