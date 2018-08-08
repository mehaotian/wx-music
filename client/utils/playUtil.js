
class Play {
  constructor() {
    // 添加url到util中
    // this.URL = config.service;
  }
  /**
   * 设置播放列表
   */
  setPlaylist(parameter) {
    //  获取播放列表
    let playlist = wx.getStorageSync('playlist');
    // 是否第一首歌
    let isPushData = true;
    // 判断是否第一首歌
    if (!playlist) {
      playlist = [];
      parameter.checked = true;
      playlist.push(parameter);
      wx.setStorage({
        key: 'playlist',
        data: playlist,
      })
      return;
    }
    // 清理选中状态
    for (let j = 0; j < playlist.length; j++) {
      playlist[j].checked = false;
    }
    // 是否重复点击
    for (let i = 0; i < playlist.length; i++) {
      if (playlist[i].id === parameter.id) {
        isPushData = false;
        playlist[i].checked = true;
        break;
      }
    }
    // 如果不是重复点击，列表新增一首歌曲
    if (isPushData) {
      parameter.checked = true;
      playlist.push(parameter);
    }
    // 储存到本地
    wx.setStorage({
      key: 'playlist',
      data: playlist,
    })
  }
  /**
   * 获取播放列表
   */
  getPlaylist() {
    let playlist = wx.getStorageSync('playlist');
    let select = {};
    // 判断列表是否有数据，每有数据返回空数组，有数据返回数据
    if (!playlist) {
      playlist = [];
    }
    for (let i = 0; i < playlist.length; i++) {
      if (playlist[i].checked) {
        select = playlist[i];
        break;
      }
    }
    return {
      playlist,
      select
    };
  }
  /**
   * 获取音乐url
   * innerAudioContext 音乐实例
   * params 获取音乐url的 id
   * isOne 是否列表点击播放
   * self 小程序实例
   */
  getUrlAjax(innerAudioContext,params, isOne,self) {
    // app.$api.http_music_url(params).then((res) => {
    //   console.log("准备播放")

    // this._playAudio(res.data.data[0].url, off, isOne);
    // 网易云api提供的第二种解决方案
    this._playAudio(innerAudioContext, params.id, isOne, self);
    // })
  }
  /**
   * 最终播放音乐
   *  url 音乐url
   * isOne 是否列表点击播放
   */
  _playAudio(innerAudioContext,url, isOne,self) {

    // let self = this;
    // innerAudioContext.autoplay = off;
    // innerAudioContext.src = url;
    // 网易云api提供的第二种解决方案
    innerAudioContext.src = `http://music.163.com/song/media/outer/url?id=${url}.mp3`;

    //  判断是否播放，不用autoplay的原因是，如果由默认播放音乐，点击相同音乐不播放的问题
    if (isOne) {
      innerAudioContext.play();
    }

    // 播放成功
    innerAudioContext.onPlay((res) => {

      self.setData({
        play: true
      })
      wx.setStorage({
        key: 'isplay',
        data: true,
      })
    })
    // 播放结束
    innerAudioContext.onEnded((res) => {
      console.log(res)
      self.setData({
        play: false
      })
    })
    // 播放失败
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      self.setData({
        play: false
      })
    })
  }

}

module.exports = new Play();