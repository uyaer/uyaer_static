$(document).ready(function () {
    var type = getURLQueryString("type") || -1;

    //请求数据
    ajax(type, function (arr) {
        var parent = $("#game-list");
        for (var i = 0; i < arr.length; i++) {
            makeItem(arr[i], parent);
        }
    }, 10);

    function makeItem(data, parent) {
        var li = $('<li class="game-card ng-scope">');
        var a1 = $('<a class="game-thumb ng-isolate-scope">').attr("href", data.url)
            .append($('<img class="game-thumb-img game-image ng-isolate-scope">')
                .attr("alt", data.name)
                .attr("title", data.name).attr("src", "icon/" + data.gameId + ".jpg"))
            .appendTo(li);
        var a2 = $('<a class="game-info ng-isolate-scope">').attr("href", data.url)
            .append($('<h3 class="ng-scope ng-binding">').text(data.name))
            .appendTo(li);
        parent.append(li);
    }
});
