/*
    PLUGIN CORE
        - Initialize plugin
        - Get the model info
        - Get the needed data from course
*/
define([
    'backbone',
    'coreJS/adapt',
    './adapt-contrib-drawerQuestionsView'
], function(Backbone, Adapt, DrawerQuestionsView) {

    function setupMenu(contentObjectsModel, contentObjectsItems) {

        var contentObjectsCollection = new Backbone.Collection(contentObjectsItems);
        var contentObjectsModel = new Backbone.Model(contentObjectsModel);

        Adapt.on('drawerQuestions:showDrawerQuestions', function() {
            Adapt.drawer.triggerCustomView(new DrawerQuestionsView({
                model: contentObjectsModel,
                collection: contentObjectsCollection
            }).$el);
        });

    }

    Adapt.once('app:dataReady', function() {

        var drawerQuestionsData = Adapt.course.get('_drawerQuestions');

        /*
            Get accesible pages with question components. In case
            "includePuntuableAssessments" it's not selected, filter those that
            have a question weight greater than 0.
        */

        var contentObjectItems = Adapt.contentObjects
            .where({
                '_isAvailable': true,
                '_type': 'page'
            })
            .filter(function(e) {
                var descendants = e.findDescendantModels('components', {
                    where: {
                        '_isQuestionType': true
                    }
                })
                .filter(function(e){
                    if(!drawerQuestionsData.includePuntuableAssessments){
                        return e.attributes._questionWeight <= 0
                    }
                    return true;
                });
                return descendants.length > 0;
            });

        // do not proceed until drawerQuestions set on course.json
        if (!contentObjectItems || drawerQuestionsData._isEnabled === false) return;

        var drawerObject = {
            title: drawerQuestionsData.title,
            description: drawerQuestionsData.description,
            className: 'Questions-drawer',
            drawerOrder: drawerQuestionsData._drawerOrder || 0
        };
        // Syntax for adding a Drawer item
        // Adapt.drawer.addItem([object], [callbackEvent]);
        Adapt.drawer.addItem(drawerObject, 'drawerQuestions:showDrawerQuestions');

        setupMenu(drawerQuestionsData, contentObjectItems);

    });

});
