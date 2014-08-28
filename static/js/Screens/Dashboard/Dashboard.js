;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * ## Screens
     * The Screens module holds all registered screens for the app.
     * A screen is a contained component of the UI that gets loaded in to the app's main region or view.
     * When you register a screen it is automatically added to the sidebar for you.
     *
     * Screens are registered by executing the `registerScreen` command on the App object
     *
     *      App.execute('registerScreen', {
     *          position: 1, // the position it will take in the sidebar
     *          screenKey: 'dashboard', // the url to navigate to
     *          iconClass: 'fa-dashboard', // font-awesome icon class
     *          anchorText: 'Dashboard', // sidebar link text
     *
     *          // the initializer for your screen,
     *          // should return an instance of the top level view of your screen
     *          initializer: function() {
     *              return new DashboardView();
     *          }
     *      });
     *
     *
     * @module Screens
     * @namespace  TA
     *
     */
    TA.module('Screens.Dashboard', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## DashboardView
         *
         *  The dashboard view provides quick links to tasks and JIRA tasks,
         *  it contains reporting widgets when signed in to JIRA
         *
         * @class DashboardView
         * @constructor
         * @namespace TA.Screens.Dashboard
         * @extends Marionette.ItemView
         * @public
         */
        var DashboardView = Marionette.Layout.extend({
            template: 'Screens/Dashboard/Main',
            regions: {
                timeTrackedWeekly: '.time-tracked-weekly',
                timeLoggedWeekly: '.time-logged-weekly',
                projectsWeekly: '.projects-weekly',
                prioritiesWeekly: '.priorities-weekly'
            },
            ui: {
                $intro: '.intro',
                $widgets: '.widgets'
            },
            onRender: function() {
                var self = this;

                App.request('jiraSettings').done(function(jSettings) {
                    if (jSettings.get('hasLoginCreds')) {
                        self.ui.$intro.hide();

                        App.request('stats:jira:tracked').done(function(stats) {
                            self.timeTrackedWeekly.show(App.Widgets.Reporting.JIRA.TimeTracked.get({
                                model: new Backbone.Model(),
                                collection: stats.thisWeek()
                            }));
                        });

                        App.request('stats:jira:logged').done(function(stats) {
                            self.timeLoggedWeekly.show(App.Widgets.Reporting.JIRA.TimeLogged.get({
                                model: new Backbone.Model(),
                                collection: stats.thisWeek()
                            }));
                        });

                        App.request('stats:jira:priority').done(function(stats) {
                            self.prioritiesWeekly.show(App.Widgets.Reporting.JIRA.Priority.get({
                                model: new Backbone.Model(),
                                collection: stats.thisWeek()
                            }));
                        });

                        App.request('stats:jira:project').done(function(stats) {
                            self.projectsWeekly.show(App.Widgets.Reporting.JIRA.ProjectsWorkedOn.get({
                                model: new Backbone.Model(),
                                collection: stats.thisWeek()
                            }));
                        });
                    }
                });
            }
        });

        Mod.DashboardView = DashboardView;

        Mod.addInitializer(function() {
            App.execute('registerScreen', {
                position: 1,
                screenKey: 'dashboard',
                iconClass: 'fa-dashboard',
                anchorText: 'Dashboard',
                initializer: function() {
                    return new DashboardView();
                }
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);
