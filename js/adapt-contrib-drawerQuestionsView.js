define([
    'core/js/adapt'
], function(Adapt) {

    var DrawerQuestionsView = Backbone.View.extend({

        className: "drawerQuestions",

        initialize: function() {
            this.listenTo(Adapt, 'remove', this.remove);
            this.render();
        },

        events: {
            'click .drawerQuestions-item-container button': 'onDrawerQuestionsMenuClicked'
        },

        render: function() {
            this.collection.comparator = 'title';
            this.collection.sort();
            var collectionData = this.collection.toJSON();
            // Get page and questions, ordered by page title.
            collectionData = this.collection
                .map(function(e) {
                    return {
                        'page': e.toJSON(),
                        'questions': e.findDescendantModels('components', {
                            where: {
                                '_isQuestionType': true
                            }
                        }).map(function(e) {
                            return e.toJSON()
                        })
                    }
                })
                .sort(function(e1, e2) {
                    return e1.page.title.localeCompare(e2.page.title)
                });

            var modelData = this.model.toJSON();

            var template = Handlebars.templates["drawerQuestions"];
            this.$el.html(template({
                model: modelData,
                resources: collectionData,
                _globals: Adapt.course.get('_globals')
            }));
            _.defer(_.bind(this.postRender, this));
            return this;
        },

        postRender: function() {
            this.listenTo(Adapt, 'drawer:triggerCustomView', this.remove);
        },

        onDrawerQuestionsMenuClicked: function(event) {
            if (event && event.preventDefault) event.preventDefault();
            if (this.model.get('_isLocked')) return;
            Backbone.history.navigate('#/id/' + $(event.currentTarget).data("href"), {
                trigger: true
            });
        }
    });

    return DrawerQuestionsView;
})
