;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * @module Data
     * @namespace  TA
     *
     */
    TA.module("Data", function(Mod, App, Backbone, Marionette, $, _){

        /**
         * ## Screenshot
         *
         * The model behind each screen capture
         *
         * @class Screenshot
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Model
         * @public
         */
        var Screenshot = Backbone.Model.extend({
            defaults: {
                src: null,
                fullSrc: null,
                moment: null,
                timestamp: null
            },
            initialize: function(attributes, options) {
                if (this.validate(attributes, options)) {
                    this.set('moment', moment(attributes.src, 'YYYY-MM-DD HH-mm-ss'));
                    this.set('fullSrc', attributes.src.replace('thumbs', 'full'));
                }
            },
            validate: function(attributes, options) {
                return !!attributes.src;
            },
            parse: function(data) {
                console.log(data);
            }
        });

        /**
         * ## ScreenshotCollection
         *
         * The collection of screen capture models
         *
         * @class ScreenshotCollection
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Collection
         * @public
         */
        var ScreenshotCollection = Backbone.Collection.extend({
            localStorage: new Backbone.LocalStorage('Screenshots'),
            model: Screenshot,
            comparitor: function(model) {
                return model.get('moment').unix();
            },
            parse: function(data) {
                console.log(data);
            }
        });

        /**
         * ## Activity
         *
         * The model behind each group of screen captures (or ScreenshotCollection instance)
         *
         * @class Activity
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Model
         * @public
         */
        var Activity = Backbone.Model.extend({
            defaults: {
                screenshots: null,
                label: null,
                length: null
            },
            initialize: function(attributes, options) {
                var coll, firstMoment;
                if (attributes.screenshots && attributes.screenshots.length) { // TODO: check if it's already a collection
                    coll = new ScreenshotCollection(attributes.screenshots);
                    firstMoment = coll.at(0).get('moment');
                    this.set('screenshots', coll);
                    // TODO: this "if" can go outside it's parent once the above TODO is done.
                    if (!attributes.label) {
                        this.set('label', firstMoment.calendar()); // TODO: customize format
                    }
                    this.set('length', coll.length);
                }
            }
        });

        /**
         * ## ActivityCollection
         *
         * The collection of activity models (groups of screen shots)
         *
         * @class ActivityCollection
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Model
         * @public
         */
        var ActivityCollection = Backbone.Collection.extend({
            model: Activity,
            localStorage: new Backbone.LocalStorage('ScreenshotActivities')
        });

        var screenshotCollection = new ScreenshotCollection();
        App.reqres.setHandler('screenshots', function() {
            var deferred = new $.Deferred();

            screenshotCollection.fetch().always(function() {
                deferred.resolve(screenshotCollection);
            });

            return deferred.promise();
        });

        var activityCollection = new ActivityCollection();
        App.reqres.setHandler('activities', function() {
            var deferred = new $.Deferred();

            activityCollection.fetch().always(function() {
                deferred.resolve(activityCollection);
            });

            return deferred.promise();
        });

        Mod.Screenshot = Screenshot;
        Mod.ScreenshotCollection = ScreenshotCollection;

        Mod.Activity = Activity;
        Mod.ActivityCollection = ActivityCollection;
    });
})(TA, Backbone, Marionette, jQuery, _);