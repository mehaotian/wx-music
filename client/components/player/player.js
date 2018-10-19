// component/player/player.js
const app = getApp();
// 创建并返回内部 audio 上下文 innerAudioContext 对象。本接口是 wx.createAudioContext 升级版
const innerAudioContext = app.innerAudioContext;

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    itemData: {
      type: Object, // 类型（必填），目前接受的类型包括：String, Number, Boolean, Object, Array, null（表示任意类型）
      value: {}, // 属性初始值（可选），如果未指定则会根据类型选择一个
      observer: function(newVal, oldVal, changedPath) {
        // console.log(newVal)
        // 判断是否第一次进入
        if (JSON.stringify(newVal) === '{}') {
          let playlist = app.Play.getPlaylist().playlist;
          // 如果播放列表有数据，那么显示上次播放的歌曲，并暂停
          if (playlist.length > 0) {
            let playType = wx.getStorageSync('isplay');
            console.log(playType)
            // if (!playType) {
            //     playType = false
            // }
            this.setData({
              play: playType,

            })

            this._playInit(app.Play.getPlaylist().select, playType)
            // 显示播放器
            console.log(playlist.length)
            this._showPage(true);
          } else {
            this._showPage(false);
          }
          return;
        }
        // 单曲点击进入执行的方法
        this._playInit(newVal, true, true);
      }
    }
  },

  /** 
   * 组件的初始数据
   */
  data: {
    isPageShow: false, //是否显示播放组件
    isPageMove: false, // 播放组件动画关键点
    play: false, // 是否播放
    list: {}, // 音乐数据列表
    isPlayListShow: false, // 是否显示播放列表
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 点击播放按钮，判断是暂停还是播放
     */
    playMusic() {
      let play = !this.data.play;
      // TODO 手动更改播放状态，目前待优化
      this.setData({
        play: play
      })
      wx.setStorage({
        key: 'isplay',
        data: play,
      })

      // 根据播放状态来判断当前是播放还是暂停
      if (play) {
        innerAudioContext.play();
      } else {
        innerAudioContext.pause();
      }

    },
    /**
     * 打开播放列表
     */
    playList() {
      this.setData({
        isPlayListShow: true
      })
      // 向父组件发送是否滚动页面事件
      this.triggerEvent('isroll', {
        show: false
      })

    },
    /**
     * 页面滚动锁，控制页面是否滚动
     */
    isroll(e) {
      // 向父组件发送是否滚动页面事件
      this.triggerEvent('isroll', {
        show: e.detail.show
      })
      // 设置本页面是否打开播放列表
      this.setData({
        isPlayListShow: false
      })
    },
    /**
     * 初始化播放音乐
     * item 当前播放音乐的数据合集
     * off 是否播放音乐
     * isOne 点击列表播放音乐
     */
    _playInit(item, off = true, isOne = false) {
      let self = this;


      // 添加到播放列表
      app.Play.setPlaylist(item);
      // 显示播放器
      this._showPage(true);
      // 数据渲染
      this.setData({
        list: item
      }, () => {
        // 请求播放数据
        // 如果在setData回到中请求接口，避免数据渲染之后，歌曲不播放的问题
        app.Play.getUrlAjax(innerAudioContext, {
          id: app.Play.getPlaylist().select.id
        }, isOne, self);

      })

    },


    /**
     * 显示隐藏播放器
     */
    _showPage(isShow) {
      // 显示播放器
      if (isShow) {
        this.setData({
          isPageShow: true
        }, () => {
          setTimeout(() => {
            this.setData({
              isPageMove: true
            })
          }, 300)
        })
      } else {
        // 隐藏播放器
        this.setData({
          isPageMove: false
        }, () => {
          setTimeout(() => {
            this.setData({
              isPageShow: false
            })
          }, 1500)
        })
      }
    },
    /**
     * 跳转到播放器页面
     */
    songPlayer() {
      app.util.to('/pages/player/player')
    },
    /**
     * 删除歌曲之后，更新当前数据
     */
    updateSong(e) {
      let play = true
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
        this._showPage(false)
        wx.setStorage({
          key: 'isplay',
          data: false,
        })
        innerAudioContext.pause();
        return
      }
      this._playInit(app.Play.getPlaylist().select, false, true)
    }
  }
})