// pages/player/player.js
const app = getApp();
// 创建并返回内部 audio 上下文 innerAudioContext 对象。本接口是 wx.createAudioContext 升级版
const innerAudioContext = app.innerAudioContext;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    play: false, // 播放设置
    list: {},
    isPlayListShow: false,
    random: [{
        icon: 'icon-icon-2',
        text: '随机播放'
      },
      {
        icon: 'icon-icon-1',
        text: '列表循环'
      },
      {
        icon: 'icon-icon-',
        text: '单曲循环'
      },
    ],
    randomIndex: 0,
    nowTime: {
      h: 0,
      m: 0,
      s: 0,
      time: 0,

    }, // 当前播放时间
    timer: null,
    stopPlay: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 获取当前播放状态
    let random = wx.getStorageSync('random:play')
    let playType = wx.getStorageSync('isplay');
    this.setData({
      play: playType,
      randomIndex: random
    })

    /**
     * 播放进度更新
     */
    this.playTime(true)
    this._playInit(app.Play.getPlaylist().select, playType)
    
  },
  onShow() {},
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
      if (!innerAudioContext.paused) {
        app.Play.getUrlAjax(innerAudioContext, {
          id: app.Play.getPlaylist().select.id
        }, false, this);
      } else {
        innerAudioContext.play();
      }
    } else {
      innerAudioContext.pause();
    }
  },
  /**
   * 播放顺序
   */
  randomPlay() {
    let random = this.data.random
    let index = this.data.randomIndex
    index++
    if (index > random.length - 1) {
      index = 0
    }
    this.setData({
      randomIndex: index
    })
    wx.showToast({
      title: this.data.random[index].text,
      icon: 'none',
    })
    wx.setStorageSync('random:play', index)
    // console.log(this.data.randomIndex)
  },
  /**
   * 切换歌曲 ，上一曲，下一曲
   */
  switchSong(e) {
    // 获取点击状态
    let types = e.currentTarget.dataset.type
    this.switchInit(types, false)

  },
  switchInit(types, auto) {
    // 获取切换列表
    let item = app.Play.randomPlay(types, auto)
    // TODO 因为本页面有大图片，所以刷新会比较慢，之后会考虑列表缓存的方式
    clearTimeout(this.data.timer)
    this.setData({
      list: item.song
    })

    // 初始化播放音乐
    this._playInit(item.song, true)
  },
  /**
   * 打开播放列表
   */
  playList() {
    this.setData({
      isPlayListShow: true
    })
  },
  /**
   * 初始化播放音乐
   * item 当前播放音乐的数据合集
   * isOne 是否播放
   */
  _playInit(item, isOne = false) {
    let self = this;
    item.time = app.util.getTime(item.song.mMusic.playTime)
    // 添加到播放列表
    app.Play.setPlaylist(item);

    clearTimeout(this.data.timer)
    // innerAudioContext.stop();
    // 数据渲染
    this.setData({
      list: item,
      nowTime: {
        h: 0,
        m: 0,
        s: 0,
        time: 0
      }
    }, () => {
      // 请求播放数据
      // 如果在setData回到中请求接口，避免数据渲染之后，歌曲不播放的问题
      if (isOne) {
        app.Play.getUrlAjax(innerAudioContext, {
          id: app.Play.getPlaylist().select.id
        }, isOne, self);
      }
    })

  },
  /**
   * 删除歌曲之后，更新当前数据
   */
  updateSong(e) {
    console.log(e.detail.show)
    // 播放列表空
    if (e.detail.show) {
      this.setData({
        isPlayListShow: false,
        play: false

      })
      // 向父组件发送是否滚动页面事件
      this.triggerEvent('isroll', {
        show: true
      })
      innerAudioContext.stop();
      wx.navigateBack()
      return
    }
    this._playInit(app.Play.getPlaylist().select, true)
  },
  /**
   * 更新进度条
   */
  playTime(types) {
    if (!types) {
      return
    }
    let s = app.util.getTime(innerAudioContext.currentTime * 1000)
    if (!s.h) s.h = 0;
    if (!s.m) s.m = 0;
    if (!s.s) s.s = 0;
    this.setData({
      nowTime: s
    })
  },
  progressMove(res) {
    let time = res.detail.value * (this.data.list.time.time / 100)
    // nowTime.time / (list.time.time / 100)
    let s = app.util.getTime(time)
    if (!s.h) s.h = 0;
    if (!s.m) s.m = 0;
    if (!s.s) s.s = 0;
    this.setData({
      nowTime: s,
    })
      innerAudioContext.seek(time / 1000)
  }

})