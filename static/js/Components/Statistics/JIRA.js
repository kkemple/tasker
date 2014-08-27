;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Statistics.JIRA', function(Mod, App, Backbone, Marionette, $, _) {

        // project worked on
        // time tracked
        // time logged
        // priority worked on
        // marked for today

        var StatsCollection = Backbone.Collection.extend({
            thisWeek: function() {
                var today = moment();
                var range = moment.range(moment(today).startOf('week'), moment(today).endOf('week'));

                return new StatsCollection(this.filter(function(m) {
                    return range.contains(moment(m.get('date')));
                }));
            }
        });

        var TimeTracked = Backbone.Model.extend({
            defaults: {
                taskName: '',
                key: '',
                count: 0,
                date: moment()
            }
        });

        var TimesTracked = StatsCollection.extend({
            localStorage: new Backbone.LocalStorage('Statistics.JIRA.TimeTracked'),
            model: TimeTracked
        });

        var timesTracked = new TimesTracked();

        timesTracked.fetch().always(function() {
            App.commands.setHandler('stats:jira:tracked', function(log) {
                timesTracked.create(log);
            });
        });

        App.reqres.setHandler('stats:jira:tracked', function() {
            var deferred = new $.Deferred();

            timesTracked.fetch().always(function() {
                deferred.resolve(timesTracked);
            });

            return deferred.promise();
        });

        /*****************************************/


        var TimeLogged = Backbone.Model.extend({
            defaults: {
                taskName: '',
                key: '',
                count: 0,
                date: moment()
            }
        });

        var TimesLogged = StatsCollection.extend({
            localStorage: new Backbone.LocalStorage('Statistics.JIRA.TimeLogged'),
            model: TimeLogged
        });

        var timesLogged = new TimesLogged();

        timesLogged.fetch().always(function() {
            App.commands.setHandler('stats:jira:logged', function(log) {
                timesLogged.create(log);
            });
        });

        App.reqres.setHandler('stats:jira:logged', function() {
            var deferred = new $.Deferred();

            timesLogged.fetch().always(function() {
                deferred.resolve(timesLogged);
            });

            return deferred.promise();
        });

        /*****************************************/


        var ProjectWorkedOn = Backbone.Model.extend({
            defaults: {
                taskName: '',
                key: '',
                project: '',
                date: moment()
            }
        });

        var ProjectsWorkedOn = StatsCollection.extend({
            localStorage: new Backbone.LocalStorage('Statistics.JIRA.ProjectWorkedOn'),
            model: ProjectWorkedOn
        });

        var projectsWorkedOn = new ProjectsWorkedOn();

        projectsWorkedOn.fetch().always(function() {
            App.commands.setHandler('stats:jira:project', function(log) {
                projectsWorkedOn.create(log);
            });
        });

        App.reqres.setHandler('stats:jira:project', function() {
            var deferred = new $.Deferred();

            projectsWorkedOn.fetch().always(function() {
                deferred.resolve(projectsWorkedOn);
            });

            return deferred.promise();
        });

        /*****************************************/


        var PriorityWorkedOn = Backbone.Model.extend({
            defaults: {
                taskName: '',
                key: '',
                priority: '',
                date: moment()
            }
        });

        var PrioritiesWorkedOn = StatsCollection.extend({
            localStorage: new Backbone.LocalStorage('Statistics.JIRA.PriorityWorkedOn'),
            model: PriorityWorkedOn
        });

        var prioritiesWorkedOn = new PrioritiesWorkedOn();

        prioritiesWorkedOn.fetch().always(function() {
            App.commands.setHandler('stats:jira:priority', function(log) {
                prioritiesWorkedOn.create(log);
            });
        });

        App.reqres.setHandler('stats:jira:priority', function() {
            var deferred = new $.Deferred();

            prioritiesWorkedOn.fetch().always(function() {
                deferred.resolve(prioritiesWorkedOn);
            });

            return deferred.promise();
        });

        /*****************************************/


        var StatusWorkedOn = Backbone.Model.extend({
            defaults: {
                taskName: '',
                key: '',
                status: '',
                date: moment()
            }
        });

        var StatusesWorkedOn = StatsCollection.extend({
            localStorage: new Backbone.LocalStorage('Statistics.JIRA.StatusWorkedOn'),
            model: StatusWorkedOn
        });

        var statusesWorkedOn = new StatusesWorkedOn();

        statusesWorkedOn.fetch().always(function() {
            App.commands.setHandler('stats:jira:status', function(log) {
                statusesWorkedOn.create(log);
            });
        });

        App.reqres.setHandler('stats:jira:status', function() {
            var deferred = new $.Deferred();

            statusesWorkedOn.fetch().always(function() {
                deferred.resolve(statusesWorkedOn);
            });

            return deferred.promise();
        });

        /*****************************************/

    });
})(TA, Backbone, Marionette, jQuery, _);