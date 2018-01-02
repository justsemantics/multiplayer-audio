function setCookie(cname, cvalue) {
    document.cookie = cname + "=" + cvalue + ";";
}

function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function checkCookie() {
    var user = getCookie("username");
    var pw = getCookie("password");
    if (user != "") {
        $("#username").attr("value", user);

        if (pw != "") {
            $("#password").attr("value", pw);
        }
    }
}



function getSessionID() {
    getJSON('/sessionID',
    function (err, data) {
        console.log(data);
        if (err !== null) {
            alert('Something went wrong: ' + err);
        } else {
            var json = JSON.parse(data);
            var sessionID = json.session;
            setCookie("sessionID", sessionID);
            revealLinks();
        }
    });
}

function revealLinks() {
    $("#links").removeClass("hidden");
}


//https://stackoverflow.com/questions/12460378/how-to-get-json-from-url-in-javascript
var getJSON = function (url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function () {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

$().ready(function () {
    getSessionID();

});