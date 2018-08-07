// components/marquee/marquee.js
let timer = null;
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        name: {
            type: String,
            value: '',
            observer: function(newVal, oldVal, changedPath) {
                clearTimeout(this.data.timer);
                console.log(1111)
                this.setData({
                    mWidth: 0,
                    move: false
                })
                // 判断是否第一次进入
                if (JSON.stringify(newVal) === '') {
                    return;
                }
                this.data.timer = setTimeout(() => {
                    this.queryMultipleNodes()
                }, 300)
            }
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        mWidth: '0',
        move: false,
        timer: null
    },

    /**
     * 组件的方法列表
     */
    methods: {
        queryMultipleNodes: function(id) {

            var query = wx.createSelectorQuery().in(this)

            query.selectAll('#wrap ,#wrap-item').boundingClientRect(function(res) {
                res.width // 这个组件内 #the-id 节点的上边界坐标
            }).exec((res) => {
                // 获取父元素宽度
                let wrapWidth = res[0][0].width;
                // 获取子元素宽度
                let itemWidth = res[0][1].width;

                // 当子元素大于父元素宽度的时候，才开始滚动操作
                if (itemWidth > wrapWidth) {
                    // console.log("开始滚动")
                    // 数据渲染
                    this.setData({
                        mWidth: (wrapWidth - itemWidth) + 'px',
                        move: true
                    })
                    // console.log(this.data.mWidth, wrapWidth, itemWidth)
                }
            })
        },
    },
    //   获取节点信息
    ready() {
        this.queryMultipleNodes()
    }

})