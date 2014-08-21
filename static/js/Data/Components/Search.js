;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Data', function(Mod, App, Backbone, Marionette, $, _) {
        var SearchModel = Backbone.Model.extend({
            localStorage: new Backbone.LocalStorage('Search'),
            defaults: {
                timeoutId: 0,
                history: []
            }
        });

        var searchModel = new SearchModel({id: 1});
        searchModel.fetch();

        Mod.Search = searchModel;
    });
})(TA, Backbone, Marionette, jQuery, _);
