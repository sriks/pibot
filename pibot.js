// Start here, this is the pibot.

var IS_TEST = false;
var _ = require('underscore');
var fs = require('fs');
const path = require('path');
var Botkit = require('botkit');
var controller = Botkit.slackbot();
var winston = require('winston');
var cc = require('./commandcenter/commandcenter.js');

var _processCommand = function(message, cb) {
    cc.process(message, cb);
}

var _test = function() {
    console.log('Running as test');
    _processCommand({'text': cc.CMD_START_WEATHER}, function(err, res) {});

    (function wait () {
        if (true) setTimeout(wait, 1000);
    })();
}

var start = function(isTest) {
    prepareCommons();
    var config = require(path.join(process.env.CONFIG_PATH, 'config.json'));
    winston.info("*** PIBOT STARTED ***");
    winston.info("Name "+config.name)

    if (isTest) {
        _test();
        return;
    }

    var bot = controller.spawn({
        token: config.slackbot.token
    })

    bot.startRTM(function(err, bot, payload) {
      if (err) {
        winston.error(err);
        // Let it live.
      } else {
          console.log('connected to slack');
          cc.prepareAutoJobs();
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

    // bot gets disconnected due to inactivity (?), so exit process which should kick back again.
    controller.on('rtm_close', function() {
        winston.info("*** rtm_close, restarting process");
        process.exitCode = 2;
        process.exit();
        // we use process manager, which restarts the bot
    })
}

var prepareCommons = function() {
  // Configure winston logger
  winston.remove(winston.transports.Console);
  winston.add(winston.transports.Console, {
    timestamp: true,
    level: 'silly',
    colorize: true,
    prettyPrint: true
  });
  winston.info('Winston Configured');

  // Load configuration
  var configPath = process.env.CONFIG_PATH;
  if (!fs.existsSync(configPath)) {
      winston.info("*** Aborting: Configuration directory not found at "+configPath);
      process.exitCode = 1;
      process.exit();
  }
  winston.info("Reading config from "+configPath)
}

start(IS_TEST);
