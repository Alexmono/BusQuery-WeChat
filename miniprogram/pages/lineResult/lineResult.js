// miniprogram/pages/lineResult/lineResult.js
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
    linesPoint: [], //线路规划方案，每一项为一种方案--坐标点
    linesLine: [], //线路规划方案，每一项为一种方案--行为
    pageid: 0, //显示方案index
    maxpageid: 0, //id的最大值
    hight: 57,
    top: 500,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var start = JSON.parse(options.start)
    var end = JSON.parse(options.end)
    this.planLine(start, end)
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

  //规划线路
  planLine: function(start, end){
    var that = this
    qqmapsdk.direction({
      mode: 'transit',
      from: {
        latitude: start.location.lat,
        longitude: start.location.lng
      },
      to: {
        latitude: end.location.lat,
        longitude: end.location.lng
      },
      success: function (res) {
        //将返回的规划数据解压放到lines
        var linesPoint = [];
        var linesLine = [];
        for(var x = 0; x < res.result.routes.length; x++){
          var ret = res.result.routes[x];
          var count = ret.steps.length;
          var pl = [];
          var coors = [];
          //将各个步骤描述装入
          var steps = ret.steps;
          linesLine.push(steps)
          console.log(steps)
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
          
          var polylines = []
          var polyline = {}
          polyline.points = pl
          polyline.color = '#FF0000DD'
          polyline.width = 4

          polylines.push(polyline)

          var line = {}
          line.latitude = pl[0].latitude
          line.longitude = pl[0].longitude
          line.polyline = polylines

          linesPoint.push(line);
          
        }
        that.setData({
          linesLine: linesLine,
          linesPoint: linesPoint,
          maxpageid: res.result.routes.length
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

  // 上一项
  previous: function(e) {
    var index = this.data.pageid
    if (index > 0) {
      index = index - 1
      this.setData({
        pageid: index
      })
    }
  },
  //下一项
  next: function(e) {
    var index = this.data.pageid
    if (index < this.data.maxpageid-1) {
      index = index + 1
      this.setData({
        pageid: index
      })
    }
  },

  //禁止滑动
  catchTouchMove: function(res) {
    return false
  },

  //过程展示全屏或半屏
  topOrbuttom: function(){
    if(this.data.top == 500 && this.data.hight == 57){
      this.setData({
        top: 0,
        hight: 100
      })
    }else{
      this.setData({
        top: 500,
        hight: 57
      })
    }
  },
})