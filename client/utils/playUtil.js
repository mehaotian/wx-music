
class Play {
    constructor() {
        // 添加url到util中
        this.URL = config.service;
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

}

module.exports = new Play();