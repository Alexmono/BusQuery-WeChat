// miniprogram/pages/subwayResult/subwayResult.js
const app = getApp();
var util = require("../../lib/Util.js")
// 加载包路径
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'HEIBZ-Y67KW-JKIRI-O2A45-CO4D6-UTBNX'
});
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: {},
    value: "",
    status: "",
    lineInformation: [],
    stationInformation: [],
    displayPage: false,
    showLine: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var value = JSON.parse(options.value)
    var status = JSON.parse(options.status)
    this.setData({
      city: app.globalData.city,
      value: value,
      status: status
    })
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
    if (this.data.status == 'line') {
      this.getStationListByLine(this.data.value)
    } else {
      this.getLineListByStation(this.data.value)
      // this.nearby_search()
    }
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

  tapLine: function (e) {
    var line = e.currentTarget.dataset.line
    this.getStationListByLine(line.transitno)
    this.setData({
      status: "line",
      value: line.transitno
    })
  },

  // 获取线路上的站点列表（线路详情）
  getStationListByLine: function (value) {
    var that = this
    var cityId = this.data.city.cityid
    var lineInformation = []
    wx.request({
      url: 'https://api.jisuapi.com/transit/line?cityid=' + cityId + '&transitno=' + value + '&appkey=746b621c85938173',
      success: function (res) {
        lineInformation = res.data.result
        that.setData({
          lineInformation: lineInformation
        })
      },
      fail: function (error) {
        console.error(error)
      },
      complete: function (res) {
        console.log(res)
      }
    })

  },
  //获取通过站点的线路（站点详情）
  getLineListByStation: function (value) {
    var that = this
    var cityId = this.data.city.cityid
    var stationInformation = []
    wx.request({
      url: 'https://api.jisuapi.com/transit/station?cityid=' + cityId + '&station=' + value + '&appkey=746b621c85938173',
      success: function (res) {
        var list = res.data.result
        for (var i = 0; i < list.length; i++) {
          var line = list[i]
          if (util.judgeTitle(line.transitno, '地铁'))
            stationInformation.push(line)
          if (util.judgeTitle(line.transitno, '轨道交通'))
            stationInformation.push(line)
        }
        that.setData({
          stationInformation: stationInformation
        })
      },
      fail: function (error) {
        console.error(error);
      },
      complete: function (res) {
        console.log(res);
      }
    })
  },
  //打开展示页面
  display: function (e) {
    if (this.data.displayPage == false) {
      this.setData({
        displayPage: true
      })
    }
    var item = this.data.lineInformation[e.currentTarget.dataset.index]
    var list = item.list
    //修改数据subway项
    for (var i = 0; i < list.length; i++) {
      if (list[i].subway != null) {
        var subway = [];
        var arr = util.stringToArrayByObject(list[i].subway);
        console.log(arr);
        for (var j = 0; j < arr.length; j++) {
          var s = {};
          s.color = arr[j].substring(21, 28);
          s.name = arr[j].substring(62, arr[j].length - 10);
          subway.push(s)
        }
        list[i].subway = subway
      }
    }
    item.list = list
    this.setData({
      showLine: item
    })
  },
  //关闭展示页面
  closeDisplayPage: function () {
    if (this.data.displayPage == true) {
      this.setData({
        displayPage: false
      })
    }
  },
  //点击线路上的站点查看
  chooseStation: function (e) {
    var station = e.currentTarget.dataset.cs
    this.getLineListByStation(station)
    this.setData({
      status: "station",
      value: station,
      displayPage: false
    })
  }
})