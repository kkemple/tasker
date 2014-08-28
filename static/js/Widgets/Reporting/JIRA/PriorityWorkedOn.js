;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Widgets.Reporting.JIRA.Priority', function(Mod, App, Backbone, Marionette, $, _) {

        var WEEK = 60 * 60 * 25; // 40 hr work week
        var colors = App.Texts.get('colors');
        var colorKeys = App.Texts.get('colorKeys');

        var PriorityWorkedOnWidget = Marionette.ItemView.extend({
            template: 'Widgets/Reporting/JIRA/PrioritiesWorkedOn',
            className: 'widget priorities-weekly',
            ui: {
                $canvas: 'canvas'
            },
            initialize: function(opts) {
                var self = this;

                this.model = new Backbone.Model();
                this.loadCount = 0;

                App.request('stats:jira:priority').done(function(stats) {
                    self.collection = stats.thisWeek();
                    self.statsLoaded = true;

                    var priorities = {};

                    self.collection.each(function(m) {
                        if (!priorities[m.get('priority')]) {
                            priorities[m.get('priority')] = 0;
                        }

                        priorities[m.get('priority')]++;
                    });

                    self.model.set('priorities', _(priorities).map(function(p, key) {
                        return {label: key, value: p, color: colors[colorKeys[Math.floor(Math.random() * 13)]]};
                    }));
                });

            },
            onRender: function() {
                var self = this;

                if (this.statsLoaded) {

                    var ctx = this.ui.$canvas.get(0).getContext('2d');

                    this.chart = new Chart(ctx).PolarArea(this.model.get('priorities'), _({
                        segmentShowStroke : false
                    }).extend(App.Config.get('chartjs')));
                } else if (this.loadCount < 50) {
                    setTimeout(function() {
                        self.onRender();
                    }, 500);

                    this.loadCount++;
                }
            }
        });

        Mod.get = function() {
            return new PriorityWorkedOnWidget();
        };
    });
})(TA, Backbone, Marionette, jQuery, _);