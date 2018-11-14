// pages/rankDetail/rankDetail.js


const app = getApp();
let self = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paly: false,
    list: [],
    pageShow: false,
    types: true,
    isroll: true, // 页面滚动开关
    itemData: {},
    currentId: '-1' // 当前播放音乐
  },

  /** 
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    self = this;
    let types = options.types;
    let idx = options.idx;
    this.setData({
      types: types === 'rank' ? true : false,
      currentId: app.Play.getPlaylist().select.id
    })
    this.getTopListAjax(idx, types)
    // this.getTopListAjax(idx, types)

  },
  onShow() {
    this.setData({
      itemData: {},
      currentId: app.Play.getPlaylist().select.id
    })
  },
  /**
   * 播放音乐
   */
  playMusic(event) {
    let item = event.currentTarget.dataset.item;
    console.log(item)
    let obj = {
      id: item.id,
      name: item.name,
      song: {
        artists: item.ar,
        album: item.al,
        mMusic: {
          playTime: item.dt
        }
      }
    }
    this.setData({
      itemData: obj,
      currentId: obj.id,
      paly: true
    })
  },
  /**
   * 获取列表数据
   */
  getTopListAjax(idx, types) {
    let url = '';
    let data = {};
    if (types === 'rank') {
      url = 'http_top_list';
      data.idx = idx
    } else {
      url = 'http_playlist_detail';
      data.id = idx;
    }
    wx: wx.showLoading();
    app.$api[url](data).then((res) => {
      wx.hideLoading();
      let list = [];
      if (types === 'rank') {
        list = res.data.playlist;
      } else {
        list = res.data.playlist;
      }
      console.log(list)
      self.setData({
        list,
        pageShow: true
      })
    })
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
    this.setData({
      play: e.detail.play
    })
  }
})