//app.js
App({


  onLaunch: function() {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }
  },

  globalData: {
    amap_key: "5406458d3b826e46c643ed51a9d4132b",
    qqmap_key: "HEIBZ-Y67KW-JKIRI-O2A45-CO4D6-UTBNX",
    jisu_key: "746b621c85938173",
    previousPage: '', //上一个页面
    //选择的城市
    city: {
      cityId: '000000',
      cityName: '未选择',
      citySearchID: 0
    },

  },
  //设置城市
  setPreviousPage: function(e) {
    this.globalData.city = e
  }

})