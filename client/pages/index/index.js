//index.js

let app = getApp();
let self;
Page({
  data: {
    play: false,
    isroll: true, // 页面滚动开关
    itemData: {},
    list: {}, // 首页数据
    currentId: '-1' // 当前播放音乐
  },
  onLoad() {
    self = this; // 将this 绑定于全局
    this.setData({
      currentId: app.Play.getPlaylist().select.id
    })
    this.init(); // 初始化获取首页数据
  },
  onShow() {
    this.setData({
      itemData: {},
      currentId: app.Play.getPlaylist().select.id
    })
  },

  /**
   * 跳转到 私人FM 排行 我的
   */
  jumpPage(e) {
    // 获取 私人FM（0） 、排行（1） 、 我的（2） 三个按钮状态
    let typesPage = e.target.dataset.type;
    // 获取跳转的url
    let url = e.target.dataset.url;
    // 判断是否 私人FM 、我的按钮。这两个按钮点击要判断是否登陆，需要额外处理
    if (typesPage == 0 || typesPage == 2) {
      //  判断是否登陆
      let userinfo = app.util.user(url);
      // 如果没有登陆，停止操作，会自动进入登陆页面
      if (!userinfo) return;
    }
    // 页面跳转
    app.util.to(url);
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
    console.log(item)
    this.setData({
      itemData: item,
      currentId: item.id,
      // paly: true
    })
    wx.setStorageSync('isplay', true);

    console.log("开始播放音乐");
  },
  // 初始化数据获取
  init() {
    //获取轮播图数据
    this.getAjaxRequest(0);

    // 推荐音乐
    this.getAjaxRequest(1);

    // 推荐歌单
    this.getAjaxRequest(2);

    // 推荐 mv
    this.getAjaxRequest(3);
  },
  /**
   *  获取首页数据 
   *  types   0 ：轮播图数据 ；1:推荐音乐；2:推荐歌单；3:推荐 mv；
   */

  getAjaxRequest(types) {
    let params = {};
    // type == 2 ，说明是推荐歌单，需要传入参数，获取前6条数据
    if (types === 2) {
      params = {
        limit: 6
      }
    }
    // 开始请求接口
    app.$api[self.setDataSel(types).url](params).then((res) => {
      //  不同数据处理
      let obj = self.data.list;
      if (!obj[types]) obj[types] = [];
      obj[types] = res.data[self.setDataSel(types).data];

      //  推荐歌单的 播放次数处理单独处理
      if (types === 2 || types === 3) {

        for (let i = 0; i < obj[types].length; i++) {
          if (obj[types][i].playCount > 10000) {
            let playCount = obj[types][i].playCount;
            playCount = (playCount / 10000).toFixed(1) + '万';
            obj[types][i].playCount = playCount;
          }
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
  },
  play(e) {
    console.log(e.detail)
    this.setData({
      play: e.detail.play
    })
  }

})