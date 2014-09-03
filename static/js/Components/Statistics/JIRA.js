;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * @module Statistics
     * @namespace  TA
     * @main  Statistics
     */
    TA.module('Statistics.JIRA', function(Mod, App, Backbone, Marionette, $, _) {


        /**
         * ## StatsCollection
         *
         * The default class that all stats collections should extend from
         * Offers helper functions to filter the collection
         *
         * @class StatsCollection
         * @constructor
         * @namespace TA.Statistics
         * @extends Backbone.Collection
         * @private
         */
        var StatsCollection = Backbone.Collection.extend({
            thisWeek: function() {
                var today = moment();
                var range = moment.range(moment(today).startOf('week'), moment(today).endOf('week'));

                return new StatsCollection(this.filter(function(m) {
                    return range.contains(moment(m.get('date')));
                }));
            }
        });

        /**
         * ## JiraStat
         *
         * Proxy Model class, placeholder in case we need stat specific model functionality
         *
         * @class JiraStat
         * @constructor
         * @namespace TA.Statistics
         * @extends Backbone.Model
         * @private
         */
        var JiraStat = Backbone.Model.extend({});


        /**
         * ## TimeTracked
         *
         * Model behind each time tracked statistic
         *
         * @class TimeTracked
         * @constructor
         * @namespace TA.Statistics
         * @extends JiraStat
         * @private
         */
        var TimeTracked = JiraStat.extend({
            defaults: {
                taskName: '',
                key: '',
                count: 0,
                date: moment()
            }
        });

        /**
         * ## TimesTracked
         *
         * Collection behind all time tracked statistics models
         *
         * @class TimesTracked
         * @constructor
         * @namespace TA.Statistics
         * @extends StatsCollection
         * @private
         */
        var TimesTracked = StatsCollection.extend({
            url: '/stats/jira/tracked',
            model: TimeTracked
        });

        // set up handlers
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

        /**
         * ## TimeLogged
         *
         * Model behind each time logged statistic
         *
         * @class TimeLogged
         * @constructor
         * @namespace TA.Statistics
         * @extends JiraStat
         * @private
         */
        var TimeLogged = JiraStat.extend({
            defaults: {
                taskName: '',
                key: '',
                count: 0,
                date: moment()
            }
        });

        /**
         * ## TimesLogged
         *
         * Collection behind all time logged statistics models
         *
         * @class TimesLogged
         * @constructor
         * @namespace TA.Statistics
         * @extends StatsCollection
         * @private
         */
        var TimesLogged = StatsCollection.extend({
            url: '/stats/jira/logged',
            model: TimeLogged
        });

        // add handlers
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

        /**
         * ## ProjectWorkedOn
         *
         * Model behind each project statistic
         *
         * @class ProjectWorkedOn
         * @constructor
         * @namespace TA.Statistics
         * @extends JiraStat
         * @private
         */
        var ProjectWorkedOn = JiraStat.extend({
            defaults: {
                taskName: '',
                key: '',
                project: '',
                date: moment()
            }
        });

        /**
         * ## ProjectsWorkedOn
         *
         * Collection behind all project statistics models
         *
         * @class ProjectsWorkedOn
         * @constructor
         * @namespace TA.Statistics
         * @extends StatsCollection
         * @private
         */
        var ProjectsWorkedOn = StatsCollection.extend({
            url: '/stats/jira/project',
            model: ProjectWorkedOn
        });

        // add handlers
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

        /**
         * ## PriorityWorkedOn
         *
         * Model behind each priority statistic
         *
         * @class PriorityWorkedOn
         * @constructor
         * @namespace TA.Statistics
         * @extends JiraStat
         * @private
         */
        var PriorityWorkedOn = JiraStat.extend({
            defaults: {
                taskName: '',
                key: '',
                priority: '',
                date: moment()
            }
        });

        /**
         * ## PrioritiesWorkedOn
         *
         * Collection behind all prioriy statistics models
         *
         * @class PrioritiesWorkedOn
         * @constructor
         * @namespace TA.Statistics
         * @extends StatsCollection
         * @private
         */
        var PrioritiesWorkedOn = StatsCollection.extend({
            url: '/stats/jira/priority',
            model: PriorityWorkedOn
        });

        // add handlers
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

        /**
         * ## StatusWorkedOn
         *
         * Model behind each status statistic
         *
         * @class StatusWorkedOn
         * @constructor
         * @namespace TA.Statistics
         * @extends JiraStat
         * @private
         */
        var StatusWorkedOn = JiraStat.extend({
            defaults: {
                taskName: '',
                key: '',
                status: '',
                date: moment()
            }
        });

        /**
         * ## StatusesWorkedOn
         *
         * Collection behind all status statistics models
         *
         * @class StatusesWorkedOn
         * @constructor
         * @namespace TA.Statistics
         * @extends StatsCollection
         * @private
         */
        var StatusesWorkedOn = StatsCollection.extend({
            url: '/stats/jira/status',
            model: StatusWorkedOn
        });

        // add handlers
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