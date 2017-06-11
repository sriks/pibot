/*
Auto speaks events in scedule.json which starts with "com.pibot.scheduler.event"
See https://github.com/sriks/pibot/issues/6
*/

var _ = require('underscore');
var Infra = require('../infra');
var winston = require('winston');
var events = Infra.events;
var speaker = Infra.speaker;
var S = require('string');
var register = function() {

events.on("com.pibot.scheduler.event", function (userInfo) {
    var eventId = userInfo["id"];
    if(!S(eventId).startsWith("pibot.speak.")) {
      return;
    }
    winston.info("auto speak event has occured "+JSON.stringify(userInfo));
    if (_.has(userInfo, "speak")) {
      var msg = userInfo.speak;
      speaker.speak(msg);
    } else {
      winston.warn('No message found');
    }
    });
} ();
