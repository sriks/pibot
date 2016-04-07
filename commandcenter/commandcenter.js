// Command Center

var S = require('string');
var workers = require('./workers.js');
var speaker = workers.speak;
var clown = workers.clown;

var _console = function(msg) {
    console.log(msg);
}

var _startsWith = function(string, prefix) {
    return S(string).startsWith(prefix);
}

var _stripAll = function(text) {
    return S(text).collapseWhitespace().s;
}

var _processSay = function(toSay, message, cb) {
    _console('toSay: '+toSay);
    
    if (_startsWith(toSay, 'joke')) {
        process({'text': toSay}, function(err, res) {
            if (err) {
                cb(err);
            } else {
                speaker.speak(res.joke, {}, cb);
            }
        });
    } 
    
    else {
        speaker.speak(toSay, {}, cb);
    }
}

var process = function(message, cb) {
    var command = _stripAll(message.text);
    _console('received cmd: '+command);    
    
    // say
    if (S(command).startsWith('say')) {
        var toSay = S(command).stripLeft('say').s; 
        _processSay(_stripAll(toSay), message, cb);
    }
    
    // joke
    if (S(command).startsWith('joke')) {
        clown.randomJoke({}, cb);
    }
}

module.exports = {
    'process': process
};