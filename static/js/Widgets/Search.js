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
                self.filterContainer.show(App.Loader.get());

                $.when(App.request('tasks'), App.request('jiraTasks')).done(function(tasks, jiraTasks) {
                    self.tasksCollection = tasks;
                    self.jiraTasksCollection = jiraTasks;
                    self.route = route;

                    if (route === 'tasks') {
                        self.currentCollection = self.tasksCollection;
                    } else {
                        self.currentCollection = self.jiraTasksCollection;
                    }

                    self.optionsCollection = new App.Data.FiltersCollection(self.currentCollection.filters);

                    self.listenTo(self.optionsCollection, 'active:changed', self.filterTasks);

                    self.optionsCollectionView = new App.FilterOptions.get({collection: self.optionsCollection});
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
