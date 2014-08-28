;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Widgets.Reporting.JIRA.TimeTracked', function(Mod, App, Backbone, Marionette, $, _) {

        var WEEK = 60 * 60 * 25; // 40 hr work week
        var colors = App.Texts.get('colors');

        var TimeTrackedThisWeekWidget = Marionette.ItemView.extend({
            template: 'Widgets/Reporting/JIRA/TimeTrackedWeek',
            className: 'widget time-tracked-weekly',
            ui: {
                $canvas: 'canvas'
            },
            initialize: function(opts) {
                var self = this;

                this.model = new Backbone.Model();
                this.loadCount = 0;

                App.request('stats:jira:tracked').done(function(stats) {
                    self.collection = stats.thisWeek();
                    self.statsLoaded = true;

                    var timetracked = 0;

                    self.collection.each(function(m) {
                        timetracked += m.get('count');
                    });

                    self.model.set('tracked', timetracked);
                    self.model.set('untracked', WEEK - timetracked);

                    var time = App.DateTime.parseSeconds(timetracked);
                    self.model.set('hours', time.hour);
                    self.model.set('minutes', time.minute);
                    self.model.set('seconds', time.second);
                });

            },
            onRender: function() {
                var self = this;

                if (this.statsLoaded) {

                    var data = [
                        {value: this.model.get('tracked'), color: colors.info, label: 'Time Tracked'},
                        {value: this.model.get('untracked'), color: colors.red, label: 'Time Not Tracked'}
                    ];
                    var ctx = this.ui.$canvas.get(0).getContext('2d');

                    this.chart = new Chart(ctx).Doughnut(data, _({
                        segmentShowStroke : false,
                        percentageInnerCutout : 45,
                        //segmentStrokeWidth : 1
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
            return new TimeTrackedThisWeekWidget();
        };
    });
})(TA, Backbone, Marionette, jQuery, _);