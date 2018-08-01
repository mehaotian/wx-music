// pages/login/login.js

let app = getApp();
let self = null;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        formData: {},
        entryUrl: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        self = this;
        // 获取url可以知道 登陆页面入口 ，之后关闭要返回
        this.setData({
            entryUrl: options.url
        })
        // 提示
        app.util.toast('相关接口来自网易云音乐，请使用网易云音乐手机账号登陆!');
    },

    /**
     * 登陆方法
     */
    login() {
        let formData = this.data.formData;
        // 登陆简单验证，实际开发 需要完善表单验证
        if (formData.phone == '' || !formData.phone) {
            app.util.toast('请输入手机号码')
            return;
        }

        if (formData.password == '' || !formData.password) {
            app.util.toast('请输入密码')
            return;
        }

        // 调用登陆接口
        this.getLoginAjax();
    },
    input(event) {
        // 获取不同输入框value
        let val = event.detail.value;
        let name = event.target.dataset.name;
        this.data.formData[name] = val;
        // 赋值
        this.setData({
            formData: this.data.formData
        })
    },
    /**
     * 请求登陆接口
     */
    getLoginAjax() {
        app.$api.http_login(self.data.formData).then((res) => {
            if (res.data.code !== 200) {
                wx.showToast({
                    title: '账号密码错误',
                    icon: 'none'
                })
                return;
            }
            wx.showLoading()
            self.getUser(res.data.profile.userId);
        })
    },

    /**
     * 获取用户信息接口
     * uid ：用户唯一id
     */
    getUser(uid) {
        app.$api.http_user_detail({
            uid
        }).then((res) => {
            wx.hideLoading()
            wx.setStorage({
                key: 'userinfo',
                data: res.data
            })
            wx.showToast({
                title: '登陆成功',
                success() {
                    setTimeout(() => {
                        app.util.red(self.data.entryUrl);
                    }, 1000)
                }
            })

        })
    }
})