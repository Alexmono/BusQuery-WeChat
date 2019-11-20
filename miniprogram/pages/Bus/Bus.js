// pages/Bus/Bus.js
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

    city: {},

    inputContent: '', //搜索的内容

    category: '', //category: "基础设施:交通设施:公交车站/公交线路"

    placeholder: "100路/三环路南三段外侧站",

    isShowBusSuggestion: false, //是否显示输入提示

    busSuggestion: [], //输入提示数组

    isShowBus: true,

    isShowBusORStation: 1, //1显示线路 & 2显示站点

    stationList: [], //线路详细

    busList: [], //站点详细

    type:''//start-起点站, between-中间站, end-终点站

  },

  /**
   * 获取城市
   */
  getCity() {
    console.log(app.globalData.city)
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

  //输入中
  getSuggerstion: function(event) {
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
        isShowBusSuggestion: false
      })
    } else {
      this.setData({
        isShowBusSuggestion: true
      })
      //输入提示
      qqmapsdk.getSuggestion({
        keyword: value,
        region: limit,
        page_size: 20,
        success: function(res) {
          that.setData({
            busSuggestion: res.data
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
  setValue: function(event) {
    var value = event.detail.value
    this.setData({
      isShowBusSuggestion: false,
      inputContent: value
    })
  },
  //点击提示内容
  suggestionAddr: function(event) {
    var that = this
    var id = event.currentTarget.id
    for (var i = 0; i < this.data.busSuggestion.length; i++) {
      if (i == id) {
        this.setData({
          //内容设定
          inputContent: that.data.busSuggestion[i].title,
          //类型设定
          category: that.data.busSuggestion[i].category,
          //关闭提示
          isShowBusSuggestion: false
        })
      }
    }
  },
  //搜索控制
  search: function() {
    var that = this
    //test
    // this.searchBusLine()
    // this.searchBusStation()
    //自动判断输入类型
    //获取必要数据
    var content = this.data.inputContent
    var category = this.data.category
    var limit = ''
    //判断是否选择了城市
    if (this.data.city.cityName != '未选择') {
      limit = this.data.city.cityName
    }
    var line = {}
    var data = {}
    //如果无category则获取
    if (category.length == 0) {
      //搜索conten，通过接口获取category
      qqmapsdk.search({
        keyword: content,
        region: limit,
        success: function(res) {
          /**
           * 目前的问题
           * 无法在里面把category赋值
           * 以及无法使用try catch进行异常处理判断res中是否存在lines数组
           */
          line = res.lines[0]
          data = res.data[0]
        },
        fail: function(error) {
          console.error(error);
        },
        complete: function(res) {
          console.log(res);
        }
      })
      if (line != null) {
        category = '基础设施:交通设施:公交线路'
      } else {
        category = '基础设施: 交通设施: 公交车站'
      }
    }
    //判断category是否说明为公交站点或者公交线路
    var temp = category.charAt(category.length - 2) + category.charAt(category.length - 1)
    if (temp == '线路') {
      this.searchBusLine()
    } else {
      this.searchBusStation()
    }
    //查询完成后清理掉category的数据
    this.setData({
      category: ''
    })
  },
  //搜索公交线路
  searchBusLine: function() {
    var that = this
    var cityid = app.globalData.city.citySearchID
    var value = this.data.inputContent
    wx.request({
      url: 'https://api.jisuapi.com/transit/line?cityid=' + cityid + '&transitno=' + value + '&appkey=746b621c85938173',
      success: function(res) {
        that.setData({
          stationList: res.data.result[0],
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
  searchBusStation: function() {
    var that = this
    var cityid = app.globalData.city.citySearchID
    var value = this.data.inputContent
    console.log(value)
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