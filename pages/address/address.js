// address.js
Page({

  data: {
      peopleAddressData: {},
  },

  /**姓名改变*/
  nameChange: function (e) {
      var name = e.detail.value;
      this.data.peopleAddressData.name = name;
  },
  /**电话改变*/
  phoneChange: function (e) {
      var phone = e.detail.value;
      this.data.peopleAddressData.phone = phone;
  },
  /**送货地址改变*/
  homeChange: function (e) {
      var home = e.detail.value;
      this.data.peopleAddressData.home = home;
  },
  /**确定修改 */
  enterTouch: function (e) {
      var tip = '';
      var data = this.data.peopleAddressData;
      if (data.name == "") {
        tip = "请填写联系人"
      } else if (data.phone == "") {
          tip = "请填写电话"
      } else if (data.home == ""){
          tip = "请填写收货地址"
      }
      if (tip != '') {
          wx.showModal({
              title: tip,
              confirmText: "确定",
              showCancel: false
          })
      }else {
          this.setPeopleAddressData();
          wx.navigateBack();
      }
  },
  /**本地化数据 */
  /**获取收货信息 */
  getPeopleAddressData: function () {
      var key = "peopleAddressData";
      var peopleAddressData = wx.getStorageSync(key);
  
      if (peopleAddressData == "") {
          peopleAddressData = {
              name: "",
              phone: "",
              home: ""
          }
      }
      this.setData({
          peopleAddressData: peopleAddressData
      })
  },
  setPeopleAddressData: function () {
      var key = "peopleAddressData";
      var data = this.data.peopleAddressData;
      wx.setStorageSync(key, data)
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
      this.getPeopleAddressData();
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