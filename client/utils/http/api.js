import config from '../../config'; // 导入公共配置
import _config from './config'; // 导入私有配置

export default function $http(options) {

  return new Promise((resolve, reject) => {
    options.url = config.host + options.url;

    // 拦截请求
    _config.complete = (response) => {

      //  request請求访问成功
      if (response.statusCode === 200) {
        if (config.code === response.data.code) {
          // 接口请求成功
          resolve(response);
        } else {
          // 接口请求失败
          // 需要处理不是200的情况
          _error(response.data.code, response.data.msg);
        }
      } else {
        // 处理catch 请求，不在本页面之外处理，统一在这里处理
        try {
          Promise.reject(response).catch(err => {
            console.log(err);
            _page_error(response.statusCode || response.errMsg);
          });
        } catch (e) {
          console.log(e)
        }

      }

    }
    // 开始请求
    wx.request(Object.assign(_config, options));
  })
}

// 接口錯誤
function _error(err, msg = '') {

  switch (err) {
    case 400:
      console.error(msg)
      // 错误码400的处理方式
      break;
  }
}
// request 錯誤
function _page_error(err) {

  switch (err) {
    case 404:
      // 错误码404的处理方式
      console.error("没有找到页面")
      break;
    case "request:fail ":
      console.error("没有网络")
      break;
  }
}