import config from '../config'

class Util {
  constructor() {
    // 添加url到util中
    this.URL = config.service;
  }
  /**
   * 保留当前页面，跳转到应用内的某个页面，使用wx.navigateBack可以返回到原页面。
   */
  to(url, data = {}) {
    let parames = "";
    for (let i in data) {
      parames += `&${i}=${data[i]}`;
    }
    parames = `?${parames.substr(1, parames.length)}`;
    wx.navigateTo({
      url: url + parames,
      complete(res) {
        console.log(res)
      },

    })

  }
  /**
   * 关闭当前页面，跳转到应用内的某个页面。
   */
  red(url, data = {}) {
    let parames = "";
    for (let i in data) {
      parames += `&${i}=${data[i]}`;
    }
    parames = `?${parames.substr(1, parames.length)}`;
    wx.redirectTo({
      url: url + parames,
      complete(res) {
        console.log(res)
      },

    })

  }

  /**
   * 获取登陆状态
   */
  user(url) {
    let userinfo = wx.getStorageSync('userinfo');
    if (userinfo) {
      return userinfo
    } else {
      this.toast('监测到您还没有登陆，或者登陆信息失效，是否去登陆', true).then(() => {
        this.to('/pages/login/login', {
          url
        })
      })
    }
  }

  /**
   * 计算日期
   * @param AddDayCount
   * @returns {string}
   */
  getDate(date, AddDayCount) {
    let dd = new Date(date);
    dd.setDate(dd.getDate() + AddDayCount); // 获取AddDayCount天后的日期
    let y = dd.getFullYear();
    let m = (dd.getMonth() + 1) < 10 ? '0' + (dd.getMonth() + 1) : (dd.getMonth() + 1); // 获取当前月份的日期，不足10补0
    let d = dd.getDate() < 10 ? '0' + dd.getDate() : dd.getDate(); // 获取当前几号，不足10补0
    return y + '-' + m + '-' + d;
  }

  /**
   *  通过毫秒获取 时分秒
   */
  getTime(time) {
    let secondTime = parseInt(time / 1000) // 秒
    let minuteTime = 0 // 分
    let hourTime = 0 // 小时
    if (secondTime > 60) { //如果秒数大于60，将秒数转换成整数
      //获取分钟，除以60取整数，得到整数分钟
      minuteTime = parseInt(secondTime / 60)
      //获取秒数，秒数取佘，得到整数秒数
      secondTime = parseInt(secondTime % 60)
      //如果分钟大于60，将分钟转换成小时
      if (minuteTime > 60) {
        //获取小时，获取分钟除以60，得到整数小时
        hourTime = parseInt(minuteTime / 60)
        //获取小时后取佘的分，获取分钟除以60取佘的分
        minuteTime = parseInt(minuteTime % 60)
      }
    }
    let result = {
      s: parseInt(secondTime)
    }

    if (minuteTime > 0) {
      result.m = parseInt(minuteTime)
    }
    if (hourTime > 0) {
      result.h = parseInt(hourTime)
    }
    result.time = time
    return result
  }

  /**
   * 提示框
   * @param obj 
   * @param showCancel
   */
  toast(obj = {
    title: '提示',
    content: '错误提示'
  }, showCancel = false) {
    let content = ''
    if (typeof obj === 'object') {
      content = obj.content
    } else {
      content = obj
    }

    return new Promise((resolve, reject) => {
      wx.showModal({
        title: obj.title || '提示',
        showCancel: showCancel,
        content: content,
        success: function(res) {
          if (res.confirm) {
            console.log('用户点击确定')
            resolve(res)
          } else if (res.cancel) {
            console.log('取消')
            reject(res)
          }
        }
      })

    })

  }

  /**
   * 刷新事件发送数据
   * @param param
   * @param back
   * @returns {boolean}
   */
  emit(param, obj, back = true) {
    if (typeof param !== 'string') {
      console.error('参数必须为String类型')
      return false
    }
    wx.setStorageSync(param, true)
    if (typeof obj === 'object') {
      wx.setStorageSync(param + 'params', obj)
    }
    if (back) {
      wx.navigateBack()
    }
  }

  /**
   * 刷新数据
   * @param param
   * @returns {*}
   */
  refresh(param) {
    if (typeof param !== 'string') {
      console.error('参数必须为String类型');
      return false
    }
    return new Promise((resolve, reject) => {
      let params = wx.getStorageSync(param + 'params');
      if (wx.getStorageSync(param)) {
        resolve(params);
        wx.removeStorageSync(param + 'params');
        wx.removeStorageSync(param);
      }

    })
  }

  /**
   * 正常调试输出
   * @param obj
   */
  log(...obj) {
    if (config.log) {
      console.log(...obj)
    }
  }

  /**
   * 错误调试输出
   * @param obj
   */
  err(...obj) {
    if (config.log) {
      console.error(...obj)
    }
  }
}

module.exports = new Util();