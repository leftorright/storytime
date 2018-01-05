"use strict";
module.change_code = 1;
var _ = require("lodash");

function StorytimeHelper(obj) {
    this.started = false;
    this.StoryIndex = 0;
    this.currentStep = 0;
    this.stories = [
        {
            title: "A Cold November Day",
            template: "It was a ${adjective_1}, cold November day. I awoke to the smell of ${type_of_bird} roasting in the ${room_in_house} downstairs. My friend said, \"See if ${relative_name}\" needs a fresh ${noun_1}.\" So I carried a tray of glasses full of ${a_liquid} into the ${verb_ending_in_ing} room.",
            steps: [
                {
                    value: null,
                    template_key: "adjective_1",
                    prompt: "an Adjective",
                    help: "Speak an adjective to add it to the story. An adjective is a word that modifies a noun (or pronoun) to make it more specific: a rotten egg, a cloudy day, or a tall, cool glass of water. What adjective would you like?"
                },
                {
                    value: null,
                    template_key: "type_of_bird",
                    prompt: "a Type of bird",
                    help: "Speak a type of bird to add it to the story. What type of bird would you like?",
                },
                {
                    value: null,
                    template_key: "room_in_house",
                    prompt: "a name of Room in a house",
                    help: "Speak a name of a room in a house. What room in a house would you like?",
                },
                {
                    value: null,
                    template_key: "relative_name",
                    prompt: "a relative's name",
                    help: "Speak a relative's name to add it to the story. What relative's name would you like?"
                },
                {
                    value: null,
                    template_key: "noun_1",
                    prompt: "a noun",
                    help: "Speak a noun to add it to the story. A noun is used to identify any of a class of people, places, or things. What noun would you like?"
                },
                {
                    value: null,
                    template_key: "a_liquid",
                    prompt: "a liquid",
                    help: "Speak a type of liquid to add it to the story. For example, kool-aid, lava, or orange juice are all liquids. What liquid do you want to add?"
                },
                {
                    value: null,
                    template_key: "verb_ending_in_ing",
                    prompt: "a verb ending in ing",
                    help: "Speak a verb ending in ing to add it to the story. Running, living, or singing are all examples. What verb ending in ing do you want to add?"
                }]
        }
    ];
    for (var prop in obj) this[prop] = obj[prop];
}

StorytimeHelper.prototype.completed = function() {
    return this.currentStep === (this.currentStory().steps.length - 1);
};

StorytimeHelper.prototype.getPrompt = function() {
    return this.getStep().prompt;
};

StorytimeHelper.prototype.getStep = function() {
    return this.currentStory().steps[this.currentStep];
};

StorytimeHelper.prototype.buildStory = function() {
    var currentStory = this.currentStory();
    var templateValues = _.reduce(currentStory.steps, function(accumulator, step) {
        accumulator[step.template_key] = step.value;
        return accumulator;
    }, {});
    var compiledTemplate = _.template(currentStory.template);
    return compiledTemplate(templateValues);
};


StorytimeHelperHelper.prototype.currentStory = function() {
    return this.stories[this.StoryIndex];
};

module.exports = StoryHelper;