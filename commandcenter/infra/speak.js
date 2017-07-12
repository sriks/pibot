// I speak what you ask me to!

var say = require('say');
var async = require('async');
var _ = require('underscore');
var polly = require('./aws-polly.js');

var _speakTask = function(task, callback) {
    console.log('speaking:'+task.msg);
    polly.speak(task.msg, callback);
    // var speed = _.has(task.options, 'speed') ? task.options.speed : 1.0;
    // var modulation = _.has(task.options, 'modulation') ? task.options.modulation : undefined;
    // say.speak(task.msg, modulation, speed, function(err) {
    //     if (err) { return console.error(err); }
    //     if (callback)
    //         callback(null);
    // });
}

var speak = function(msg, options, cb) {
    var task = {'msg': msg, 'options': options, 'cb': cb};    
    if (arguments.callee.speakingQueue === undefined) {
        arguments.callee.speakingQueue = async.queue(function (task, callback) {
            _speakTask(task, callback);
            if (cb)
                cb(null, {'reply': 'spoken: '+task.msg});
        }, 1);
        arguments.callee.speakingQueue.drain = function() {}
    } 
    arguments.callee.speakingQueue.push(task);
}

module.exports = {
    'speak': speak
}