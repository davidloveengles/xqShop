// shop.js
const requestAllFoods = require('../../config').requestAllFoods
var app = getApp()

Page({

  data: {
      leftList: [],
    leftList2 : [
        {
            id: 10,
            name: "素食",
            open: false,
            count: 10,
            subKinds: [{
                id: 1, open: false, name: "方便面榨菜", count: 0, foods: [{ id: 10001, img: "", name: "巧面馆老坛酸菜方便面红油味桶面", price: 4.5, count: 0, icon: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496204658603&di=cf5b7faadac35ac74989598d353962d4&imgtype=0&src=http%3A%2F%2Fs4.sinaimg.cn%2Fmw690%2F001hYbJBgy6DCQkjv4Dc3%26690" }, { id: 10002, img: "", name: "豫竹香辣牛肉方便面68g", price: 1.5,  count: 0, icon: "https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1496204658603&di=cf5b7faadac35ac74989598d353962d4&imgtype=0&src=http%3A%2F%2Fs4.sinaimg.cn%2Fmw690%2F001hYbJBgy6DCQkjv4Dc3%26690" }]
            }, {
                    id: 2, select: false, name: "辣条一元等", count: 0, foods: []
                }, {
                    id: 3, select: false, name: "肉肠凤爪类", count: 0, foods: []
            }, {
                    id: 4, select: false, name: "蛋类", count: 0, foods: []
            }]
        },
        {
            id: 1,
            name: "代买香烟",
            open: false,
            subKinds: [{
                id: 1001, select: false, name: "烟具", foods: []
            }, {
                    id: 1002, select: false, name: "10元以下", foods: []
                }, {
                    id: 1003, select: false, name: "10-20元", foods: []
            }, {
                    id: 1004, select: false, name: "10-20元", foods: []
                }, {
                    id: 1005, select: false, name: "20-50元", foods: []
            }, {
                    id: 1006, select: false, name: "50-100元", foods: []
            }, {
                    id: 1007, select: false, name: "整条购", foods: []
            }]
        },
        {
            id: 2,
            name: "饮品", open: false,
            subKinds: [{
                id: 2001, select: false, name: "水", foods: []
            }, {
                    id: 2002, select: false, name: "碳酸饮料", foods: []
            }, {
                    id: 2003, select: false, name: "功能饮料", foods: []
            }, {
                    id: 2004, select: false, name: "果汁饮品", foods: []
            }, {
                    id: 2005, select: false, name: "茶饮料", foods: []
            }, {
                    id: 2006, select: false, name: "奶茶咖啡", foods: []
            }, {
                    id: 2007, select: false, name: "冲泡饮品", foods: []
            }]
        },
        {
            id: 3,
            name: "冷饮冰激凌",
            open: false,
            subKinds: [{
                id: 3001, select: false, name: "2元以下", foods: []
            }, {
                    id: 3002, select: false, name: "2-5元", foods: []
            }]
        },
        {
            id: 4,
            name: "牛奶面包蛋糕",
            open: false,
            subKinds: [{
                id: 4001, select: false, name: "牛奶", foods: []
            }, {
                    id: 4002, select: false, name: "酸奶", foods: []
            }, {
                    id: 4003, select: false, name: "面包", foods: []
            }, {
                    id: 4004, select: false, name: "糕点", foods: []
            }]
        },
        {
            id: 5,
            name: "零食饼干坚果",
            open: false,
            subKinds: [{
                id: 5001, select: false, name: "饼干", foods: []
            }, {
                    id: 5002, select: false, name: "坚果", foods: []
            }, {
                    id: 5003, select: false, name: "锅巴", foods: []
            }, {
                    id: 5004, select: false, name: "薯片", foods: []
            }, {
                    id: 5005, select: false, name: "膨化食品", foods: []
            }, {
                    id: 6, select: false, name: "蜜饯", foods: []
            }]
        },
        {
            id: 6,
            name: "果糖巧克力",
            open: false,
            subKinds: [{
                id: 6001, select: false, name: "棒棒糖", foods: []
            }, {
                    id: 6002, select: false, name: "口香糖", foods: []
            }]
        },
        {
            id: 7,
            name: "酒",
            open: false,
            subKinds: [{
                id: 7001, select: false, name: "啤酒", foods: []
            }, {
                    id: 7002, select: false, name: "白酒", foods: []
            }]
        },
        {
            id: 8,
            name: "纸品湿巾",
            open: false,
            subKinds: [{
                id: 8001, select: false, name: "抽纸", foods: []
            }, {
                    id: 8002, select: false, name: "卷纸", foods: []
            }, {
                    id: 8003, select: false, name: "女士用品", foods: []
            }, {
                    id: 8004, select: false, name: "整提卷纸", foods: []
            }]
        },
    ],
    leftSelectId: 0,
    leftSelectSubObj: {},
    storageCardData: [],
    cardTotalCount: 0,
    cardTotalPrice: 0,
    cardViewIsShow: false,
    userInfo: {},

    // add动画
    currentAddFoodAnimation: {},
    currentAddFoodId: null,
  },
/** 选择左边标题*/
    leftTitleTouch: function (e) {

        var id = e.currentTarget.id, list = this.data.leftList;

        for (var i = 0; i < list.length; i++) {

            if (list[i].id == id){
                list[i].open = !list[i].open;
                this.data.leftSelectId = id;

                // 选择的子页重置select状态
                var subList = list[i].subKinds
                for (var j = 0; j < subList.length; j++) {
                    subList[j].select = false;
                }

            }else {
                list[i].open = false;
            }
        }
        this.setData ({
            leftList: list,
            leftSelectId: this.data.leftSelectId
        })
    },
/** 选择左边子标题*/
    leftElementTouch: function (e) {
        
        var id = e.currentTarget.id, list = this.data.leftList;
        for (var i = 0; i < list.length; i++) {
            if (list[i].id == this.data.leftSelectId) {
                var subList = list[i].subKinds;
                for (var j = 0; j < subList.length; j++) {

                    if (subList[j].id == id ) {
                        subList[j].open = true;
                        this.data.leftSelectSubObj = subList[j];

                        // add动画有关逻辑（切回来还能看见动画轨迹的bug），清空animation
                        for (var x = 0; x < subList[j].foods.length; x++) {
                            subList[j].foods[x].animation = null
                        }
                    }else{
                        subList[j].open = false;
                    }
                }
                
            } 
        }
       
        this.setData({
            leftList: list,
            leftSelectSubObj: this.data.leftSelectSubObj
        })
    },

/** 合并购物车数据和网络数据*/
    handleLeftListData: function () {

        var list = this.data.leftList;
        var carList = this.data.storageCardData;
        for (var i = 0; i < list.length; i++) {
            
            list[i].count = 0;
            var pagesObj = list[i].subKinds;
            for (var j = 0; j < pagesObj.length; j++) {
                pagesObj[j].count = 0;
                var foodsObj = pagesObj[j].foods;
                for (var k = 0; k < foodsObj.length; k++){
                    
                    var foodObj = foodsObj[k];
                    // add动画
                    if (this.currentAddFoodId == foodObj.id) {
                        foodObj.animation = this.currentAddFoodAnimation
                    }else {
                        foodObj.animation = null
                    }
                    foodObj.count = 0;
                    for (var x = 0; x < carList.length; x++) {
                       
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


                if (pagesObj[j].id == this.data.leftSelectSubObj.id && pagesObj[j].name == this.data.leftSelectSubObj.name){
                    this.data.leftSelectSubObj = pagesObj[j];
                }

            }
        }

        // 移除count=0的购物车数据
        // 计算总数量和总价格
        var newCardList = carList.concat();
        var cardTotalCount = 0, cardTotalPrice = 0;
        for (var i = 0; i < carList.length; i++) {
            
            var cardObj = carList[i];
            if (cardObj.count == 0) {
                for (var j = 0; j < newCardList.length; j++) {
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
            leftList: list,
            leftSelectSubObj: this.data.leftSelectSubObj,
            storageCardData: newCardList,
            cardTotalCount: cardTotalCount,
            cardTotalPrice: Math.floor(cardTotalPrice * 100) / 100
        })

        this.setCardStorage(newCardList);

        // add动画逻辑，置空数据
        this.currentAddFoodId = null
        this.currentAddFoodAnimation = null
    },
    /** - */
    countJianTouch: function (e) {

        var id = e.currentTarget.id;
        var cardList = this.data.storageCardData;

        for (var i = 0; i < cardList.length; i++) {
            var cardObj = cardList[i];
            if (cardObj.id == id) {
                if (cardObj.count > 0) {
                    cardObj.count -= 1;
                }
                break;
            }
        }
        
        this.handleLeftListData();
    },
    /** + */
    countAddTouch: function (e) {

        // 1.获取当前模型
        var id = e.currentTarget.id;
        var currentFood;
        var foods = this.data.leftSelectSubObj.foods;
        for (var i = 0; i < foods.length; i++) {
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
        }else {
            currentFood.count += 1;
        }

        // 3.动画
        // if (this.data.cardViewIsShow == false) {
        //     this.beginCardAnimation(e)
        // }

        // 4. 修改购物车数据
        var cardList = this.data.storageCardData;
            var cardContainsCurrentFood = false;
            for (var i = 0; i < cardList.length; i++) {
                var cardObj = cardList[i];
                if (currentFood.id == cardObj.id) {
                    cardContainsCurrentFood = true;
                    cardList[i] = currentFood;
                    break;
            }
            }
            if (cardContainsCurrentFood == false) {
                cardList[cardList.length] = currentFood;
            }
        

        // 5.修改大模型数组的数据
        this.handleLeftListData();

        // 
        this.setData({
            countJianFromCard: false
        })
    },
    /**清空购物车 */
    countClearTouch: function () {
        var cardList = this.data.storageCardData;

        for (var i = 0; i < cardList.length; i++) {
            var cardObj = cardList[i];
            cardObj.count = 0;
        }

        this.handleLeftListData();
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
    /**去结算跳转 */
    goOrderTouch: function () {
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
    /**网络请求 */
    requestLeftList: function () {
        var self = this

        self.setData({
            loading: true
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

                if (result.data.status == 1) {
                    var data = JSON.parse(result.data.data)
                    console.log("获取所有商品信息成功")
                    console.log(data)
                    self.setData({
                        leftList: data
                    })
                    self.handleLeftListData();
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
      this.handleLeftListData();
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