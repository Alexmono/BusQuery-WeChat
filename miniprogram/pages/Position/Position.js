// miniprogram/pages/Position/Position.js
const app = getApp();
// 加载包路径
var QQMapWX = require('../../lib/qqmap-wx-jssdk.js');
var Util = require('../../lib/Util.js');
// 实例化API核心类
var qqmapsdk = new QQMapWX({
  key: 'HEIBZ-Y67KW-JKIRI-O2A45-CO4D6-UTBNX'
});
Page({
  /**
   * 页面的初始数据
   */
  data: {
    previousPage: "",
    //城市列表
    cityList: [],
    //城市列表-极速数据
    // cityList_jisuAPI: [],
    //首字母
    searchLetter: ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K", "L", "M", "N", "P", "Q", "R", "S", "T", "W", "X", "Y", "Z"],
    scrollTop: 0, //置顶高度
    scrollTopId: '', //置顶id
    winHeight: 0,
    showLetter: "",
    isShowLetter: false,
    //定位
    location: {},
    //选择的城市
    choosecity: {},
    //直辖市及特别行政区
    municipalityAndSpecialAdministrativeRegion: [{
      "cityid": 1,
      "name": "北京",
      "code": "beijing"
    }, {
      "cityid": 26,
      "name": "天津",
      "code": "tianjin"
    }, {
      "cityid": 24,
      "name": "上海",
      "code": "shanghai"
    }, {
      "cityid": 31,
      "name": "重庆",
      "code": "chongqing"
    }, {
      "cityid": 32,
      "name": "香港",
      "code": "hongkong"
    }, {
      "cityid": 33,
      "name": "澳门",
      "code": "aomen"
    }],
    //热门城市
    popularCityList: [{
      "cityid": 1,
      "name": "北京",
      "code": "beijing"
    }, {
      "cityid": 24,
      "name": "上海",
      "code": "shanghai"
    }, {
      "cityid": 75,
      "name": "广州",
      "code": "guangzhou"
    }, {
      "cityid": 76,
      "name": "深圳",
      "code": "shenzhen"
    }, {
      "cityid": 382,
      "name": "杭州",
      "code": "hangzhou"
    }, {
      "cityid": 219,
      "name": "南京",
      "code": "nanjing"
    }, {
      "cityid": 179,
      "name": "武汉",
      "code": "wuhan"
    }, {
      "cityid": 148,
      "name": "郑州",
      "code": "zhengzhou"
    }, {
      "cityid": 26,
      "name": "天津",
      "code": "tianjin"
    }, {
      "cityid": 310,
      "name": "西安",
      "code": "xian"
    }, {
      "cityid": 321,
      "name": "成都",
      "code": "chengdu"
    }, {
      "cityid": 31,
      "name": "重庆",
      "code": "chongqing"
    }]
  },
  /**
   * 获取初始城市列表
   */
  getCityList() {
    var that = this
    wx.request({
      url: 'https://api.jisuapi.com/transit/city?appkey=746b621c85938173',
      success: function (res) {
        var cityList = res.data.result
        console.log(cityList.length)
        //进行排序处理
        var tempObj = []
        var temp = {}
        //直辖市及特别行政区放在开头
        temp.initial = "直辖市及特别行政区"
        var muni = that.data.municipalityAndSpecialAdministrativeRegion
        temp.cityInfo = muni
        tempObj.push(temp)
        //按照A-Z分组排序
        var sysInfo = wx.getSystemInfoSync()
        var winHeight = sysInfo.windowHeight
        var itemH = winHeight / that.data.searchLetter.length
        for (var i = 0; i < that.data.searchLetter.length; i++) {
          var initial = that.data.searchLetter[i]
          var cityInfo = []
          var tempArr = {}

          tempArr.initial = initial
          tempArr.tHeight = i * itemH
          tempArr.bHeight = (i + 1) * itemH

          for (var j = 0; j < cityList.length; j++) {
            if (that.data.searchLetter[i].toLowerCase() === Util.processStationName(cityList[j].code, 1, cityList[j].code.length - 1)) {
              var cityId = cityList[j].cityid
              if (cityId != 1 && cityId != 24 && cityId != 26 && cityId != 31 && cityId != 32 && cityId != 33) {
                var city = cityList[j]
                cityInfo.push(city)
              }
            }
          }
          tempArr.cityInfo = cityInfo;
          tempObj.push(tempArr);
        }
        //设置数据
        that.setData({
          cityList: tempObj,
          winHeight: winHeight,
          choosecity: app.globalData.city,
          previousPage: app.globalData.previousPage
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCityList()
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
  clickLetter: function (e) {
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function () {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //选择城市
  bindCity: function (e) {
    var chooseCity = {};
    chooseCity.cityid = e.currentTarget.dataset.cityid
    chooseCity.name = e.currentTarget.dataset.name
    chooseCity.code = e.currentTarget.dataset.code
    this.setData({
      choosecity: chooseCity
    })
  },
  //选择热门城市
  bindHotCity: function (e) {
    var chooseCity = {};
    chooseCity.cityid = e.currentTarget.dataset.cityid
    chooseCity.name = e.currentTarget.dataset.name
    chooseCity.code = e.currentTarget.dataset.code
    this.setData({
      choosecity: chooseCity
    })
  },
  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({
      scrollTop: 0,
    })
  },

  //返回上一页
  sure: function () {
    var city = {} //临时选择对象
    city.name = this.data.choosecity.name
    city.cityid = this.data.choosecity.cityid
    city.code = this.data.choosecity.code
    //将选择对象放入app.js
    app.setCity(city)
    //跳转回上一页
    var url = this.data.previousPage
    wx.switchTab({
      url: url,
    })
  },

  //点击定位
  positioningLocation: function () {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function (res) {
        const getlatitude = res.latitude //纬度
        const getlongitude = res.longitude //经度
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: getlatitude,
            longitude: getlongitude
          },
          success: function (res) {
            //获取城市名
            var chooseCity = {};
            var cityList = that.data.cityList
            var name = res.result.ad_info.city.substring(0, 2)
            var find = false
            for (var i = 0; i < cityList.length; i++) {
              for (var j = 0; j < cityList[i].cityInfo.length; j++) {
                if (cityList[i].cityInfo[j].name == name) {
                  chooseCity = cityList[i].cityInfo[j]
                  find = true
                  break
                }
              }
              if (find) {
                break
              }
            }
            that.setData({
              choosecity: chooseCity
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
    })

  }
})