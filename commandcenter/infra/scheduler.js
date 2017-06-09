// Grand Job Scheduler. Schedules and emits events as configured in schedule.json

var _ = require('underscore');
var schedule = require('node-schedule');
var fs = require('fs');
var winston = require('winston');
var events = require('./index').events;
var allJobs = {};

var startAll = function(cb) {
  var appRoot = require('app-root-path');
  var scheduleJSONPath = appRoot + '/commandcenter/infra/config/schedule.json';
  require('fs').readFile(scheduleJSONPath, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
      winston.warn("Unable to read scehduled jobs at "+scheduleJSONPath);
      return;
    } else {
      winston.info("Reading scheduled jobs from "+scheduleJSONPath);
    }
    allJobs = JSON.parse(data);
    if (allJobs) {
      _.each(allJobs, function(jobConfig) {
        _scheduleJob(jobConfig);
      });
    }
  });
};

var _scheduleJob = function(jobConfig) {
  if (!_.has(jobConfig, 'active') || jobConfig.active) {
    winston.info('scheduling job '+ JSON.stringify(jobConfig));
    var job = schedule.scheduleJob(jobConfig.cron, function() {
      console.log('triggering job ' + jobConfig.event + ' ' + new Date());
      winston.info('triggering job ' + jobConfig.event);
      events.emit(jobConfig.event, jobConfig);
    });
  } else {
    winston.info('ignorning job '+JSON.stringify(jobConfig));
  }
};

module.exports = {
  start: startAll
};
