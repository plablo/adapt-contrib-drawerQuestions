define(function(require) {

    var Backbone = require('backbone');
    var Adapt = require('coreJS/adapt');

    var drawerQuestionsView = Backbone.View.extend({

        className: "drawerQuestions",

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.render();
        },
// TODO: the event may change, find the correct class if needed.
        events: {
            'click .contentObjects-item-container button': 'onContentObjectMenuClicked'
        },

        render: function() {
            var collectionData = this.collection.toJSON();
            var modelData = this.model.toJSON();
            var template = Handlebars.templates["gmcq"];
            this.$el.html(template({model: modelData, resources: collectionData, _globals: Adapt.course.get('_globals')}));
            _.defer(_.bind(this.postRender, this));
            return this;
        },

        postRender: function() {
            this.listenTo(Adapt, 'drawer:triggerCustomView', this.remove);
        },

        onContentObjectMenuClicked: function(event) {
            if(event && event.preventDefault) event.preventDefault();
// TODO: if the item is locked, then disable it, not remove it.
            if(this.model.get('_isLocked')) return;
// TODO: Change the href with data-id.
            Backbone.history.navigate('#/id/' + $(event.currentTarget).data("href"), {trigger: true});
        }
    });

    return drawerQuestionsView;
})
