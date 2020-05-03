// pages/Bus/Bus.js
const app = getApp();
var utils = require('../../lib/Util.js')
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

    minHight: 0, //灰色区域最小高度

    city: {},

    inputContent: '', //搜索的内容

    category: '', //category: "基础设施:交通设施:公交车站/公交线路"

    placeholder: "100路/三环路天府立交[公交站]",

    item: {},

    isShowBusSuggestion: false, //是否显示输入提示

    busSuggestion: [], //输入提示数组

    isShowBus: true,

    isShowBusORStation: 0, //1显示线路 & 2显示站点

    stationList: [], //线路详细

    lastStation: 0, //最后一个站点

    busList: [], //站点详细

    poiStationList: [], //POI站点检索

    poiLineList: [], //POI线路检索

    isShowPOIList: false, //是否展示POI检索列表


  },

  /**
   * 获取城市
   */
  getCity() {
    this.setData({
      city: app.globalData.city
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var minHight = app.globalData.windH * 750 / app.globalData.windW - 165 - 39
    this.setData({
      minHight: minHight
    })
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

  //输入中
  getSuggerstion: function(event) {
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
        isShowBusSuggestion: false
      })
    } else {
      //输入提示
      qqmapsdk.getSuggestion({
        keyword: value, //提示关键字
        region: limit, //城市限制
        filter: "category=公交车站,公交线路", //指定搜索分类
        region_fix: 1, //固定在当前城市
        success: function(res) {
          var list = res.data
          if (list.length == 0) {
            isShowBusSuggestion: false
          }
          else {
            that.setData({
              isShowBusSuggestion: true,
              busSuggestion: list
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
  setloseBlur: function() {
    this.setData({
      isShowBusSuggestion: false,
    })
  },
  getscroll: function() {
    this.setData({
      isShowBusSuggestion: true,
    })
  },
  //点击提示内容
  suggestionAddr: function(event) {
    var that = this
    var item = event.currentTarget.dataset.item
    this.setData({
      item: item,
      //内容设定
      inputContent: item.title,
      //类型设定
      category: item.category,
      //关闭提示
      isShowBusSuggestion: false
    })
  },
  //搜索控制
  search: function() {
    var that = this
    var limit = ''
    //判断是否选择了城市
    if (this.data.city.cityName != '未选择') {
      limit = this.data.city.cityName
    }
    //1.1判断输入的是线路还是站点
    //1.2输入为站点或者线路时调用相应的方法
    var cate = this.data.category //获取类型
    var content = this.data.inputContent //获取搜索类容
    //公交站点
    if (cate == "基础设施:交通设施:公交车站") {
      //对站点名做指定处理
      var stationName = utils.processStationName(content, content.length - 5, content.length - 1)
      //调用方法查询
      this.searchBusStation(stationName)
    }
    //公交线路
    if (cate == "基础设施:交通设施:公交线路") {
      //调用方法查询
      this.searchBusLine(content)
    }
    //2.1如果无法判定，则进行POI检索进行站点线路检索
    else {
      qqmapsdk.search({
        keyword: content,
        region: limit,
        filter: "category=公交车站,公交线路",
        success: function(res) {
          that.setData({
            poiLineList: res.lines,
            poiStationList: res.data,
            isShowPOIList: true
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

  //点击POI检索的数据
  onclickPOI: function(event) {
    var content = event.currentTarget.dataset.title
    var category = event.currentTarget.dataset.category
    this.setData({
      //设定类容
      inputContent: content,
      category: category,
      isShowPOIList: false,
      poiLineList: [],
      poiStationList: []
    })
    //进行查询判定
    this.search()
  },


  // 点击站点结果查询线路
  searchlineItem: function(event) {
    var data = JSON.stringify(event.currentTarget.dataset.lineitem)
    var type = 1
    //携带数据跳转页面
    wx.navigateTo({
      url: '../busResult/busResult?data=' + data + '&type=' + type,
    })
  },
  // 点击线路结果查询站点
  searchstationItem: function(event) {
    var data = JSON.stringify(event.currentTarget.dataset.stationitem)
    var type = 2
    //携带数据跳转页面
    wx.navigateTo({
      url: '../busResult/busResult?data=' + data + '&type=' + type,
    })
  },

  //搜索公交线路
  searchBusLine: function(value) {
    var that = this
    var cityid = this.data.city.cityid
    wx.request({
      url: 'https://api.jisuapi.com/transit/line?cityid=' + cityid + '&transitno=' + value + '&appkey=746b621c85938173',
      success: function(res) {
        console.log(res)
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
          stationList: stationlist,
          isShowBusORStation: 1
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
    var cityid = this.data.city.cityid
    wx.request({
      url: "https://api.jisuapi.com/transit/station?cityid=" + cityid + "&station=" + value + "&appkey=746b621c85938173",
      success: function(res) {
        that.setData({
          busList: res.data.result,
          isShowBusORStation: 2
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

  //切换页面记录
  changePage: function() {
    wx.navigateTo({
      url: '../Position/Position',
    })
    app.globalData.previousPage = '../Bus/Bus'
  }
})