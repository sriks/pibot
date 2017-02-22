var _ = require('underscore');
var Infra = require('../infra');
var winston = require('winston');
var events = Infra.events;
var speaker = Infra.speaker;
var EVENTS = ["reminder.medicine.tyroid",
              "reminder.medicine.multivitamin"];

var register = function() {
  _.each(EVENTS, function(theEvent) {
    events.on(theEvent, function (userInfo) {
        winston.info("event has occured "+JSON.stringify(userInfo));
        if (_.has(userInfo, "reminder")) {
          var msg = userInfo.reminder;
          speaker.speak(msg);
        }
    });
    winston.info("Registered to event "+theEvent);
  });
}();
