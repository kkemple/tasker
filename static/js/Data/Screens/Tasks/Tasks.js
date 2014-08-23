;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {

        var Task = Mod.DefaultTask.extend({
            defaults: {
                taskName: '',
                tags: [],
                count: 0,
                isRunning: false,
                isFiltered: false,
                createdAt: null
            }
        });

        var Tasks = Backbone.Collection.extend({
            model: Task,
            localStorage: new Backbone.LocalStorage('TaskCollection'),
            filters: [
                {id: 'taskName', label: 'Task Name'},
                {id: 'tags', label: 'Tag'}
            ],
            filterTasks: function(filter, term) {

                this.each(function(model) {
                    if (model.get(filter)) {
                        var toFilter = model.get(filter);

                        if (filter === 'tags') {
                            toFilter = toFilter.join(' ');
                        }

                        if (toFilter.toLowerCase().indexOf(term.toLowerCase()) > -1) {
                            model.set('isFiltered', false);
                        } else {
                            model.set('isFiltered', true);
                        }
                    }
                });
            }
        });

        var taskCollection = new Tasks();

        App.reqres.setHandler('tasks', function() {
            var deferred = new $.Deferred();
            taskCollection.fetch().always(function() {
                deferred.resolve(taskCollection);
            });

            return deferred.promise();
        });

        Mod.Task = Task;
        Mod.Tasks = Tasks;
    });
})(TA, Backbone, Marionette, $, _);