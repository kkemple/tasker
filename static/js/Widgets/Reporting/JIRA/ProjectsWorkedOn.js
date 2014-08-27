;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Widgets.Reporting.JIRA.ProjectsWorkedOn', function(Mod, App, Backbone, Marionette, $, _) {

        var WEEK = 60 * 60 * 25; // 40 hr work week
        var colors = {
            warning: '#f0ad4e',
            info: '#5bc0de',
            danger: '#d9534f',
            success: '#5cb85c'
        };
        var colorKeys = ['warning', 'info', 'danger', 'success'];
        var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        var ProjectsWorkedOnWidget = Marionette.ItemView.extend({
            template: 'Widgets/Reporting/JIRA/ProjectsWorkedOn',
            className: 'widget projects-worked-on-weekly',
            ui: {
                $canvas: 'canvas'
            },
            events: {
                'stats:loaded': 'renderChart'
            },
            initialize: function(opts) {
                var self = this;

                this.model = new Backbone.Model();
                this.loadCount = 0;

                App.request('stats:jira:project').done(function(stats) {
                    self.collection = stats.thisWeek();
                    self.statsLoaded = true;

                    var groups = self.collection.groupBy(function(m) {
                        return m.get('project');
                    });

                    var projects = {};

                    _(groups).each(function(g, key) {
                        projects[key] = {};

                        _(weekdays).each(function(day) {
                            projects[key][day] = _(g).filter(function(m) {
                                return moment(m.get('date')).format('dddd') === day;
                            });
                        });
                    });

                    var data = {};

                    _(projects).each(function(p, key) {
                        data[key] = [];
                        _(p).each(function(d) {
                            data[key].push(d.length);
                        });
                    });

                    self.model.set('projects', {
                        labels: weekdays,
                        datasets: _(data).map(function(p, key) {
                            return { label: key, data: p, fillColor: colors[colorKeys[Math.floor(Math.random() * 4)]] };
                        })
                    });
                });

            },
            onRender: function() {
                var self = this;

                if (this.statsLoaded) {

                    var ctx = this.ui.$canvas.get(0).getContext('2d');

                    this.chart = new Chart(ctx).Bar(this.model.get('projects'), {
                        scaleShowGridLines: false,
                        showBarStroke: false,
                        legendTemplate: '' +
                            '<ul class=\"<%= name.toLowerCase() %>-legend\">' +
                                '<% for (var i = 0; i<datasets.length; i++) {%>' +
                                    '<li>' +
                                        '<span style=\"background-color:<%= datasets[i].fillColor %>\"></span>' +
                                        '<%= datasets[i].label %>' +
                                    '</li>' +
                                '<% } %>' +
                            '</ul>'
                    });

                    this.$el.find('.footer').prepend(this.chart.generateLegend());
                } else if (this.loadCount < 50) {
                    setTimeout(function() {
                        self.onRender();
                    }, 500);

                    this.loadCount++;
                }
            }
        });

        Mod.getWeekly = function() {
            return new ProjectsWorkedOnWidget();
        };
    });
})(TA, Backbone, Marionette, jQuery, _);