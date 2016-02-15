$(document).ready(function () {
    var menu = $("#js-toggle-nav-menu");
    if(menu){
        menu.click(function () {
            $(" #wdg_menu, .content, #wdg_footer_container_zibbo").toggleClass("flyout-active");
        });
    }

    var now = Date.now();
    var appId = "A6905655566893";
    var appKey = "550A1EB9-EC16-2D80-D828-8BB8F9839EF6";
    var appKey = SHA1(appId + "UZ" + appKey + "UZ" + now) + "." + now

    window.GameType = {
        ON_LINE: 1,//网游
        OFF_LINE: 2,//单机
        WECHAT: 3 //微信广告
    }

    window.ajax = function (type, callback, limit) {
        var filter = {
            "fields": ["gameId", "name","id"],
            "limit": limit || 1000
        };
        if (type > 0) {
            filter["where"] = {"type": type};
        }
        $.ajax({
            "url": "https://d.apicloud.com/mcm/api/list?filter=" + encodeURIComponent(JSON.stringify(filter)),
            "method": "GET",
            "cache": false,
            "headers": {
                "X-APICloud-AppId": appId,
                "X-APICloud-AppKey": appKey
            }
        }).success(function (data, status, header) {
            callback && callback(data);
        });
    }
    window.ajaxGameInfo = function (id, callback) {
        var filter = {
            "fields": ["params","url","gameId","name"],
            "limit": 1,
            "where":{"id":id}
        };
        $.ajax({
            "url": "https://d.apicloud.com/mcm/api/list?filter=" + encodeURIComponent(JSON.stringify(filter)),
            "method": "GET",
            "cache": false,
            "headers": {
                "X-APICloud-AppId": appId,
                "X-APICloud-AppKey": appKey
            }
        }).success(function (data, status, header) {
            callback && callback(data);
        });
    }

    /**
     * 从地址上获取key
     * @param name
     * @returns {string}
     */
    window.getURLQueryString = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            return decodeURI(r[2]);
        }
        return null;
    }
});