;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Screentime', function(Mod, App, Backbone, Marionette, $, _) {

        var ScreenshotModalBody = Marionette.ItemView.extend({
            template: 'Screens/Screentime/ModalBody',
            tagName: 'figure',
            className: 'zoomed'
        });

        var ScreenshotModal = Marionette.Layout.extend({
            template: 'Screens/Screentime/Modal',
            regions: {
                modalBody: '.modal-body'
            },
            ui: {
                $modal: '.modal'
            },
            events: {
                'click .prev': 'showPrevious',
                'click .next': 'showNext',
                'click .delete': 'deleteScreenshot'
            },
            initialize: function(options) {
                var self = this;

                this.collection = options.collection;

                this.listenTo(Mod, 'screenshot:zoomed', function(timestamp) {
                    this.currentModel = this.collection.findWhere({ timestamp: timestamp });

                    this.modalBody.show(new ScreenshotModalBody({model: this.currentModel}));
                    this.ui.$modal.modal('show');
                });
            },
            showPrevious: function() {
                this.modalBody.show(App.Loader.get());

                var model,
                    currentIndex = this.collection.indexOf(this.currentModel);

                if (currentIndex === 0) {
                    model = this.collection.at(this.collection.length -1);
                } else {
                    model = this.collection.at(currentIndex - 1);
                }

                this.currentModel = model;
                this.modalBody.show(new ScreenshotModalBody({ model: this.currentModel }));
            },
            showNext: function() {
                this.modalBody.show(App.Loader.get());

                var model,
                    currentIndex = this.collection.indexOf(this.currentModel);

                if (currentIndex === this.collection.length - 1) {
                    model = this.collection.at(0);
                } else {
                    model = this.collection.at(currentIndex + 1);
                }

                this.currentModel = model;
                this.modalBody.show(new ScreenshotModalBody({ model: this.currentModel }));
            },
            deleteScreenshot: function() {
                var toDelete = this.currentModel;
                this.showNext();
                toDelete.destroy();
            }
        });

        Mod.ScreenshotModal = ScreenshotModal;
    });
})(TA, Backbone, Marionette, jQuery, _);