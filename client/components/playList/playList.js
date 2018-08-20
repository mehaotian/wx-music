// components/playList/playList.js
const app = getApp()
Component({
    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
        list: []
    },
    ready() {
        let playList = app.util.getPlaylist();


        if (playList.playlist.length > 0) {
            this.setData({
                list: playList.playlist
            })
        }
        console.log(playList)
    },
    /**
     * 组件的方法列表
     */
    methods: {

    }
})