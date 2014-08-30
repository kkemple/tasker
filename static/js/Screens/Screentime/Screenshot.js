;(function(TA, Backbone, Marionette, $, _) {
    "use strict";

    TA.module('Screentime', function(Mod, App, Backbone, Marionette, $, _) {
        var Screenshot = Backbone.Marionette.ItemView.extend({
            template: 'Screens/Screentime/Screenshot',
            className: 'shot',
            initialize: function(options) {
                this.$el.attr('data-gid', this.model.get('index'));
            },
            events: {
                'click': function(evt) {
                    var self = this;

                    // TODO: turn this into a view
                    var $modal = $('#image-zoom'),
                        $fullImg = $('<img />').attr('src', this.model.get('fullSrc')),
                        idx = this.model.get('index'),
                        $prev = $modal.find('.modal-header .prev'),
                        $next = $modal.find('.modal-header .next'),
                        $imgContainer = $('<figure />').addClass('zoomed').html($fullImg);

                    if (idx === this.model.collection.length -1) {
                        $prev.prop('disabled', true);
                    } else {
                        $prev.prop('disabled', false);
                    }

                    if (idx === 0) {
                        $next.prop('disabled', true);
                    } else {
                        $next.prop('disabled', false);
                    }
                    $prev.attr('data-current-idx', idx);
                    $next.attr('data-current-idx', idx);
                    $modal.find('.modal-body').html($imgContainer);

                    var $delete = $('<button class="btn btn-sm btn-default remove"><i class="fa fa-times"></i> Delete</button>');
                    $delete.on('click', function() {
                        $modal.modal('hide');
                        self.model.destroy();
                    });

                    $modal.find('.modal-body').prepend($delete);
                    $modal.find('.modal-header .caption').html(this.model.get('moment').calendar());
                    $modal.modal();
                },
                'click .fa.fa-times': function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.model.destroy();
                }
            }
        });

        var Activity = Backbone.Marionette.CompositeView.extend({
            itemView: Screenshot,
            template: 'Screens/Screentime/ActivityGroup',
            itemViewContainer: '.shots',
            className: 'shot-group list-group-item',
            initialize: function() {
                this.collection = this.model.get('screenshots');
            }
        });

        var ActivityGroup = Backbone.Marionette.CollectionView.extend({
            itemView: Activity,
            className: 'list-group'
        });

        Mod.ActivityGroup = ActivityGroup;
    });
})(TA, Backbone, Marionette, jQuery, _);