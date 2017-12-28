// JavaScript source code
// 2. This code loads the IFrame Player API code asynchronously.
var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

var playlist = [];
var currentVideo = "";


// 3. This function creates an <iframe> (and YouTube player)
//    after the API code downloads.
var player;
function onYouTubeIframeAPIReady() {
    player = new YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'M7lc1UVf-VE',
        events: {
            'onReady': onPlayerReady,
            'onStateChange': onPlayerStateChange
        }
    });
}

// 4. The API will call this function when the video player is ready.
function onPlayerReady(event) {
    event.target.playVideo();
}

var done = false;
function onPlayerStateChange(event) {
    if (event.data == YT.PlayerState.ENDED && !done) {
        done = true;
        playNextVideo();
    }
}
function stopVideo() {
    player.stopVideo();
}

function checkForUpdates() {
    getJSON('/newVideo',
    function (err, data) {
        console.log(data);
        if (err !== null) {
            alert('Something went wrong: ' + err);
        } else {
            var json = JSON.parse(data);
            if (json.video != null){
                addVideoToPlaylist(json.video);
            }
        }
        updatePlaylistElement();
    });
}

function addVideoToPlaylist(id) {
    playlist.push(id);
}

function playVideo(id) {
    player.loadVideoById(id);
    done = false;
}

function updatePlaylistElement() {
    var newHtml = "";
    for (var i = 0; i < playlist.length; i++) {
        newHtml += playlist[i];
        newHtml += "<br>";
    }

    $("#playlist").html(newHtml);
}

function playNextVideo() {
    if (playlist.length != 0) {
        var nextVideo = playlist[0];
        playlist.splice(0, 1);

        playVideo(nextVideo);
    }
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

setInterval(checkForUpdates, 3000);