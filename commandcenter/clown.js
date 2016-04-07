// He tells jokes!

var _ = require('underscore');
var request = require('request');
var cn = require('chuck-norris-api');

var _cnRandom = function(options, cb) {
    console.log('asked for random joke');
    
    request('http://api.icndb.com/jokes/random', function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var data = JSON.parse(body);
            console.log(data);
            var joke = '';
            if (_.has(data, 'type') && data.type === 'success') {
                joke = data.value.joke;
            } else {
                joke = 'Cannot say! (its not a joke)';
            }
            cb(null, joke);
        } else {
            cb(error);
        }
    });
    
    // https://phil-simmons.com/chuck-api-docs/classes/ChuckNorrisApi.html
    cn.getRandom(options).then(function (data) {
        var joke = '';
        if (_.has(data, 'type') && _.data.type === 'success') {
            joke = data.value.joke;
        } else {
            joke = 'Cannot say! (its not a joke)';
        }
        cb(null, joke);
    });
}
 
var randomJoke = function(options, cb) {
    _cnRandom(/*{'number':1}*/null, function(err, joke) {
        console.log('random joke(cn):'+joke);
        cb(err, err ? null : {'reply':joke, 'joke':joke});
    });
}

module.exports = {
    randomJoke: randomJoke
}