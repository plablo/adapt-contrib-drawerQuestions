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
            // Mod 0.0.2 - Añadir un orden al listado del índice.
            collectionData.sort(function(e1,e2){
            	if (e1._parentId == 'course')
            		return -1;
            	else if (e2._parentId == 'course')
            		return 1;
            	else
            		return e1.title.localeCompare(e2.title);
            });
            var modelData = this.model.toJSON();

            console.log(collectionData);
            console.log(modelData);

            var template = Handlebars.templates["contentObjects"];
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
