var AWS = require('aws-sdk');

var DB = new AWS.SimpleDB();

var log = function (category, message) {
	var currentdate = new Date(); 
	var datetime = "Last Sync: " + currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " @ "  
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();


	var params = {
	  Attributes: [ /* required */
	    {
	      Name: 'timestamp', /* required */
	      Value: datetime /* required */
	    },
	    {
	      Name: 'message', /* required */
	      Value: message /* required */
	    },
	  ],
	  DomainName: 'dmytro.chebotarskyi', /* required */
	  ItemName: 'LOGS', /* required */
	};

	DB.putAttributes(params, function(err, data) {
	  if (err){
	  		console.log(err, err.stack); // an error occurred
	  	    console.log("writing successful");
	  } 
	  else {
	  	    console.log(data);           // successful response
	  	    console.log("writing successful");	
	  }
	});
}

exports.log = log;