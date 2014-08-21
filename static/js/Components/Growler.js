;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Growler', function(Mod, App, Backbone, Marionette, $, _) {

        var GrowlModel = Backbone.Model.extend({
            defaults: {
                top: 70,
                isSticky: true,
                title: '',
                message: '',
                type: 'default'
            },
            validate: function(attrs) {
                var types = ['success', 'info', 'warning', 'danger', 'default'];

                if (_.indexOf(types, attrs.type) === -1) {
                    return 'Incorrect Growler type, accepted types are: success, info, warning, and danger.';
                }
            }
        });

        var GrowlCollection = Backbone.Collection.extend({
            model: GrowlModel,
            adjustPositionUp: function(index) {
                var self = this;
                this.each(function(model) {
                    if (model.get('index') < index) {
                        model.trigger('moveup');
                    }
                });
            },
            adjustPositionDown: function(index) {
                var self = this;
                this.each(function(model) {
                    if (model.get('index') < index) {
                        model.trigger('movedown');
                    }
                });
            }
        });

        var GrowlView = Marionette.ItemView.extend({
            template: 'Components/Growl',
            tagName: 'div',
            className: function() {
                return 'growl ' + this.model.get('type');
            },
            events: {
                'click .growl-close': 'removeView'
            },
            modelEvents: {
                'change:active': 'removeView',
            },
            ui: {
                $childView: '.growl-childview'
            },
            initialize: function() {
                var self = this;

                this.listenTo(this.model, 'moveup', function() {
                    self.moveUp();
                });

                this.listenTo(this.model, 'movedown', function() {
                    self.moveDown();
                });
            },
            onRender: function() {
                var self = this;

                this.$el.hide().css('top', this.model.get('top'));

                var childView = this.model.get('childView');
                if (childView !== undefined && childView instanceof Marionette.ItemView) {
                    this.ui.$childView.append(childView.render().$el).show();
                }

                this.$el.fadeIn(300).promise().done(function() {
                    if (!self.model.get('isSticky')) {
                        setTimeout(function() {
                            self.removeView();
                        }, 1000 * 7);
                    }
                });
            },
            onBeforeClose: function() {
                this.model.destroy();
            },
            removeView: function(e) {
                var self = this;

                if (e) { e.preventDefault(); }

                this.model.destroy();
                this.$el.fadeOut(300).promise().done(function() {
                    self.$el.remove();
                });
            },
            moveUp: function() {
                var top = this.$el.position().top - this.$el.outerHeight() - 20;
                this.$el.animate({
                    top: top
                });
            },
            moveDown: function() {
                var top = this.$el.position().top + this.$el.outerHeight() + 20;
                this.$el.animate({
                    top: top
                });
            }
        });

        var growlCollection = new GrowlCollection();
        growlCollection.on('add', function(model) {
            growlCollection.adjustPositionDown(model.get('index'));
        });
        growlCollection.on('remove', function(model) {
            growlCollection.adjustPositionUp(model.get('index'));
        });

        var index = 0;
        Mod.growl = function(opts) {
            opts.index = ++index;
            var model = new GrowlModel(opts);

            growlCollection.add(model);
            var view = new GrowlView({model: model});

            $('body').append(view.render().$el);

            return view;
        };
    });

})(TA, Backbone, Marionette, jQuery, _);
