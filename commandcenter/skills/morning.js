var TEST = false; // TODO: Read from commandline args
var winston = require('winston');
var Infra = require('../infra');
var events = Infra.events;
var speaker = Infra.speaker;
var MINUTE = 1000 * (TEST ? 1 : 60);
var REPEAT = 6;
var delayInMs = 5 * MINUTE;
var T;
var timeoutObj;

var onTimeout =  function(context) {
  winston.info('On Timeout ' + context);
  var inMins = T/MINUTE;
  var msg = "Master, you have " + inMins + " minutes to catch your train.";
  speaker.speak(msg);
  T = T - delayInMs;
  if (T <= 0) {
    winston.info('clearing timer at T ' + T);
    clearInterval(timeoutObj);
  }
};

// Registers when loaded for the first time
var register = function() {
  events.on("com.pibot.scheduler.event", function (userInfo) {
      var eventId = userInfo["id"];
      if (eventId === "schedule.workcountdown") {
        winston.info("event has occured schedule.workcountdown");
        T = (delayInMs * REPEAT);
        onTimeout('First shot');
        timeoutObj = setInterval(onTimeout, delayInMs, 'timer triggered');
      }
  });
  winston.info("Registered to event schedule.workcountdown");
} ();
