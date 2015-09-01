function GameVo(obj){
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