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
      observer: function(newVal, oldVal, changedPath) {
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
    isPageMove: false
  },
  ready() {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    _listInit() {
      let self = this
      // 获取播放列表数据
      let playList = app.util.getPlaylist();
      // 这个判断其实不用写也行，如果打开播放列表，肯定最少是有一首歌曲的
      if (playList.playlist.length > 0) {
        this.setData({
          list: playList.playlist
        }, () => {
          console.log(this.data.show)
          this._showPage(this.data.show)
        })
      }
      console.log(playList)
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
        // 隐藏播放器
        this.setData({
          isPageMove: false
        }, () => {
          setTimeout(() => {
            this.setData({
              show: false
            })
          }, 330)
        })

      }
    },
    // 关闭播放列表
    closeMask() {
      console.log(11111)
      this._showPage(false)


    },
    // 清理事件冒泡
    clear() {},
    // 删除歌曲
    delSong(e) {
      let key = e.currentTarget.dataset.key
      let playList = app.util.getPlaylist().playlist;
      // playList.findIndex((item,index) => {
      //   console.log(item,index)
      // })
      console.log(playList)
      this.setData({
        list: playList
      })
    }


  }
})