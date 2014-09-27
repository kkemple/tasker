;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('FilterOptions', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## FilterOption
         *
         * The view created when a new FilterModel is added to the FiltersCollection
         *
         * @class FilterOption
         * @constructor
         * @namespace TA.Search
         * @extends Marionette.ItemView
         * @private
         */
        var FilterOption = Marionette.ItemView.extend({
            template: 'Widgets/SearchFilterOption',
            tagName: 'option',
            modelEvents: {
                'change:isActive': 'toggleSelected'
            },
            onRender: function() {
                this.$el.attr('value', this.model.get('id'));
            },
            toggleSelected: function() {
                this.$el.prop('selected', this.model.get('isActive'));
            }
        });

        /**
         * ## FilterOptions
         *
         * The view that contains all current filter options
         *
         * @class FilterOptions
         * @constructor
         * @namespace TA.Search
         * @extends Marionette.CollectionView
         * @private
         */
        var FilterOptions = Marionette.CollectionView.extend({
            tagName: 'select',
            id: 'tasks-search-filter',
            className: 'form-control',
            itemView: FilterOption,
            events: {
                'change': 'updateActiveFilter',
            },
            onRender: function() {
                this.updateActiveFilter();
            },

            /**
             * Responsible for letting the FiltersCollection instance know that a new option has been selected
             *
             * @method  updateActiveFilter
             * @public
             */
            updateActiveFilter: function() {
                this.collection.setActive(this.$el.val());
                this.collection.trigger('active:changed');
            }
        });

        Mod.get = function(opts) {
            return new FilterOptions({collection: opts.collection});
        };
    });
})(TA, Backbone, Marionette, jQuery, _);