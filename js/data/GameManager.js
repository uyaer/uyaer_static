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

GameManager.getData= function () {
    if(lang == "zh"){
        return GameManager._dataZhArr;
    }
    return GameManager._dataEnArr;
}