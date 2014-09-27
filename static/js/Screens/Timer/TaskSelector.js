;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Timer', function(Mod, App, Backbone, Marionette, $, _) {

        var getDisplayText = function(model) {
            return model.get('key') + ': ' + model.get('taskName').substring(0, 30) + '...';
        };

        var TaskOption = Marionette.ItemView.extend({
            template: 'Screens/Timer/TaskOption',
            tagName: 'li',
            className: 'list-group-item',
            templateHelpers: function() {
                var displayText = getDisplayText(this.model);

                return {
                    displayText: displayText
                };
            },
            events: {
                'click': 'notify',
            },
            modelEvents: {
                'change:isFiltered': 'toggleVisibility'
            },
            ui: {
                $taskInfo: '.task-info'
            },
            onRender: function() {
                var self = this;

                this.ui.$taskInfo.popover({
                    html: true,
                    content: function() {
                        var template = _.template(
                            '<div class="well">URL: <a href="<%= jiraUrl %>"><%= jiraUrl %></a></div>' +
                            '<div class="well">KEY: <%= key %></div>' +
                            '<div class="well">STATUS: <%= status %></div>' +
                            '<div class="well">PRIORITY: <%= priority %></div>'
                        );

                        return template(self.model.toJSON());
                    },
                    title: this.model.get('key'),
                    trigger: 'hover',
                    container: 'body'
                });
            },
            toggleVisibility: function() {
                var showHide = (this.model.get('isFiltered')) ? 'hide' : 'show';

                this.$el[showHide]();
            },
            notify: function(e) {
                e.preventDefault();

                this.trigger('selected');
            }
        });

        var TaskSelector = Marionette.CompositeView.extend({
            template: 'Screens/Timer/TaskSelector',
            itemViewContainer: '.list-group',
            itemView: TaskOption,
            ui: {
                $options: '.filter-options',
                $currentTask: '.current-task',
                $menu: '.menu',
                $tasksFilter: '.tasks-filter'
            },
            events: {
                'keydown .tasks-filter': 'filterTasks',
                'click .text': 'showMenu',
                'click .close-container i': 'clearMenu',
                'click .list-group-item': 'fireChange'
            },
            initialize: function() {
                var self = this;

                this.model = new Backbone.Model({
                    filter: 'taskName'
                });

                this.on('itemview:selected', function(view) {
                    self.ui.$currentTask.find('.text').text(getDisplayText(view.model));
                    self.collection.trigger('task:selected', view.model);
                    self.clearMenu();
                });
            },
            onRender: function() {
                var self = this;

                var filterOptions = new App.Data.FiltersCollection(this.collection.filters);

                this.listenTo(filterOptions, 'active:changed', function() {
                    self.model.set('filter', filterOptions.findWhere({isActive: true}).get('id'));
                });

                this.ui.$options.append(new App.FilterOptions.get({collection: filterOptions}).render().$el);

                this.ui.$currentTask.find('.text').text(getDisplayText(this.collection.at(0)));
            },
            filterTasks: function(e) {
                var self = this;

                if (e && e.which === 13) { e.preventDefault(); }

                if (this.timeoutId) { clearTimeout(this.timeoutId); }

                this.timeoutId = setTimeout(function() {
                    var term = self.ui.$tasksFilter.val().trim();

                    self.collection.filterTasks(self.model.get('filter'), term);
                }, 500);
            },
            showMenu: function(e) {
                e.preventDefault();
                e.stopPropagation();

                this.ui.$menu.show();
            },
            clearMenu: function(e) {
                this.ui.$menu.hide();
                this.ui.$tasksFilter.val('').trigger('change');
                this.collection.filterTasks(this.model.get('filter'), '');

                if (e) {
                    e.preventDefault();
                    e.stopPropagation();
                }
            }
        });

        Mod.TaskSelector = TaskSelector;
    });
})(TA, Backbone, Marionette, jQuery, _);