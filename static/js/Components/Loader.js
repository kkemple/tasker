;(function(TA, Backbone, Marionette, $, _) {
    "use strict";


    /**
     * ## Loader
     * The Loader module is responsible for creating and returning an app loader view instance,
     * it provides a `get()` method that will return an app loader view instance
     *
     *      var loader = TA.Loader.get();
     *      someLayout.someRegion.show(loader);
     *
     * @module Loader
     * @namespace  TA
     *
     */
    TA.module('Loader', function(Mod, App, Backbone, Marionette, $, _) {


        /**
         * ## LoaderView
         *
         * The view created when a new LoaderView is requested
         *
         * @class LoaderView
         * @constructor
         * @namespace TA.Loader
         * @extends Marionette.ItemView
         * @private
         */
        var LoaderView = Marionette.ItemView.extend({
            template: 'Components/Loader',
            tagName: 'span',
            className: 'app-loader'
        });

        Mod.get = function() {
            return new LoaderView();
        };
    });
})(TA, Backbone, Marionette, jQuery, _);