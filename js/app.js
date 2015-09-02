$(document).ready(function (e) {
    window.trace = function (str) {
        console.log(str);
    }
    window.int = parseInt;

    var $nav = $("#nav");

    updateLangNav();

    //初始化数据
    $.getJSON("data/data.json", function (data) {
        GameManager.initData(data["games"]);

        updatePage();

        //开始页面动画
        setTimeout(pageLoadOverStartAnim,50);
    });

    /**
     * 更新页面
     */
    function updatePage() {
        updateNavTop();
        updateGameListView();
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
            var txt = '<div class="game" style="background-color:{bgcolor}">'
                    .replace('{bgcolor}', vo.bgcolor) +
                '<div class="game_box">';
            if (i % 2 == 0) {
                txt += ' <div class="gamebox_left">' +
                    '<img src="images/' + vo.bgimg + '"/>' +
                    '<img class="bigicon" src="images/' + vo.bigicon + '" width="228" height="432">' +
                    '</div>';
            }
            txt += '<div class="gamebox_right" style="margin-left:30px;">';
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
            txt += '<div class="gbr_intro"><div class="gbr_in_onetop"></div>' +
                '<div class="gbr_in_onecenter"><p>' + vo.info + '</p></div>' +
                '<div class="gbr_in_onefoot"></div></div>';
            //download
            txt += '<div id="btn_one"><a href="' + vo.downloadurl + '">';

            if ("zh" == lang) {
                txt += 'Android下载';
            } else {
                txt += 'Download';
            }
            txt += '</a></div></div>';

            //float
            if (i % 2 == 1) {
                txt += '<div class="gamebox_left"><img src="images/' + vo.bgimg + '"/>' +
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
        var $nav_b = $("#nav .nav_bottom");
        var $nav_t = $("#nav #nav_top");

        var dotArr = $nav.children();
        var bigDotArr = $nav.children(".nav_big_dot");
        var gameArr = $(".game");
        var navH = (bigDotArr.length + 1) * 90;
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
                    return
                }
            });
            if (!hasGame) {
                $(".nav_big_target").removeClass("nav_big_target").removeClass("nav_big_icon").css("background-image", "")
            }
            updateNavY()
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
                trace(navH);
                $nav_t.animate({
                    "top": stop + winh - navH - 200
                }, 500, "easeOutBack")
            }
        }

        function updateNavX() {
        }

        requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame ||
            function (callback) {
                setTimeout(callback, 1000 / 60)
            };

        function step() {
            if (isDown) {
                var mbY = int($nav_b.css("top").replace("px", ""));
                for (var i = dotArr.length - 2; i >= 0; i--) {
                    var el = $(dotArr[i]);
                    var mb2Y = int(el.css("top").replace("px", ""));
                    var toY = mbY - (mbY - mb2Y) / 2 - 5;
                    if (el.hasClass("nav_big_dot")) toY = mbY - (mbY - mb2Y) / 2 - 22;
                    if (el.hasClass("nav_big_icon")) toY = mbY - (mbY - mb2Y) / 2 - 40;
                    if (i == 0) toY = mbY - (mbY - mb2Y) / 2 - 17;
                    el.css("top", toY);
                    mbY = mb2Y
                }
            } else {
                var mbY = int($nav_t.css("top").replace("px", ""));
                var oldDiv = $nav_t;
                for (var i = 1; i < dotArr.length; i++) {
                    var el = $(dotArr[i]);
                    var mb2Y = int(el.css("top").replace("px", ""));
                    var toY = mbY + (mb2Y - mbY) / 2 + 5;
                    if (oldDiv.hasClass("nav_big_dot")) toY = mbY + (mb2Y - mbY) / 2 + 22;
                    if (oldDiv.hasClass("nav_big_icon")) toY = mbY + (mb2Y - mbY) / 2 + 40;
                    if (i == 1) toY = mbY + (mb2Y - mbY) / 2 + 17;
                    el.css("top", toY);
                    mbY = mb2Y;
                    oldDiv = el
                }
            }
            requestAnimationFrame(step)
        }

        requestAnimationFrame(step)
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
        if (vo.isEn) {
            GameManager._dataEnArr.push(vo);
        } else {
            GameManager._dataZhArr.push(vo);
        }
    }
};

GameManager.getData = function () {
    if (lang == "zh") {
        return GameManager._dataZhArr;
    }
    return GameManager._dataEnArr;
}