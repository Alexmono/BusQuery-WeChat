// miniprogram/pages/Position/Position.js
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
    previousPage: "",
    //城市列表
    cityList: [],
    //城市列表-极速数据
    cityList_jisuAPI: [],
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
        cid: [0, 15],
        id: "110000",
        fullname: "北京市",
        location: {
          lat: 39.90469,
          lng: 116.40717
        },
        name: "北京",
        pinyin: ["bei", "jing"]
      },
      {
        cid: [6, 31],
        id: "120000",
        fullname: "天津市",
        location: {
          lat: 39.0851,
          lng: 117.19937
        },
        name: "天津",
        pinyin: ["tian", "jin"]
      }, {
        cid: [102, 117],
        id: "310000",
        fullname: "上海市",
        location: {
          lat: 31.23037,
          lng: 121.4737
        },
        name: "上海",
        pinyin: ["shang", "hai"]
      }, {
        cid: [297, 334],
        id: "500000",
        fullname: "重庆市",
        location: {
          lat: 29.56471,
          lng: 106.55073
        },
        name: "重庆",
        pinyin: ["chong", "qing"]
      }, {
        cid: [468, 485],
        id: "810000",
        fullname: "香港特别行政区",
        location: {
          lat: 22.27534,
          lng: 114.16546
        },
        name: "香港",
        pinyin: ["xiang", "gang"]
      }, {
        cid: [486, 489],
        id: "820000",
        fullname: "澳门特别行政区",
        location: {
          lat: 22.19875,
          lng: 113.54913
        },
        name: "澳门",
        pinyin: ["ao", "men"]
      }
    ],
    //热门城市
    popularCityList: [{
      id: 110000,
      name: '北京'
    }, {
      id: 310000,
      name: '上海'
    }, {
      id: 440100,
      name: '广州'
    }, {
      id: 440300,
      name: '深圳'
    }, {
      id: 330100,
      name: '杭州'
    }, {
      id: 320100,
      name: '南京'
    }, {
      id: 420100,
      name: '武汉'
    }, {
      id: 410100,
      name: '郑州'
    }, {
      id: 120000,
      name: '天津'
    }, {
      id: 610100,
      name: '西安'
    }, {
      id: 510100,
      name: '成都'
    }, {
      id: 500000,
      name: '重庆'
    }]
  },
  /**
   * 获取初始城市列表
   */
  getCityList() {
    var that = this
    qqmapsdk.getCityList({
      success: function(res) { //成功后的回调
        // 进行排序处理
        var tempObj = []
        var temp = {};
        //直辖市，特别行政区
        temp.initial = "直辖市及特别行政区";
        var muni = that.data.municipalityAndSpecialAdministrativeRegion;
        temp.cityInfo = muni;
        tempObj.push(temp);
        //A-Z分组
        var sysInfo = wx.getSystemInfoSync();
        var winHeight = sysInfo.windowHeight;
        var itemH = winHeight / that.data.searchLetter.length;

        for (var i = 0; i < that.data.searchLetter.length; i++) {
          var initial = that.data.searchLetter[i];
          var cityInfo = [];
          var tempArr = {};

          tempArr.initial = initial;
          tempArr.tHeight = i * itemH;
          tempArr.bHeight = (i + 1) * itemH;
          for (var j = 32; j < 468; j++) {

            if (j < 102 || j > 117) {
              if (j < 297 || j > 334) {
                var city = res.result[1][j]
                if (that.data.searchLetter[i].toLowerCase() === city.pinyin[0].substring(0, 1)) {
                  cityInfo.push(city);
                }
              }
            }
          }
          tempArr.cityInfo = cityInfo;
          tempObj.push(tempArr);
        }
        that.setData({
          cityList: tempObj,
          winHeight: winHeight,
          choosecity: app.globalData.city,
          previousPage: app.globalData.previousPage

        })
      },
      fail: function(error) {
        console.error(error);
      },
      complete: function(res) {
        console.log(res);
      }
    });
  },

  /**
   * 从极速数据获取城市列表
   */
  getCityList_jisuAPI() {
    var that = this
    wx.request({
      url: 'https://api.jisuapi.com/transit/city?appkey=746b621c85938173',
      success: function(res) {
        that.setData({
          cityList_jisuAPI: res.data.result
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
    this.getCityList()
    this.getCityList_jisuAPI()
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
  clickLetter: function(e) {
    console.log(e.currentTarget.dataset.letter)
    var showLetter = e.currentTarget.dataset.letter;
    this.setData({
      showLetter: showLetter,
      isShowLetter: true,
      scrollTopId: showLetter,
    })
    var that = this;
    setTimeout(function() {
      that.setData({
        isShowLetter: false
      })
    }, 1000)
  },
  //选择城市
  bindCity: function(e) {
    console.log("bindCity")
    var chooseCity = {};
    chooseCity.cityId = e.currentTarget.dataset.cityCode
    chooseCity.cityName = e.currentTarget.dataset.city
    this.setData({
      choosecity: chooseCity
    })
  },
  //选择热门城市
  bindHotCity: function(e) {
    console.log("bindHotCity")
    var chooseCity = {};
    chooseCity.cityId = e.currentTarget.dataset.cityCode
    chooseCity.cityName = e.currentTarget.dataset.city
    this.setData({
      choosecity: chooseCity
    })
  },
  //点击热门城市回到顶部
  hotCity: function() {
    this.setData({
      scrollTop: 0,
    })
  },

  //返回上一页
  sure: function() {
    var ccity = {} //临时选择对象
    ccity.cityName = this.data.choosecity.cityName
    ccity.cityId = this.data.choosecity.cityId
    //遍历列表，获取查询id
    for (var i = 0; i < this.data.cityList_jisuAPI.length; i++) {
      if (this.data.cityList_jisuAPI[i].name === this.data.choosecity.cityName) {
        ccity.citySearchID = this.data.cityList_jisuAPI[i].cityid
      }
    }
    //将选择对象放入app.js
    app.setCity(ccity)
    //跳转回上一页
    var url = this.data.previousPage
    console.log(url)
    wx.switchTab({
      url: url,
    })
  },

  //点击定位
  positioningLocation: function() {
    var that = this
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        const getlatitude = res.latitude //纬度
        const getlongitude = res.longitude //经度
        qqmapsdk.reverseGeocoder({
          location: {
            latitude: getlatitude,
            longitude: getlongitude
          },
          success: function(res) {
            //获取城市名
            var chooseCity = {};
            chooseCity.cityId = res.result.ad_info.city_code.substring(3, 9)
            chooseCity.cityName = res.result.ad_info.city.substring(0, 2)
            that.setData({
              choosecity: chooseCity
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

  }
})