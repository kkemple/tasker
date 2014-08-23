;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * @module Data
     * @namespace  TA
     *
     */
    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## DefaultTask
         *
         * The base Task Model class
         *
         * @class DefaultTask
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Model
         * @public
         */
        var DefaultTask = Backbone.Model.extend({
            initialize: function() {
                var self = this;

                this.buildDisplayTime();

                this.on('change:isRunning', function() {
                    self.toggleRunning();
                });
            },

            /**
             * Responsible for starting and stopping internal count for the model
             *
             * @method  toggleRunning
             * @public
             */
            toggleRunning: function() {
                if (this.get('isRunning')) {
                    this.startCount();
                } else {
                    this.stopCount();
                }
            },

            /**
             * Responsible for clearing any interval running and then starting a new one,
             * also responsible for adding the model to the Notifier module's activeTasks collection
             *
             * @method  startCount
             * @public
             */
            startCount: function() {
                var self = this;

                if (this.get('timerId')) {
                    clearInterval(this.get('timerId'));
                }

                var timerId = setInterval(function() {
                    self.set('count', self.get('count') + 1);
                    self.set('displayTime', self.buildDisplayTime('HH:mm:ss'));
                    self.save();
                }, 1000);

                this.set('timerId', timerId);
                this.save();

                // add the model to the notifier list
                App.Notifier.add(this);
            },

            /**
             * Responsible for clearing any interval running,
             * also responsible for removing the model from the Notifier module's activeTasks collection
             *
             * @method  stopCount
             * @public
             */
            stopCount: function() {
                this.set('isRunning', false);
                clearInterval(this.get('timerId'));
                this.save();

                // remove the model from the notifier list
                App.Notifier.remove(this);
            },

            /**
             * Responsible for clearing any interval running as well as clearing the internal count and updating display,
             * also responsible for removing the model from the Notifier module's activeTasks collection (by calling the `stopCount()` method)
             *
             * @method  clearCount
             * @public
             */
            clearCount: function() {
                this.set('count', 0);
                this.buildDisplayTime();
                this.stopCount();
            },

            /**
             * Parses count in to human readable HH:mm:ss format
             *
             * @method  buildDisplayTime
             * @public
             */
            buildDisplayTime: function(formatter) {
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

                if (formatter) {
                   return moment({hour: hours, minute: minutes, second: seconds}).format(formatter);
                } else {
                    return {hour: hours, minute: minutes, second: seconds};
                }
            },

            /**
             * Sugar for `!this.get('isFiltered')`
             *
             *     if (this.isViewable()) { ... }
             *
             * @method  isViewable
             * @public
             */
            isViewable: function() {
                return !this.get('isFiltered');
            }
        });

        Mod.DefaultTask = DefaultTask;
    });
})(TA, Backbone, Marionette, $, _);