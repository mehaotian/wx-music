//index.js

let app = getApp();
let self;
Page({
  data: {
    isroll: true, // 页面滚动开关
    list: [], // 首页数据
    itemData: {}
  },
  onLoad() {
    self = this; // 将this 绑定于全局
    this.init(); // 初始化获取首页数据
  },
  onShow() {
    this.setData({
      itemData: {}
    })
  },
  /**
   * 跳转歌单
   */
  songFn(e) {
    // 获取歌单id
    let idx = e.currentTarget.dataset.id;
    // 跳转到歌单详情页面
    app.util.to('/pages/rankDetail/rankDetail', {
      idx,
      types: 'song'
    })
  },
  /**
   * 播放音乐
   */
  playMusic(event) {
    let item = event.currentTarget.dataset.item;
    this.setData({
      itemData: item
    })
    console.log("开始播放音乐");
  },
  // 初始化数据获取
  init() {
    // 推荐歌单
    this.getAjaxRequest();
  },
  /**
   *  获取首页数据 
   *  types   0 ：轮播图数据 ；1:推荐音乐；2:推荐歌单；3:推荐 mv；
   */
  getAjaxRequest(types) {
    let params = {
      limit: 30
    };

    // 开始请求接口
    app.$api.http_highquality(params).then((res) => {
      //  不同数据处理
      let obj = self.data.list;
      obj = res.data.playlists;

      //  推荐歌单的 播放次数处理单独处理
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].playCount > 10000) {
          let playCount = obj[i].playCount;
          playCount = (playCount / 10000).toFixed(1) + '万';
          obj[i].playCount = playCount;
        }
      }
      // 数据渲染
      self.setData({
        list: obj
      })
    })
  },

  /**
   * 设置不同的url 和返回数据key
   */
  setDataSel(types) {
    let urlName = '';
    let urlData = '';
    switch (types) {
      case 0:
        urlName = 'http_banner';
        urlData = 'banners';
        break;
      case 1:
        urlName = 'http_newsong';
        urlData = 'result';
        break;
      case 2:
        urlName = 'http_highquality';
        urlData = 'playlists';
        break;
      case 3:
        urlName = 'http_mv';
        urlData = 'result';
        break;
    }
    return {
      url: urlName,
      data: urlData
    }
  },
  /**
   * 打开播放列表是否禁止页面滚动
   */
  isroll(e) {
    console.log(e.detail.show)
    this.setData({
      isroll: e.detail.show
    })
  }

})