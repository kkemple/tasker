;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Search', function(Mod, App, Backbone, Marionette, $, _) {

        var Filter = Backbone.Model.extend({
            defaults: {
                isActive: false
            }
        });

        var Filters = Backbone.Collection.extend({
            model: Filter,
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
            updateActiveFilter: function() {
                this.collection.setActive(this.$el.val());
                this.collection.trigger('active:changed');
            }
        });

        var SearchView = Marionette.Layout.extend({
            template: 'Widgets/Search',
            tagName: 'span',
            events: {
                'keydown #tasks-search': 'filterTasks'
            },
            ui: {
                $search: '#tasks-search',
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

                    self.optionsCollection = new Filters(self.currentCollection.filters);

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
            updateForm: function(activeSearch) {
                this.ui.$search.val(activeSearch.term);
                this.optionsCollection.setActive(activeSearch.filter);
            },
            filterTasks: function(e) {
                var self = this;

                if (e && e.which === 13) { e.preventDefault(); }

                if (this.timeoutId) { clearTimeout(this.timeoutId); }

                this.timeoutId = setTimeout(function() {
                    var term = self.ui.$search.val().trim(),
                        filter = self.optionsCollection.findWhere({isActive: true}).get('id');

                    if (term === '') {
                        self.model.set(self.route, undefined);
                    } else {
                        self.model.set(self.route, {
                            term: term,
                            filter: filter
                        });
                    }

                    self.currentCollection.filterTasks(filter, term);
                }, 500);
            }
        });

        Mod.get = function(model) {
            model = model || App.Data.Search;
            return new SearchView({model: model});
        };
    });
})(TA, Backbone, Marionette, jQuery, _);
