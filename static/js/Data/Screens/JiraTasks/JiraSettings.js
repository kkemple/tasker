;(function(TA, Backbone, Marionette, jQuery, _) {
    "use strict";

    /**
     * @module Data
     * @namespace  TA
     *
     */
    TA.module('JIRA', function(Mod, App, Backbone, Marionette, $, _) {

        /**
         * ## JiraSettings
         *
         * The model behind all App settings
         *
         *
         * @class JiraSettings
         * @constructor
         * @namespace TA.Data
         * @extends Backbone.Model
         * @public
         */
        var JiraSettings = Backbone.Model.extend({
            url: '/jira/settings',
            defaults: {
                username: '',
                password: '',
                jiraUrl: '',
                hasLoginCreds: false,
                isVisible: true
            }
        });

        var jiraSettings = new JiraSettings({id: 1});

        App.reqres.setHandler('jiraSettings', function() {
            var deferred = new $.Deferred();

            jiraSettings.fetch().always(function() {
                deferred.resolve(jiraSettings);
            });

            return deferred.promise();
        });

        Mod.JiraSettings = JiraSettings;
    });

})(TA, Backbone, Marionette, jQuery, _);