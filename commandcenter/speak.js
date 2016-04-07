// I speak what you ask me to!

var say = require('say');
var async = require('async');

var _speakTask = function(task, callback) {
    console.log('speaking:'+task.msg);
    say.speak(task.msg, task.options.modulation ? task.options.modulation : undefined, 1.0, function(err) {
        if (err) { return console.error(err); }
        callback(null);
    });
}

var speak = function(msg, options, cb) {
    var task = {'msg': msg, 'options': options, 'cb': cb};    
    if (arguments.callee.speakingQueue === undefined) {
        arguments.callee.speakingQueue = async.queue(function (task, callback) {
            _speakTask(task, callback);
            cb(null, {'reply': 'spoken'});
        }, 1);
        arguments.callee.speakingQueue.drain = function() {}
    } 
    arguments.callee.speakingQueue.push(task);
}

module.exports = {
    'speak': speak
}