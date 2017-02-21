var _ = require('underscore');
var Infra = require('../infra');
var winston = require('winston');
var events = Infra.events;
var speaker = Infra.speaker;
var EVENT = "reminder.medicine.multivitamin";

var register = function() {
  events.on(EVENT, function (userInfo) {
      winston.info("event has occured "+JSON.stringify(userInfo));
      if (_.has(userInfo, "reminder")) {
        var msg = userInfo.reminder;
        speaker.speak(msg);
      }
  });
  winston.info("Registered to event "+EVENT);
}();
