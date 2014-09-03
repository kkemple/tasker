;(function(Backbone, Marionette, $, _) {
    "use strict";

    // use syncronous ajax for template fetching
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

    // Create the app
    var TA = new Marionette.Application();

    // add our app regions
    TA.addRegions({
        main: '#main',
        sidebar: '#sidebar',
        header: '#header'
    });

    // create our router
    TA.router = new Backbone.Router();

    // add command for updating the current screen
    TA.commands.setHandler('showScreen', function(initializer) {
        initializer(TA.main);
    });

    window.TA = TA;

})(Backbone, Marionette, jQuery, _);