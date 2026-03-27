const STORE_NAME = '鲜蔬果园';
const STORE_SERVICE_PHONE = '4008202718';
const STORE_SERVICE_TIME = '每日 08:00-20:00';

const detailFarm = '/assets/produce/detail-farm.svg';
const detailDelivery = '/assets/produce/detail-delivery.svg';

const buildSku = ({ skuId, skuImage, specInfo, salePrice, linePrice, stockQuantity, weight }) => ({
  skuId,
  skuImage,
  specInfo,
  priceInfo: [
    { priceType: 1, price: `${salePrice}`, priceTypeName: '销售价' },
    { priceType: 2, price: `${linePrice}`, priceTypeName: '划线价' },
  ],
  stockInfo: {
    stockQuantity,
    safeStockQuantity: 0,
    soldQuantity: 0,
  },
  weight: { value: weight, unit: 'KG' },
  volume: null,
});

const goods = [
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '1001',
    title: '云南阳光苹果礼盒',
    primaryImage: '/assets/produce/apple.svg',
    images: ['/assets/produce/apple.svg', detailFarm, detailDelivery],
    available: 1,
    isAvailable: 1,
    minSalePrice: '3980',
    minLinePrice: '4680',
    maxSalePrice: '6580',
    maxLinePrice: '7580',
    spuStockQuantity: 68,
    soldNum: 842,
    isPutOnSale: 1,
    isSoldOut: false,
    categoryIds: ['fruit'],
    groupIdList: ['fruit'],
    specList: [
      {
        specId: '1001-spec-1',
        title: '规格',
        specValueList: [
          { specValueId: '1001-spec-1-a', specId: '1001-spec-1', specValue: '家庭装 2.5kg', image: '' },
          { specValueId: '1001-spec-1-b', specId: '1001-spec-1', specValue: '分享装 5kg', image: '' },
        ],
      },
    ],
    skuList: [
      buildSku({
        skuId: '1001-01',
        skuImage: '/assets/produce/apple.svg',
        salePrice: 3980,
        linePrice: 4680,
        stockQuantity: 36,
        weight: 2.5,
        specInfo: [{ specId: '1001-spec-1', specTitle: '规格', specValueId: '1001-spec-1-a', specValue: '家庭装 2.5kg' }],
      }),
      buildSku({
        skuId: '1001-02',
        skuImage: '/assets/produce/apple.svg',
        salePrice: 6580,
        linePrice: 7580,
        stockQuantity: 32,
        weight: 5,
        specInfo: [{ specId: '1001-spec-1', specTitle: '规格', specValueId: '1001-spec-1-b', specValue: '分享装 5kg' }],
      }),
    ],
    spuTagList: [{ id: 'fresh-fruit', title: '当季鲜果', image: null }],
    limitInfo: [{ text: '限购 3 件' }],
    desc: [detailFarm, detailDelivery],
    etitle: '',
  },
  {
    saasId: '88888888',
    storeId: '1000',
    spuId: '1004',
    title: '沙瓤番茄组合装',
    primaryImage: '/assets/produce/tomato.svg',
    images: ['/assets/produce/tomato.svg', detailFarm, detailDelivery],
    available: 1,
    isAvailable: 1,
    minSalePrice: '1990',
    minLinePrice: '2590',
    maxSalePrice: '3590',
    maxLinePrice: '4390',
    spuStockQuantity: 76,
    soldNum: 688,
    isPutOnSale: 1,
    isSoldOut: false,
    categoryIds: ['vegetable'],
    groupIdList: ['vegetable'],
    specList: [
      {
        specId: '1004-spec-1',
        title: '规格',
        specValueList: [
          { specValueId: '1004-spec-1-a', specId: '1004-spec-1', specValue: '轻食装 2kg', image: '' },
          { specValueId: '1004-spec-1-b', specId: '1004-spec-1', specValue: '家用装 4kg', image: '' },
        ],
      },
    ],
    skuList: [
      buildSku({
        skuId: '1004-01',
        skuImage: '/assets/produce/tomato.svg',
        salePrice: 1990,
        linePrice: 2590,
        stockQuantity: 40,
        weight: 2,
        specInfo: [{ specId: '1004-spec-1', specTitle: '规格', specValueId: '1004-spec-1-a', specValue: '轻食装 2kg' }],
      }),
      buildSku({
        skuId: '1004-02',
        skuImage: '/assets/produce/tomato.svg',
        salePrice: 3590,
        linePrice: 4390,
        stockQuantity: 36,
        weight: 4,
        specInfo: [{ specId: '1004-spec-1', specTitle: '规格', specValueId: '1004-spec-1-b', specValue: '家用装 4kg' }],
      }),
    ],
    spuTagList: [{ id: 'origin-direct', title: '产地直发', image: null }],
    limitInfo: [{ text: '限购 4 件' }],
    desc: [detailFarm, detailDelivery],
    etitle: '',
  },
];

const categories = [
  {
    groupId: 'fruit',
    name: '鲜果',
    thumbnail: '/assets/produce/apple.svg',
    children: [
      {
        groupId: 'fruit-hot',
        name: '热卖鲜果',
        thumbnail: '/assets/produce/apple.svg',
        children: [{ groupId: 'fruit-hot-1', name: '苹果礼盒', thumbnail: '/assets/produce/apple.svg' }],
      },
    ],
  },
  {
    groupId: 'vegetable',
    name: '时蔬',
    thumbnail: '/assets/produce/tomato.svg',
    children: [
      {
        groupId: 'vegetable-fresh',
        name: '今日鲜蔬',
        thumbnail: '/assets/produce/tomato.svg',
        children: [{ groupId: 'vegetable-fresh-1', name: '沙瓤番茄', thumbnail: '/assets/produce/tomato.svg' }],
      },
    ],
  },
];

const user = {
  id: 'u-1000',
  nickName: '鲜蔬会员',
  phoneNumber: '13438358888',
  avatarUrl:
    'https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg',
  gender: 2,
};

const addresses = [
  {
    saasId: '88888888',
    uid: 'u-1000',
    authToken: null,
    id: 'addr-1000',
    addressId: 'addr-1000',
    phone: '17612345678',
    name: '鲜蔬用户',
    countryName: '中国',
    countryCode: 'chn',
    provinceName: '广东省',
    provinceCode: '440000',
    cityName: '广州市',
    cityCode: '440100',
    districtName: '天河区',
    districtCode: '440106',
    detailAddress: '花城大道 88 号鲜蔬公寓 12 栋 602',
    isDefault: 1,
    addressTag: '家',
    latitude: '23.119100',
    longitude: '113.324500',
    storeId: null,
  },
];

const cartItems = [
  { userId: 'u-1000', spuId: '1001', skuId: '1001-01', quantity: 1, isSelected: 1, joinCartTime: '2026-03-28T08:00:00.000Z' },
  { userId: 'u-1000', spuId: '1004', skuId: '1004-01', quantity: 1, isSelected: 1, joinCartTime: '2026-03-28T08:05:00.000Z' },
];

const baseAddress = {
  receiverAddressId: 'addr-1000',
  provinceCode: '440000',
  cityCode: '440100',
  countryCode: '440106',
  receiverProvince: '广东省',
  receiverCity: '广州市',
  receiverCountry: '天河区',
  receiverArea: '',
  receiverAddress: '花城大道 88 号鲜蔬公寓 12 栋 602',
  receiverLongitude: '113.324500',
  receiverLatitude: '23.119100',
  receiverPhone: '17612345678',
  receiverName: '鲜蔬用户',
};

const findGoodById = (spuId) => goods.find((item) => item.spuId === `${spuId}`);

const findSku = (good, skuId) => {
  if (!good) return null;
  return good.skuList.find((item) => item.skuId === skuId) || good.skuList[0];
};

const getSalePrice = (sku) => Number((sku?.priceInfo || []).find((item) => item.priceType === 1)?.price || 0);
const getLinePrice = (sku) => Number((sku?.priceInfo || []).find((item) => item.priceType === 2)?.price || 0);

const normalizeReceiverAddress = (address = {}) => ({
  receiverAddressId: address.addressId || address.id || baseAddress.receiverAddressId,
  provinceCode: address.provinceCode || baseAddress.provinceCode,
  cityCode: address.cityCode || baseAddress.cityCode,
  countryCode: address.districtCode || baseAddress.countryCode,
  receiverProvince: address.provinceName || baseAddress.receiverProvince,
  receiverCity: address.cityName || baseAddress.receiverCity,
  receiverCountry: address.districtName || baseAddress.receiverCountry,
  receiverArea: address.countryName || baseAddress.receiverArea,
  receiverAddress: address.detailAddress || baseAddress.receiverAddress,
  receiverLongitude: address.longitude || baseAddress.receiverLongitude,
  receiverLatitude: address.latitude || baseAddress.receiverLatitude,
  receiverPhone: address.phone || baseAddress.receiverPhone,
  receiverName: address.name || baseAddress.receiverName,
});

const buildOrderItem = ({ spuId, skuId, buyQuantity = 1, itemId, buttonVOs = [] }) => {
  const good = findGoodById(spuId);
  const sku = findSku(good, skuId);
  const actualPrice = getSalePrice(sku);
  const originPrice = getLinePrice(sku);

  return {
    id: itemId || `${sku.skuId}-item`,
    spuId: good.spuId,
    skuId: sku.skuId,
    goodsName: good.title,
    specifications: sku.specInfo.map((item) => ({ specTitle: item.specTitle, specValue: item.specValue })),
    goodsPictureUrl: good.primaryImage,
    originPrice: `${originPrice}`,
    actualPrice: `${actualPrice}`,
    buyQuantity,
    itemTotalAmount: `${actualPrice * buyQuantity}`,
    itemDiscountAmount: `${Math.max(originPrice - actualPrice, 0) * buyQuantity}`,
    itemPaymentAmount: `${actualPrice * buyQuantity}`,
    goodsPaymentPrice: `${actualPrice}`,
    tagPrice: null,
    tagText: good.spuTagList?.[0]?.title || null,
    buttonVOs,
  };
};

const buildTrajectory = (nodes) =>
  nodes.map((item) => ({
    title: item.title,
    code: item.code,
    nodes: [{ status: item.status, timestamp: `${item.timestamp}`, remark: null }],
    isShow: true,
  }));

const buildOrder = ({ orderNo, orderId, status, statusName, statusRemark, createTime, goods: orderGoods, buttons = [], trajectoryVos = [], paySuccessTime = null, freightFee = 0, remark = '', address }) => {
  const orderItemVOs = orderGoods.map((item, index) => buildOrderItem({ ...item, itemId: `${orderId}-${index + 1}` }));
  const goodsAmount = orderItemVOs.reduce((sum, item) => sum + Number(item.itemTotalAmount), 0);
  const receiverAddress = normalizeReceiverAddress(address);

  return {
    saasId: '88888888',
    storeId: '1000',
    storeName: STORE_NAME,
    uid: 'u-1000',
    parentOrderNo: orderNo,
    orderId,
    orderNo,
    orderStatus: status,
    totalAmount: `${goodsAmount}`,
    goodsAmount: `${goodsAmount}`,
    goodsAmountApp: `${goodsAmount}`,
    paymentAmount: `${goodsAmount + freightFee}`,
    freightFee: `${freightFee}`,
    discountAmount: '0',
    remark,
    createTime: `${createTime}`,
    orderItemVOs,
    logisticsVO: {
      logisticsType: 1,
      logisticsNo: '',
      logisticsCompanyCode: '',
      logisticsCompanyName: '',
      logisticsCompanyTel: '',
      ...receiverAddress,
      senderName: STORE_NAME,
      senderPhone: STORE_SERVICE_PHONE,
      senderAddress: '花城大道 18 号鲜蔬果园分拣仓',
      sendTime: null,
      arrivalTime: null,
    },
    paymentVO: {
      payStatus: paySuccessTime ? 2 : 1,
      amount: `${goodsAmount + freightFee}`,
      currency: 'CNY',
      payWayName: paySuccessTime ? '微信支付' : null,
      payTime: paySuccessTime ? `${paySuccessTime}` : null,
      paySuccessTime: paySuccessTime ? `${paySuccessTime}` : null,
    },
    buttonVOs: buttons,
    couponAmount: '0',
    autoCancelTime: paySuccessTime ? null : `${createTime + 24 * 60 * 60 * 1000}`,
    orderStatusName: statusName,
    orderStatusRemark: statusRemark,
    invoiceStatus: 3,
    invoiceDesc: '暂不开发票',
    trajectoryVos,
  };
};

const orders = [
  buildOrder({
    orderNo: 'FG20260328001',
    orderId: 'FGORDER0001',
    status: 10,
    statusName: '待发货',
    statusRemark: '订单已支付，等待仓库分拣',
    createTime: 1774617600000,
    goods: [{ spuId: '1001', skuId: '1001-01', buyQuantity: 1 }],
    buttons: [{ primary: true, type: 9, name: '再次购买' }],
    trajectoryVos: buildTrajectory([
      { title: '已支付', code: '200002', status: '订单已支付，等待仓库分拣', timestamp: 1774618200000 },
      { title: '', code: '200001', status: '订单已提交', timestamp: 1774617600000 },
    ]),
    paySuccessTime: 1774618200000,
    address: addresses[0],
  }),
  buildOrder({
    orderNo: 'FG20260328002',
    orderId: 'FGORDER0002',
    status: 50,
    statusName: '交易完成',
    statusRemark: '感谢选购，新鲜到家',
    createTime: 1774444800000,
    goods: [{ spuId: '1004', skuId: '1004-02', buyQuantity: 1 }],
    buttons: [{ primary: true, type: 6, name: '评价' }],
    trajectoryVos: buildTrajectory([
      { title: '已签收', code: '200005', status: '订单已签收，欢迎分享鲜蔬评价', timestamp: 1774459200000 },
      { title: '', code: '200001', status: '订单已提交', timestamp: 1774444800000 },
    ]),
    paySuccessTime: 1774448400000,
    address: addresses[0],
  }),
];

const createSeedData = () => ({
  version: 1,
  store: { id: '1000', name: STORE_NAME, servicePhone: STORE_SERVICE_PHONE, serviceTime: STORE_SERVICE_TIME },
  users: [user],
  categories,
  goods,
  addresses,
  cartItems,
  orders,
  nextOrderSeq: 3,
  nextAddressSeq: 1001,
  nextUserSeq: 1001,
});

module.exports = {
  STORE_NAME,
  STORE_SERVICE_PHONE,
  STORE_SERVICE_TIME,
  detailFarm,
  detailDelivery,
  buildSku,
  createSeedData,
  findGoodById,
  findSku,
  getSalePrice,
  getLinePrice,
  buildOrder,
  buildTrajectory,
};
