;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    /**
     * ## Storage
     * The Storage module is responsible backing up and restoring localStorage data
     *
     * It has a `backup()` method responsible for gathering all localStorage data and sending it to the server
     *
     *      TA.Storage.backup();
     *
     * It has a `restore()` method responsible for fetching data from server and re-populating localStorage
     *
     *      TA.Storage.restore();
     *
     * The data is backed up to `backup.json` in the root folder of the app
     *
     *
     * @module Storage
     * @namespace  TA
     * @static
     *
     */
    TA.module('Storage', function(Mod, App, Backbone, Marionette, $, _) {

        Mod.backup = function() {
            var data = {},
                keys = Object.keys(localStorage);

            for (var i = 0, len = keys.length; i < len; i++) {
                data[keys[i]] = localStorage.getItem(keys[i]);
            }

            $.ajax({
                url: '/app/backup',
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(data)
            }).done(function(response) {
                TA.Growler.growl({
                    title: 'LocalStorage Backed Up',
                    message: response.message
                });
            });
        };

        Mod.restore = function() {
            var GrowlExtender = Marionette.ItemView.extend({
                template: _.template('<button class="btn btn-block btn-success">Reload Page</button>'),
                events: {
                    'click': 'refreshPage'
                },
                refreshPage: function() {
                    window.location.reload();
                }
            });

            $.get('/app/backup').done(function(data) {
                data = JSON.parse(data);

                _(data).each(function(val, key) {
                    localStorage.setItem(key, val);
                });

                TA.Growler.growl({
                    title: 'LocalStorage Restored',
                    message: 'localStorage is now restored from your latest backup, the page will refresh in 30 seconds, if you do not wish to wait, click the button below.',
                    childView: new GrowlExtender()
                });

                setTimeout(function() {
                    window.location.reload();
                }, 1000 * 30);
            });
        };

        App.request('userSettings').done(function(userSettings) {
            var intID = 0;

            intID = setInterval(Mod.backup, 1000 * 60 * userSettings.get('backupDuration'));

            userSettings.on('change:backupDuration', function() {
                clearInterval(intID);
                intID = setInterval(Mod.backup, 1000 * 60 * userSettings.get('backupDuration'));
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);