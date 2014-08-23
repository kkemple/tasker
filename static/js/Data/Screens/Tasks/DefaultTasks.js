;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {

        var DefaultTask = Backbone.Model.extend({
            initialize: function() {
                var self = this;

                this.buildDisplayTime();

                this.on('change:isRunning', function() {
                    self.toggleRunning();
                });
            },
            toggleRunning: function() {
                if (this.get('isRunning')) {
                    this.startCount();
                } else {
                    this.stopCount();
                }
            },
            startCount: function() {
                var self = this;

                if (this.get('timerId')) {
                    clearInterval(this.get('timerId'));
                }

                var timerId = setInterval(function() {
                    self.set('count', self.get('count') + 1);
                    self.buildDisplayTime();
                    self.save();
                }, 1000);

                this.set('timerId', timerId);
                this.save();

                // add the model to the notifier list
                App.Notifier.add(this);
            },
            stopCount: function() {
                clearInterval(this.get('timerId'));
                this.save();

                // remove the model from the notifier list
                App.Notifier.remove(this);
            },
            clearCount: function() {
                this.set('isRunning', false);
                this.set('count', 0);
                this.buildDisplayTime();
                this.save();
            },
            buildDisplayTime: function() {
                var count = this.get('count');

                if (count === 0) {
                    this.set('displayTime', moment({second: 0}).format('HH:mm:ss'));
                    return;
                }

                var hours = Math.floor(count / (60 * 60));

                var divisor_for_minutes = count % (60 * 60);
                var minutes = Math.floor(divisor_for_minutes / 60);

                var divisor_for_seconds = divisor_for_minutes % 60;
                var seconds = Math.ceil(divisor_for_seconds);

                this.set('displayTime', moment({hour: hours, minute: minutes, second: seconds}).format('HH:mm:ss'));
            },
            isViewable: function() {
                return !this.get('isFiltered');
            }
        });

        Mod.DefaultTask = DefaultTask;
    });
})(TA, Backbone, Marionette, $, _);