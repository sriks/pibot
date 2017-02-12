// Jobs to be executed now or in future 

var schedule = require('node-schedule');
var omx = require('omxctrl');
var morningRagaJob;
var volIncreaseJob;

var playMorningRaga = function() {
    var songToPlay = '/home/pi/Music/suprabhatham.mp3' // my choice of morning song :)
    var args = ['--vol -3600']; // vol in millibels.
    var remainingVolIncreaseSteps = 5;
    
    omx.play(songToPlay, args);
    omx.on('playing', function(filename) {
        console.log('playing: ', filename);
    });
    
    omx.on('ended', function() {
        console.log('playback has ended');
        volIncreaseJob.cancel();
    });
    
    volIncreaseJob = schedule.scheduleJob('*/2 * * * *', function() {
        console.log('vol inc job')
        if(--remainingVolIncreaseSteps > 0) {
            console.log('increasing volume');
            omx.increaseVolume();    
        } else {
            console.log('cancelling vol increase job');
            volIncreaseJob.cancel();
        }
    });        
}

var scheduleMorningRaga = function() {    
    morningRagaJob = schedule.scheduleJob('35 7 * * *', function() {
        playMorningRaga();
    });   
    console.log('scheduled morning raga');
}

var cancelMorningRaga = function() {
    if (morningRagaJob) {
        morningRagaJob.cancel();
    }
}

var play = function() {
    
}

var stop = function() {
    omx.stop();
    if (volIncreaseJob) 
        volIncreaseJob.cancel();
}

module.exports = {
    'scheduleMorningRaga': scheduleMorningRaga,
    'playMoringRaga': playMorningRaga,
    'stop': stop,
    'play': play,
    'playMorning': playMorningRaga,
}