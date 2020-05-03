// pages/LinePlanning/LinePlanning.js
const app = getApp();
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
    city: {}, //城市
    //提示
    startSuggestion: [],
    isShowSSuggestion: false,
    endSuggestion: [],
    isShowESuggestion: false,
    //内容
    start: {},
    end: {},
    //线路(每一项为一个方案)
    polyline: []
  },

  //获取城市
  getCity() {
    this.setData({
      city: app.globalData.city
    })
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
  //切换至设置城市页面
  changePage: function() {
    wx.navigateTo({
      url: '../Position/Position',
    })
    app.globalData.previousPage = '../LinePlanning/LinePlanning'
  },
  //点击定位
  position: function() {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        var lat = res.latitude
        var lnt = res.longitude
        // var location = {}
        // location.lat = lat
        // location.lnt = lnt
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: lat,
            longitude: lnt
          },
          success: function(res) {
            var start = {}
            start.value = res.result.formatted_addresses.recommend
            start.location = res.result.location
            that.setData({
              start: start
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
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    })
  },
  //获取起点位置
  getStart: function(event) {
    // console.log(e.detail.value)
    var value = event.detail.value
    var that = this
    var limit = ''
    //判断是否选择了城市
    if (this.data.city.name != '未选择') {
      limit = this.data.city.name
    }
    //输入框是否为空判断
    if (value.length == 0) {
      this.setData({
        isShowSSuggestion: false
      })
    } else {
      //输入提示
      qqmapsdk.getSuggestion({
        keyword: value,
        region: limit,
        page_size: 20,
        success: function(res) {
          var list = res.data
          if (list.length == 0) {
            that.setData({
              isShowSSuggestion: false
            })
          } else {
            that.setData({
              isShowSSuggestion: true,
              startSuggestion: list
            })
          }
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
  //失去焦点
  loseblur: function() {
    this.setData({
      isShowSSuggestion: false,
      isShowESuggestion: false
    })
  },
  getSscroll: function() {
    this.setData({
      isShowSSuggestion: true,
      isShowESuggestion: false
    })
  },
  getEscroll: function() {
    this.setData({
      isShowSSuggestion: false,
      isShowESuggestion: this
    })
  },

  //起点提示选择
  suggestionStartAddr: function(e) {
    var item = e.currentTarget.dataset.sitem;
    var selectStart = {}
    selectStart.value = item.title
    selectStart.location = item.location
    this.setData({
      start: selectStart,
      isShowSSuggestion: false,
      isShowESuggestion: false
    })
  },

  //交换起点终点
  exChange: function(event) {
    var that = this
    var temp = this.data.start
    this.setData({
      start: that.data.end,
      end: temp
    })
  },

  //获取终点位置
  getEnd: function(event) {
    // console.log(e.detail.value)
    var value = event.detail.value
    var that = this
    var limit = ''
    //判断是否选择了城市
    if (this.data.city.name != '未选择') {
      limit = this.data.city.name
    }
    //判断输入框是否为空
    if (value.length == 0) {
      this.setData({
        isShowESuggestion: false
      })
    } else {
      //输入提示
      qqmapsdk.getSuggestion({
        keyword: value,
        region: limit,
        page_size: 20,
        success: function(res) {
          var list = res.data
          if (list.length == 0) {
            that.setData({
              isShowESuggestion: false
            })
          } else {
            that.setData({
              isShowESuggestion: true,
              endSuggestion: list
            })
          }

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

  //终点提示选择
  suggestionEndAddr: function(e) {
    var item = e.currentTarget.dataset.eitem;
    var selectEnd = {}
    selectEnd.value = item.title
    selectEnd.location = item.location
    this.setData({
      end: selectEnd,
      isShowSSuggestion: false,
      isShowESuggestion: false
    })

  },

  //开始规划
  planLine: function() {
    var start = this.data.start
    var end = this.data.end
    var startData = JSON.stringify(start);
    var endData = JSON.stringify(end);
    wx.navigateTo({
      url: '../lineResult/lineResult?start=' + startData + '&end=' + endData,
    })
  }
})