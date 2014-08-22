;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('JIRA', function(Mod, App, Backbone, Marionette, $, _) {
        var SettingsView = Marionette.ItemView.extend({
            template: 'Screens/JIRA/JiraSettings',
            events: {
                'click #update-jira-settings': 'updateSettings',
                'click .toggle-jira-settings': 'setVisibility'
            },
            modelEvents: {
                'change:isVisible': 'updateView'
            },
            ui: {
                $username: '#jira-username',
                $password: '#jira-password',
                $url: '#jira-url',
                $toggle: '.toggle-jira-settings i'
            },
            onRender: function() {
                if (!this.model.get('isVisible')) {
                    this.$('form').hide();
                    this.ui.$toggle.removeClass('fa-toggle-up').addClass('fa-toggle-down');
                }
            },
            updateSettings: function(e) {
                e.preventDefault();

                var data = {
                    username: this.ui.$username.val().trim(),
                    password: this.ui.$password.val().trim(),
                    jiraUrl: this.ui.$url.val().trim(),
                };

                $.ajax({
                    async: false,
                    method: 'GET',
                    dataType: 'json',
                    url: '/encrypt',
                    data: {password: data.password}
                }).done(function(res) {
                    data.password = res.password;
                });

                this.model.set('username', data.username);
                this.model.set('password', data.password);
                this.model.set('jiraUrl', data.jiraUrl);
                this.model.set('hasLoginCreds', true);
                this.model.save();

                window.location.reload();
            },
            setVisibility: function() {
                this.model.set('isVisible', !this.model.get('isVisible'));
                this.model.save();
            },
            updateView: function() {
                var showHide = (this.model.get('isVisible')) ? 'Down' : 'Up';
                this.$('form')['slide' + showHide]();

                if (showHide === 'Up') {
                    this.ui.$toggle.removeClass('fa-toggle-up').addClass('fa-toggle-down');
                } else {
                    this.ui.$toggle.removeClass('fa-toggle-down').addClass('fa-toggle-up');
                }
            }
        });

        Mod.SettingsView = SettingsView;
    });
})(TA, Backbone, Marionette, jQuery, _);