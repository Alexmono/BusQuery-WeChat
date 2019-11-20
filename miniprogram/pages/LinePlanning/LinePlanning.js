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
    //线路
    latitude: '',
    longitude: '',
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
        var location = {}
        location.lat = lat
        location.lnt = lnt
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: lat,
            longitude: lnt
          },
          success: function(res) {
            var start = {}
            start.value = res.result.formatted_addresses.recommend
            start.location = location
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
    if (this.data.city.cityName != '未选择') {
      limit = this.data.city.cityName
    }
    //输入框是否为空判断
    if (value.length == 0) {
      this.setData({
        isShowSSuggestion: false
      })
    } else {
      this.setData({
        isShowSSuggestion: true
      })
      //输入提示
      qqmapsdk.getSuggestion({
        keyword: value,
        region: limit,
        page_size: 20,
        success: function(res) {
          that.setData({
            startSuggestion: res.data
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
  //失去焦点
  startLoseFoucs: function(event) {
    //根据输入的进行查询
    this.setData({
      isShowSSuggestion: false,
    })
  },

  //起点提示选择
  suggestionStartAddr: function(e) {
    var id = e.currentTarget.id;
    var selectStart = {}
    for (var i = 0; i < this.data.startSuggestion.length; i++) {
      if (i == id) {
        selectStart.value = this.data.startSuggestion[i].title
        selectStart.location = this.data.startSuggestion[i].location
        this.setData({
          start: selectStart
        })
      }
    }
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
    if (this.data.city.cityName != '未选择') {
      limit = this.data.city.cityName
    }
    //判断输入框是否为空
    if (value.length == 0) {
      this.setData({
        isShowESuggestion: false
      })
    } else {
      this.setData({
        isShowESuggestion: true
      })
      //输入提示
      qqmapsdk.getSuggestion({
        keyword: value,
        region: limit,
        page_size: 20,
        success: function(res) {
          that.setData({
            endSuggestion: res.data
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

  //失去焦点
  endLoseFoucs: function(event) {
    //根据输入的查询
    this.setData({
      isShowESuggestion: false,
    })
  },

  //终点提示选择
  suggestionEndAddr: function(e) {
    var id = e.currentTarget.id;
    var selectEnd = {}
    for (var i = 0; i < this.data.endSuggestion.length; i++) {
      if (i == id) {
        selectEnd.value = this.data.endSuggestion[i].title
        selectEnd.location = this.data.endSuggestion[i].location
        this.setData({
          end: selectEnd
        })
      }
    }
  },

  //开始规划
  planLine: function() {
    var that = this
    qqmapsdk.direction({
      mode: 'transit',
      from: {
        latitude: that.data.start.location.lat,
        longitude: that.data.start.location.lng
      },
      to: {
        latitude: that.data.end.location.lat,
        longitude: that.data.end.location.lng
      },
      success: function(res) {
        var ret = res.result.routes[0];
        var count = ret.steps.length;
        var pl = [];
        var coors = [];
        //获取各个步骤的polyline
        for (var i = 0; i < count; i++) {
          if (ret.steps[i].mode == 'WALKING' && ret.steps[i].polyline) {
            coors.push(ret.steps[i].polyline);
          }
          if (ret.steps[i].mode == 'TRANSIT' && ret.steps[i].lines[0].polyline) {
            coors.push(ret.steps[i].lines[0].polyline);
          }
        }
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 0; i < coors.length; i++) {
          for (var j = 2; j < coors[i].length; j++) {
            coors[i][j] = Number(coors[i][j - 2]) + Number(coors[i][j]) / kr;
          }
        }
        //定义新数组，将coors中的数组合并为一个数组
        var coorsArr = [];
        for (var i = 0; i < coors.length; i++) {
          coorsArr = coorsArr.concat(coors[i]);
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coorsArr.length; i += 2) {
          pl.push({
            latitude: coorsArr[i],
            longitude: coorsArr[i + 1]
          })
        }
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        that.setData({
          latitude: pl[0].latitude,
          longitude: pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
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