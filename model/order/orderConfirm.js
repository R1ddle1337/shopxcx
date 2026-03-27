import { mockIp, mockReqId } from '../../utils/mock';
import { STORE_NAME } from '../store';

export const transformGoodsDataToConfirmData = (goodsDataList) => {
  const list = [];

  goodsDataList.forEach((goodsData) => {
    list.push({
      storeId: goodsData.storeId,
      spuId: goodsData.spuId,
      skuId: goodsData.skuId,
      goodsName: goodsData.title,
      image: goodsData.primaryImage,
      reminderStock: 119,
      quantity: goodsData.quantity,
      payPrice: goodsData.price,
      totalSkuPrice: goodsData.price,
      discountSettlePrice: goodsData.price,
      realSettlePrice: goodsData.price,
      settlePrice: goodsData.price,
      oriPrice: goodsData.originPrice,
      tagPrice: null,
      tagText: null,
      skuSpecLst: goodsData.specInfo,
      promotionIds: null,
      weight: 0.0,
      unit: 'KG',
      volume: null,
      masterGoodsType: 0,
      viceGoodsType: 0,
      roomId: goodsData.roomId,
      egoodsName: null,
    });
  });

  return list;
};

export function genSettleDetail(params) {
  const { userAddressReq, goodsRequestList } = params;

  const resp = {
    data: {
      settleType: 0,
      userAddress: null,
      totalGoodsCount: 0,
      packageCount: 1,
      totalAmount: '0',
      totalPayAmount: '0',
      totalDiscountAmount: '0',
      totalPromotionAmount: '0',
      totalCouponAmount: '0',
      totalSalePrice: '0',
      totalGoodsAmount: '0',
      totalDeliveryFee: '0',
      invoiceRequest: null,
      skuImages: null,
      deliveryFeeList: null,
      storeGoodsList: [
        {
          storeId: '1000',
          storeName: STORE_NAME,
          remark: null,
          goodsCount: 1,
          deliveryFee: '0',
          deliveryWords: null,
          storeTotalAmount: '0',
          storeTotalPayAmount: '0',
          storeTotalDiscountAmount: '0',
          storeTotalCouponAmount: '0',
          skuDetailVos: [],
          couponList: [],
        },
      ],
      inValidGoodsList: null,
      outOfStockGoodsList: null,
      limitGoodsList: null,
      abnormalDeliveryGoodsList: null,
      invoiceSupport: 1,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 244,
    success: true,
  };

  const list = transformGoodsDataToConfirmData(goodsRequestList);
  const totalPrice = list.reduce((pre, cur) => pre + cur.quantity * Number(cur.settlePrice), 0);

  resp.data.storeGoodsList[0].skuDetailVos = list;
  resp.data.totalGoodsCount = list.reduce((pre, cur) => pre + cur.quantity, 0);
  resp.data.totalSalePrice = `${totalPrice}`;
  resp.data.totalAmount = `${totalPrice}`;
  resp.data.totalGoodsAmount = `${totalPrice}`;
  resp.data.totalCouponAmount = '0';
  resp.data.totalPromotionAmount = '0';
  resp.data.totalDiscountAmount = '0';
  resp.data.totalPayAmount = `${totalPrice}`;
  resp.data.storeGoodsList[0].storeTotalPayAmount = `${resp.data.totalPayAmount}`;

  if (userAddressReq) {
    resp.data.settleType = 1;
    resp.data.userAddress = userAddressReq;
  }

  return resp;
}
