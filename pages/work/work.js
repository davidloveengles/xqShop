
const requestShopMsgUrl = require('../../config').requestShopMsgUrl
const requestSetShopMsgUrl = require('../../config').requestSetShopMsgUrl


Page({

  /**
   * 页面的初始数据
   */
  data: {
      tipmsg: null,
      phone: null,
      workStatus: 0,
      loading: false
  },
  /**开关改变*/
  switchChange: function (e) {
      var workStatus = e.detail.value;
      this.setData({
          workStatus: Number(workStatus)
      })
  },
  /**提示改变*/
  tipChange: function (e) {
      var tipmsg = e.detail.value;
      this.data.tipmsg = tipmsg;
  },
  /**电话改变*/
  phoneChange: function (e) {
      var phone = e.detail.value;
      this.data.phone = phone;
  },
   /**网络请求 */
  /**确定 */
  enterTouch: function () {
      wx.request({
          url: requestSetShopMsgUrl,
          data: {
              open: this.data.workStatus,
              tip: this.data.tipmsg,
              phone: this.data.phone
          },
          method: 'POST',
          success: function (res) {

              console.log(res)
              if (res.data.status == 1) {
                  console.log("修改成功")
                  wx.showToast({
                      title: '修改成功',
                      icon: 'success',
                      mask: true,
                      duration: 2000,
                      success: function (res){
                          wx.navigateBack()
                      }
                  })
               }else {
                  wx.showToast({
                      title: '修改失败',
                      icon: 'success',
                      mask: true,
                      duration: 2000
                  })
               }
            },
            fail: function (error) {
                console.log("修改营业信息失败")
                console.log(error)
                wx.showToast({
                    title: '修改失败',
                    icon: 'success',
                    mask: true,
                    duration: 2000
                })
            }
      })
  },
  // 营业信息（营业时间，是否营业，电话等）
  requestShopMsg: function () {
      var self = this

      wx.showNavigationBarLoading()
      wx.request({
          url: requestShopMsgUrl,
          data: {
              // noncestr: Date.now()
          },
          success: function (result) {
              wx.hideNavigationBarLoading()

              console.log("营业信息")
              console.log(result)
              if (result.data.status == 1) {
                  var data = JSON.parse(result.data.data)
                  console.log("获取营业信息成功")
                  self.setData({
                      tipmsg: data.tip,
                      phone: data.phone,
                      workStatus: data.open
                  })

              } else {
                //   wx.showToast({
                //       title: '获取数据失败',
                //       icon: 'success',
                //       mask: true,
                //       duration: 2000
                //   })
              }
          },
          fail: function ({errMsg}) {
              console.log('request fail', errMsg)
              wx.hideNavigationBarLoading()
              wx.showToast({
                  title: '获取数据失败',
                  icon: 'success',
                  mask: true,
                  duration: 2000
              })
          }
      })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.requestShopMsg()
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
  
  }
})