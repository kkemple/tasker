;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('JIRA', function(Mod, App, Backbone, Marionette, $, _) {

        var MainView = Marionette.Layout.extend({
            template: 'Screens/Jira/Tasks',
            regions: {
                settings: '.settings-region',
                tasks: '.tasks-region'
            },
            onRender: function() {
                var self = this;

                this.tasks.show(App.Loader.get());

                App.request('jiraSettings').done(function(jiraSettings) {
                    var settingsView = new Mod.SettingsView({model: jiraSettings});
                    self.settings.show(settingsView);
                });

                App.request('jiraTasks').done(function(tasksCollection) {
                    var tasks = new Mod.TasksView({collection: tasksCollection});
                    self.tasks.show(tasks);
                });
            }
        });

        Mod.MainView = MainView;

        Mod.addInitializer(function() {
            App.execute('registerScreen', {
                position: 2,
                screenKey: 'jira-tasks',
                iconClass: 'fa-rocket',
                anchorText: 'JIRA Tasks',
                initializer: function() {
                    TA.execute('showScreen', new MainView());
                }
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);