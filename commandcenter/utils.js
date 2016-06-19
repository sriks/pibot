var S = require('string');

var startsWith = function(string, prefix) {
    return S(string).startsWith(prefix);
}

var stripAll = function(text) {
    return S(text).collapseWhitespace().s;
}

module.exports = {
    'startsWith': startsWith,
    'stripAll': stripAll,
}