;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * ## Data
     * The Data module is responsible for handling all data
     *
     * All data classes can be accessed through namespacing or for an updated instance, through an `App.request()` call
     *
     *      var screens = new App.Data.Screens();
     *
     *      // or
     *
     *      var screens = App.request('screens'); // gives the main instance, shared across app
     *
     *
     * Any data class that pulls from local storage or other endpoints will return a promise when requested,
     * the deferred is resolved with the data class once it has fetched the latest data
     *
     *      App.request('someCollectionOrModel').done(function(someCollectionOrModel) { ... });
     *
     *
     * @module Data
     * @namespace  TA
     *
     */
    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## Screen
         *
         * The model behind each screen, screens are registered with the App
         *
         *      App.execute('registerScreen', { ... });
         *
         * @class Screen
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Model
         * @public
         */
        var Screen = Backbone.Model.extend({
            defaults: {
                position: 0,
                screenKey: '',
                iconClass: '',
                anchorText: '',
                initializer: undefined
            },
            validate: function(attrs) {
                if (attrs.position === 0) {
                    return 'ERROR: Screen Model needs a position property.';
                }

                if (attrs.screenKey === '') {
                    return 'ERROR: Screen Model needs a screenKey property.';
                }

                if (attrs.iconClass === '') {
                    return 'ERROR: Screen Model needs a iconClass property. (See FontAwesome docs for options.)';
                }

                if (attrs.anchorText === '') {
                    return 'ERROR: Screen Model needs a anchorText property.';
                }

                if (attrs.initializer === undefined ||
                        (typeof attrs.initializer !== 'function') ) {

                    return 'ERROR: Screen Model needs a screenKey property.';
                }
            },
            initialize: function(attrs) {
                TA.router.route(attrs.screenKey + '/', attrs.screenKey, function() {
                    TA.execute('showScreen', attrs.initializer);
                });
            }
        });

        /**
         * ## Screens
         *
         * The collection of all registered screens
         *
         * @class Screens
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Collection
         * @public
         */
        var Screens = Backbone.Collection.extend({
            model: Screen,
            comparator: function(model) {
                return model.get('position');
            }
        });

        var screens = new Screens();

        App.reqres.setHandler('screens', function() {
            return screens;
        });

        App.commands.setHandler('registerScreen', function(opts) {
            screens.add(opts);
        });

        Mod.Screen = Screen;
        Mod.Screens = Screens;
    });
})(TA, Backbone, Marionette, jQuery, _);