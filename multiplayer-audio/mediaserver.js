var userID = '9999';
var pw = '1234';


var userSession = function (){
    this.ID = "";
    this.authorized = false;
    this.expiry = Date.now() + 60 * 60 * 1000; // one hour
}

var sessions = [];

//node modules
var express = require('express');
var http = require('http');
var SSH = require('simple-ssh');
var os = require('os');
var fs = require('fs');
var qs = require('querystring');
var fileupload = require('express-fileupload');
var cookie = require('cookie');
var shortid = require('shortid');
var util = require('util');
var childProcess = require('child_process');


var app = express();





///////////////////////////////
//// APP.USE
///////////////////////////////

//app.use('/secure',
//	function(req, res, next){
//		var cookies = cookie.parse(req.headers.cookie || '');

//		let session = cookies.sessionID;
//		let sessionIndex = findSessionIndex(session);
//		if (sessionIndex >= 0){
//			if(sessions[sessionIndex].authorized){
//				next('route');
//			}
//			else{
//				console.log('[' + req.ip +'] unauthorized session');

//				res.redirect('/');
//			}
//		}
//		else{
//			console.log('[' + req.ip +'] no session');
//			res.redirect('/');
//		}
//	}
//);

//app.use('/secure', express.static('secure'));

app.use(express.static('secure'));



var nextVideo = null;


///////////////////////////////
//// APP.GET
///////////////////////////////

app.get('/sessionID', function(req, res){
    var session = "";
	var sessionID = "";

	var cookies = cookie.parse(req.headers.cookie || '');
	var sessionIndex = findSessionIndex(cookies.sessionID);

	if(sessionIndex >= 0){
		sessionID = sessions[sessionIndex].ID;
	}
	else{
		var newSession = new userSession();
		newSession.ID = shortid.generate();
		sessionID = newSession.ID;
		sessions.push(newSession);
		console.log("new connection: ["+ req.ip +"] assigned session ID ["+sessionID+"]");
	}

    var json = JSON.stringify(
        {
            session: sessionID
        });

    res.json(json);
});

app.get('/newVideo', function (req, res) {
    var video = "";
    var json = JSON.stringify(
        {
            video: nextVideo
        });


    res.json(json);
    nextVideo = null;
});



///////////////////////////////
//// APP.POST
///////////////////////////////
//app.use(express.urlencoded());

app.post('/login', function(req, res){
	let body = '';

    req.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        if (body.length > 1e6)
            req.connection.destroy();
    });

    req.on('end', function () {
      let post = qs.parse(body);
      var cookies = cookie.parse(req.headers.cookie || '');
     let sessionIndex = findSessionIndex(cookies.sessionID);
		if(sessionIndex >= 0){ //if user has a session
			if(post.username == userID && post.password == pw){
				sessions[sessionIndex].authorized = true;
				console.log("session [" + sessions[sessionIndex].ID + "] authorized");
				res.redirect("/secure/signController.html");
			}
			else{
				sessions[sessionIndex].authorized = false;
				res.redirect("/");
			}
		}
		else{
			res.redirect("/");
		}
    });
});

app.post('/video', function (req, res) {
    let body = '';

    req.on('data', function (data) {
        body += data;

        // Too much POST data, kill the connection!
        if (body.length > 1e6)
            req.connection.destroy();
    });

    req.on('end', function () {
        let post = qs.parse(body);
        if (post.videoID != null) {
            console.log(post.videoID);
            addVideo(post.videoID);
        }

        res.sendStatus(204);
    });
}); 

function addVideo(id){
    nextVideo = id;
}



//drop this middleware in front of any "secure" express functions and it will redirect to the login screen unless the client supplies an authorized session ID
function checkAuth(){
	return function(req, res, next){

	var cookies = cookie.parse(req.headers.cookie || '');
	let session = cookies.sessionID;
	let sessionIndex = findSessionIndex(session);

	if (sessionIndex >= 0){
		if(sessions[sessionIndex].authorized){
			next();
		}
		else{
			console.log('['+req.ip+'] unauthorized session');
			res.redirect('/');
		}
	}
	else{
		console.log('['+req.ip+']no session');
		res.redirect('/');
		}
	}
}

function findSessionIndex(sessionID){
	for(var i = 0; i < sessions.length; i++){
		if(sessions[i].ID == sessionID){
			return i;
		}
	}
	return -1;
}

function removeExpiredSessions(){
	for(var i = sessions.length - 1; i >= 0; i--){
		if(sessions[i].expiry < Date.now()){
			console.log("["+sessions[i].ID+"] expired, removing it from the session list");
			sessions.splice(i, 1);
		}
	}
}

//finish setting up server and go live
setInterval(removeExpiredSessions, 15000);

var server = http.createServer(app);
var port = 80;

var host = '0.0.0.0';
//var host = '192.168.0.51'
server.listen(port, host);

var interfaces = os.networkInterfaces();
var addresses = [];
for (var k in interfaces) {
    for (var k2 in interfaces[k]) {
        var address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
            addresses.push(address.address);
        }
    }
}

console.log('media queuer is up and listening (http://' + addresses[0] + ':' + port + ')');

//written by Zach Daniel
