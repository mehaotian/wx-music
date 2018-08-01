//app.js
import interfaces from './utils/http/interface.js'
import util from './utils/util'

App({
    onLaunch: function() {
        // console.log(interfaces.query)

    },
    $api: interfaces, // 将https 注册到 app中
    util // 注册工具方法
})