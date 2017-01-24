var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";
var logger = require("../logger.js");


var AWS = require('aws-sdk');

var task = function(request, callback){
	//1. load configuration
	var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);

	//2. prepare policy
	var policy = new Policy(policyData);

	//3. generate form fields for S3 POST
	var s3Form = new S3Form(policy);
	
	policy.getConditions().push({ "x-amz-meta-uploader": request.connection.remoteAddress });
	hiddenFields = s3Form.generateS3FormFields();
	hiddenFields = s3Form.addS3CredientalsFields(hiddenFields, awsConfig);

	var s3 = new AWS.S3();
	var files = [];


	logger.log("Hidden fields to S3 POST", JSON.stringify(hiddenFields));

	s3.listObjects({Bucket: "lab4-weeia"}, 
		function(err, data) {
		  if (err) {
		  	console.log(err, err.stack); // an error occurred

			logger.log("Faild to obtain object list from S3", JSON.stringify(err.stack));
		  	callback(null, {template: INDEX_TEMPLATE, params:{files: ["Faild to obtain file list"],
				fields:hiddenFields, bucket:policy.getConditionValueByKey("bucket")
			}});

		  } else {
		  	console.log("Successfuly obtainted objects list");

			data.Contents.forEach( function(item) {
				if (item.Key.startsWith("dmytro.chebotarskyi/")) {
					var name = item.Key.substr(20);
					if (! name == '') {
						var tmp = { key: item.Key, name: name};
						files.push(tmp);
					}
				}
			});
			logger.log("Successfuly obtained object list from S3", JSON.stringify(data));

			callback(null, {template: INDEX_TEMPLATE, params:{files:files,
				fields:hiddenFields, bucket:policy.getConditionValueByKey("bucket")
			}});
		  }           
	});

}

exports.action = task;
