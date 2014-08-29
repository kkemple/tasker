;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * ## Search
     * The Search module is responsible for handling all task searches
     *
     * It has a `get()` method that will return an instance of SearchView, it takes no options
     *
     *      var search = TA.Search.get();
     *      someLayout.someRegion.show(search);
     *
     * @module Search
     * @namespace  TA
     *
     */
    TA.module('Search', function(Mod, App, Backbone, Marionette, $, _) {

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

        /**
         * ## SearchView
         *
         * The layout that is rendered when a search view is requested
         *
         * @class  SearchView
         * @namespace TA.Search
         * @extends Marionette.Layout
         * @private
         */
        var SearchView = Marionette.Layout.extend({
            template: 'Widgets/Search',
            tagName: 'span',
            className: 'search-view',
            events: {
                'keydown #tasks-search': 'filterTasks',
                'click .remove-search': 'removeSearch'
            },
            ui: {
                $search: '#tasks-search',
                $removeSearch: '.remove-search'
            },
            regions: {
                filterContainer: '.filter-container'
            },
            initialize: function() {
                var self = this;

                this.model = new Backbone.Model();

                this.listenTo(App.router, 'route', function(route) {
                    if (route === 'jira-tasks' || route === 'tasks') {
                        self.initSearch(route);
                        self.$el.show();
                    } else {
                        self.$el.hide();
                    }
                });
            },

            /**
             * Responsible for running a search
             *
             * @method initSearch
             * @param  {String} route the route that triggered initSearch to be fired
             * @public
             */
            initSearch: function(route) {
                var self = this;

                $.when(App.request('tasks'), App.request('jiraTasks')).done(function(tasks, jiraTasks) {
                    self.tasksCollection = tasks;
                    self.jiraTasksCollection = jiraTasks;
                    self.route = route;

                    if (route === 'tasks') {
                        self.currentCollection = self.tasksCollection;
                    } else {
                        self.currentCollection = self.jiraTasksCollection;
                    }

                    self.optionsCollection = new FiltersCollection(self.currentCollection.filters);

                    self.listenTo(self.optionsCollection, 'active:changed', self.filterTasks);

                    self.optionsCollectionView = new FilterOptions({collection: self.optionsCollection});
                    self.filterContainer.show(self.optionsCollectionView);

                    if (self.model.get(route)) {
                        self.updateForm(self.model.get(route));
                        self.filterTasks();
                    } else {
                        self.ui.$search.val('');
                    }
                });
            },

            /**
             * Responsible for updating form values
             *
             * @method updateForm
             * @public
             */
            updateForm: function(activeSearch) {
                this.ui.$search.val(activeSearch.term);
                this.optionsCollection.setActive(activeSearch.filter);
            },

            /**
             * Called when the remove search icon is clicked
             * Responsible for clearing the form to the default values
             *
             * @method  removeSearch
             * @public
             */
            removeSearch: function() {
                this.updateForm({
                    term: '',
                    filter: 'taskName'
                });
                this.filterTasks();
            },

            /**
             * Responsible for prepping form data and passing to collection fitlerTasks method
             *
             * @method  filterTasks
             * @param  {Event} e the DOM event object
             * @public
             */
            filterTasks: function(e) {
                var self = this;

                if (e && e.which === 13) { e.preventDefault(); }

                if (this.timeoutId) { clearTimeout(this.timeoutId); }

                this.timeoutId = setTimeout(function() {
                    var term = self.ui.$search.val().trim(),
                        filter = self.optionsCollection.findWhere({isActive: true}).get('id');

                    if (term === '') {
                        self.model.set(self.route, undefined);
                        self.ui.$removeSearch.hide();
                    } else {
                        self.model.set(self.route, {
                            term: term,
                            filter: filter
                        });

                        self.ui.$removeSearch.show();
                    }

                    self.currentCollection.filterTasks(filter, term);
                }, 500);
            }
        });

        Mod.get = function() {
            return new SearchView();
        };
    });
})(TA, Backbone, Marionette, jQuery, _);
