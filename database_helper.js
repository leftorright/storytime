"use strict";
module.change_code = 1;
var _ = require("lodash");
var StoryTimeHelper = require("./storytime_helper");
var STORYTIME_DATA_TABLE_NAME = "StoryTimeSkillTable";

function DatabaseHelper() {
}
var storyTable = function() {
    return dynasty.table(STORYTIME_DATA_TABLE_NAME);
};

DatabaseHelper.prototype.createStoryTable = function() {
    return dynasty.describe(STORYTIME_DATA_TABLE_NAME)
        .catch(function(error) {
            console.log("createStoryTable::error: ", error);
            return dynasty.create(STORYTIME_DATA_TABLE_NAME, {
                key_schema: {
                    hash: ["userId", "string"]
                }
            });
        });
};

DatabaseHelper.prototype.storeStoryData = function(userId, storyData) {
    console.log("writing storydata to database for user " + userId);
    return storyTable().insert({
        userId: userId,
        data: JSON.stringify(storyData)
    }).catch(function(error) {
        console.log(error);
    });
};

DatabaseHelper.prototype.readStoryData = function(userId) {
    console.log("reading story with user id of : " + userId);
    return storyTable().find(userId)
        .then(function(result) {
            var data = (result === undefined ? {} : JSON.parse(result["data"]));
            return new StoryTimeHelper(data);
        }).catch(function(error) {
            console.log(error);
        });
};

module.exports = DatabaseHelper;