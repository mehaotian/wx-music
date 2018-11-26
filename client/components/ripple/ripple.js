// components/ripple/ripple.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    off: {
      type: Boolean,
      value: true,
      observer(newVal, oldVal) {
        this.init(newVal)
      }
    },
    num: {
      type: Number,
      value: 20
    }

  },
  ready() {
    this.init(this.data.off)
  },

  /**
   * 组件的初始数据
   */
  data: {
    musList: [],
    timer: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    //我的随机数
    myradom(musList, newVal) {
      const that = this
      let _musList = musList
      // console.log(newVal)
      for (let i = 0; i < _musList.length; i++) {
        //+1是为了避免为0
        if (newVal) {
          _musList[i] = (100 * Math.random().toFixed(2))
        } else {
          _musList[i] = 0
        }
      }
      that.setData({
        musList: _musList
      });
      clearTimeout(this.data.timer)
      if (!newVal) return
      this.data.timer = setTimeout(() => {
        that.myradom(_musList, newVal)
      }, 300)
    },
    init(newVal) {
      let num = this.data.num
      let musList = []
      for (let i = 0; i < num; i++) {
        musList.push(100)
      }
      this.myradom(musList, newVal)
    }
  }
})