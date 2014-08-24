;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Tasks', function(Mod, App, Backbone, Marionette, $, _) {

        var TasksView = Marionette.CompositeView.extend({
            template: 'Screens/Tasks/TasksView',
            itemViewContainer: '.tasks',
            itemView: Mod.TaskView,
            collectionEvents: {
                'add remove': 'renderTotal updateVisibility',
            },
            events: {
                'click .export': 'exportTasks'
            },
            ui: {
                $badge: '.tasks-title .badge'
            },
            onRender: function() {
                this.renderTotal();
                this.updateVisibility();
            },
            renderTotal: function() {
                this.ui.$badge.text(this.collection.length);
            },
            updateVisibility: function() {
                if (!this.collection.length) {
                    this.$el.hide();
                } else {
                    this.$el.show();
                }
            },
            exportTasks: function() {
                var json = this.collection.toJSON(),
                    url = 'data:text/json;charset=utf8,' + JSON.stringify(json),
                    link = document.createElement("a");

                link.setAttribute("href", url);
                link.setAttribute("download", "tasks.json");

                link.click();
            }
        });

        Mod.TasksView = TasksView;
    });
})(TA, Backbone, Marionette, jQuery, _);
