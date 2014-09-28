;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Screentime', function(Mod, App, Backbone, Marionette, $, _) {
        var ScreentimeLayout = Marionette.Layout.extend({
            template: 'Screens/Screentime/Screentime',
            className: 'screentime',
            regions: {
                activitiesRegion: '#activities-region',
                modalRegion: '#modal-region'
            },
            onRender: function() {
                var self = this;

                this.activitiesRegion.show(App.Loader.get());

                App.request('screenshots').done(function(screenshots) {
                    var groupedScreenshots = screenshots.groupBy(function(item) {
                        return item.get('moment').format('YYYY-MM-DD HH');
                    });

                    var groupedScreensArray = _(groupedScreenshots).map(function(item) {
                        return { screenshots: item };
                    });
                    groupedScreensArray.reverse();

                    var activities = new App.Data.ActivityCollection(groupedScreensArray);
                    self.activitiesRegion.show(new Mod.ScreenshotGroup({ collection: activities }));

                    self.modalRegion.show(new Mod.ScreenshotModal({ collection: screenshots }));
                });
            }
        });

        Mod.addInitializer(function() {
            App.execute('registerScreen', {
                position: 5,
                screenKey: 'screentime',
                iconClass: 'fa-laptop',
                anchorText: 'Screentime',
                initializer: function(screen) {
                    screen.show(new ScreentimeLayout());
                }
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);