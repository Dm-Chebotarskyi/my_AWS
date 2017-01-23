var AWS = require('aws-sdk');

var task = function(request, callback){
	console.log("processFile script! #####################################################");
	var message = request.body.fileNames ? request.body.fileNames : "missing parameter: fileNames";
	console.log(message);

	var params = {
	  MessageBody: 'Files to process', /* required */
	  QueueUrl: 'https://sqs.us-west-2.amazonaws.com/983680736795/ChebotarskyiSQS', /* required */
	  DelaySeconds: 0,
	  MessageAttributes: {
	   "FileKeys": {
	     DataType: "String", 
	     StringValue: message
	    }
	  }
	};

	var sqs = new AWS.SQS();

	sqs.sendMessage(params, function(err, data) {
	  if (err) {
	  	//console.log(err, err.stack); 
	  	console.log("Failed to add message to SQS");
	  }// an error occurred
	  else {
	  	 console.log("Message successfully added to SQS");
	  	//console.log(data); 
	  }          // successful response
	});

	callback(null, null);
}

exports.action = task;