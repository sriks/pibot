// Command Center

var S = require('string');
var utils = require('./utils.js');
var Skills = require('./skills');
var clown = Skills.clown;
var weather = Skills.weather;
var music = Skills.music;
var morning = Skills.morning;

var Infra = require('./infra');
var speaker = Infra.speaker;

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
    // Not stripping message
    // toSay = S(toSay).unescapeHTML().s;
    // toSay = toSay.replace(/&quot;/g,'"');
    // toSay = S(toSay).stripPunctuation().s;

    _console('toSay: '+toSay);
    if (_startsWith(toSay, 'joke')) {
        process({'text': toSay}, function(err, res) {
            if (err) {
                cb(err);
            } else {
                speaker.speak(res.joke, cb);
            }
        });
    }

    else {
        speaker.speak(toSay, cb);
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
    //music.scheduleMorningRaga();
    Infra.scheduler.start();
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
        console.log('Ignoring joke');
        // Need to make this working, so disabling for now.
        //clown.randomJoke({}, cb);
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
