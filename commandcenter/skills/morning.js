var Infra = require('../infra');
var events = Infra.events;
var speaker = Infra.speaker;
var MINUTE = 1000 * 60;
var delayInMs = 5 * MINUTE;
var T = 6 * delayInMs;
var timeoutObj;

var onTimeout =  function(context) {
  var inMins = T/MINUTE;
  var msg = "Master, you have " + inMins + " minutes to catch your train.";
  speaker.speak(msg);

  T = T - delayInMs;
  if (T <= 0) {
    console.log('clearing timer');
    clearInterval(timeoutObj);
  }
};

// Registers when loaded for the first time
var register = function() {
  events.on("schedule.workcountdown", function () {
      console.log("event has occured schedule.workcountdown");
      onTimeout('first shot');
      timeoutObj = setInterval(onTimeout, delayInMs, 'timer triggered');
  });
  console.log("Registered to event schedule.workcountdown");
}();
