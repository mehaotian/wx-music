// pages/rankDetail/rankDetail.js


const app = getApp();
let self = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [],
        pageShow: false,
        types: true
    },

    /** 
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this;
        let types = options.types;
        let idx = options.idx;
        this.setData({
            types: types === 'rank' ? true : false
        })
        this.getTopListAjax(idx, types)
        this.getTopListAjax(idx, types)

    },

    getTopListAjax(idx, types) {
        let url = '';
        let data = {};
        if (types === 'rank') {
            url = 'http_top_list';
            data.idx = idx
        } else {
            url = 'http_playlist_detail';
            data.id = idx;
        }
        wx: wx.showLoading();
        app.$api[url](data).then((res) => {

            wx.hideLoading();
            let list = [];
            if (types === 'rank') {
                list = res.data.playlist;
            } else {
                list = res.data.result;
            }
            self.setData({
                list,
                pageShow: true
            })
        })
    }
})