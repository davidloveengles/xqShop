

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la


var host = "https://www.zhangpangpang.cn"
// var host = "http://127.0.0.1:8888"


var config = {

    // 下面的地址配合云端 Server 工作
    host,

    // shop.js 请求所有商品数据url
    requestAllFoods: `${host}/xq/allfoods/query`,
    // 查询订单列表
    requestOrdersUrl: `${host}/xq/order/all`,
    // 货到付款下单url
    requestOrderUrl: `${host}/xq/order/order`,
    // 获取营业信息url
    requestShopMsgUrl: `${host}/xq/shopmsg/query`,
    // 设置营业信息url
    requestSetShopMsgUrl: `${host}/xq/shopmsg/set`,
    

    // 用code换取openId
    openIdUrl: `${host}/xq/openid`,
    // 生成支付订单的接口
    paymentUrl: `${host}/xq/order/payment`,
    // 测试的请求地址，用于测试会话
    // requestUrl: `https://${host}/testRequest`,
    // // 登录地址，用于建立会话
    // loginUrl: `https://${host}/login`,
    // // 测试的信道服务接口
    // tunnelUrl: `https://${host}/tunnel`,
    // // 发送模板消息接口
    // templateMessageUrl: `https://${host}/templateMessage`,
    // // 上传文件接口
    // uploadFileUrl: `https://${host}/upload`,
    // // 下载示例图片接口
    // downloadExampleUrl: `https://${host}/static/weapp.jpg`
};

module.exports = config