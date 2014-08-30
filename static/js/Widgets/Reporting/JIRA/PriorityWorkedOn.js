;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Widgets.Reporting.JIRA.Priority', function(Mod, App, Backbone, Marionette, $, _) {

        var WEEK = 60 * 60 * 25; // 40 hr work week
        var colors = App.Texts.get('colors');
        var colorKeys = App.Texts.get('colorKeys');

        var _usedColors = [];

        var getRandomColor = function() {
            var color = colorKeys[Math.floor(Math.random() * colorKeys.length)];

            if (_.indexOf(_usedColors, color) === -1) {
                _usedColors.push(color);
                return colors[color];
            } else {
                return getRandomColor();
            }
        };

        var PriorityWorkedOnWidget = Marionette.ItemView.extend({
            template: 'Widgets/Reporting/JIRA/PrioritiesWorkedOn',
            className: 'widget priorities-weekly',
            ui: {
                $canvas: 'canvas'
            },
            initialize: function(opts) {
                var self = this;


                this.collection = opts.collection;

                var priorities = {};

                this.collection.each(function(m) {
                    if (!priorities[m.get('priority')]) {
                        priorities[m.get('priority')] = 0;
                    }

                    priorities[m.get('priority')]++;
                });

                this.model.set('priorities', _(priorities).map(function(p, key) {
                    return { label: key, value: p, color: getRandomColor() };
                }));
            },
            onRender: function() {
                var self = this;

                var ctx = this.ui.$canvas.get(0).getContext('2d');

                this.chart = new Chart(ctx).PolarArea(this.model.get('priorities'), _({
                    segmentShowStroke : false
                }).extend(App.Config.get('chartjs')));
            }
        });

        Mod.get = function(opts) {
            return new PriorityWorkedOnWidget(opts);
        };
    });
})(TA, Backbone, Marionette, jQuery, _);