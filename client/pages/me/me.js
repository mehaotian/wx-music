// pages/me/me.js


let app = getApp();
let self = null;
Page({
    /**
     * 页面的初始数据
     */
    data: {
        pageShow: false,
        userinfo: {},
        list: {
            myList: [],
            collection: []
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this;
        let userinfo = app.util.user(); // 获取用户信息
        // 获取本地储存的登陆信息
        self.setData({
            userinfo
        });
        // 获取我的歌单
        this.getPlaylistAjax(userinfo.profile.userId);
    },
    /**
     * 跳转歌单
     */
    songFn(e) {
        let idx = e.currentTarget.dataset.id;
        app.util.to('/pages/rankDetail/rankDetail', {
            idx,
            types: 'song'
        })
    },
    /**
     * 获取歌单
     * uid ：用户ID
     */
    getPlaylistAjax(uid) {
        app.$api.http_playlist({
            uid
        }).then((res) => {
            console.log(res)

            let data = res.data.playlist;
            let list = self.data.list;

            for (let i = 0; i < data.length; i++) {

                if (data[i].creator.userId === uid) {
                    // 我创建的歌单
                    list.myList.push(data[i]);
                } else {
                    // 我收藏的歌单
                    list.collection.push(data[i]);
                }
            }


            self.setData({
                list,
                pageShow: true
            })
        })
    }
})