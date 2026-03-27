import { getGoodById } from '../good';
import { STORE_NAME, STORE_SERVICE_PHONE, STORE_SERVICE_TIME } from '../store';

const clone = (value) => JSON.parse(JSON.stringify(value));

const baseAddress = {
  receiverAddressId: '14',
  provinceCode: '440000',
  cityCode: '440100',
  countryCode: '440106',
  receiverProvince: '广东省',
  receiverCity: '广州市',
  receiverCountry: '天河区',
  receiverArea: '',
  receiverAddress: '花城大道 88 号鲜蔬公寓 12 栋 602',
  receiverPostCode: '',
  receiverLongitude: '113.324500',
  receiverLatitude: '23.119100',
  receiverIdentity: '88888888205468',
  receiverPhone: '17612345678',
  receiverName: '鲜蔬用户',
};

const serviceCenterAddress = {
  receiverAddressId: '20',
  provinceCode: '440000',
  cityCode: '440100',
  countryCode: '440106',
  receiverProvince: '广东省',
  receiverCity: '广州市',
  receiverCountry: '天河区',
  receiverArea: '',
  receiverAddress: '猎德大道 66 号鲜蔬果园售后中心',
  receiverPostCode: '',
  receiverLongitude: '113.324500',
  receiverLatitude: '23.119100',
  receiverIdentity: '88881046205',
  receiverPhone: '18371736717',
  receiverName: '鲜蔬售后',
  senderName: STORE_NAME,
  senderPhone: STORE_SERVICE_PHONE,
  senderAddress: '猎德大道 66 号鲜蔬果园售后中心',
};

const coldChain = {
  logisticsCompanyCode: 'sf-cold',
  logisticsCompanyName: '顺丰冷链',
  logisticsCompanyTel: '95338',
};

const cityDelivery = {
  logisticsCompanyCode: 'same-city',
  logisticsCompanyName: '同城鲜送',
  logisticsCompanyTel: STORE_SERVICE_PHONE,
};

const findSku = (good, skuId) => {
  if (!good) return null;
  if (skuId) {
    return good.skuList.find((item) => item.skuId === skuId) || good.skuList[0];
  }
  return good.skuList[0];
};

const getSalePrice = (sku) => Number(sku.priceInfo.find((item) => item.priceType === 1)?.price || 0);
const getLinePrice = (sku) => Number(sku.priceInfo.find((item) => item.priceType === 2)?.price || 0);

const buildOrderItem = ({ spuId, skuId, buyQuantity = 1, itemId, buttonVOs = [] }) => {
  const good = getGoodById(spuId);
  const sku = findSku(good, skuId);
  const actualPrice = getSalePrice(sku);
  const originPrice = getLinePrice(sku);
  const itemTotalAmount = actualPrice * buyQuantity;
  const itemDiscountAmount = Math.max(originPrice - actualPrice, 0) * buyQuantity;

  return {
    id: itemId || `${sku.skuId}-item`,
    orderNo: null,
    spuId: good.spuId,
    skuId: sku.skuId,
    roomId: null,
    goodsMainType: 0,
    goodsViceType: 0,
    goodsName: good.title,
    specifications: sku.specInfo.map((item) => ({
      specTitle: item.specTitle,
      specValue: item.specValue,
    })),
    goodsPictureUrl: good.primaryImage,
    originPrice: `${originPrice}`,
    actualPrice: `${actualPrice}`,
    buyQuantity,
    itemTotalAmount: `${itemTotalAmount}`,
    itemDiscountAmount: `${itemDiscountAmount}`,
    itemPaymentAmount: `${itemTotalAmount}`,
    goodsPaymentPrice: `${actualPrice}`,
    tagPrice: null,
    tagText: good.spuTagList?.[0]?.title || null,
    outCode: null,
    labelVOs: null,
    buttonVOs,
  };
};

const buildTrajectory = (nodes) =>
  nodes.map((item) => ({
    title: item.title,
    icon: item.icon || null,
    code: item.code,
    nodes: [
      {
        status: item.status,
        timestamp: `${item.timestamp}`,
        remark: null,
      },
    ],
    isShow: true,
  }));

const buildOrder = ({
  orderNo,
  orderId,
  parentOrderNo,
  status,
  statusName,
  statusRemark,
  createTime,
  goods,
  freightFee = 0,
  discountAmount = 0,
  buttons = [],
  trajectoryVos = [],
  logistics = {},
  paySuccessTime = null,
  autoCancelTime = null,
  remark = '',
}) => {
  const orderItemVOs = goods.map((item, index) =>
    buildOrderItem({
      ...item,
      itemId: `${orderId}-${index + 1}`,
    }),
  );
  const goodsAmount = orderItemVOs.reduce((sum, item) => sum + Number(item.itemTotalAmount), 0);
  const paymentAmount = goodsAmount - discountAmount + freightFee;

  return {
    saasId: '88888888',
    storeId: '1000',
    storeName: STORE_NAME,
    uid: '88888888205468',
    parentOrderNo: parentOrderNo || orderNo,
    orderId,
    orderNo,
    orderType: 0,
    orderSubType: 0,
    orderStatus: status,
    orderSubStatus: null,
    totalAmount: `${goodsAmount}`,
    goodsAmount: `${goodsAmount}`,
    goodsAmountApp: `${goodsAmount}`,
    paymentAmount: `${paymentAmount}`,
    freightFee: `${freightFee}`,
    packageFee: '0',
    discountAmount: `${discountAmount}`,
    channelType: 0,
    channelSource: '',
    channelIdentity: '',
    remark,
    cancelType: null,
    cancelReasonType: null,
    cancelReason: null,
    rightsType: null,
    createTime: `${createTime}`,
    orderItemVOs,
    logisticsVO: {
      logisticsType: 1,
      logisticsNo: logistics.logisticsNo || '',
      logisticsStatus: null,
      logisticsCompanyCode: logistics.logisticsCompanyCode || '',
      logisticsCompanyName: logistics.logisticsCompanyName || '',
      logisticsCompanyTel: logistics.logisticsCompanyTel || '',
      ...baseAddress,
      senderName: STORE_NAME,
      senderPhone: STORE_SERVICE_PHONE,
      senderAddress: '花城大道 18 号鲜蔬果园分拣仓',
      sendTime: logistics.sendTime || null,
      arrivalTime: logistics.arrivalTime || null,
    },
    paymentVO: {
      payStatus: paySuccessTime ? 2 : 1,
      amount: `${paymentAmount}`,
      currency: 'CNY',
      payType: 0,
      payWay: 0,
      payWayName: paySuccessTime ? '微信支付' : null,
      interactId: null,
      traceNo: null,
      channelTrxNo: null,
      period: null,
      payTime: paySuccessTime ? `${paySuccessTime}` : null,
      paySuccessTime: paySuccessTime ? `${paySuccessTime}` : null,
    },
    buttonVOs: buttons,
    labelVOs: null,
    invoiceVO: null,
    couponAmount: '0',
    autoCancelTime: autoCancelTime ? `${autoCancelTime}` : null,
    orderStatusName: statusName,
    orderStatusRemark: statusRemark,
    logisticsLogVO: null,
    invoiceStatus: 3,
    invoiceDesc: '暂不开发票',
    invoiceUrl: null,
    trajectoryVos,
  };
};

const orders = [
  buildOrder({
    orderNo: 'FG20260327001',
    orderId: 'FGORDER0001',
    status: 5,
    statusName: '待付款',
    statusRemark: '请在 24 小时内完成支付',
    createTime: 1774617600000,
    goods: [{ spuId: '1001', skuId: '1001-01', buyQuantity: 1 }],
    freightFee: 600,
    discountAmount: 0,
    buttons: [
      { primary: false, type: 2, name: '取消订单' },
      { primary: true, type: 1, name: '去支付' },
    ],
    trajectoryVos: buildTrajectory([
      { title: '已下单', code: '200001', status: '订单已提交，等待支付', timestamp: 1774617600000 },
    ]),
    logistics: {},
    autoCancelTime: 1893456000000,
    remark: '苹果尽量挑脆甜一些',
  }),
  buildOrder({
    orderNo: 'FG20260327002',
    orderId: 'FGORDER0002',
    status: 10,
    statusName: '待发货',
    statusRemark: '正在打包冷链发出',
    createTime: 1774531200000,
    goods: [
      { spuId: '1002', skuId: '1002-02', buyQuantity: 1 },
      { spuId: '1004', skuId: '1004-02', buyQuantity: 1 },
    ],
    freightFee: 0,
    discountAmount: 300,
    buttons: [{ primary: true, type: 9, name: '再次购买' }],
    trajectoryVos: buildTrajectory([
      { title: '已支付', code: '200002', status: '订单已支付，等待仓库分拣', timestamp: 1774533000000 },
      { title: '', code: '200001', status: '订单已提交', timestamp: 1774531200000 },
    ]),
    logistics: {},
    paySuccessTime: 1774533000000,
    remark: '番茄成熟一些即可',
  }),
  buildOrder({
    orderNo: 'FG20260327003',
    orderId: 'FGORDER0003',
    status: 40,
    statusName: '待收货',
    statusRemark: '冷链配送中，请留意签收',
    createTime: 1774444800000,
    goods: [
      {
        spuId: '1003',
        skuId: '1003-03',
        buyQuantity: 1,
        buttonVOs: [{ primary: false, type: 4, name: '申请售后' }],
      },
    ],
    freightFee: 0,
    discountAmount: 200,
    buttons: [{ primary: true, type: 3, name: '确认收货' }],
    trajectoryVos: buildTrajectory([
      {
        title: '已发货',
        code: '200003',
        status: '商品已发出，承运方为顺丰冷链',
        timestamp: 1774452000000,
      },
      { title: '已支付', code: '200002', status: '订单支付成功', timestamp: 1774446600000 },
      { title: '', code: '200001', status: '订单已提交', timestamp: 1774444800000 },
    ]),
    logistics: {
      ...coldChain,
      logisticsNo: 'SF20260327003',
      sendTime: '1774452000000',
    },
    paySuccessTime: 1774446600000,
    remark: '请放在前台冷藏柜',
  }),
  buildOrder({
    orderNo: 'FG20260327004',
    orderId: 'FGORDER0004',
    status: 50,
    statusName: '交易完成',
    statusRemark: '感谢选购，新鲜到家',
    createTime: 1774358400000,
    goods: [
      {
        spuId: '1001',
        skuId: '1001-03',
        buyQuantity: 1,
        buttonVOs: [{ primary: false, type: 4, name: '申请售后' }],
      },
      {
        spuId: '1002',
        skuId: '1002-04',
        buyQuantity: 1,
        buttonVOs: [{ primary: false, type: 4, name: '申请售后' }],
      },
    ],
    freightFee: 0,
    discountAmount: 500,
    buttons: [
      { primary: false, type: 4, name: '申请售后' },
      { primary: true, type: 6, name: '评价' },
    ],
    trajectoryVos: buildTrajectory([
      {
        title: '已签收',
        code: '200005',
        status: '订单已签收，欢迎分享鲜蔬评价',
        timestamp: 1774372800000,
      },
      {
        title: '已发货',
        code: '200003',
        status: '商品已发出，承运方为同城鲜送',
        timestamp: 1774365600000,
      },
      { title: '已支付', code: '200002', status: '订单支付成功', timestamp: 1774362000000 },
      { title: '', code: '200001', status: '订单已提交', timestamp: 1774358400000 },
    ]),
    logistics: {
      ...cityDelivery,
      logisticsNo: 'TC20260327004',
      sendTime: '1774365600000',
      arrivalTime: '1774372800000',
    },
    paySuccessTime: 1774362000000,
    remark: '收货后请尽快冷藏保存',
  }),
];

const buildAfterServiceCase = ({
  rightsNo,
  orderNo,
  spuId,
  skuId,
  rightsStatus,
  rightsType,
  userRightsStatus,
  userRightsStatusName,
  userRightsStatusDesc,
  rightsReasonDesc,
  refundRequestAmount,
  itemRefundAmount,
  logisticsVO = {},
  buttonVOs = [],
  rightsImageUrls = [],
  afterSaleRequireType,
  refundMethodList = [],
  rightsRefund = {},
}) => {
  const order = orders.find((item) => item.orderNo === orderNo) || orders[0];
  const orderItem = order.orderItemVOs.find((item) => item.skuId === skuId || item.spuId === spuId) || order.orderItemVOs[0];

  return {
    buttonVOs,
    saasId: '8888',
    storeId: order.storeId,
    uid: order.uid,
    refundMethodList,
    createTime: `${order.createTime}`,
    rights: {
      bizRightsStatus: 1,
      bizRightsStatusName: rightsType === 20 ? '仅退款' : '退货退款',
      createTime: `${order.createTime}`,
      orderNo,
      refundAmount: refundRequestAmount,
      refundRequestAmount,
      rightsMethod: 1,
      rightsNo,
      rightsParentNo: `P-${rightsNo}`,
      rightsReasonDesc,
      rightsReasonType: 10,
      rightsStatus,
      rightsStatusName: userRightsStatusName,
      rightsType,
      saasId: 123,
      shippingFee: 0,
      shippingFeeBear: 1,
      storeId: order.storeId,
      storeName: STORE_NAME,
      uid: '123',
      updateTime: `${order.createTime}`,
      userRightsStatus,
      userRightsStatusDesc,
      userRightsStatusName,
      afterSaleRequireType,
      rightsImageUrls,
    },
    rightsItem: [
      {
        actualPrice: orderItem.actualPrice,
        createTime: `${order.createTime}`,
        disconutInfo: '',
        goodsName: orderItem.goodsName,
        goodsPictureUrl: orderItem.goodsPictureUrl,
        goodsViceType: 1,
        itemDiscountAmount: orderItem.itemDiscountAmount,
        itemRefundAmount,
        itemStatus: 2,
        itemTotalAmount: orderItem.itemTotalAmount,
        orderNo,
        parentOrderNo: order.parentOrderNo,
        rightsId: `${rightsNo}-1`,
        rightsNo,
        rightsParentNo: `P-${rightsNo}`,
        rightsQuantity: orderItem.buyQuantity,
        saasId: 123,
        skuId: orderItem.skuId,
        spuId: orderItem.spuId,
        specInfo: orderItem.specifications.map((item) => ({
          specTitle: item.specTitle,
          specValues: item.specValue,
        })),
        updateTime: `${order.createTime}`,
      },
    ],
    rightsRefund: {
      callbackTime: `${order.createTime}`,
      channel: '微信支付',
      channelTrxNo: `${rightsNo}-wx`,
      createTime: `${order.createTime}`,
      refundDesc: rightsRefund.refundDesc || rightsReasonDesc,
      memo: rightsRefund.memo || '',
      refundAmount: itemRefundAmount,
      refundStatus: 1,
      requestTime: `${order.createTime}`,
      successTime: rightsRefund.successTime || `${order.createTime}`,
      traceNo: `${rightsNo}-trace`,
      updateTime: `${order.createTime}`,
    },
    logisticsVO: {
      logisticsType: 1,
      logisticsNo: logisticsVO.logisticsNo || '',
      logisticsStatus: null,
      logisticsCompanyCode: logisticsVO.logisticsCompanyCode || '',
      logisticsCompanyName: logisticsVO.logisticsCompanyName || '',
      remark: logisticsVO.remark || '',
      ...serviceCenterAddress,
      sendTime: logisticsVO.sendTime || null,
      arrivalTime: logisticsVO.arrivalTime || null,
    },
  };
};

const afterServiceCases = [
  buildAfterServiceCase({
    rightsNo: 'AS20260327001',
    orderNo: 'FG20260327004',
    spuId: '1002',
    skuId: '1002-04',
    rightsStatus: 50,
    rightsType: 20,
    userRightsStatus: 160,
    userRightsStatusName: '已退款',
    userRightsStatusDesc: '退款已原路退回，请注意查收',
    rightsReasonDesc: '沃柑包装轻微挤压',
    refundRequestAmount: 4980,
    itemRefundAmount: 4980,
    afterSaleRequireType: 'REFUND_MONEY',
    rightsImageUrls: ['/assets/produce/citrus.svg'],
    refundMethodList: [{ refundMethodAmount: 4980, refundMethodName: '微信支付' }],
    rightsRefund: {
      refundDesc: '商品存在轻微磕碰，商家已同意退款',
      successTime: '1774378800000',
    },
  }),
  buildAfterServiceCase({
    rightsNo: 'AS20260327002',
    orderNo: 'FG20260327003',
    spuId: '1003',
    skuId: '1003-03',
    rightsStatus: 20,
    rightsType: 10,
    userRightsStatus: 110,
    userRightsStatusName: '已审核',
    userRightsStatusDesc: '请在 48 小时内寄回商品并填写物流单号',
    rightsReasonDesc: '西兰花到货偏小',
    refundRequestAmount: 2690,
    itemRefundAmount: 2690,
    afterSaleRequireType: 'REFUND_GOODS',
    rightsImageUrls: ['/assets/produce/broccoli.svg'],
    buttonVOs: [{ name: '填写运单号', primary: false, type: 3 }],
    rightsRefund: {
      refundDesc: '商家已审核通过，等待买家寄回商品',
    },
  }),
  buildAfterServiceCase({
    rightsNo: 'AS20260327003',
    orderNo: 'FG20260327004',
    spuId: '1001',
    skuId: '1001-03',
    rightsStatus: 60,
    rightsType: 10,
    userRightsStatus: 170,
    userRightsStatusName: '已关闭',
    userRightsStatusDesc: '售后申请已关闭',
    rightsReasonDesc: '已与客服协商保留商品',
    refundRequestAmount: 6580,
    itemRefundAmount: 0,
    afterSaleRequireType: 'REFUND_GOODS',
    rightsImageUrls: ['/assets/produce/apple.svg'],
    rightsRefund: {
      refundDesc: '用户已主动关闭申请',
    },
  }),
];

export function getMockOrders() {
  return clone(orders);
}

export function getMockOrder(orderNo) {
  return clone(orders.find((item) => item.orderNo === orderNo) || orders[0]);
}

export function getMockOrdersCount() {
  return [
    { tabType: 5, orderNum: orders.filter((item) => item.orderStatus === 5).length },
    { tabType: 10, orderNum: orders.filter((item) => item.orderStatus === 10).length },
    { tabType: 40, orderNum: orders.filter((item) => item.orderStatus === 40).length },
    { tabType: 50, orderNum: orders.filter((item) => item.orderStatus === 50).length },
  ];
}

export function getBusinessTimeData() {
  return {
    businessTime: [STORE_SERVICE_TIME],
    telphone: STORE_SERVICE_PHONE,
    saasId: '88888888',
  };
}

export function findMockOrderItem({ orderNo, skuId, spuId }) {
  const order = orders.find((item) => item.orderNo === orderNo) || orders[0];
  const orderItem =
    order.orderItemVOs.find((item) => item.skuId === skuId || item.spuId === spuId) || order.orderItemVOs[0];
  return {
    order,
    orderItem,
  };
}

export function getMockAfterServices() {
  return clone(afterServiceCases);
}
