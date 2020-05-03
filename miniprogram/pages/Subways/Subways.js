// pages/Subways/Subways.js
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
    //当前城市
    city: {},

    navbar: ["已开通站点", "已开通线路"],

    currentIndex: 0,

    status: false,

    inputContent: '',

    ishaveSubway: true, //当前城市是否存在地铁，不存在则显示不存在的view

    isShowStationSuggestion: false, //是否显示站点提示

    stationSuggestion: [], //站点智能提示列表

    isShowLineSUggestion: false, //是否显示线路提示

    lineSuggestion: [], //线路智能提示列表

    stationLineList: [], //站点线路列表

    lineStationList: [], // 线路站点列表
    //地铁列表
    subwayList: [],

    subwayNum: 0, //线路数量
  },

  //获取城市
  getCity() {
    this.setData({
      city: app.globalData.city
    })
  },

  //获取当前选择城市的地铁列表
  getSubwayList(cityid) {
    var that = this
    wx.request({
      url: 'http://134.175.225.146:8081/Metro/querySubwayListByCity?cityId=' + cityid,
      success: function (res) {
        if (res.data.length == 0) {
          that.setData({
            ishaveSubway: false
          })
        } else {
          that.setData({
            ishaveSubway: true
          })
        }
        that.setData({
          subwayNum: res.data.length,
          subwayList: res.data
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

  // navbar切换
  navbarTab: function (e) {
    this.setData({
      currentIndex: e.currentTarget.dataset.index,
      inputContent: '',
      category: ''
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
    this.getSubwayList(this.data.city.cityid)
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
  },
  //站点搜索智能提示
  setSubwayStation: function (event) {
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
        isShowStationSuggestion: false
      })
    } else {
      var list = []
      //输入提示
      qqmapsdk.getSuggestion({
        keyword: value,
        region: limit,
        page_size: 20,
        filter: 'category=地铁站',
        success: function (res) {
          //"基础设施:交通设施:地铁站"
          for (var i = 0; i < res.data.length; i++) {
            if (res.data[i].category == '基础设施:交通设施:地铁站') {
              var object = res.data[i]
              list.push(object)
            }
          }
          if (list.length == 0) {
            that.setData({
              isShowStationSuggestion: false
            })
          } else {
            that.setData({
              isShowStationSuggestion: true,
              stationSuggestion: list
            })
          }
        },
        fail: function (error) {
          console.error(error);
        },
        complete: function (res) {
          console.log(res);
        }
      })
    }
  },
  //站点搜索提示点击
  suggestionAddr: function (event) {
    var that = this
    var station = event.currentTarget.dataset.station
    console.log(station.title)
    this.setData({
      //内容设定
      inputContent: station.title,
      //类型设定
      category: station.category,
      //关闭提示
      isShowStationSuggestion: false
    })
  },
  //站点搜索
  searchSubwayStation: function () {
    var len = this.data.inputContent.length
    var value = util.processStationName(this.data.inputContent, len - 5, len - 1)
    var values = JSON.stringify(value);
    var status = JSON.stringify('station')
    wx.navigateTo({
      url: '../subwayResult/subwayResult?value=' + values + '&status=' + status,
    })
  },
  //线路搜索
  searchSubwayLine: function (event) {
    var values = JSON.stringify(event.currentTarget.dataset.line)
    var status = JSON.stringify("line")
    wx.navigateTo({
      url: '../subwayResult/subwayResult?value=' + values + '&status=' + status,
    })
  },

  //失去焦点
  loseblur: function () {
    this.setData({
      isShowStationSuggestion: false,
      isShowLineSuggestion: false
    })
  },
  getSscroll: function () {
    this.setData({
      isShowStationSuggestion: true,
      isShowLineSuggestion: false
    })
  },
  getLscrool: function () {
    this.setData({
      isShowLineSuggestion: true,
      isShowStationSuggestion: false
    })
  },
  showCitySubwayMap: function () {

  },
})