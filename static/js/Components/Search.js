;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Search', function(Mod, App, Backbone, Marionette, $, _) {

        var SearchOption = Marionette.ItemView.extend({
            template: 'Widgets/SearchFilterOption',
            tagName: 'option',
            onRender: function() {
                this.$el.attr('value', this.model.get('id'));
            }
        });

        var SearchOptions = Marionette.CollectionView.extend({
            tagName: 'select',
            id: 'tasks-search-filter',
            className: 'form-control',
            itemView: SearchOption,
            events: {
                'change': 'updateActiveFilter'
            },
            onRender: function() {
                this.updateActiveFilter();
            },
            updateActiveFilter: function() {
                this.collection.activeFilter = this.$el.val();
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

                    if (route === 'tasks') {
                        self.currentCollection = self.tasksCollection;
                    } else {
                        self.currentCollection = self.jiraTasksCollection;
                    }

                    self.optionsCollection = new Backbone.Collection(self.currentCollection.filters);
                    self.optionsCollectionView = new SearchOptions({collection: self.optionsCollection});
                    self.filterContainer.show(self.optionsCollectionView);
                });
            },
            filterTasks: function(e) {
                var self = this;

                if (e && e.which === 13) { e.preventDefault(); }

                if (this.timeoutId) { clearTimeout(this.timeoutId); }

                this.timeoutId = setTimeout(function() {
                    var term = self.ui.$search.val().trim(),
                        filter = self.optionsCollection.activeFilter;

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
