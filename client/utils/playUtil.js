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

    // 拼接歌唱者和专辑名
    let strName = '';
    for (let i = 0; i < parameter.song.artists.length; i++) {
      if (i !== 0) {
        strName += ' / '
      }
      strName += parameter.song.artists[i].name
    }

    strName += " - " + parameter.song.album.name;
    parameter.strName = strName;
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
  getUrlAjax(innerAudioContext, params, isOne, self) {
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
  _playAudio(innerAudioContext, url, isOne, self) {
    let that = this;
    let playlist = this.getPlaylist().select
    // let self = this;
    // innerAudioContext.autoplay = off;
    // innerAudioContext.src = url;
    // 网易云api提供的第二种解决方案
    innerAudioContext.src = `http://music.163.com/song/media/outer/url?id=${url}.mp3`;

    console.log(playlist)
    innerAudioContext.title = playlist.name // 歌曲名称
    innerAudioContext.epname = playlist.song.album.name // 专辑名称
    // 歌手名称
    let songname = ''
    playlist.song.artists.map((item, index) => {
      if (index !== 0) {
        songname += '/'
      }
      songname += item.name
    })
    console.log(songname)
    innerAudioContext.singer = songname // 歌手名称
    innerAudioContext.coverImgUrl = playlist.song.album.picUrl // 歌手名称
    // 播放成功
    innerAudioContext.onPlay((res) => {

      self.setData({
        play: true
      })
      self.triggerEvent('play', {
        play: true
      })
      wx.setStorage({
        key: 'isplay',
        data: true,
      })
    })
    // // 停止播放
    // innerAudioContext.onStop((res) => {})

    // // 暂停播放
    innerAudioContext.onPause((res) => {
      self.setData({
        play: false
      })
      self.triggerEvent('play', {
        play: false
      })
      wx.setStorage({
        key: 'isplay',
        data: false,
      })
    })

    innerAudioContext.onTimeUpdate((res) => {

      // if (!self.stopPlay) {
      typeof(self.playTime) === 'function' && self.playTime(true)
      // }
    })

    
    // 播放结束
    innerAudioContext.onEnded((res) => {
      // 停止播放 ，下次播放同一首歌曲从头开始
      innerAudioContext.stop()

      typeof(self.switchInit) === 'function' && self.switchInit('next', true)


    })
    // 播放失败
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
      self.setData({
        play: false
      })
      self.triggerEvent('play', {
        play: false
      })
    })
  }
  /**
   * 播放模式切换 ,返回下一首播放曲目
   * types: 'next' ||'pre' 歌曲切换 下一曲
   * auto ：true || false 是否自动播放，如果为true 是单曲循环 否则列表循环
   * del 删除歌曲
   */
  randomPlay(types, auto = true, del = false) {
    let random = wx.getStorageSync('random:play') // 0:随机播放 1：顺序播放 2：单曲循环
    let songs = this.getPlaylist().playlist // 歌曲数据列表
    let index = songs.findIndex((item, index) => item.checked) // 当前播放歌曲位置索引
    // let item = songs.find((item, index) => item.checked) // 当前播放歌曲位置
    // 所有歌曲默认为停止播放 (因为当前程序只会有一首歌曲播放，所以直接帮当前播放状态设置为false即可)
    songs[index].checked = false
    // 获取下一首歌曲的歌曲数据

    switch (random) {
      case 0:
        // 随机播放
        if (del) {
          index++
          if (index > songs.length - 1) {
            index = 0
          }
        } else {
          index = Math.floor(Math.random() * songs.length)
        }
        break
      case 1:
        // 列表循环
        if (types === 'next') {
          index++
          if (index > songs.length - 1) {
            index = 0
          }
        } else {
          index--
          if (index < 0) {
            index = songs.length - 1
          }
        }

        break
      case 2:
        // 单曲播放
        if (!auto) {
          if (types === 'next') {
            index++
            if (index > songs.length - 1) {
              index = 0
            }
          } else {
            index--
            if (index < 0) {
              index = songs.length - 1
            }
          }


        }
        break
    }

    console.log('播放索引：', index)
    // 重新设置播放列表
    this.setPlaylist(songs[index])

    // 返回当前播放音乐
    return {
      song: songs[index]
    }
  }

}

module.exports = new Play();