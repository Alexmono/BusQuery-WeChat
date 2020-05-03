//app.js
App({


  onLaunch: function() {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.globalData.windH = res.windowHeight;
        that.globalData.windW = res.windowWidth;
      },
    })
    
  },

  globalData: {
    windH:'',
    windW:'',
    previousPage: '', //上一个页面
    //选择的城市
    city: {
      cityid: 0,
      name: '未选择',
      code:""
    },

  },
  //设置城市
  setCity: function(e) {
    this.globalData.city = e
  }

})