;(function(TA, Backbone, Marionette, jQuery, _) {
    "use strict";

    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {
        var JiraTask = App.Data.Task.extend({
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
            sync: function() { return false; }
        });

        var JiraTasks = App.Data.Tasks.extend({
            url: 'jira/tasks',
            localStorage: new Backbone.LocalStorage('JiraTaskCollection'),
            model: JiraTask,
            filters: [
                {id: 'taskName', label: 'Task Name'},
                {id: 'status', label: 'Status'},
                {id: 'priority', label: 'Priority'},
                {id: 'key', label: 'Key'}
            ],
            parse: function(data) {
                var tasks = [];

                if (data && data.issues) {
                    _(data.issues).each(function(issue) {

                        // exclude tickets that are closed and done
                        if (issue.fields.status.name !== 'Closed' && issue.fields.status.name !== 'Done') {
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
            fetch: function() {
                var self = this,
                    deferred = new $.Deferred();

                if (this.jiraSettings.get('hasLoginCreds')) {
                    var jiraUrl = this.jiraSettings.get('jiraUrl') +
                            'rest/api/2/search?jql=assignee=' +
                            this.jiraSettings.get('username') +
                            '&password=' +
                            this.jiraSettings.get('password');

                    $.get(this.url + '?jiraUrl=' + encodeURIComponent(jiraUrl) + '&username=' + encodeURIComponent(this.jiraSettings.get('username')) + '&password=' + encodeURIComponent(this.jiraSettings.get('password')), function(data) {
                        self.set(self.parse(JSON.parse(data)));
                        deferred.resolve();
                    });
                } else {
                    deferred.resolve();
                }

                return deferred.promise();
            },
            initialize: function(models, options) {
                this.jiraSettings = options.jiraSettings;
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

                jiraTasks.fetch().always(function() {
                    deferred.resolve(jiraTasks);
                });

                return deferred.promise();
            });
        });

        Mod.JiraTasks = JiraTasks;

    });

})(TA, Backbone, Marionette, jQuery, _);