;(function(TA, Backbone, Marionette, jQuery, _) {
    "use strict";

    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {
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
                created: ''
            },
            initialize: function(attrs) {
                var self = this;

                //this.id = attrs.key;

                this.buildDisplayTime();

                this.on('change:isRunning', function() {
                    self.toggleRunning();
                });
            },
        });

        var JiraTasks = Backbone.Collection.extend({
            localStorage: new Backbone.LocalStorage('JiraTaskCollection'),
            model: JiraTask,
            filters: [
                {id: 'taskName', label: 'Task Name'},
                {id: 'status', label: 'Status'},
                {id: 'priority', label: 'Priority'},
                {id: 'key', label: 'Key'}
            ],
            initialize: function(models, options) {
                var self = this;

                this.jiraSettings = options.jiraSettings;
            },
            parseJiraJSON: function(data) {
                var tasks = [];

                if (data && data.issues) {
                    _(data.issues).each(function(issue) {

                        // exclude tickets that are closed and done
                        if (issue.fields.status.name !== 'Closed' &&
                            issue.fields.status.name !== 'Done' &&
                            issue.fields.status.name !== 'Resolved') {
                            tasks.push({
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
            fetchJiraJSON: function() {
                var self = this,
                    deferred = new $.Deferred();

                if (this.jiraSettings.get('hasLoginCreds')) {
                    var jiraUrl = this.jiraSettings.get('jiraUrl') +
                            'rest/api/2/search?jql=assignee=' +
                            this.jiraSettings.get('username') +
                            '&password=' +
                            this.jiraSettings.get('password');

                    $.get('jira/tasks?jiraUrl=' + encodeURIComponent(jiraUrl) + '&username=' + encodeURIComponent(this.jiraSettings.get('username')) + '&password=' + encodeURIComponent(this.jiraSettings.get('password')), function(data) {
                        var jiraKeys = [];

                        _(self.parseJiraJSON(JSON.parse(data))).each(function(modelAttrs) {
                            var model = self.findWhere({key: modelAttrs.key});

                            if (!model) {
                                self.add(modelAttrs, {merge: true});
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

        Mod.JiraTasks = JiraTasks;

    });

})(TA, Backbone, Marionette, jQuery, _);