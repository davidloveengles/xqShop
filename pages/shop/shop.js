// shop.js
const requestAllFoods = require('../../config').requestAllFoods
const requestShopMsgUrl = require('../../config').requestShopMsgUrl
const nethost = require('../../config').host
var app = getApp()

Page({

  data: {
      leftList: [],
    leftSelectId: 0,
    leftSelectSubObj: {},
    storageCardData: [],
    cardTotalCount: 0,
    cardTotalPrice: 0,
    cardViewIsShow: false,
    userInfo: {},

    host: nethost,

    tipmsg: "",
    phone: null,
    workStatus: true,

    // add动画
    // currentAddFoodAnimation: {},
    // currentAddFoodId: null,
  },
/** 选择左边标题*/
    leftTitleTouch: function (e) {

        var id = e.currentTarget.id, list = this.data.leftList;
        
        const listLength = list.length
        for (var i = 0; i < listLength; i++) {

            var kind = list[i]
            if (kind.id == id){
                var subList = kind.subKinds
                if (kind.nosub == true) {

                    if (kind.open == true) {
                        return
                    }
                    kind.open = true
                }else {
                    kind.open = !kind.open;
                }
             
                this.data.leftSelectId = id;

                // 选择的子页重置select状态
                var selectSubkind = null
                var sublistFirst = subList[0]
                if (subList.length > 0) {
                    sublistFirst.open = true;
                    selectSubkind = sublistFirst
                }
                
                const subListLength = subList.length
                for (var j = 0; j < subListLength; j++) {
                    var subkind = subList[j]
                    if (j != 0 && subkind.open == true) {
                        sublistFirst.open = false;
                        selectSubkind = subkind
                        break
                    }
                }
                if (kind.open == true) {

                    this.setData({
                        leftSelectSubObj: selectSubkind
                    })
                }
            }else {
                kind.open = false;
            }
        }

        this.setData ({
            leftList: list,
            leftSelectId: this.data.leftSelectId
        })
    },
/** 选择左边子标题*/
    leftElementTouch: function (e) {
        
        var id = e.currentTarget.id
        this.leftElementSelect(id)
    },
    leftElementSelect: function (id) {
      
        var list = this.data.leftList;
        const listLength = list.length
        for (var i = 0; i < listLength; i++) {
            var kind = list[i]
            if (kind.id == this.data.leftSelectId) {
                var subList = kind.subKinds;
                const subListLength = subList.length
                for (var j = 0; j < subListLength; j++) {

                    var subKind = subList[j]
                    if (subKind.id == id) {
                        subKind.open = true;
                        this.data.leftSelectSubObj = subKind;

                        // add动画有关逻辑（切回来还能看见动画轨迹的bug），清空animation
                        // for (var x = 0; x < subList[j].foods.length; x++) {
                        //     subList[j].foods[x].animation = null
                        // }
                    } else {
                        subKind.open = false;
                    }
                }
                break
            }
        }

        this.setData({
            leftList: list,
            // leftSelectSubObj: this.data.leftSelectSubObj
        })
        this.setData({
            // leftList: list,
            leftSelectSubObj: this.data.leftSelectSubObj
        })
       
    },

/** 合并购物车数据和网络数据*/
    handleLeftListData: function (isOperate) {

        var list = this.data.leftList;
        var carList = this.data.storageCardData;

        if (isOperate == false) {
            const listLength = list.length
            for (var i = 0; i < listLength; i++) {

                list[i].count = 0;
                var pagesObj = list[i].subKinds;
                const pagesLength = pagesObj.length
                for (var j = 0; j < pagesLength; j++) {
                    pagesObj[j].count = 0;
                    var foodsObj = pagesObj[j].foods;
                    const foodsObjLength = foodsObj.length
                    for (var k = 0; k < foodsObjLength; k++) {

                        var foodObj = foodsObj[k];
                        // add动画
                        // if (this.currentAddFoodId == foodObj.id) {
                        //     foodObj.animation = this.currentAddFoodAnimation
                        // }else {
                        //     foodObj.animation = null
                        // }
                        foodObj.count = 0;
                        const carListLength = carList.length
                        for (var x = 0; x < carListLength; x++) {

                            var cardObj = carList[x];
                            if (cardObj.id == foodObj.id) {
                                // 每个商品选择的数量
                                foodObj.count = cardObj.count;
                                // 左边子类选择的数量 
                                pagesObj[j].count += foodObj.count;
                                // 网络数据里除了id都可能有变，所以把购物车的数据再刷新一下
                                cardObj = foodObj;
                            }
                        }
                    }
                    // 大标题类型选择的总数量
                    list[i].count += pagesObj[j].count;

                    if (pagesObj[j].id == this.data.leftSelectSubObj.id && pagesObj[j].name == this.data.leftSelectSubObj.name) {
                        this.data.leftSelectSubObj = pagesObj[j];
                    }

                }
            }
        }else {
            const listLength = list.length
            for (var i = 0; i < listLength; i++) {

                var kindobj = list[i]
                kindobj.count = 0
                
                var subKinds = kindobj.subKinds;
                const subKindsLength = subKinds.length
                for (var j = 0; j < subKindsLength; j++) {

                    var subkindObj = subKinds[j]
                    subkindObj.count = 0
                    const carListLength = carList.length
                    for (var x = 0; x < carListLength; x++) {
                       
                        var cardObj = carList[x];
                        if (cardObj.ppid == kindobj.id) {

                            if (cardObj.pid == subkindObj.id || cardObj.pid == -1) {
                                var foodsObj = subkindObj.foods;
                                const foodsObjLength = foodsObj.length
                                for (var k = 0; k < foodsObjLength; k++) {
                                    var foodObj = foodsObj[k];

                                    if (cardObj.id == foodObj.id) {
                                        // 每个商品选择的数量
                                        foodObj.count = cardObj.count;
                                        // 左边子类选择的数量 
                                        subkindObj.count += foodObj.count;

                                    }
                                }
                            }
                           
                        }
                    }
                    
                    // 大标题类型选择的总数量
                    if (subkindObj.count > 0) { 
                        kindobj.count += subkindObj.count;
                    }
                    if (subkindObj.id == this.data.leftSelectSubObj.id && subkindObj.name == this.data.leftSelectSubObj.name) {
                        this.data.leftSelectSubObj = subkindObj;
                        console.log(this.data.leftSelectSubObj)
                    }
                }
            }
        }

        // 移除count=0的购物车数据
        // 计算总数量和总价格
        var newCardList = carList.concat();
        var cardTotalCount = 0, cardTotalPrice = 0;
        const carListLength = carList.length
        for (var i = 0; i < carListLength; i++) {
            
            var cardObj = carList[i];
            if (cardObj.count == 0) {
                const newcarListLength = newCardList.length
                for (var j = 0; j < newcarListLength; j++) {
                    if (newCardList[j] == cardObj) {
                        newCardList.splice(j,1);
                    }
                }
            }else {
                cardTotalCount += cardObj.count;
                cardTotalPrice += cardObj.price * cardObj.count;
            }
        }
        
        // 购物车没有商品时隐藏
        if (newCardList.length == 0) {
            this.setData({
                cardViewIsShow: false
            })
        }

        this.setData({
            // leftList: list,
            leftSelectSubObj: this.data.leftSelectSubObj,
            storageCardData: newCardList,
            cardTotalCount: cardTotalCount,
            cardTotalPrice: Math.floor(cardTotalPrice * 100) / 100
        })
        this.setData({
            leftList: list
        })

        this.setCardStorage(newCardList);

        // add动画逻辑，置空数据
        // this.currentAddFoodId = null
        // this.currentAddFoodAnimation = null
    },
    /** - */
    countJianTouch: function (e) {

        var id = e.currentTarget.id;
        var cardList = this.data.storageCardData
        const cardListLength = cardList.length
        for (var i = 0; i < cardListLength; i++) {
            var cardObj = cardList[i];
            if (cardObj.id == id) {
                if (cardObj.count > 0) {
                    cardObj.count -= 1;
                }
                break;
            }
        }

        this.handleLeftListData(true);
    },
    /** + */
    // 从购物车+
    countAddInCardTouch: function (e) {
        var id = e.currentTarget.id;
        this.countAdd(true, id)
    },
    // 从右边+
    countAddTouch: function (e) {
        var id = e.currentTarget.id;
        this.countAdd(false, id)
    },
    countAdd: function (fromCard, id) {

        var currentFood;
        if (fromCard == false) {
            // 1.获取当前模型
            var foods = this.data.leftSelectSubObj.foods
            const foodsLength = foods.length
            for (var i = 0; i < foodsLength; i++) {
                var food = foods[i];
                if (food.id == id) {
                    currentFood = food;
                    break;
                }
            }

            // 2.增加数量
            if (currentFood.count == 99) {
                console.log("单品最大数量99");
                return
            } else {
                currentFood.count += 1;
            }


            // 3.判断购物车是否有该商品
            var cardList = this.data.storageCardData;
            var cardCoutainThis = false
            const cardListLength = cardList.length
            for (var i = 0; i < cardListLength; i++) {
                var cardObj = cardList[i];
                if (cardObj.id == id) {
                    cardObj.count = currentFood.count
                    cardCoutainThis = true
                    break;
                }
            }

            // 3.第一次添加，加到购物车
            if (cardCoutainThis == false) {
                cardList[cardList.length] = currentFood;
            }
        } else {
            // 1.获取当前模型
            var cardList = this.data.storageCardData;
            const cardListLength = cardList.length
            for (var i = 0; i < cardListLength; i++) {
                var cardObj = cardList[i];
                if (cardObj.id == id) {
                    currentFood = cardObj;
                    break;
                }
            }

            // 2.增加数量
            if (currentFood.count == 99) {
                console.log("单品最大数量99");
                return
            } else {
                currentFood.count += 1;
            }
        }


        // 5.修改大模型数组的数据
        this.handleLeftListData(true);
    },
    /**清空购物车 */
    countClearTouch: function () {
        var cardList = this.data.storageCardData;

        for (var i = 0; i < cardList.length; i++) {
            var cardObj = cardList[i];
            cardObj.count = 0;
        }

        this.handleLeftListData(true);
    },

/**本地化数据 */
    getCardStorage:function () {
        var key = "cardData";
        var data = wx.getStorageSync(key) || []
        // if (data) {
                this.setData({
                    storageCardData: data
                })
        // }
        
    },
    setCardStorage: function (data) {
        var key = "cardData";
        wx.setStorageSync(key, data);
    },
    /** 添加商品动画*/ 
    beginCardAnimation: function (e) {

        // 获取窗口宽高
        var systemInfo = app.globalData.systemInfo
        if (systemInfo == null) {
            return
        }
        var pixelRatio = systemInfo.pixelRatio
        var windowWidth = systemInfo.windowWidth
        var windowHeight = systemInfo.windowHeight

        // 计算动画宽高
        var mX = - (e.detail.x - 90 / pixelRatio)
        var mY = (windowHeight - e.detail.y - 100 / pixelRatio)

        // console.log("asdfasd")
        // console.log(mX)
        // console.log(mY)

        // 动画
        var animation = wx.createAnimation({
            duration: 300,
            timingFunction: 'ease',
        })

        animation.opacity(1)

        var num = 10
        var time = 300 / num
        for (var i = 1; i < num; i++) {

            var nx = - (mX / num) * i
            var ny = Math.sqrt( (1 - (nx * nx) / (mX * mX)) *( mY * mY))

            animation.translate(- nx,  mY - ny).step({ duration: time })
        }
        animation.translate(mX, mY).step({ duration: time })
        animation.translate(0, 0).opacity(0).step({ duration: 0, timingFunction: "step-start"})
        // opacity(0)

        // 设置数据
        this.currentAddFoodId = e.currentTarget.id
        this.currentAddFoodAnimation = animation.export()
    },
    /**购物车视图显示 */
    cardViewImgTouch: function () {
        if (this.data.storageCardData.length == 0) {
            this.setData({
                cardViewIsShow: false
            })
            return;
        }
        var isShow = this.data.cardViewIsShow;
        this.setData({
            cardViewIsShow: !isShow
        })

    },
    cardViewTouch: function (e) {
        // 这个方法是为了阻止事件冒泡
    },
    // 打电话
    callPhoneTouch: function () {
        var phone = this.data.phone
        if (phone!= null && phone.length > 0) {
            wx.makePhoneCall({
                phoneNumber: this.data.phone
            })
        }
    },
    /**去结算跳转 */
    goOrderTouch: function () {

        if (this.data.workStatus == 0) {
            return;
        }
        if (this.data.cardTotalPrice == 0) {
            return;
        }
        wx.navigateTo({
            url: '../order/order'
        })
    },
    /**去我的订单跳转 */
    myOrderTouch: function () {
        wx.navigateTo({
            url: '../orderList/orderList'
        })
    },
    /** 点击我的头像 */
    myIconTouch: function () {

        app.getUserOpenId(function (err, openid) {
console.log(openid)
            if (!err && openid =="ozxD-0G8VslMeTlo0UUN06M0mYJw") {
                wx.navigateTo({
                    url: '../work/work'
                })
            }
        })
       
    },
    // tipMsgTouch: function () {
    //     wx.navigateTo({
    //         url: '../orderList/shopMsg'
    //     })
    // },
    /**网络请求 */
    // 营业信息（营业时间，是否营业，电话等）
    requestShopMsg: function () {
        var self = this

        wx.request({
            url: requestShopMsgUrl,
            data: {
                // noncestr: Date.now()
            },
            success: function (result) {
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
                }
            },
            fail: function ({errMsg}) {
                console.log('request fail', errMsg)
            }
        })
    },
    requestLeftList: function () {
        var self = this

        wx.showLoading({
            title: '加载网络数据...',
            mask: true
        })

        wx.request({
            url: requestAllFoods,
            data: {
                // noncestr: Date.now()
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (result) {
                wx.hideLoading()
                if (result.data.status == 1) {
                    var data = JSON.parse(result.data.data)
                    console.log("获取所有商品信息成功")
                    console.log(data)
                    self.setData({
                        leftList: data
                    })
                    self.handleLeftListData(false);
                }else {
                    wx.showToast({
                        title: '获取数据失败',
                        icon: 'success',
                        mask: true,
                        duration: 2000
                    })
                }
                
            },
            fail: function ({errMsg}) {
                console.log('request fail', errMsg)
                wx.hideLoading()
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
      
      this.requestLeftList()

      var that = this
      //调用应用实例的方法获取全局数据
      app.getUserInfo(function (userInfo) {
          //更新数据
          that.setData({
              userInfo: userInfo
          })
      })
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
      this.getCardStorage();
      this.handleLeftListData(false);

      this.requestShopMsg()
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