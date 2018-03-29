var app = getApp()    // 引入全局变量
var getstars = require('../../utils/util.js') // 引入util.js模块
Page({
  // 分别储存3种类型的数据
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchMovie: {}, // 搜索电影条目
    showSearchPanel: false,
    showListPanel: true,
    showCancelIcon: false,
    movieId: ''
  },

  onShow() {
    // var inTheatersURL = app.globalData.g_getMovieUrl + '/v2/movie/in_theaters' + '?start=0&count=3'
    // var comingSoonURL = app.globalData.g_getMovieUrl + '/v2/movie/coming_soon' + '?start=0&count=3'
    // var top250URL = app.globalData.g_getMovieUrl + '/v2/movie/top250' + '?start=0&count=3'
    var inTheatersURL = app.globalData.g_getMovieUrl + '/in_theaters?start=0&count=3'
    var comingSoonURL = app.globalData.g_getMovieUrl + '/coming_soon?start=0&count=3'
    var top250URL = app.globalData.g_getMovieUrl + '/top250?start=0&count=3'
    this.getMovieListData(inTheatersURL, 'inTheaters','正在热映')
    this.getMovieListData(comingSoonURL, 'comingSoon', '即将上映')
    this.getMovieListData(top250URL, 'top250', '豆瓣TOP250')
  },

  // 获取电影数据
  getMovieListData (url, movieType, typeName) {
    var that = this
    wx.request({
      url: url,
      header: {
        'Content-Type': 'application/xml'  // 不可以使用application/json，否则会报未知错误
      },
      success(res) {
        that.successCallback(res.data, movieType, typeName)
      },
      fail(error) {
        console.log(error)
      }
    })
  },

 // 当请求成功时执行的回调函数
  successCallback(data, movieType, typeName) {
    var aMovieList = []
    for(var idx in data.subjects){
      var doubanData = data.subjects[idx]  // 取data数组中具体的每一个数据，遍历
      if (doubanData.title.length > 6) {
        doubanData.title = doubanData.title.substr(0, 6) + '...'
      }
      var stars = doubanData.rating.stars // 星星
      doubanData.rating.aStars = getstars.toStarsArray(stars)
      aMovieList.push(doubanData)
    }
    // 渲染的数据到底是哪类呢？不如将所有类型都储存在一个对象里
    var oMovieData = {}
    oMovieData[movieType] = {
      aMovieList: aMovieList,
      totalMovies: aMovieList, // 搜索中需要用到gird模板，该模板需要用到totalMovies
      typeName: typeName
    }
    // oMovieData[movieType] = aMovieList
    this.setData(oMovieData)
  },

  //点击更多跳转到详情页
  moreMovies(event) {
    var typeName = event.currentTarget.dataset.typeid
    wx.navigateTo({
      url: 'more-movies/more-movies?typeid=' + typeName,
    })
  },

  // 搜索框聚焦
  onFocusTap () {
    this.setData ({
      showSearchPanel: true,
      showListPanel: false,
      showCancelIcon: true
    })
  },

  // 取消搜索
  onCancelTap () {
    this.setData({
      showSearchPanel: false,
      showListPanel: true,
      showCancelIcon: false
    })
  },

  // 当输入搜索词
  onChangeTap (event) {
    var inputValue = event.detail.value   // 输入框中的值
    var searchUrl = app.globalData.g_getMovieUrl + '/search?q=' + inputValue  // 豆瓣搜索的URL
    this.getMovieListData(searchUrl, 'searchMovie', '')
  },

  /**
   * 跳转到电影详情
   */
  onMovieDetailTap (event) {
    let movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: `movie-detail/movie-detail?id=${movieId}`
    })
  }
})