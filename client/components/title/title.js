// components/title/title.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: '标题'
    },
    right: {
      type: Boolean,
      value: false
    },
    rightUrl: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    jump() {
      app.util.to('/pages/' + this.data.rightUrl + '/' + this.data.rightUrl);

    }
  }
})