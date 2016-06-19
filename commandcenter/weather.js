var schedule = require('node-schedule');
var async = require('async');
var _ = require('underscore');
var request = require('request');
var speaker = require('./speak.js');

var _job;
var _updatesCallback;

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
        var main = res['main'];
        if (main) {
            var theTemp = main['temp'] - 273.15; // Kelvin to C
            theTemp = theTemp.toFixed(0);
            forecast['temp'] = theTemp;
        }
        cb(null, forecast);
    },function(error){
        console.log(error)
        cb(error);
    })
}

var _fetchWeather = function(cb) {
    _fetchWeather_OWM(cb);
}

var performWeatherForecast = function(cb) {
    console.log('checking weather');
    _fetchWeather(function(err, res) {
        cb(err, res);
    });
}

var start = function(cb) {
    console.log('starting weather scheduling.');
    // Run every 5 mins everyday from 9:00-18:00
    _job = schedule.scheduleJob('*/5 9-18 * * *', function(){
        performWeatherForecast(cb);
    });
    performWeatherForecast(cb);
}

var stop = function() {
    if (_job) {
        console.log('cancelling weather scheduling.');
        _job.cancel();
    }
}

module.exports = {
    'start': start,
    'stop': stop,
    'weather': performWeatherForecast,
}

//start();