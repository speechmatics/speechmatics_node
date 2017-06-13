/* GET MODULES AND HANDLE COMMAND LINE OPTIONS */
var fs = require('fs');
try {
    var request = require('request');
} catch (e) {
    console.log("\nError: Cannot find module 'request'. Install with 'npm install request'.");
    process.exit();
}
try {
    var epilogueMessage = 'Documentation at https://www.speechmatics.com/api-details';

    var yargs = require('yargs')
        .usage('Usage: $0 <command> <options>')
	    .command('upload', 'Upload an audio file for processing')
    	.command('download', 'Download a processed transcription')
	    .demand(1, 'ERROR: Must provide a valid command.')
	    .epilogue(epilogueMessage),
	    argv = yargs.argv,
	    command = argv._[0];
} catch (e) {
    console.log("\nError: Cannot find module 'yargs'. Install with 'npm install yargs'.");
    process.exit();
}


/* === COMMANDS === */
/* --- UPLOAD an audio file for processing --- */
if (command === 'upload') {

	//Handle command line options (for upload).
    yargs.reset()
        .usage('Usage: $0 upload <options>')
        .example('$0 upload -f example.mp3 -l en-US -i $MY_API_USER_ID -t $MY_API_AUTH_TOKEN -c $MY_CALLBACK_URL')
        .demand(['f','l','i','t','c'])
        .describe({'f':'File to transcribe', 'l':'Language to use (e.g. en-US)', 'i':'API User Id', 't':'API Auth Token', 'c':'Callback url to use'})
        .help('h', 'display this help')
        .epilogue(epilogueMessage)
        .argv

	var formData = {
  	    diarisation: 'true',
  	    model: argv.l,
   	    data_file: fs.createReadStream(argv.f),
   	    notification: 'callback',
   	    callback: argv.c
	}

	//API CALL: Upload file for transcription.
	var apiUploadURL = 'https://api.speechmatics.com/v1.0/user/' + argv.i + '/jobs/?auth_token=' + argv.t;

	request.post({url: apiUploadURL, formData: formData}, function (error, response, body) {
	    if (error) {
	        return console.log('\nREQUEST ERROR:', error);
	    }

	    try {
	        var json = JSON.parse(body);
	        if (json['error']) {
	            return console.log('\nAPI ERROR', json['error']);
	        }
	    } catch (parseError) {
	        return console.log('\nPARSE ERROR', parseError);
	    }

	    console.log('\nSpeechmatics job uploaded. Job ID:', json['id']);
	});

	
/* --- DOWNLOAD a processed transcription --- */
} else if (command === 'download'){

	//Handle command line options (for downpload)
    yargs.reset()
        .usage('Usage: $0 download <options>')
        .example('$0 download -j $MY_JOB_ID -i $MY_API_USER_ID -t $MY_API_AUTH_TOKEN')
        .demand(['j','i','t'])
        .describe({'j':'API Job Id', 'i':'API User Id', 't':'API Auth Token'})
        .help('h', 'display this help')
        .epilogue(epilogueMessage)
        .argv

	//API CALL: Download transcription by job ID.
	var apiDownloadURL = 'https://api.speechmatics.com/v1.0/user/' + argv.i + '/jobs/' + argv.j + '/transcript?auth_token=' + argv.t;

	request(apiDownloadURL, function (error, response, body) {
	    if (error) {
	        return console.log('\nREQUEST ERROR:', error);
	    }

	    try {
	        var json = JSON.parse(body);
	        if (json['error']) {
	            return console.log('\nAPI ERROR', json['error']);
	        }
	    } catch (parseError) {
	        return console.log('\nPARSE ERROR', parseError);
	    }

	    console.log('\nSpeechmatics transcript downloaded. Transcript data:', json);
	});

} else {
   yargs.showHelp();
}
