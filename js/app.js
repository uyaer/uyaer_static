$(document).ready(function (e) {
    window.trace = function (str) {
        console.log(str);
    }
    window.int = parseInt;

    var $nav = $("#nav");

    updateLangNav();

    //初始化数据
    $.getJSON("data/data.json?"+Date.now(), function (data) {
        GameManager.initData(data["games"]);

        updatePage();

        //开始页面动画
        setTimeout(pageLoadOverStartAnim, 50);

        //重新定位
        scrollToView();
    });

    /**
     * 重定位
     */
    function scrollToView(){
        var url = location.href;
        if(url.indexOf("#game-")>-1){
            location.href = url;
        }
    }

    /**
     * 更新页面
     */
    function updatePage() {
        if (!isMobile) {
            updateNavTop();
        }
        updateGameListView();
        bindBigIconEvent();
    }

    /**
     * 绑定事件
     */
    function bindBigIconEvent() {
        if (!isMobile)return;
        $(".bigicon").click(function () {
            $body = $("body");
            var container = $("<div id='showImgContainer'>").appendTo($body);
            var img = $("<img id='showImg'>").attr("src", $(this).attr("src"));
            img.appendTo($body);
            var w = innerWidth;
            var h = innerHeight;
            var ow = $(this).width();
            var oh = $(this).height();
            var pre = ow / oh;//宽高比
            var dw = w * 0.75;
            var dh = h * 0.75;
            if (w < h * pre) { //竖屏
                dh = dw / pre;
            } else { //横屏
                dw = dh * pre;
            }
            img.width(ow);
            img.height(oh);
            var box = $(this)[0].getBoundingClientRect();
            trace(box.top + " " + box.left)
            img.css("top", box.top);
            img.css("left", box.left);
            img.animate({
                "width": dw,
                "height": dh,
                "top": (h - dh) / 2,
                "left": (w - dw) / 2
            }, 500);
            container.hide();
            container.fadeIn(500);
            img.click(function () {
                img.animate({
                    "width": ow,
                    "height": oh,
                    "top": box.top,
                    "left": box.left
                }, 500, function () {
                    $body.off("touchmove", preventDefaultHandler);
                    img.remove();
                });
                container.fadeOut(500, function () {
                    container.remove();
                });
            });
            $body.on("touchmove", preventDefaultHandler);
        });
    }

    function preventDefaultHandler(e) {
        e.preventDefault();
    }

    /**
     * 创建所有的游戏
     */
    function updateGameListView() {
        var htmlTxt = "";
        var arr = GameManager.getData();
        for (var i = 0; i < arr.length; i++) {
            /**@type GameVo*/
            var vo = arr[i];
            var txt = '<div class="game" id="game-' + vo.id + '" style="background-color:{bgcolor}">'
                    .replace('{bgcolor}', vo.bgcolor) +
                '<div class="game_box">';
            if (i % 2 == 0) {
                txt += ' <div class="gamebox_left">' +
                    '<img src="images/' + vo.bgimg + '"/>' +
                    '<img class="bigicon" src="images/' + vo.bigicon + '" width="228" height="432">' +
                    '</div>';
            }
            if (i % 2 == 1 && isMobile) {
                txt += '<div class="gamebox_right float_left" >';
            } else {
                txt += '<div class="gamebox_right" >';
            }
            if (lang == "en") {
                txt += '<div class="gbr_title gbr_title_en" style="background-image:url(images/{icon})">{name}</div>'
                    .replace('{icon}', vo.icon).replace('{name}', vo.name);
            } else {
                txt += '<div class="gbr_title" style="background-image:url(images/{icon})">{name}</div>'
                    .replace('{icon}', vo.icon).replace('{name}', vo.name);
            }
            //info
            txt += '<div class="gbr_info"><ul>';
            if ("zh" == lang) {
                txt += '<li>游戏大小：<span>' + vo.gamesize + '</span></li>' +
                    '<li>适应系统：<span>' + vo.gameos + '</span></li>' +
                    '<li>上传时间：<span>' + vo.updatetime + '</span></li>' +
                    '<li>游戏版本：<span>' + vo.version + '</span></li>';
            } else {
                txt += '<li>size：<span>' + vo.gamesize + '</span></li>' +
                    '<li>os：<span>' + vo.gameos + '</span></li>' +
                    '<li>update time：<span>' + vo.updatetime + '</span></li>' +
                    '<li>version：<span>' + vo.version + '</span></li>';
            }
            txt += '</ul><div class="clear"></div></div>';
            //desc
            txt += '<div class="gbr_intro">' +
                '<div class="gbr_in_onecenter"><p>' + vo.info + '</p></div>' +
                '<div class="gbr_in_onefoot"></div></div>';
            //download
            txt += '<div id="btn_one"><div class="down_icon"></div><a href="' + vo.downloadurl + '">';

            if ("zh" == lang) {
                txt += 'Android下载';
            } else {
                txt += 'Download';
            }
            txt += '</a><div class="clear"></div></div></div>';

            //float
            if (i % 2 == 1) {
                txt += '<div class="gamebox_left ' + (isMobile ? 'float_right' : '') + '"><img src="images/' + vo.bgimg + '"/>' +
                    '<img class="bigicon" src="images/' + vo.bigicon + '"width="228" height="432"></div>';
            }

            txt += '<div class="clear"></div></div></div>';

            htmlTxt += txt;
        }

        $("#game_container").html(htmlTxt);
    }

    /**
     * 更新语言
     */
    function updateLangNav() {
        //语言
        var lang = window.lang;
        if (!lang) {
            if (navigator.language.toLowerCase().indexOf("en") != -1) {
                window.lang = "en";
            } else {
                window.lang = "zh";
            }
        }
        var href = '<a href="./?lang=en">English</a>';
        if (lang == "en") {
            href = '<a href="./?lang=zh">中文版</a>';
        }
        $("#top_right").html(href);
    }


    /**
     * 更新导航
     */
    function updateNavTop() {
        var arr = GameManager.getData();
        var htmlTxt = '<div id="nav_top"></div>';
        for (var i = 0; i < arr.length; i++) {
            /**@type GameVo*/
            var vo = arr[i];
            htmlTxt += '<div class="nav_big_dot" style="background-color: {bgcolor}" data-icon="{icon}"></div>'
                    .replace('{bgcolor}', vo.bgcolor)
                    .replace('{icon}', vo.icon) +
                '<div class="nav_white_dot"></div>' +
                '<div class="nav_white_dot"></div>' +
                '<div class="nav_white_dot"></div>' +
                '<div class="nav_white_dot"></div>';
        }
        htmlTxt += '<div class="nav_bottom">Top</div>';
        $nav.html(htmlTxt);
    }

    /**
     * 开始页面动画
     */
    function pageLoadOverStartAnim() {
        var navScale = 1;
        if (isMobile) {
            navScale = 2;
        }


        var $nav_b = $("#nav .nav_bottom");
        var $nav_t = $("#nav #nav_top");

        var dotArr = $nav.children();
        var bigDotArr = $nav.children(".nav_big_dot");
        var gameArr = $(".game");
        var navH = (bigDotArr.length + 1) * 90 * navScale;


        updateNavX();
        updateNavY();
        var gamelen = $(".game").length;
        var currGameIndex = 0;
        var oldScrollH = 0;
        var oldScrollTime = 0;
        var isDown = true;
        var isHover = false;
        var isHoverAnimOver = true;
        var isNeedOverAnim = false;
        var hoverTarget;
        $(window).resize(function (e) {
            updateNavX(true)
        });
        if (!isMobile) {
            $(window).scroll(function (e) {
                var stop = $(window).scrollTop();
                var winH = window.innerHeight;
                var hasGame = false;
                gameArr.each(function (index, el) {
                    el = $(el);
                    var gtop = el.offset().top;
                    var h1 = gtop - winH / 3;
                    var h2 = h1 + el.height();
                    if (stop >= h1 && stop < h2) {
                        var bigDot = $(bigDotArr[index]);
                        $(".nav_big_target").removeClass("nav_big_target").removeClass("nav_big_icon").css("background-image", "");
                        bigDot.addClass("nav_big_icon").addClass("nav_big_target");
                        bigDot.css("background-image", "url(images/" + bigDot.data("icon") + ")");
                        hasGame = true;
                        return;
                    }
                });
                if (!hasGame) {
                    $(".nav_big_target").removeClass("nav_big_target").removeClass("nav_big_icon").css("background-image", "")
                }
                updateNavY();
                isAnimStop = false;
            });
            $("#nav .nav_big_dot").click(function (e) {
                var index = $(this).prevAll(".nav_big_dot").length;
                var pos = $($(".game").get(index)).offset();
                var winH = window.innerHeight;
                $(window).scrollTop(pos.top - 50)
            });
            $("#nav .nav_bottom").click(function (e) {
                $(window).scrollTop(0)
            });
            $("#nav .nav_big_dot").mouseover(function (e) {
                var el = $(this);
                if (el.hasClass("nav_big_target")) return;
                el.addClass("nav_big_icon");
                el.css("background-image", "url(images/" + el.data("icon") + ")");
                isHover = true;
                hoverTarget = el;
                isHoverAnimOver = false;
                setTimeout(function () {
                    isHoverAnimOver = true;
                    if (isNeedOverAnim) {
                        el.removeClass("nav_big_icon");
                        el.css("background-image", "");
                        isHover = false;
                        hoverTarget = null;
                        isNeedOverAnim = false
                    }
                }, 150)
            });
            $("#nav .nav_big_dot").mouseout(function (e) {
                var el = $(this);
                if (el.hasClass("nav_big_target")) return;
                if (!isHoverAnimOver) {
                    isNeedOverAnim = true
                } else {
                    el.removeClass("nav_big_icon");
                    el.css("background-image", "");
                    isHover = false;
                    hoverTarget = null;
                    isNeedOverAnim = false
                }
            });
        }


        function updateNavY() {
            var now = Date.now();
            oldScrollTime = Date.now();
            var stop = $(window).scrollTop();
            var deltaY = stop - oldScrollH;
            oldScrollH = stop;
            var winh = window.innerHeight;
            $nav_b.stop();
            $nav_t.stop();
            if (deltaY > 0) {
                isDown = true;
                $nav_b.animate({
                    "top": stop + winh - 200
                }, 500, "easeOutBack")
            } else {
                isDown = false;
                $nav_t.animate({
                    "top": stop + winh - navH - 200
                }, 500, "easeOutBack")
            }
        }

        function updateNavX() {
        }

        var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || _requestAnimationFrame;

        function _requestAnimationFrame(callback) {
            setTimeout(callback, 1000 / 60)
        }

        var lastUpdateTime = Date.now();
        var isAnimStop = false;

        function step() {
            requestAnimationFrame(step);

            var now = Date.now();
            var dt = now - lastUpdateTime;
            var fps = parseInt(1000 / dt);
            lastUpdateTime = now;

            var moveSpeed = 2;

            if (isAnimStop || isMobile) {
                $("#debug").text(VERSION + " " + (Date.now() - lastUpdateTime) + " " + fps);
                return;
            }
            isAnimStop = true;
            if (isDown) {
                var mbY = int($nav_b.css("top").replace("px", ""));
                for (var i = dotArr.length - 2; i >= 0; i--) {
                    var el = $(dotArr[i]);
                    var mb2Y = int(el.css("top").replace("px", ""));
                    var toY = mbY - (mbY - mb2Y) / moveSpeed - 5 * navScale;
                    if (el.hasClass("nav_big_dot")) toY = mbY - (mbY - mb2Y) / moveSpeed - 22 * navScale;
                    if (el.hasClass("nav_big_icon")) toY = mbY - (mbY - mb2Y) / moveSpeed - 40 * navScale;
                    if (i == 0) {
                        toY = mbY - (mbY - mb2Y) / moveSpeed - 17 * navScale;
                    }
                    el.css("top", toY);
                    mbY = mb2Y;
                    if (Math.abs(toY - mb2Y) >= 1) {
                        isAnimStop = false;
                    }
                }
            } else {
                var mbY = int($nav_t.css("top").replace("px", ""));
                var oldDiv = $nav_t;
                for (var i = 1; i < dotArr.length; i++) {
                    var el = $(dotArr[i]);
                    var mb2Y = int(el.css("top").replace("px", ""));
                    var toY = mbY + (mb2Y - mbY) / moveSpeed + 5 * navScale;
                    if (oldDiv.hasClass("nav_big_dot")) toY = mbY + (mb2Y - mbY) / moveSpeed + 22 * navScale;
                    if (oldDiv.hasClass("nav_big_icon")) toY = mbY + (mb2Y - mbY) / moveSpeed + 40 * navScale;
                    if (i == 1) {
                        toY = mbY + (mb2Y - mbY) / moveSpeed + 17 * navScale;
                    }
                    el.css("top", toY);
                    mbY = mb2Y;
                    oldDiv = el;
                    if (Math.abs(toY - mb2Y) >= 1) {
                        isAnimStop = false;
                    }
                }
            }

            $("#debug").text(VERSION + " " + (Date.now() - lastUpdateTime) + " " + parseInt(1000 / dt));
        }

        requestAnimationFrame(step);
    }
});

/**
 * ================================= GameVo ===========================================
 * @param obj
 * @constructor
 */
function GameVo(obj) {
    /**
     * id
     */
    this.id = obj.id;
    /**
     * 排序
     */
    this.sort = obj.sort;
    /**
     * 游戏名称
     */
    this.name = obj.name;
    /**
     * 包大小
     */
    this.gamesize = obj.gamesize;
    /**
     * 系统要求
     */
    this.gameos = obj.gameos;
    /**
     * 更新日期
     */
    this.updatetime = obj.updatetime;
    /**
     * 版本号
     * @type {*|string}
     */
    this.version = obj.version;
    /**
     * 描述
     */
    this.info = obj.info;
    /**
     * 背景颜色
     */
    this.bgcolor = obj.bgcolor;
    /**
     * 背景图片
     */
    this.bgimg = obj.bgimg;
    /**
     * 大图标
     */
    this.bigicon = obj.bigicon;
    /**
     * 小图标
     */
    this.icon = obj.icon;
    /**
     * 下载地址
     */
    this.downloadurl = obj.downloadurl;
    /**
     * 导航头像
     */
    this.navicon = obj.navicon;
    /**
     * 是否是英文版本
     */
    this.isEn = obj.isen;
    /**
     * 正式版本是否显示
     */
    this.isShow = obj.isshow;
}

/**
 * ================================== GameManager ==================================
 * @type Object
 */
var GameManager = {};
/**
 * 中文游戏
 * @type {Array}
 * @private
 */
GameManager._dataZhArr = [];
/**
 * 英文游戏数据
 * @type {Array}
 * @private
 */
GameManager._dataEnArr = [];
GameManager.initData = function (arr) {
    GameManager._dataZhArr = [];
    GameManager._dataEnArr = [];
    for (var i = 0; i < arr.length; i++) {
        var vo = new GameVo(arr[i]);
        //正式版下，不显示的东西
        if (!isDebug && !vo.isShow)continue;
        if (vo.isEn) {
            GameManager._dataEnArr.push(vo);
        } else {
            GameManager._dataZhArr.push(vo);
        }
    }
    GameManager._dataEnArr.sort(function (a,b) {
        return a.sort < b.sort;
    });
    GameManager._dataZhArr.sort(function (a,b) {
        return a.sort < b.sort;
    });
};

GameManager.getData = function () {
    if (lang == "zh") {
        return GameManager._dataZhArr;
    }
    return GameManager._dataEnArr;
}