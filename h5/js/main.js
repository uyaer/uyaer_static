// ----------------------------------------------------------------------------
// ready
// ----------------------------------------------------------------------------
$(document).ready(function () {

  $("#js-toggle-nav-menu").click(function () {
    $(" #wdg_menu, .content, #wdg_footer_container_zibbo").toggleClass("flyout-active");
  });

  var now = Date.now();
  var appId = "A6905655566893";
  var appKey = "550A1EB9-EC16-2D80-D828-8BB8F9839EF6";
  var appKey = SHA1(appId+"UZ"+appKey+"UZ"+now)+"."+now

  var filter = {
    fields:["gameId","name"]
  }
  $.ajax({
    "url": "https://d.apicloud.com/mcm/api/list?filter=" + encodeURIComponent(JSON.stringify(filter)),
    "method": "GET",
    "cache": false,
    "headers": {
      "X-APICloud-AppId":appId,
      "X-APICloud-AppKey": appKey
    }
  }).success(function (data, status, header) {

  })
});
