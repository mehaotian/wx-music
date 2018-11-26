// components/playList/playList.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    show: {
      type: Boolean,
      value: false,
      observer(newVal, oldVal, changedPath) {
        // 新值为true ，表示打开播放列表，这个时候初始化列表数据 
        if (newVal) {
          this._listInit()
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    list: [], // 数据
    isPageMove: false,
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
    randomIndex: 0
  },
  ready() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    _listInit() {
      let self = this
      let random = wx.getStorageSync('random:play')

      // 获取播放列表数据
      let playList = app.Play.getPlaylist();
      // 这个判断其实不用写也行，如果打开播放列表，肯定最少是有一首歌曲的
      if (playList.playlist.length > 0) {
        // 保证在数据渲染完毕之后，在打开播放列表
        this.setData({
          list: playList.playlist,
          randomIndex: random
        }, () => {
          this._showPage(this.data.show)
        })
      } else {
        this._showPage(false)
      }
    },
    /**
     * 显示隐藏播放器
     */
    _showPage(isShow) {
      // 显示播放器
      if (isShow) {
        setTimeout(() => {
          this.setData({
            isPageMove: true
          })
        }, 30)
      } else {
        // 隐藏播放器，设置定时器的目的是 ，避免马上消失，必须等元素动画结束之后，在隐藏元素，并发送数据
        this.setData({
          isPageMove: false
        }, () => {
          setTimeout(() => {
            this.setData({
              show: false
            })
            this.triggerEvent('isroll', {
              show: true
            })
          }, 330)
        })

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
      wx.setStorageSync('random:play', index)
      // console.log(this.data.randomIndex)
    },
    // 关闭播放列表
    closeMask() {
      this._showPage(false)
    },
    // 清理事件冒泡，可以不写内容 ，但是必须有这个事件 ，目前原生还不知道有没有更好的替代方案
    clear() {},
    // 删除歌曲
    delSong(e) {
      let self = this
      let key = e.currentTarget.dataset.key
      // 获取当前绑定的list数据，切勿调用本地储存里的数据  app.Play.getPlaylist()
      let playlist = this.data.list
      let song = {}
      if (playlist[key].checked) {
        song = app.Play.randomPlay('next', false, true).song
        for (let i = 0; i < playlist.length; i++) {
          if (playlist[i].id === song.id) {
            playlist[i].checked = true
          }
        }
        if (playlist.length === 1) {
          wx.showModal({
            title: '提示',
            content: '删除歌曲将停止当前播放，是否确认删除？',
            success(e) {
              console.log(e)
              if (e.confirm) {
                playlist.splice(key, 1)
                self._playMusicInit(playlist)
              }
            }
          })
          return
        }
        playlist.splice(key, 1)
      } else {
        playlist.splice(key, 1)
      }

      this._playMusicInit(playlist)

    },
    /**
     * 播放歌曲
     */
    play(e) {
      let key = e.currentTarget.dataset.key
      let playlist = this.data.list
      let index = playlist.findIndex((item, index) => item.checked) // 当前播放歌曲位置索引
      // 所有歌曲默认为停止播放 (因为当前程序只会有一首歌曲播放，所以直接帮当前播放状态设置为false即可)

      playlist[index].checked = false
      // 当前选中的歌曲
      playlist[key].checked = true
      wx.setStorageSync('isplay', true)
      this._playMusicInit(playlist)

    },
    _playMusicInit(list) {
      this.setData({
        list
      })
      wx.setStorageSync('playlist', list)
      this.triggerEvent('update', {
        show: list.length === 0 ? true : false
      })
    }

  }
})