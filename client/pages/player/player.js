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
            this.getUrlAjax({
                id: app.util.getPlaylist().select.id
            }, off, isOne);
        })
        // innerAudioContext.pause();


    },
    /**
     * 获取音乐url
     * params 获取音乐url的 id
     * off 是否播放音乐
     * isOne 是否列表点击播放
     */
    getUrlAjax(params, off, isOne) {
        app.$api.http_music_url(params).then((res) => {
            this._playAudio(res.data.data[0].url, off, isOne);
        })
    },
    /**
     * 最终播放音乐
     *  url 音乐url
     * off 是否播放音乐
     * isOne 是否列表点击播放
     */
    _playAudio(url, off, isOne) {

        let self = this;
        // innerAudioContext.autoplay = off;
        innerAudioContext.src = url;

        //  判断是否播放，不用autoplay的原因是，如果由默认播放音乐，点击相同音乐不播放的问题
        if (isOne) {
            innerAudioContext.play();
        }
        // 播放成功
        innerAudioContext.onPlay(() => {
            self.setData({
                play: true
            })
            wx.setStorage({
                key: 'isplay',
                data: true,
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
    },
})