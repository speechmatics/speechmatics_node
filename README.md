# speechmatics_node
This is a code snippet one of our users was kind enough to allow us to share with you as an example of how you can upload transcription jobs to our system and view the results.  
We do not actively support this snippet.  

## Requirements
The NodeJS code sample requires the request and yargs modules, which on a Linux system can be installed with 'npm install request yargs'.  

## Usage
It can be used to upload a new transcription job with notification via a url callback:  
```
node speechmatics.js upload -f example.mp3 -l en-US -i $user_id -t $auth_token -c http://your_url.com/transcript_callback
```

This code sample can also be used for retrieving a processed job:
```
node speechmatics.js download -j $MY_JOB_ID -i $user_id -t $auth_token
```
