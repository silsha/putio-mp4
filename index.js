var putio = require("put.io-v2");
var querystring = require("querystring");
var https = require("https");

var token = "TOKEN";

var reqdata = querystring.stringify({
	oauth_token: token
});

var api = new putio(token);

var id = 0;

function getContent(id){
	api.files.list(id, function(data){
		for(i in data.files){
			if(data.files[i].name != "items shared with you"){
				if(data.files[i].content_type == "application/x-directory"){
					getContent(data.files[i].id);
				}else if(data.files[i].content_type.substring(0,5) == "video" && data.files[i].is_mp4_available == false){
					console.log(data.files[i].is_mp4_available);
					var options = {
						host: 'api.put.io',
						port: 443,
						path: '/v2/files/' + data.files[i].id + '/mp4?oauth_token=' + token,
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Length': Buffer.byteLength(reqdata)
						}
					};

					var req = https.request(options, function(res) {
					    res.setEncoding('utf8');
					    res.on('data', function (chunk) {
					        console.log("body: " + chunk);
					    });
					});

					req.write(reqdata);
					req.end();
				}
			}
		}
	});
}

getContent();