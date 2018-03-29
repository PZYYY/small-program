var app = getApp()    // 引入全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var movieId = options.id
    var movieDetailData = app.globalData.g_getMovieUrl + '/subject2/' + movieId
    this.getMovieDetail(movieDetailData)
  },

  onShow () {},

  getMovieDetail (url) {
    var that = this
    wx.request({  // 网络请求
      url: url,
      header: {
        'Content-Type': 'application/xml'  // 不可以使用application/json，否则会报未知错误
      },
      success(res) {
        that.successCallback(res.data)
      },
      fail(error) {
        console.log(error)
      }
    })
  },

  // 当请求成功执行的回调
  successCallback (data) {
    console.log(data)
    let movieDetailData = {}
    this.setData ({
      movieDetailData: data
    })
  }
})