// I speak what you ask me to!

var say = require('say');
var async = require('async');

var _speakTask = function(task, callback) {
    console.log('speaking:'+task.msg);
    var speed = task.options.speed ? task.options.speed : 1.0;
    var modulation = task.options.modulation ? task.options.modulation : undefined;
    say.speak(task.msg, modulation, speed, function(err) {
        if (err) { return console.error(err); }
        callback(null);
    });
}

var speak = function(msg, options, cb) {
    var task = {'msg': msg, 'options': options, 'cb': cb};    
    if (arguments.callee.speakingQueue === undefined) {
        arguments.callee.speakingQueue = async.queue(function (task, callback) {
            _speakTask(task, callback);
            cb(null, {'reply': 'spoken: '+task.msg});
        }, 1);
        arguments.callee.speakingQueue.drain = function() {}
    } 
    arguments.callee.speakingQueue.push(task);
}

module.exports = {
    'speak': speak
}