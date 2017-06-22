//app.js
const openIdUrl = require('config.js').openIdUrl

App({
    globalData: {
        systemInfo: null,
        userInfo: null,
        hasLogin: false,
        openid: null//用登陆获取的code从后台获取openid
    },
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
   
    this.getSystemInfo()
  },

  getSystemInfo: function () {
      var that = this
      wx.getSystemInfo({
          success: function (res) {
              // console.log(res.model)
              // console.log(res.pixelRatio)
              // console.log(res.windowWidth)
              // console.log(res.windowHeight)
              // console.log(res.language)
              // console.log(res.version)
              that.globalData.systemInfo = res
          },
          fail: function () {
          }
      })
  },

  /**getUserInfo */
  getUserInfo: function (callback){
    var that = this
    if(this.globalData.userInfo){
      typeof cb == "function" && cb(this.globalData.userInfo)
    }else{
      //调用登录接口
      wx.login({
          success: function () {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.userInfo = res.userInfo
              console.log(res.userInfo);
              callback(res.userInfo)
            }
          })
        }
      })
    }
  },

  // lazy loading openid
  /**getUserOpenId */
  getUserOpenId: function (callback) {
      var self = this

      if (self.globalData.openid) {
          callback(null, self.globalData.openid)
      } else {
          wx.login({
              success: function (data) {
                  console.log(data)
                  wx.request({
                      url: openIdUrl,
                      data: {
                          code: data.code,
                      },
                      success: function (res) {
                          
                          if (res.data.status == 1){
                              console.log('拉取openid成功', res)
                              self.globalData.openid = res.data.data
                              callback(null, self.globalData.openid)
                          }else {
                              callback("服务端获取openid失败", null)
                          }
                      },
                      fail: function (res) {
                          console.log('拉取用户openid失败，将无法正常使用开放接口等服务', res)
                          callback(res, null)
                      }
                  })
              },
              fail: function (err) {
                  console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
                  callback(err,null)
              }
          })
      }
  }

  
})