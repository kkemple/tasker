
;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * ## Growler
     * The Growler module is responsible for all growl messages, it provides a `growl()` method
     * that will return an instance of a GrowlView
     *
     *      var growlView = TA.Growler.growl({ ... });
     *
     * The growl method takes options for:
     * - title: String
     * - message: String
     * - isSticky: boolean
     * - type: String ['success', 'info', 'warning', 'danger', 'default']
     *
     * @module Growler
     * @namespace  TA
     *
     */
    TA.module('Growler', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## GrowlModel
         *
         * The model behind each growl view
         *
         * @class GrowlModel
         * @constructor
         * @namespace TA.Growler
         * @extends Backbone.Model
         * @private
         */
        var GrowlModel = Backbone.Model.extend({
            defaults: {
                top: 70,
                isSticky: false,
                title: '',
                message: '',
                type: 'default'
            },
            validate: function(attrs) {
                var types = ['success', 'info', 'warning', 'danger', 'default'];

                if (_.indexOf(types, attrs.type) === -1) {
                    return 'Incorrect Growler type, accepted types are: success, info, warning, danger, and default.';
                }
            }
        });

        /**
         * ## GrowlCollection
         *
         * The collection behind each growl collection view
         *
         * @class GrowlCollection
         * @constructor
         * @namespace TA.Growler
         * @extends Backbone.Collection
         * @private
         */
        var GrowlCollection = Backbone.Collection.extend({
            model: GrowlModel,

            /**
             * @method adjustPositionUp
             * @param  {Integer} index views with indexes below index param should be moved up
             */
            adjustPositionUp: function(index) {
                var self = this;
                this.each(function(model) {
                    if (model.get('index') < index) {
                        model.trigger('moveup');
                    }
                });
            },

            /**
             * @method adjustPositionDown
             * @param  {integer} index views with indexes below index param should be moved down
             */
            adjustPositionDown: function(index) {
                var self = this;
                this.each(function(model) {
                    if (model.get('index') < index) {
                        model.trigger('movedown');
                    }
                });
            }
        });

        /**
         * ## GrowlView
         *
         * The view created when a new GrowlModel is added to the GrowlCollection
         *
         * @class GrowlView
         * @constructor
         * @namespace TA.Growler
         * @extends Marionette.ItemView
         * @private
         */
        var GrowlView = Marionette.ItemView.extend({
            template: 'Components/Growl',
            tagName: 'div',
            className: function() {
                return 'growl ' + this.model.get('type');
            },
            events: {
                'click .growl-close': 'selfDestruct'
            },
            modelEvents: {
                'change:active': 'selfDestruct',
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
                            self.selfDestruct();
                        }, 1000 * 7);
                    } else {
                        setTimeout(function() {
                            self.selfDestruct();
                        }, 1000 * 60 * 10);
                    }
                });
            },
            onBeforeClose: function() {
                this.model.destroy();
            },

            /**
             * Fades out the growl notification, then destroys the model and view
             *
             * @method  selfDestruct
             * @param  {Event} e this method can be triggered by DOM events
             */
            selfDestruct: function(e) {
                var self = this;
                if (e) { e.preventDefault(); }

                this.model.destroy();
                this.$el.fadeOut(300).promise().done(function() {
                    self.$el.remove();
                });
            },

            /**
             * Moves the growl notification up on the page
             *
             * @method  moveUP
             */
            moveUp: function() {
                var top = this.$el.position().top - this.$el.outerHeight() - 20;
                this.$el.animate({
                    top: top
                });
            },

            /**
             * Moves the growl notification up down the page
             *
             * @method  moveDown
             */
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


        var index = 0; // used to increment the index of each growl instance

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
