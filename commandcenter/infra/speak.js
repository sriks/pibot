// I speak what you ask me to!

var say = require('say');
var async = require('async');
var _ = require('underscore');
var polly = require('./aws-polly.js');
var speakingQueue;

var _speak = function(message, cb) {
    console.log('speaking:'+message);
    polly.speak(message, function(err) {
      if (!cb) { return }
      if (!err) {
        cb(null, {'reply': 'spoken: '+message});
      } else {
        cb(null, {'reply': 'unable to speak'});
      }
    });

    // Speak with say library
    // var speed = _.has(task.options, 'speed') ? task.options.speed : 1.0;
    // var modulation = _.has(task.options, 'modulation') ? task.options.modulation : undefined;
    // say.speak(task.msg, modulation, speed, function(err) {
    //     if (err) { return console.error(err); }
    //     if (callback)
    //         callback(null);
    // });
}

var speak = function(msg, cb) {
    // TODO: use queue
    _speak(msg, cb);
}

module.exports = {
    'speak': speak
}
