define([
    'backbone',
    'coreJS/adapt',
    './adapt-contrib-drawerQuestionsView'
], function(Backbone, Adapt, drawerQuestionsView) {

    function setupMenu(contentObjectsModel, contentObjectsItems) {

        var contentObjectsCollection = new Backbone.Collection(contentObjectsItems);
        var contentObjectsModel = new Backbone.Model(contentObjectsModel);

        Adapt.on('drawerQuestions:showContentObjects', function() {
            Adapt.drawer.triggerCustomView(new drawerQuestionsView({
                model: contentObjectsModel,
                collection: contentObjectsCollection
            }).$el);
        });

    }

    Adapt.once('app:dataReady', function() {

        var drawerQuestionsData = Adapt.course.get('_drawerQuestions');
        var contentObjectItems = Adapt.contentObjects.models;

        // do not proceed until resource set on course.json
        if (!contentObjectItems || drawerQuestionsData._isEnabled === false) return;

        var drawerObject = {
            title: drawerQuestionsData.title,
            description: drawerQuestionsData.description,
            className: 'pageNavigation-drawer'
        };
        // Syntax for adding a Drawer item
        // Adapt.drawer.addItem([object], [callbackEvent]);
        Adapt.drawer.addItem(drawerObject, 'drawerQuestions:showContentObjects');

        setupMenu(drawerQuestionsData, contentObjectItems);

    });

});
