// pages/ranking/ranking.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    itemData: {},
    list: [{
        'id': 0,
        'name': '云音乐新歌榜',
        'url': 'http://p1.music.126.net/N2HO5xfYEqyQ8q6oxCw8IQ==/18713687906568048.jpg?param=150y150'
      },
      {
        'id': 1,
        'name': '云音乐热歌榜',
        'url': 'http://p1.music.126.net/GhhuF6Ep5Tq9IEvLsyCN7w==/18708190348409091.jpg?param=150y150'
      },
      {
        'id': 2,
        'name': '网易原创歌曲榜',
        'url': 'http://p1.music.126.net/sBzD11nforcuh1jdLSgX7g==/18740076185638788.jpg?param=150y150'
      },
      {
        'id': 3,
        'name': '云音乐飙升榜',
        'url': 'http://p1.music.126.net/DrRIg6CrgDfVLEph9SNh7w==/18696095720518497.jpg?param=150y150'
      },
      {
        'id': 4,
        'name': '云音乐电音榜',
        'url': 'http://p1.music.126.net/5tgOCD4jiPKBGt7znJl-2g==/18822539557941307.jpg?param=150y150'
      }

    ],
    list2: [{
        'id': 5,
        'name': 'UK排行榜周榜',
        'url': 'http://p1.music.126.net/VQOMRRix9_omZbg4t-pVpw==/18930291695438269.jpg?param=150y150'
      },
      {
        'id': 6,
        'name': '美国Billboard周榜',
        'url': 'http://p1.music.126.net/EBRqPmY8k8qyVHyF8AyjdQ==/18641120139148117.jpg?param=150y150'
      },
      {
        'id': 7,
        'name': 'KTV嗨榜',
        'url': 'http://p1.music.126.net/H4Y7jxd_zwygcAmPMfwJnQ==/19174383276805159.jpg?param=150y150'
      },
      {
        'id': 8,
        'name': 'iTunes榜',
        'url': 'http://p1.music.126.net/83pU_bx5Cz0NlcTq-P3R3g==/18588343581028558.jpg?param=150y150'
      },
      {
        'id': 9,
        'name': 'Hit FM Top榜',
        'url': 'http://p1.music.126.net/54vZEZ-fCudWZm6GH7I55w==/19187577416338508.jpg?param=150y150'
      },
      {
        'id': 10,
        'name': '日本Oricon周榜',
        'url': 'http://p1.music.126.net/Rgqbqsf4b3gNOzZKxOMxuw==/19029247741938160.jpg?param=150y150'
      },
      // {
      //     'id': 11,
      //     'name': '韩国Melon排行榜周榜', 'url': ''
      // },
      // {
      //     'id': 12,
      //     'name': '韩国Mnet排行榜周榜', 'url': ''
      // },
      // {
      //     'id': 13,
      //     'name': '韩国Melon原声周榜', 'url': ''
      // },
      {
        'id': 14,
        'name': '中国TOP排行榜(港台榜)',
        'url': 'http://p1.music.126.net/JPh-zekmt0sW2Z3TZMsGzA==/18967675090783713.jpg?param=150y150'
      },
      {
        'id': 15,
        'name': '中国TOP排行榜(内地榜)',
        'url': 'http://p1.music.126.net/2klOtThpDQ0CMhOy5AOzSg==/18878614648932971.jpg?param=150y150'
      },
      {
        'id': 16,
        'name': '香港电台中文歌曲龙虎榜',
        'url': 'http://p1.music.126.net/YQsr07nkdkOyZrlAkf0SHA==/18976471183805915.jpg?param=150y150'
      },
      // {
      //     'id': 17,
      //     'name': '华语金曲榜', 'url': ''
      // },
      {
        'id': 18,
        'name': '中国嘻哈榜',
        'url': 'http://p1.music.126.net/_nwkQTFtOdAjFvOI8Wg7Tg==/18922595114302109.jpg?param=150y150'
      },
      {
        'id': 19,
        'name': '法国 NRJ EuroHot 30周榜',
        'url': 'http://p1.music.126.net/6O0ZEnO-I_RADBylVypprg==/109951162873641556.jpg?param=150y150'
      },
      {
        'id': 20,
        'name': '台湾Hito排行榜',
        'url': 'http://p1.music.126.net/wqi4TF4ILiTUUL5T7zhwsQ==/18646617697286899.jpg?param=150y150'
      },
      {
        'id': 21,
        'name': 'Beatport全球电子舞曲榜',
        'url': 'http://p1.music.126.net/A61n94BjWAb-ql4xpwpYcg==/18613632348448741.jpg?param=150y150'
      },
      {
        'id': 22,
        'name': '云音乐ACG音乐榜',
        'url': 'http://p1.music.126.net/vttjtRjL75Q4DEnjRsO8-A==/18752170813539664.jpg?param=150y150'
      },
      {
        'id': 23,
        'name': '云音乐嘻哈榜',
        'url': 'http://p1.music.126.net/RChr5NydlXafIV1GVEHJdg==/19073228207465342.jpg?param=150y150'
      }
    ],
    isroll: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

  },
  onShow() {
    this.setData({
      itemData: {}
    })
  },
  detailFn(e) {
    let idx = e.currentTarget.dataset.idx;
    app.util.to('/pages/rankDetail/rankDetail', {
      idx,
      types: 'rank'
    })
  },
  /**
   * 打开播放列表是否禁止页面滚动
   */
  isroll(e) {
    console.log(e.detail.show)
    this.setData({
      isroll: e.detail.show
    })
  }
})