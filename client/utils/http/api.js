import config from '../../config'; // 导入公共配置
import _config from './config'; // 导入私有配置

export default function $http(options) {

    return new Promise((resolve, reject) => {
        options.url = config.host + options.url;
        // 拦截成功
        _config.success = (response) => {
            // if (response.data.code === 200) {
            resolve(response);
            // }
        }
        // 拦截请求失败
        _config.fail = (response) => {
            // wx.showToast({
            //     title: '请求失败',
            // })
            reject(response)
        }
        // 开始请求
        wx.request(Object.assign(_config, options))
    })
}