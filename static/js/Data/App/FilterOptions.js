;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {
        /**
         * ## FilterModel
         *
         * The model behind each filter option view
         *
         * @class FilterModel
         * @constructor
         * @namespace TA.Search
         * @extends Backbone.Model
         * @private
         */
        var FilterModel = Backbone.Model.extend({
            defaults: {
                isActive: false
            }
        });

        /**
         * ## FiltersCollection
         *
         * The collection behind each growl collection view
         *
         * @class FiltersCollection
         * @constructor
         * @namespace TA.Search
         * @extends Backbone.Collection
         * @private
         */
        var FiltersCollection = Backbone.Collection.extend({
            model: FilterModel,

            /**
             * Responsible for updating the isActive flag on the model
             * with the id that matches the value passed in
             *
             * @method  setActive
             * @param {String} val the value/id of the filter option to set active
             */
            setActive: function(val) {
                this.each(function(model) {
                    if (model.get('id') === val) {
                        model.set('isActive', true);
                    } else {
                        model.set('isActive', false);
                    }
                });
            }
        });

        Mod.FilterModel = FilterModel;
        Mod.FiltersCollection = FiltersCollection;
    });
})(TA, Backbone, Marionette, jQuery, _);