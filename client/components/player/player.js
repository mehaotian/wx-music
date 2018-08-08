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
                console.log(newVal)
                // 如果有更新暂停播放

                // 判断是否第一次进入
                if (JSON.stringify(newVal) === '{}') {
                    let playlist = app.util.getPlaylist().playlist;
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

                        this._playInit(app.util.getPlaylist().select, playType)
                        // 显示播放器

                        this._showPage(true);
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
        isPageShow: false,
        isPageMove: false,
        play: false,
        list: {}
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
            let self =this;
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
            // 显示播放器
            this._showPage(true);
            // 数据渲染
            this.setData({
                list: item
            }, () => {
                // 请求播放数据
                // 如果在setData回到中请求接口，避免数据渲染之后，歌曲不播放的问题
              app.Play.getUrlAjax(innerAudioContext,{
                    id: app.util.getPlaylist().select.id
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
            }
        },
        /**
         * 跳转到播放器页面
         */
        songPlayer() {
            app.util.to('/pages/player/player')
        }
    }
})