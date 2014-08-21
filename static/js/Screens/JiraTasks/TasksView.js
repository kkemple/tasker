;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('JIRA', function(Mod, App, Backbone, Marionette, $, _) {
        var TasksView = App.Tasks.TasksView.extend({
            template: 'Screens/JIRA/TasksView',
            itemViewContainer: '.jira-tasks',
            itemView: Mod.TaskView,
            collectionEvents: function() {
                return _.extend(App.Tasks.TasksView.prototype.collectionEvents || {}, {
                    'sorted': 'render'
                });
            },
            events: function() {
                return _.extend(App.Tasks.TasksView.prototype.events || {}, {
                    'click .sorter': 'sortTasks'
                });
            },
            ui: function() {
                return _.extend(App.Tasks.TasksView.prototype.ui || {}, {
                    $sorters: '.sorter'
                });
            },
            initialize: function() {
                this.model = new Backbone.Model();
            },
            onRender: function() {
                this.updateUI();
            },
            updateUI: function() {
                if (this.model.get('sorter')) {
                    var $target = this.$('a[data-sorter="' + this.model.get('sorter') + '"]');

                    if (this.model.get('sortOrder') === 'asc') {
                        $target.children('i').removeClass('fa-sort-asc').addClass('fa-sort-desc');
                    } else if (this.model.get('sortOrder') === 'desc') {
                        $target.children('i').removeClass('fa-sort-desc').addClass('fa-sort-asc');
                    }
                }
            },
            sortTasks: function(e) {
                e.preventDefault();

                var $target = $(e.target).parent(),
                    sorter = $target.attr('data-sorter'),
                    order = $target.attr('data-sortorder');

                var sorted = _(this.collection.models).sortBy(function(model) {
                    return model.get(sorter);
                });

                if (this.model.get('sortOrder') === 'asc') {
                    sorted.reverse();
                    this.model.set('sortOrder', 'desc');
                } else if (this.model.get('sortOrder') === 'desc') {
                    this.model.set('sortOrder', 'asc');
                } else {
                    this.model.set('sortOrder', 'asc');
                }

                this.model.set('sorter', sorter);

                this.collection.reset(sorted);
                this.collection.trigger('sorted');
            }
        });

        Mod.TasksView = TasksView;
    });
})(TA, Backbone, Marionette, jQuery, _);