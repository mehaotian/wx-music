Page({

  /**
   * 页面的初始数据
   */
  data: {
    off: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  switch () {
    this.setData({
      off: !this.data.off
    })
  }

})