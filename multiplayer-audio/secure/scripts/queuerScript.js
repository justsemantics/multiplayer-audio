var videoDataApiKey = "AIzaSyA2RQY03rN2mG0iumDGau5rO6LhJmzg5-k";

var playlist = [];

var playlistElements = [];

function createVideoInfo(id) {
    var infoElement = $("#videoInfoPrefab").clone();
    $(infoElement).appendTo("#playlist");

    youtubeDataAPIQuery(id, infoElement);
}

function updatePlaylist() {
    getJSON('/playlist',
    function (err, data) {
        console.log(data);
        if (err !== null) {
            alert('Something went wrong: ' + err);
        } else {
            var parsedData = JSON.parse(data);
            
        }
    });
}

function videoInfo() {
    this.ID = "";
    this.thumbnail = "";
    this.title = "";
    this.views = "";

    this.log = function () {
        console.log("VIDEO INFO LOGGED" +
            "\nID: " + this.ID +
            "\nthumbnail URL: " + this.thumbnail +
            "\nTITLE: " + this.title +
            "\nVIEWS: " + this.views);
    }
}

function fillElementWithYoutubeInfo(element, info) {
    element.find(".videoTitle").html(info.title);
}

function youtubeDataAPIQuery(id, element) {

    var query = 'https://www.googleapis.com/youtube/v3/videos?id=' + id + '&key=' + videoDataApiKey + '&part=snippet,statistics&fields=items(id,snippet,statistics)';

    console.log(query);
    var req = $.ajax({
        url: query,
        type: "GET",
        headers: {
            'Accept': 'application/json',
        },
        timeout: 5000
    })
    .done(function (result, status, req) {
        var info = result.items[0];
        console.log(info);
        var video = new videoInfo();

        video.ID = info.id;
        video.thumbnail = info.snippet.thumbnails.default.url;
        video.title = info.snippet.title;
        video.views = info.statistics.viewCount;
        video.log();

        fillElementWithYoutubeInfo(element, video);


    })
    .fail(function (x, t, m) {
        if (t === 'timeout') {
            req.abort();
            alert("timeout :(");
        } else {
            alert("failure :(");
        }
    });
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

$(document).ready(function () {
    //youtubeDataAPIQuery('iACJwuZm2Zg');

    createVideoInfo('iACJwuZm2Zg');
});