// orderList.js
const requestOrdersUrl = require('../../config.js').requestOrdersUrl
var app = getApp()

Page({

  data: {
      orderList: [],
      loadSuccess: false,
      loadFail: false
  },

  requestOrderList: function () {
      var self = this;
      self.setData({
          loadFail: false,
          loadSuccess: false
      })
      app.getUserOpenId(function (err, openid) {

          if (!err) {
              wx.request({
                  url: requestOrdersUrl,
                  data: {
                      openid
                  },
                  header: {
                      'content-type': 'application/json'
                  },
                  method: 'GET',
                  success: function (res) {

                     if (res.data.status == 1) {
                         var data = JSON.parse(res.data.data)
                         for (var i=0; i<data.length; i++) {
                             data[i].body = JSON.parse(data[i].body) 
                         }
                         self.setData({
                             orderList: data,
                             loadSuccess: true
                         })
                         console.log("success")
                     }else {
                         self.setData({
                             loadFail: true,
                             orderList: []
                         })
                     }
                  },
                  complete: function () {
                      wx.stopPullDownRefresh()
                  },
                  fail: function () {
                      self.setData({
                          loadFail: true,
                           orderList: []
                      })
                      console.log("faile")
                  }
              })
          } else {
              console.log('err:', err)
              self.setData({
                  loadFail: true,
                  orderList: []
              })
          }
      })
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
      this.onPullDownRefresh()
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
      this.requestOrderList()
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
  
  }
})