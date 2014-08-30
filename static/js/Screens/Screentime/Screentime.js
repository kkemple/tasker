;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    var DEFAULT_PAGE_SIZE = 100;

    TA.module('Screentime', function(Mod, App, Backbone, Marionette, $, _) {
        var ScreentimeLayout = Marionette.Layout.extend({
            template: 'Screens/Screentime/Screentime',
            className: 'screentime',
            regions: {
                controlBarRegion: '#control-bar-region',
                activitiesRegion: '#activities-region'
            },
            onRender: function() {
                var self = this;

                App.request('screenshots').done(function(screenshots) {
                    var currentActivities = screenshots.groupBy(function(item) {
                        return item.get('moment').format('YYYY-MM-DD HH');
                    });

                    currentActivities = _(currentActivities).map(function(item) { return { screenshots: item }; });
                    currentActivities.reverse();

                    App.request('activities').done(function(activities) {
                        activities.set(currentActivities);
                        self.activitiesRegion.show(new Mod.ActivityGroup({collection: activities}));
                    });
                });

                setTimeout(function() {
                    $('#image-zoom').on('click', '.modal-header .prev', function(evt) {
                        switchImg(this, 'prev');
                    });
                    $('#image-zoom').on('click', '.modal-header .next', function(evt) {
                        switchImg(this, 'next');
                    });
                }, 500);

                var switchImg = function(btn, direction) {
                    var currentIdx = +$(btn).attr('data-current-idx'),
                        idxToOpen = (direction === 'prev') ? currentIdx + 1 : currentIdx - 1;

                    if (idxToOpen > -1) {
                        $('.shot[data-gid="' + idxToOpen + '"]').click();
                    }
                };
            },
            onBeforeDestroy: function() {
                $('#image-zoom').off('click');
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