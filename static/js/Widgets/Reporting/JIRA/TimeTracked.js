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

                this.collection = opts.collection;
                this.statsLoaded = true;

                var timetracked = 0;

                this.collection.each(function(m) {
                    timetracked += m.get('count');
                });

                this.model.set('tracked', timetracked);
                this.model.set('untracked', WEEK - timetracked);

                var time = App.DateTime.parseSeconds(timetracked);
                this.model.set('hours', time.hour);
                this.model.set('minutes', time.minute);
                this.model.set('seconds', time.second);
            },
            onRender: function() {
                var self = this;

                var data = [
                    {value: this.model.get('tracked'), color: colors.info, label: 'Time Tracked'},
                    {value: this.model.get('untracked'), color: colors.red, label: 'Time Not Tracked'}
                ];
                var ctx = this.ui.$canvas.get(0).getContext('2d');

                this.chart = new Chart(ctx).Doughnut(data, _({
                    //segmentShowStroke : false,
                    segmentStrokeWidth: 1,
                    segmentStrokeColor: '#3e3634',
                    percentageInnerCutout : 45,
                    //segmentStrokeWidth : 1
                }).extend(App.Config.get('chartjs')));
            }
        });

        Mod.get = function(opts) {
            return new TimeTrackedThisWeekWidget(opts);
        };
    });
})(TA, Backbone, Marionette, jQuery, _);