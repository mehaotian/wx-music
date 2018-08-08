// pages/player/player.js
const app = getApp();
// 创建并返回内部 audio 上下文 innerAudioContext 对象。本接口是 wx.createAudioContext 升级版
const innerAudioContext = app.innerAudioContext;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    play: false,
    list: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取当前播放状态
    let playType = wx.getStorageSync('isplay');
    this.setData({
      play: playType,
    })

    this._playInit(app.util.getPlaylist().select, playType)
    console.log(innerAudioContext.duration)


  },
  /**
   * 播放音乐
   */
  playMusic() {
    let play = !this.data.play;

    this.setData({
      play: play
    })
    wx.setStorage({
      key: 'isplay',
      data: play,
    })
    if (play) {
      innerAudioContext.play();
    } else {
      innerAudioContext.pause();
    }

  },
  /**
   * 初始化播放音乐
   * item 当前播放音乐的数据合集
   * off 是否播放音乐
   * isOne 点击列表播放音乐
   */
  _playInit(item, off = true, isOne = false) {
    let self = this;
    let strName = '';
    // 拼接歌唱者和专辑名
    for (let i = 0; i < item.song.artists.length; i++) {
      if (i !== 0) {
        strName += ' / '
      }
      strName += item.song.artists[i].name
    }

    strName += " - " + item.song.album.name;
    item.strName = strName;

    // 添加到播放列表
    app.util.setPlaylist(item);

    // 数据渲染
    this.setData({
      list: item
    }, () => {
      // 请求播放数据
      // 如果在setData回到中请求接口，避免数据渲染之后，歌曲不播放的问题
      app.Play.getUrlAjax(innerAudioContext, {
        id: app.util.getPlaylist().select.id
      }, isOne, self);
    })

  }

})