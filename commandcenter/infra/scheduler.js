// Grand Job Scheduler. Schedules and emits events as configured in schedule.json

var _ = require('underscore');
var schedule = require('node-schedule');
var fs = require('fs');
var winston = require('winston');
var events = require('./index').events;
var allJobs = require('./config/schedule.json');

var startAll = function(cb) {
  _.each(allJobs, function(jobConfig) {
    _scheduleJob(jobConfig);
  });
};

var _scheduleJob = function(jobConfig) {
  if (!_.has(jobConfig, 'active') || jobConfig.active) {
    winston.info('scheduling job '+ JSON.stringify(jobConfig));
    var job = schedule.scheduleJob(jobConfig.cron, function() {
      console.log('triggering job ' + jobConfig.event + ' ' + new Date());
      winston.info('triggering job ' + jobConfig.event);
      events.emit(jobConfig.event);
    });
  } else {
    winston.info('ignorning job '+JSON.stringify(jobConfig));
  }
};

module.exports = {
  start: startAll
};
