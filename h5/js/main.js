// ----------------------------------------------------------------------------
// ready
// ----------------------------------------------------------------------------
$(document).ready(function () {

    var sIconLi = $("#featured-thumbs");
    var sLarge = $("#featured-main");
    var sInfo = $("#featured-info");
    var sButton = $("#featured-cta");
    //top推荐
    ajaxTopGame(function (arr) {
        for(var i = 0 ; i < arr.length;i++){
            makeTopSmallItem(arr[i],sIconLi);
            makeTopLargeItem(arr[i],sLarge);
            makeTopInfoItem(arr[i],sInfo);
        }
        topShowIndex(sIconLi.children().eq(0));
    });

    function makeTopInfoItem(data,parent){
        $li = $("<li>");
        parent.append($li);
        $li.html('<h2 class="featured-title">'+data.name+'</h2>' +
            '<p class="featured-description">'+data.desc+'</p>');
    }

    function makeTopLargeItem(data,parent){
        $li = $("<li>");
        parent.append($li);
        $li.html('<a class="featured-image-link" href="game.html?id='+data.id+'">' +
            '<img width="450" height="190" alt="'+data.name+'." src="icon/large'+data.gameId+'.jpg"/>' +
            '</a>');
    }

    function makeTopSmallItem(data,parent){
        var $li = $('<li class="game-thumb game">');
        parent.append($li);
        $li.data("gid",data.id);
        $li.html('<a href="game.html?id='+data.id+'">' +
            '<img width="130" height="90" class="game-thumb-img" alt="'+data.name+'" src="icon/' + data.gameId + '.jpg"/>' +
            '<span class="cta-text">Play now</span>' +
            '</a>');
        $li.mouseenter(function () {
            topShowIndex($(this));
        })
    }

    function topShowIndex($item){
        var index = $item.prevAll().length;
        sLarge.children().css("opacity","0");
        sLarge.children().eq(index).css("opacity","1");
        sInfo.children().css("opacity","0");
        sInfo.children().eq(index).css("opacity","1");
        sInfo.children().eq(index).css("visibility","visible");
        sButton.attr("href","game.html?id="+$(this).data("gid"));
    }

    //////////////////////////////////////
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
        var a1 = $('<a class="game-thumb">').attr("href", "game.html?id="+data.id)
            .append($('<img class="game-thumb-img">').attr("alt", data.name).attr("src", "icon/" + data.gameId + ".jpg"))
            .appendTo(li);
        var a2 = $('<a class="game-info">').attr("href", "game.html?id="+data.id)
            .append($('<h3>').addClass(h3Class).text(data.name))
            .appendTo(li);
        parent.append(li);
    }

});
