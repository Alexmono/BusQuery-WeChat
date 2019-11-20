// pages/Subways/Subways.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //当前城市
    city: {},

    navbar: ["站点", "线路"],

    currentIndex: 0,

    status: false,

    inputContent: '',

    ishaveSubway: true, //当前城市是否存在地铁，不存在则显示不存在的view

    isShowStationSuggestion: false, //是否显示提示

    stationSuggestion: [], //智能提示列表

    stationLineList: [], //搜索的地铁对象
    //地铁列表
    subwayList: [{
      lineName: "一号线",
      lineColor: "#0011ff"
    }, {
      lineName: "二号线",
      lineColor: "#ff7700"
    }, {
      lineName: "三号线",
      lineColor: "#ff0099"
    }, {
      lineName: "四号线",
      lineColor: "#00ff22"
    }, {
      lineName: "七号线",
      lineColor: "#00ffff"
    }, {
      lineName: "十号线",
      lineColor: "#aa00ff"
    }]
  },

  //获取城市
  getCity() {
    this.setData({
      city: app.globalData.city
    })
  },

  // navbar切换
  navbarTab: function(e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.getCity()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
   * 点击事件
   */
  //切换至设置城市页面
  changePage: function() {
    wx.navigateTo({
      url: '../Position/Position',
    })
    app.globalData.previousPage = '../Subways/Subways'
  },
  //站点搜索智能提示
  setSubwayStation: function(event) {
    var value = event.detail.value
    var that = this
    var limit = ''
    //判断是否选择了城市
    if (this.data.city.cityName != '未选择') {
      limit = this.data.city.cityName
    }
    //输入框是否为空判断
    if (value.length == 0) {
      this.setData({
        isShowStationSuggestion: false
      })
    } else {
      this.setData({
        isShowStationSuggestion: true
      })
      //输入提示
      qqmapsdk.getSuggestion({
        keyword: value,
        region: limit,
        page_size: 20,
        success: function(res) {
          that.setData({
            stationSuggestion: res.data
          })
        },
        fail: function(error) {
          console.error(error);
        },
        complete: function(res) {
          console.log(res);
        }
      })
    }
  },
  //站点搜索失去焦点
  loseInput: function(event) {
    var value = event.detail.value
    this.setData({
      isShowStationSuggestion: false,
      inputContent: value
    })
  },
  //站点搜索提示点击
  suggestionAddr: function(event) {
    var that = this
    var id = event.currentTarget.id
    for (var i = 0; i < this.data.busSuggestion.length; i++) {
      if (i == id) {
        this.setData({
          //内容设定
          inputContent: that.data.stationSuggestion[i].title,
          //类型设定
          category: that.data.stationSuggestion[i].category,
          //关闭提示
          isShowStationSuggestion: false
        })
      }
    }
  },
  //站点搜索
  searchSubwayStation: function() {
    var that = this
    var cityid = app.globalData.city.citySearchID
    var value = this.data.inputContent
    wx.request({
      url: 'https://api.jisuapi.com/transit/station?cityid=' + cityId + '&station=' + value + '&appkey=746b621c85938173',
      success: function(res) {
        that.setData({
          stationLineList: res.result
        })
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  }
})