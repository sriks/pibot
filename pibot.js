// Start here, this is the pibot.

var _ = require('underscore');
var Botkit = require('botkit');
var controller = Botkit.slackbot();

var cc = require('./commandcenter/commandcenter.js');

var bot = controller.spawn({
  token: 'xoxb-32744129586-0eutZ0QiPQK3FV9q9g8aYb3y'
})

bot.startRTM(function(err, bot, payload) {
  if (err) {
    throw new Error('Could not connect to Slack');
  } else {
      //console.log(bot);
      console.log(payload);
  }
});

controller.hears('', 'direct_message,direct_mention,mention', function(bot, message) {
    console.log(bot.name+':'+JSON.stringify(message));
    _processCommand(message, function(err, res) {
        if (err) {
            bot.reply(message, 'Houston, we have a problem! '+JSON.stringify(err));    
        }
        else if (_.has(res, 'reply')) {
            bot.reply(message, res.reply);    
        }
    });
});

var _processCommand = function(message, cb) {
    cc.process(message, cb);
}

var _test = function() {
    _processCommand({'text': 'say joke'}, function(err, res) {});
}

//_test();

