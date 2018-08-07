//app.js
import interfaces from './utils/http/interface.js'
import util from './utils/util'
import Play from './utils/playUtil.js'

App({
    onLaunch: function() {
        // console.log(interfaces.query)
        console.log('第一次进入页面')
        wx.setStorage({
            key: 'isplay',
            data: false,
        })

    },
    innerAudioContext: wx.createInnerAudioContext(), // 播放器实例，全局都要用这一个播放器
    $api: interfaces, // 将https 注册到 app中
    util, // 注册工具方法
    Play // 注册工具方法
})