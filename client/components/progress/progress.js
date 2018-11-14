// components/progress/progress.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    height: {
      type: String,
      value: '4'
    },
    btnH: {
      type: String,
      value: '16'
    },
    percent: {
      type: Number,
      value: 0,
      observer(newVal, oldVal) {
        if (this.data.isMove) {
          this.setData({
            x: newVal * this.data.domBox.one
          })
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    domBox: {
      width: 0, // 元素外层宽度
      height: 0 // 元素外层高度
    },
    x: 0,
    active: 0,
    isMove: true
  },
  ready() {
    this.getSize()
  },
  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 选择当前位置
     */
    change(e) {
      // console.log(e.detail.x - this.data.height / 2)
      let active = e.detail.x
      this.setData({
        active
      })
    },
    /**
     * 当前位置
     */
    jump(e) {
      let left = e.currentTarget.offsetLeft
      let x = e.detail.x
      this.setData({
        x: x - left - this.data.height,
      })
      this.triggerEvent('progressMove', {
        value: (x - left - this.data.height) / this.data.domBox.one
      })
      // console.log(x - left - this.data.height / 2)
    },
    catchtap() {},

    start() {
      this.setData({
        isMove: false
      })
      this.triggerEvent('progressStart')
    },
    end() {
      let self = this
      this.setData({
        isMove: true
      })
      this.triggerEvent('progressMove', {
        value: self.data.active / this.data.domBox.one
      })
    },
    /**
     * 获取组件位置 ，暂时无用
     */
    getSize() {
      const query = wx.createSelectorQuery().in(this)
      query.select('#selQuery').fields({
        size: true,
      }, function(res) {
        res.width // 节点的宽度
        res.height // 节点的高度
      })
      query.exec((res) => {
        console.log(res)
        res[0].one = res[0].width / 100
        this.setData({
          domBox: res[0]
        })
      })
    },
  }
})