'use strict';
module.change_code = 1;
var _ = require('lodash');
var Skill = require('alexa-app');
var STORYTIME_BUILDER_SESSION_KEY = 'STORYTIME_BUILDER_SESSION_KEY';
var skillService = new Skill.app('storytime');
var StoryHelper = require('./storytime_helper');
var DatabaseHelper = require('./database_helper');
var databaseHelper = new DatabaseHelper();
skillService.pre = function(request, response, type) {
    databaseHelper.createStoryTable();
};
var getStorytimeHelper = function(storyHelperData) {
    if (storyHelperData === undefined) {
        storyHelperData = {};
    }
    return new StorytimeHelper(storyHelperData);
};
var cancelIntentFunction = function(req, res) {
    res.say('Goodbye!').shouldEndSession(true);
};

skillService.intent('AMAZON.CancelIntent', {}, cancelIntentFunction);
skillService.intent('AMAZON.StopIntent', {}, cancelIntentFunction);
var getStoryHelperFromRequest = function(request) {
    var storyHelperData = request.session(STORYTIME_BUILDER_SESSION_KEY);
    return getStorytimeHelper(storyHelperData);
};
var storyIntentFunction = function(storyHelper, request, response) {
    var stepValue = request.slot('STEPVALUE');
    storyHelper.started = true;
    if (stepValue !== undefined) {
        storyHelper.getStep().value = stepValue;
    }
    if (storyHelper.completed()) {
        var completedStory = storyHelper.buildStory();
        response.card(storyHelper.currentStory().title, completedStory);
        response.say(completedStory);
        response.shouldEndSession(true);
    } else {
        if (stepValue !== undefined) {
            storyHelper.currentStep++;
        }
        response.say('Give me ' + storyHelper.getPrompt());
        response.reprompt('I didn\'t hear anything. Give me ' + storyHelper.getPrompt() + ' to continue.');
        response.shouldEndSession(false);
    }
    response.session(STORYTIME_BUILDER_SESSION_KEY, storyHelper);
    response.send();
};

skillService.launch(function(request, response) {
    var prompt = 'Welcome to Story Time.' +
        'To create a new story, say create a story';
    response.say(prompt).shouldEndSession(false);
});

skillService.intent('AMAZON.HelpIntent', {},
    function(request, response) {
        var storyHelper = getStorytimeHelper(request);
        var help = 'Welcome to story time.' +
            'To start a new story, say create a story.' +
            'You can also say stop or cancel to exit.';
        if (storyHelper.started) {
            help = storyHelper.getStep().help;
        }
        response.say(help).shouldEndSession(false);
    });

skillService.intent('loadStoryIntent', {
        'utterances': ['{load|resume} {|a|the} {|last} story']
    },
    function(request, response) {
        var userId = request.userId;
        databaseHelper.readStoryData(userId).then(function(loadedStoryHelper) {
            return storyIntentFunction(loadedStoryHelper, request, response);
        });
        return false;
    });

skillService.intent('storyIntent', {
        'slots': {
            'STEPVALUE': 'STEPVALUES'
        },
        'utterances': ['{new|start|create|begin|build} {|a|the} story',
            '{-|STEPVALUE}'
        ]
    },
    function(request, response) {
        storyIntentFunction(getStoryHelperFromRequest(request), request,
            response);
    }
);

skillService.intent('saveStoryIntent', {
        'utterances': ['{save} {|a|the|my} story']
    },
    function(request, response) {
        var userId = request.userId;
        var storyHelper = getStoryHelperFromRequest(request);
        databaseHelper.storeStoryData(userId, storyHelper).then(
            function(result) {
                return result;
            }).catch(function(error) {});
        response.say(
            'Your story progress has been saved.'
        );
        response.shouldEndSession(true).send();
        return false;
    }
);

module.exports = skillService;


