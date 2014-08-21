;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Tasks', function(Mod, App, Backbone, Marionette, $, _) {

        var TasksView = Marionette.CompositeView.extend({
            template: 'Screens/Tasks/TaskCollectionView',
            itemViewContainer: '.tasks',
            itemView: Mod.TaskView,
            collectionEvents: {
                'add remove': 'renderTotal'
            },
            ui: {
                $badge: '.tasks-title .badge'
            },
            onRender: function() {
                this.renderTotal();
            },
            renderTotal: function() {
                this.ui.$badge.text(this.collection.length);
            }
        });

        Mod.TasksView = TasksView;
    });
})(TA, Backbone, Marionette, jQuery, _);
