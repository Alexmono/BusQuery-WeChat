// miniprogram/pages/busLineResult/busLineResult.js
const app = getApp();
var utils = require('../../lib/Util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: {},
    item: {},
    type: 0, //0 1线路   2站点
    stationlist: {},
    linelist: []
  },

  getCity() {
    this.setData({
      city: app.globalData.city
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getCity();
    var type = options.type;
    var data = JSON.parse(options.data)
    console.log(type)
    this.setData({
      item: data,
      type: type
    })
    if (type == 1) {
      this.searchBusLine(data.transitno);
    }
    if (type == 2) {
      this.searchBusStation(data.station)
    }
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

  //搜索公交线路
  searchBusLine: function(value) {
    var that = this
    wx.request({
      url: 'https://api.jisuapi.com/transit/line?cityid=' + this.data.city.cityid + '&transitno=' + value + '&appkey=746b621c85938173',
      success: function(res) {
        //修改数据subway项
        var list = res.data.result[0].list;
        for (var i = 0; i < list.length; i++) {
          if (list[i].subway == null) {
            var subway = [];
            var s = {}
            s.color = '#0095ff';
            s.name = null;
            subway.push(s)
            list[i].subway = subway
          } else {
            var subway = [];
            var arr = utils.stringToArrayByObject(list[i].subway);
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
        // 装载数据
        var stationlist = {}
        stationlist.transitno = res.data.result[0].transitno;
        stationlist.timetable = res.data.result[0].timetable;
        stationlist.price = res.data.result[0].price;
        stationlist.list = list;
        stationlist.lastStation = res.data.result[0].list.length - 1;
        // 设定
        that.setData({
          stationlist: stationlist
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

  //搜索公交站点
  searchBusStation: function(value) {
    var that = this
    wx.request({
      url: "https://api.jisuapi.com/transit/station?cityid=" + that.data.city.cityid + "&station=" + value + "&appkey=746b621c85938173",
      success: function(res) {
        that.setData({
          linelist: res.data.result,
        })
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },
})