;(function(Backbone, Marionette, $, _) {
    "use strict";

    Marionette.TemplateCache.prototype.loadTemplate = function(templateId) {
        var template = '';

        $.ajax({
            type: 'GET',
            async: false,
            url: 'templates/' + templateId + '.html'
        })
        .done(function(html) {
            template = html;
        });

        return template;
    };

    // create our app object
    var TA = new Marionette.Application();

    // add our app regions
    TA.addRegions({
        main: '#main',
        sidebar: '#sidebar',
        header: '#header'
    });

    // create our router
    TA.router = new Backbone.Router();

    // set up our sidebar collection, may be a better way to do this
    var sidebarCollection = new Backbone.Collection();
    sidebarCollection.comparator = function(model) {
        return model.get('position');
    };

    TA.reqres.setHandler('sidebarCollection', function() {
        return sidebarCollection;
    });

    TA.commands.setHandler('registerScreen', function(opts) {
        TA.router.route(opts.screenKey + '/', opts.screenKey, opts.initializer);
        sidebarCollection.add(opts);
    });

    TA.commands.setHandler('showScreen', function(screen) {
        TA.main.show(screen);
    });

    window.TA = TA;

})(Backbone, Marionette, jQuery, _);