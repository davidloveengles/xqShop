
const paymentUrl = require('../../config.js').paymentUrl
const requestOrderUrl = require('../../config.js').requestOrderUrl
var app = getApp()

Page({

  data: {
      storageCardData: [],
      cardTotalPrice: 0,
      peopleAddressData: {},
      payWayList: [{ value: 1, name: '微信支付', checked: true }, { value: 2, name: '货到付款'}],
      formid: null,
    payWay: 1,
    loading: false
  },

  /**支付方式改变 */
    payWayChange: function (e) {
       
        var items = this.data.payWayList;
        for (var i = 0, len = items.length; i < len; ++i) {
            items[i].checked = (items[i].value == e.detail.value);
        }

        this.setData({
            payWayList: items,
            payWay: Number(e.detail.value)
        });
    },
    /**计算总价格 */
    getTotalPrice: function () {
        var cardTotalPrice = 0;
        var carList = this.data.storageCardData;
        for (var i = 0; i < carList.length; i++) {
            var cardObj = carList[i];
            cardTotalPrice += cardObj.price * cardObj.count;
        }
        this.setData({
            cardTotalPrice: cardTotalPrice
        })
    },
    /**跳转地址编辑页面 */
    goPeopleAddressTouch: function () {
        
        wx.navigateTo({
            url: '../address/address'
        })
    },
    /**跳转回首页 */
    goShopPage: function () {
        // 清理购物车缓存
         wx.removeStorageSync('cardData')
     
        // 跳转
        wx.navigateBack({
            url: '../shop/shop'
         })
    },
    /**检查用户授权 */
    checkUserScope: function () {
    
    },
    submitForm: function (e) {

        var form_id = e.detail.formId
        var formData = e.detail.value

        console.log('form_id is:', form_id)
        console.log('formData is:', formData)
        
        this.setData({
            formid: form_id
        })

    // },
    // /**确定下单 */
    // enterTouch: function (e) {

        var self = this;

        // 判断是否填写了收货地址 
        var data = this.data.peopleAddressData;
        if (this.data.peopleAddressData == "") {
            wx.showModal({
                title: "请添加一个收货地址",
                confirmText: "确定",
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        self.goPeopleAddressTouch();
                    }
                }
            })
            return;
        } 
        
        // 配置订单信息
        var orderList = { goods_detail: null }
        var goods_detail = []

        var storageCardData = this.data.storageCardData
        for (var i = 0; i < storageCardData.length; i++) {
            var food = storageCardData[i]
            var goods = {}
            goods.goods_id = food.id
            goods.goods_name = food.name
            goods.quantity = food.count
            goods.price = food.price * 100
            goods_detail[i] = goods
        }
        var orderList = { "goods_detail": goods_detail }
        orderList.goods_detail = goods_detail

        var total_fee = this.data.cardTotalPrice * 100
        var addressinfo = this.data.peopleAddressData
        var userinfo = app.globalData.userInfo
        var form_id = this.data.formid
        var remark = formData.textarea || ""

        // 下单
        if (this.data.payWay == 1) {
            this.requestPayment(orderList, total_fee, addressinfo, userinfo, this.data.payWay, form_id, remark);
        }else {
            this.requestOrder(orderList, total_fee, addressinfo, userinfo, this.data.payWay, form_id, remark)
        }

    },
    /**请求支付 */
    requestPayment: function (orderList, total_fee, addressinfo, userinfo, payWay, form_id, remark) {
        var self = this;
        self.setData({
            loading: true
        })
        // 此处需要先调用wx.login方法获取code，然后在服务端调用微信接口使用code换取下单用户的openId
        // 具体文档参考https://mp.weixin.qq.com/debug/wxadoc/dev/api/api-login.html?t=20161230#wxloginobject
            app.getUserOpenId(function (err, openid) {

            if (!err) {
                wx.request({
                    url: paymentUrl,
                    data: {
                        openid,
                        orderList,
                        total_fee,
                        addressinfo,
                        userinfo,
                        payWay,
                        form_id,
                        remark
                    },
                    method: 'POST',
                    success: function (res) {
                        console.log('服务器返回待支付信息成功:', res)
                        var payargs = JSON.parse(res.data.data)

                        console.log('payargs.appId:', payargs.appId)
                        console.log('payargs.timeStamp:', payargs.timeStamp)
                        console.log('payargs.nonceStr:', payargs.nonceStr)
                        console.log('payargs.package:', payargs.package)
                        console.log('payargs.signType:', payargs.signType)
                        console.log('payargs.paySign:', payargs.paySign)
                        
                        wx.requestPayment({
                            appId: payargs.appId,
                            timeStamp: payargs.timeStamp,
                            nonceStr: payargs.nonceStr,
                            package: payargs.package,
                            signType: payargs.signType,
                            paySign: payargs.paySign,
                            success: function (res) {
                                console.log("吊起支付成功")
                                console.log(res)
                                wx.showModal({
                                    title: "下单成功，马上给您送货",
                                    confirmText: "确定",
                                    showCancel: false,
                                    success: function (res) {
                                        self.goShopPage()
                                    }
                                })
                            },
                            fail: function (error) {
                                console.log("吊起支付失败")
                                console.log(error)
                                wx.showToast({
                                    title: '支付失败',
                                    icon: 'success',
                                    mask: true,
                                    duration: 2000
                                })
                            },
                            complete: function () {
                                self.setData({
                                    loading: false
                                })
                            },

                        })
                        // ...
                        
                    }
                })
            } else {
                console.log('err:', err)
                self.setData({
                    loading: false
                })
            }
        })
    },
    /**选择货到付款下单 */
    requestOrder: function (orderList, total_fee, addressinfo, userinfo, payWay, form_id, remark) {
        var self = this;
        self.setData({
            loading: true
        })

        app.getUserOpenId(function (err, openid) {

            if (!err) {
                wx.request({
                    url: requestOrderUrl,
                    data: {
                        openid,
                        orderList,
                        total_fee,
                        payWay,
                        addressinfo,
                        userinfo,
                        form_id,
                        remark
                    },
                    method: 'POST',
                    success: function (res) {
                       
                       if (res.data.status == 1){
                           console.log('下单成功', res)
                           wx.showModal({
                               title: "下单成功，马上给您送货",
                               confirmText: "确定",
                               showCancel: false,
                               success: function (res) {
                                   if (res.confirm) {
                                       self.goShopPage();
                                   }
                               }
                           })
                       }else {
                           wx.showModal({
                               title: "下单失败，再试一次",
                               confirmText: "确定",
                               showCancel: false,
                           })
                       }
                        

                        self.setData({
                            loading: false
                        })
                    },
                    fail: function (res) {
                        self.setData({
                            loading: false
                        })
                        console.log('下单失败', res)
                    }
                 })
            } else {
                console.log('err:', err)
                self.setData({
                    loading: false
                })
            }
        })
    },
    /**本地化数据 */
    /**购物车信息 */
    getCardStorage: function () {
        var key = "cardData";
        var storageCardData = wx.getStorageSync(key)

        this.setData({
            storageCardData: storageCardData
        })
    },
    /**获取收货信息 */
    getPeopleAddressData: function () {
        var key = "peopleAddressData";
        var peopleAddressData = wx.getStorageSync(key);

        this.setData({
            peopleAddressData: peopleAddressData
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
      this.getCardStorage();
      this.getTotalPrice();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      this.getPeopleAddressData();
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