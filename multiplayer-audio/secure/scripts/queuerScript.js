var videoDataApiKey = "AIzaSyA2RQY03rN2mG0iumDGau5rO6LhJmzg5-k";

var playlist = [];

var playlistElements = [];

function createVideoInfo(id) {
    var info = new videoInfo();
    playlist.push(info);

    var infoElement = $("#videoInfoPrefab").clone();
    $(infoElement).appendTo("#playlist");

    youtubeDataAPIQuery(id, info, infoElement);
}

function updatePlaylist() {
    getJSON('/playlist',
    function (err, data) {
        console.log(data);
        if (err !== null) {
            alert('Something went wrong: ' + err);
        } else {
            var newPlaylist = JSON.parse(data).currentPlaylist;
            console.log(newPlaylist);
            for (var i = 0; i < newPlaylist.length; i++) {
                if (i < playlist.length) {

                }
                else {
                    createVideoInfo(newPlaylist[i]);
                }
            }
        }
    });
}

function videoInfo() {
    this.ID = "";
    this.thumbnail = "";
    this.title = "";
    this.views = "";
    this.element = null;

    this.log = function () {
        console.log("VIDEO INFO LOGGED" +
            "\nID: " + this.ID +
            "\nthumbnail URL: " + this.thumbnail +
            "\nTITLE: " + this.title +
            "\nVIEWS: " + this.views);
    }

    this.fillElement = function () {
        this.element.find(".videoThumbnail").attr("src", this.thumbnail);
        this.element.find(".videoTitle").html(this.title);
        this.element.find(".videoViews").html(this.views + " views");
    }
}

function youtubeDataAPIQuery(id, info, element) {

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
        var data = result.items[0];
        //console.log(data);

        info.ID = data.id;
        info.thumbnail = data.snippet.thumbnails.default.url;
        info.title = data.snippet.title;
        info.views = data.statistics.viewCount;
        //info.log();
        info.element = element;
        info.fillElement();
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


    setTimeout(function () {
        console.log(playlist);
    }, 2000);
    setInterval(function () {
        updatePlaylist();
    }, 3000);
});