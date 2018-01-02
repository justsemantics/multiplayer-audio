// JavaScript source code

function checkCurrentVideo() {
    getJSON('/currentVideoIndex',
            function (err, data) {
                if (err !== null) {
                    alert('Something went wrong: ' + err);
                } else {
                    var json = JSON.parse(data);
                    if (json.index != null){
                        currentVideoIndex = json.index;
                        highlightCurrentVideo();
                    }
                }
            });
}

function getYoutubeVideoIDFromURL(url) {
    //from https://gist.github.com/FinalAngel/1876898
    var regex = /youtu(?:\.be|be\.com)\/(?:.*v(?:\/|=)|(?:.*\/)?)([\w'-]+)/ig;

    var match = regex.exec(url);
    if (match == null) {
        return null;
    }
    else {
        console.log(url);
        console.log(match[1]);
        return match[1];
    }
}

function checkYoutubeVideoID() {
    //add actual logic
    return true;
}

function addCurrentVideo() {
    addVideoToPlaylist($("#videoURL").val());
}

function addVideoToPlaylist(url) {
    var id = getYoutubeVideoIDFromURL(url);

    if (id == null) {
        alert("url is no good lol");
    }
    else {
        if(checkYoutubeVideoID())
            postVideoID(id);
        else {
            alert("got ID but no video data");
        }
    }
}

function postVideoID(id) {
    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/video', true);
    var params = 'videoID=' + id;

    //Send the proper header information along with the request
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xhr.onreadystatechange = function () {//Call a function when the state changes.
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log("got post response");
        }
    }
    xhr.send(params);
}

setInterval(function () {
    checkCurrentVideo();
}, 3000)