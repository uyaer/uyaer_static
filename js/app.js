$(document).ready(function (e) {
    window.trace = function (str) {
        console.log(str);
    }
    window.int = parseInt;

    var $nav = $("#nav");
    var $nav_b = $("#nav .nav_bottom");
    var $nav_t = $("#nav #nav_top");

    //语言
    window.lang = "";
    if (navigator.language.toLowerCase().indexOf("zh") != -1) {
        lang = "zh";
    } else {
        lang = "en";
    }

    //初始化数据
    $.getJSON("data/data.json", function (data) {
        GameManager.initData(data["games"]);

        updatePage();
    });

    /**
     * 更新页面
     */
    function updatePage() {
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
});