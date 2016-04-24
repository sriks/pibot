var schedule = require('node-schedule');
var say = require('say');
var async = require('async');
var _ = require('underscore');
var request = require('request');

//say.speak('Deya it may rain in the next 20 minutes.');

//say.speak('whats up, dog?', 'Hysterical', 1.0, function(err) {
//  if (err) {
//    return console.error(err);
//  }
//

//var say = require('say');
//  console.log('Text has been spoken.');
//});

var _speakTask = function(task, cb) {
    console.log('speaking:'+task.msg);
    say.speak(task.msg, undefined, 1.0, function(err) {
        if (err) { return console.error(err); }
        cb(null);
    });
}

var speak = function(msg, options) {
    var task = {'msg': msg, 'options': options};
    if (arguments.callee.speakingQueue === undefined) {
        arguments.callee.speakingQueue = async.queue(function (task, callback) {
            _speakTask(task, callback);
        }, 1);
        arguments.callee.speakingQueue.drain = function() {
            console.log('all items processed');
        }
    } 
    
    arguments.callee.speakingQueue.push(task);
}


var _fetchWeather_WUN = function(cb) {
    request('http://api.wunderground.com/api/1a8f5bc4661388cc/conditions/q/pws:ISINGAPO111.json', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var json = JSON.parse(body);
            var condition = {'source': 'weatherunderground', 
                             'situation':json.current_observation.weather, 
                             'description': json.current_observation.weather};
            cb(null, condition);
        } else {
            cb(error);
        }
    });
}

var _fetchWeather_OWM = function(cb) {
    var weather = require('npm-openweathermap');
 
    // api_key is required. You can get one at http://www.openweathermap.com/ 
    weather.api_key = 'e6db9c3e9aa0fea3cb02b755e0fd3477';
 
    // OPTIONAL: you can set return temperature unit. 
    // 'k' for Kelvin 
    // 'c' for Celsius 
    // 'f' for Fahrenheit 
    
    weather.temp = 'c';
    
    weather.get_weather_custom('zip', '140059,sg', 'weather').then(function(res){
        var weather = _.first(res.weather);
        var forecast = {
            'source': 'openweathermap', 
            'situation': weather.main,
            'description': weather.description
        }
        cb(null, forecast);
    },function(error){
        console.log(error)
        cb(error);
    })
}

var _fetchWeather = function(cb) {
    //_fetchWeather_WUN(cb);
    _fetchWeather_OWM(cb);
}

var performWeatherForecast = function(options) {
    console.log('checking weather');
    _fetchWeather(function(err, res) {
        console.log(res);
        speak(res.description);
    });
}

var start = function() {
    console.log('scheduling');
    var job = schedule.scheduleJob('*/5 9-18 * * *', function(){
        performWeatherForecast();
    });
    performWeatherForecast();
}

say.speak('Chuck Norris doesn\'t chew gum. Chuck Norris chews tin foil.', 'Bahh', 1.0, function(err) {
});

//start();