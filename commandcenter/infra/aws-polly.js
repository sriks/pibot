
var AWS = require('aws-sdk');
var appRoot = require('app-root-path');
var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var omx = require('omxctrl');
var cmd = require('node-cmd');
const FILE_FORMAT	=	"mp3";

var prepareAWS = function() {
	var awsPath = appRoot + '/commandcenter/infra/config/aws.json';
	AWS.config.loadFromPath(awsPath);
}();

/*Returns file name + extension for msg. Applying the same msg will return the same file name*/
var filePathForMessage = function(msg) {
	var dir = '/var/tmp'
	var fileName = md5(msg) + "." + FILE_FORMAT;
	return path.join(dir, fileName);
}

var outputToSpeaker = function(audioFilePath, cb) {
	omx.play(songToPlay, args);
	omx.on('playing', function(filename) {
			console.log('playing: ', filename);
	});
	omx.on('ended', function() {
			console.log('playback has ended');
			cb(null, null);
	});
}

var speak = function(msg, cb) {
	const outFile = filePathForMessage(msg);

	// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html
	var polly = new AWS.Polly();
	var params = {
	  OutputFormat: FILE_FORMAT,
	  Text: msg,
	  TextType: "text",
	  VoiceId: "Amy"
	 };

	 polly.synthesizeSpeech(params, function(err, data) {
	  if (err) {
	  	console.log(err, err.stack); // an error occurred
	  	cb(err);
	 } else {
		if (data.AudioStream instanceof Buffer) {
            fs.writeFile(outFile, data.AudioStream, function(err) {
                if (err) {
                    console.log(err)
										cb(err);
                }
								console.log("The file was saved "+outFile)
								outputToSpeaker(outFile, cb);
                // cmd.run('omxplayer -o local '+outFile);
                // cb(null, null);
            })
        }
	 }
	 });
}

module.exports = {
	'speak': speak
};
