// pages/Bus/Bus.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: {},

    value: '',

    search_type: true, //搜索类型：true为公交查询， false为站点查询

    placeholder: "100路/三环路南三段外侧站",

    isShowBus: true,

    isShowBusORStation: 1, //1显示线路 & 2显示公交

    lineList: {}, //线路详细

    busList: [], //站点详细

  },

  /**
   * 获取城市
   */
  getCity() {
    this.setData({
      city: app.globalData.city
    })
    console.log(this.data.city)
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
    this.getCity();
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
  //设置设置输入内容
  setValue: function(event) {
    this.setData({
      value: event.detail.value
    })
  },
  //搜索
  search: function() {
    var that = this
    var cityid = app.globalData.city.citySearchID
    var value = this.data.value
    wx.request({
      url: 'https://api.jisuapi.com/transit/line?cityid=' + cityid + '&transitno=' + value + '&appkey=746b621c85938173',
      success: function(res) {
        that.setData({
          lineList: res.data.result[0]
        });
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },
  //切换页面记录
  changePage: function() {
    wx.navigateTo({
      url: '../Position/Position',
    })
    app.globalData.previousPage = '../Bus/Bus'
  }
})