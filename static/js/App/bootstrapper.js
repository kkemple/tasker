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
    TA.commands.setHandler('showScreen', function(screen) {
        TA.main.show(screen);
    });

    window.TA = TA;

})(Backbone, Marionette, jQuery, _);