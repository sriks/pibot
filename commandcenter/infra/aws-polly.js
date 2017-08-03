
var AWS = require('aws-sdk');
var appRoot = require('app-root-path');
var fs = require('fs');
var path = require('path');
var md5 = require('md5');
var omx = require('omxctrl');
var cmd = require('node-cmd');
var awsSSMLBuilder = require('ssml-builder/amazon_speech')
var FILE_FORMAT =	"mp3";

var prepareAWS = function() {
	var awsPath = appRoot + '/commandcenter/infra/config/aws.json';
	if (fs.existsSync(awsPath)) {
			AWS.config.loadFromPath(awsPath);
	} else {
			console.error("Aborting: *** Configuration not found at "+awsPath);
			process.exitCode = 20
			process.exit();
	}
} ();

/*Returns file name + extension for msg. Applying the same msg will return the same file name*/
var filePathForMessage = function(msg) {
	var dir = '/var/tmp'
	var fileName = md5(msg) + "." + FILE_FORMAT;
	return path.join(dir, fileName);
}

var outputToSpeaker = function(audioFilePath, cb) {
	var args = ['--vol 900']
	omx.play(audioFilePath, args);
	omx.on('playing', function(filename) {
		console.log('playing: ', filename);
	});
	omx.on('ended', function() {
		console.log('playback has ended');
		cb(null, null);
	});
}

var requestParamsForMessage = function(msg) {
	// http://docs.aws.amazon.com/polly/latest/dg/supported-ssml.html
	var builder = new awsSSMLBuilder();
	builder.say(msg)
	builder.pause('3s')
	var ssml = builder.ssml()
	console.log(ssml)

	// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html
	var params = {
		OutputFormat: FILE_FORMAT,
		Text: ssml,
		TextType: "text",
		VoiceId: "Amy",
		TextType: "ssml"
	};
	return params;
}

var speak = function(msg, cb) {
	const outFile = filePathForMessage(msg);
	// http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/Polly.html
	var polly = new AWS.Polly();
	var params = requestParamsForMessage(msg)
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
		    })
		}
		}
	});
}

module.exports = {
	'speak': speak
};
