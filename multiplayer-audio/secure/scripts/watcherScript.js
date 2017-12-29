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

setInterval(function () {
    checkCurrentVideo();
}, 3000)