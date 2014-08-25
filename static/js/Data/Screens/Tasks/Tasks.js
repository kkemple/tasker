;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * @module Data
     * @namespace  TA
     *
     */
    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## Task
         *
         * The model behind each custom task
         *
         * @class Task
         * @constructor
         * @namespace TA.Data
         * @extends Data.DefaultTask
         * @public
         */
        var Task = Mod.DefaultTask.extend({
            defaults: {
                taskName: '',
                tags: [],
                count: 0,
                isRunning: false,
                isFiltered: false,
                today: false,
                createdAt: null
            }
        });

        /**
         * ## Tasks
         *
         * The collection of all custom tasks
         *
         * @class Tasks
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Collection
         * @public
         */
        var Tasks = Backbone.Collection.extend({
            model: Task,
            localStorage: new Backbone.LocalStorage('TaskCollection'),
            filters: [
                {id: 'taskName', label: 'Task Name'},
                {id: 'tags', label: 'Tag'}
            ],

            /**
             * Responsible for setting the `isFiltered` property on it's models,
             * determined by the filter type (model property), and the filter term (what to match)
             *
             * @method  filterTasks
             * @param  {String} filter the model property to check against
             * @param  {String} term   the string to match agains model property
             * @public
             */
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