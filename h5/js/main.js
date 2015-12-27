// ----------------------------------------------------------------------------
// ready
// ----------------------------------------------------------------------------
$(document).ready(function () {

    //单机版本
    ajax(GameType.OFF_LINE, function (arr) {
        var parent = $("#game-offline");
        for (var i = 0; i < arr.length; i++) {
            makeItem(arr[i], parent, "", "");
        }
    }, 10);
    //网游版本
    ajax(GameType.ON_LINE, function (arr) {
        var parent = $("#game-online");
        for (var i = 0; i < arr.length; i++) {
            makeItem(arr[i], parent, "game-card-alt", "game-title");
        }
    }, 5);
    //微信版本
    ajax(GameType.WECHAT, function (arr) {
        var parent = $("#game-wechat");
        for (var i = 0; i < arr.length; i++) {
            makeItem(arr[i], parent, "", "game-title");
        }
    }, 5);

    function makeItem(data, parent, liClass, h3Class) {
        var li = $("<li>").addClass("game-card").addClass(liClass);
        var a1 = $('<a class="game-thumb">').attr("href", "game.html?url="+data.url)
            .append($('<img class="game-thumb-img">').attr("alt", data.name).attr("src", "icon/" + data.gameId + ".jpg"))
            .appendTo(li);
        var a2 = $('<a class="game-info">').attr("href", "game.html?url="+data.url)
            .append($('<h3>').addClass(h3Class).text(data.name))
            .appendTo(li);
        parent.append(li);
    }

});
