;(function(TA, Backbone, Marionette, jQuery, _) {
    "use strict";


    /**
     * @module Data
     * @namespace  TA
     *
     */
    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## JiraTask
         *
         * The model behind each JIRA task
         *
         * @class JiraTask
         * @constructor
         * @namespace TA.Data
         * @extends Data.DefaultTask
         * @public
         */
        var JiraTask = Mod.DefaultTask.extend({
            defaults: {
                key: '',
                taskName: '',
                status: '',
                priority: '',
                project: '',
                count: 0,
                isRunning: false,
                isVisible: true,
                isFiltered: false,
                today: false,
                created: '',
                jiraUrl: ''
            }
        });

        /**
         * ## JiraTasks
         *
         * The collection of all JIRA tasks
         *
         * @class JiraTasks
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Collection
         * @public
         */
        var JiraTasks = Backbone.Collection.extend({
            localStorage: new Backbone.LocalStorage('JiraTaskCollection'),
            model: JiraTask,
            filters: [
                {id: 'taskName', label: 'Task Name'},
                {id: 'key', label: 'Key'},
                {id: 'status', label: 'Status'},
                {id: 'priority', label: 'Priority'}
            ],
            initialize: function(models, options) {
                var self = this;
                this.jiraSettings = options.jiraSettings;
            },

            /**
             * Responsible for parsing return JSON from JIRA to mutate to a jira task config object
             *
             * @method  parseJiraJSON
             * @param  {JSON} data the return JSON from JIRA
             * @return {Array}      an array of mutated objects ready to be added to a JiraTasks collection
             * @public
             */
            parseJiraJSON: function(data) {
                var self = this,
                    tasks = [];

                try {
                    data = JSON.parse(data);
                } catch (e) {
                    TA.Growler.growl({
                        type: 'danger',
                        title: 'Fetch Error (JIRA)',
                        message: 'Failed to fetch JIRA tasks. Check console for more information.',
                        isSticky: true
                    });

                    console.warn('ERROR :: Failed to fetch JIRA tasks ::', e);
                    return tasks;
                }

                if (data && data.issues) {
                    _(data.issues).each(function(issue) {

                        // exclude tickets that are closed and done
                        if (issue.fields.status.name !== 'Closed' &&
                            issue.fields.status.name !== 'Done' &&
                            issue.fields.status.name !== 'Resolved') {
                            tasks.push({
                                jiraId: issue.id,
                                jiraApiUrl: issue.self,
                                jiraUrl: self.jiraSettings.get('jiraUrl') + 'browse/' + issue.key,
                                key: issue.key,
                                taskName: issue.fields.summary,
                                status: issue.fields.status.name,
                                priority: issue.fields.priority.name,
                                project: issue.fields.project.name,
                                created: issue.fields.created
                            });
                        }
                    });
                } else {
                    tasks = data;
                }

                return tasks;
            },

            /**
             * Responsible for fetching JIRA tasks JSON, and adding return tasks to the collection
             *
             * @method  fetchJiraJSON
             * @return {Promise} a promise that is resolved once the tasks have been parsed and added to the collection
             * @public
             */
            fetchJiraJSON: function() {
                var self = this,
                    deferred = new $.Deferred();

                if (this.jiraSettings.get('hasLoginCreds')) {

                    var data = {
                        jiraUrl: this.jiraSettings.get('jiraUrl'),
                        queryParams: [
                            'rest/api/2/search?jql=assignee=',
                            this.jiraSettings.get('username'),
                            '+order+by+updated',
                            '&maxResults=150',
                            '&password=',
                            this.jiraSettings.get('password')
                        ].join(''),
                        username: this.jiraSettings.get('username'),
                        password: this.jiraSettings.get('password')
                    };

                    $.ajax({
                        url: 'jira/tasks',
                        type: 'POST',
                        contentType: 'application/json',
                        data: JSON.stringify(data)
                    }).done(function(data) {
                        var jiraKeys = [];

                        _(self.parseJiraJSON(data)).each(function(modelAttrs) {
                            var model = self.findWhere({key: modelAttrs.key});

                            if (!model) {
                                self.add(modelAttrs, {merge: true});
                            } else {
                                model.set({
                                    priority: modelAttrs.priority,
                                    status: modelAttrs.status,
                                    taskName: modelAttrs.taskName,
                                    project: modelAttrs.project
                                });
                                model.save();
                            }

                            jiraKeys.push(modelAttrs.key);
                        });

                        self.each(function(model) {
                            if (_.indexOf(jiraKeys, model.get('key')) === -1) {
                                model.destroy();
                            }
                        });

                        deferred.resolve();
                        self.trigger('jira:loaded');
                    });
                } else {
                    deferred.resolve();
                    self.trigger('jira:loaded');
                }

                return deferred.promise();
            },

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
                        if (toFilter.toLowerCase().indexOf(term.toLowerCase()) > -1) {
                            model.set('isFiltered', false);
                        } else {
                            model.set('isFiltered', true);
                        }
                    }
                });
            }
        });

        App.request('jiraSettings').done(function(jiraSettings) {
            var jiraTasks = new JiraTasks([], {jiraSettings: jiraSettings});

            App.reqres.setHandler('jiraTasks', function() {
                var deferred = new $.Deferred();

                jiraTasks.fetch().done(function() {
                    jiraTasks.fetchJiraJSON().done(function() {
                        deferred.resolve(jiraTasks);
                    });
                });

                return deferred.promise();
            });
        });

        Mod.JiraTask = JiraTask;
        Mod.JiraTasks = JiraTasks;

    });

})(TA, Backbone, Marionette, jQuery, _);