// pages/Subways/Subways.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:{
      city_name:"成都"
    },
    ishaveSubway:true,
    navbar: ["站点", "线路"],
    currentIndex: 0,
    status: false,
    subwayList:[{
        lineName:"一号线",
      lineColor:"#0011ff"
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
  navbarTab: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getCity()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  /**
   * 点击事件
   */
  //切换至设置城市页面
  changePage: function () {
    wx.navigateTo({
      url: '../Position/Position',
    })
    app.globalData.previousPage = '../Subways/Subways'
  }

})