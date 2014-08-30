;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Widgets.Reporting.JIRA.TimeTracked', function(Mod, App, Backbone, Marionette, $, _) {

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
                this.userSettings = opts.userSettings;

                var timetracked = 0;

                this.collection.each(function(m) {
                    timetracked += m.get('count');
                });

                this.model.set('workWeek', this.userSettings.get('hoursPerWorkWeek'));
                var secondCount = (this.model.get('workWeek') * 60) * 60;

                this.model.set('tracked', Math.round((timetracked / secondCount) * 100));
                this.model.set('untracked', Math.round(((secondCount - timetracked) / secondCount) * 100));

                var time = App.DateTime.parseSeconds(timetracked);
                this.model.set('hours', time.hour);
                this.model.set('minutes', time.minute);
                this.model.set('seconds', time.second);
            },
            onRender: function() {
                var self = this;

                var data = [
                    {value: this.model.get('tracked'), color: colors.info, label: 'Time Tracked'},
                    {value: this.model.get('untracked'), color: colors.danger, label: 'Time Not Tracked'}
                ];
                var ctx = this.ui.$canvas.get(0).getContext('2d');

                this.chart = new Chart(ctx).Doughnut(data, _({
                    segmentStrokeWidth: 1,
                    segmentStrokeColor: '#3e3634',
                    percentageInnerCutout : 45,
                    tooltipTemplate: "<%if (label){%><%=label%>: <%}%><%= value %>%"
                }).extend(App.Config.get('chartjs')));
            }
        });

        Mod.get = function(opts) {
            return new TimeTrackedThisWeekWidget(opts);
        };
    });
})(TA, Backbone, Marionette, jQuery, _);