// Grand Job Scheduler. Schedules and emits events as configured in schedule.json

var _ = require('underscore');
var schedule = require('node-schedule');
var fs = require('fs');
var events = require('./index').events;

var allJobs = require('./config/schedule.json');

var startAll = function(cb) {
  _.each(allJobs, function(jobConfig) {
    _scheduleJob(jobConfig);
  });
};

var _scheduleJob = function(jobConfig) {
  console.log('scheduling job '+JSON.stringify(jobConfig));
  var job = schedule.scheduleJob(jobConfig.cron, function() {
    console.log('triggering job '+jobConfig.event);
    events.emit(jobConfig.event);
  });
  return job;
};

module.exports = {
  start: startAll
};
