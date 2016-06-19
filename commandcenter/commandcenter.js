// Command Center

var S = require('string');
var workers = require('./workers.js');
var utils = require('./utils.js');
var speaker = workers.speak;
var clown = workers.clown;
var weather = workers.weather;
var music = workers.music;

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
    toSay = S(toSay).unescapeHTML().s;
    toSay = toSay.replace(/&quot;/g,'"');
    toSay = S(toSay).stripPunctuation().s;
    
    _console('toSay: '+toSay);
    
    if (_startsWith(toSay, 'joke')) {
        process({'text': toSay}, function(err, res) {
            if (err) {
                cb(err);
            } else {
                speaker.speak(res.joke, {'speed': 0.82}, cb);
            }
        });
    } 
    
    else {
        speaker.speak(toSay, {'speed': 0.9}, cb);
    }
}

var _processWeatherUpdates = function(cb) {
    weather.start(function(err, weather) {
        if (weather) 
            speaker.speak(weather.description);
    });
}

var _processMusic = function(command) {
    // TODO: move to music module.
    // TODO: send response as an event from the respective module
    
    if (utils.startsWith(command, module.exports.CMD_MUSIC_PLAY_MORNING)) {
        music.playMorning();
    }
    
    else if(utils.startsWith(command, module.exports.CMD_MUSIC_STOP)) {
        music.stop();
    }
}

var prepareAutoJobs = function() {
    music.scheduleMorningRaga();
}

var process = function(message, cb) {
    var command = _stripAll(message.text);
    _console('received cmd: '+command);    
    
    // say
    if (S(command).startsWith(module.exports.CMD_SAY)) {
        var toSay = S(command).stripLeft(module.exports.CMD_SAY).s; 
        _processSay(_stripAll(toSay), message, cb);
    }
    
    // joke
    if (S(command).startsWith('joke')) {
        clown.randomJoke({}, cb);
    }
    
    // weather updates
    if (_startsWith(command, module.exports.CMD_START_WEATHER)) {
        _processWeatherUpdates(cb);
    }
    
    if(_startsWith(command, 'music')) {
        _processMusic(command)
    }
}

module.exports = {
    'process': process,
    'prepareAutoJobs': prepareAutoJobs,
    'CMD_START_WEATHER': 'start weather',
    'CMD_SAY': 'say',
    'CMD_MUSIC_PLAY_MORNING': 'music play morning',
    'CMD_MUSIC_STOP': 'music stop'
};