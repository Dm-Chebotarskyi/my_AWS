var util = require("util");
var helpers = require("../helpers");
var Policy = require("../s3post").Policy;
var S3Form = require("../s3post").S3Form;
var AWS_CONFIG_FILE = "config.json";
var POLICY_FILE = "policy.json";
var INDEX_TEMPLATE = "index.ejs";


var AWS = require('aws-sdk');

var task = function(request, callback){
	//1. load configuration
	var awsConfig = helpers.readJSONFile(AWS_CONFIG_FILE);
	var policyData = helpers.readJSONFile(POLICY_FILE);

	//2. prepare policy
	var policy = new Policy(policyData);

	//3. generate form fields for S3 POST
	var s3Form = new S3Form(policy);
	//4. get bucket name

	policy.getConditions().push({ "x-amz-meta-uploader": request.connection.remoteAddress });
	hiddenFields = s3Form.generateS3FormFields();
	hiddenFields = s3Form.addS3CredientalsFields(hiddenFields, awsConfig);

	var s3 = new AWS.S3();
	var files = [];

	s3.listObjects({Bucket: "lab4-weeia"}, 
		function(err, data) {
		  if (err) {
		  	console.log(err, err.stack); // an error occurred

		  	callback(null, {template: INDEX_TEMPLATE, params:{files: ["Faild to obtain file list"],
				fields:hiddenFields, bucket:policy.getConditionValueByKey("bucket")
			}});

		  } else {
		  	console.log("Successfuly obtainted objects list");

			data.Contents.forEach( function(item) {
				if (item.Key.startsWith("dmytro.chebotarskyi/")) {
					var name = item.Key.substr(20);
					if (! name == '')
						files.push(name);
				}
			});

			if (files.length === 0) {
				files.push("You have no files");
			}

			callback(null, {template: INDEX_TEMPLATE, params:{files:files,
				fields:hiddenFields, bucket:policy.getConditionValueByKey("bucket")
			}});
		  }           
	});

}

exports.action = task;
