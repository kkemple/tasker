;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screens.Timer', function(Mod, App, Backbone, Marionette, $, _) {

        var TimerModel = Backbone.Model.extend({
            localStorage: new Backbone.LocalStorage('Timer')
        });

        var timerModel = new TimerModel({id: 1});
        timerModel.fetch();

        var TimerScreen = Marionette.Layout.extend({
            template: 'Screens/Timer/Timer',
            regions: {
                taskSelector: '.task-selector',
                taskDisplay: '.task-display'
            },
            className: 'timer-screen',
            onRender: function() {
                var self = this;

                this.taskSelector.show(App.Loader.get());

                App.request('jiraTasks').done(function(tasksCollection) {

                    var model;

                    if (timerModel.get('currentModel')) {
                        model = tasksCollection.findWhere({ key: timerModel.get('currentModel') });
                    } else {
                        model = tasksCollection.at(0);
                    }

                    timerModel.set('currentModel', model.get('key'));
                    timerModel.save();


                    var taskSelector = new Mod.TaskSelector({
                        collection: tasksCollection,
                        currentModel: timerModel.get('currentModel')
                    });
                    self.taskSelector.show(taskSelector);

                    self.listenTo(tasksCollection, 'task:selected', self.showTask);

                    self.$('.task-display').show();

                    self.taskDisplay.show(new Mod.TaskDisplay({ model: model }));
                });
            },
            showTask: function(model) {
                timerModel.set('currentModel', model.get('key'));
                timerModel.save();

                this.taskDisplay.show(new Mod.TaskDisplay({ model: model }));
            }
        });

        Mod.TimerScreen = TimerScreen;

        App.addInitializer(function(opts) {
            App.execute('registerScreen', {
                position: 6,
                screenKey: 'timer',
                iconClass: 'fa-clock-o',
                anchorText: 'Timer',
                initializer: function(screen) {
                    screen.show(new TimerScreen());
                }
            });
        });
    });
})(TA, Backbone, Marionette, jQuery, _);