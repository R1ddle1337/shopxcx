import { mockIp, mockReqId } from '../../utils/mock';
import { findMockOrderItem } from './mockData';

export function genRightsPreview(params) {
  const { orderNo, skuId, spuId } = params;
  const { orderItem } = findMockOrderItem({ orderNo, skuId, spuId });

  return {
    data: {
      saasId: '88888888',
      uid: '88888888205468',
      storeId: '1000',
      skuId: orderItem.skuId,
      spuId: orderItem.spuId,
      numOfSku: orderItem.buyQuantity,
      numOfSkuAvailable: orderItem.buyQuantity,
      refundableAmount: orderItem.itemPaymentAmount,
      refundableDiscountAmount: '0',
      shippingFeeIncluded: '0',
      paidAmountEach: orderItem.actualPrice,
      boughtQuantity: orderItem.buyQuantity,
      orderNo,
      goodsInfo: {
        goodsName: orderItem.goodsName,
        skuImage: orderItem.goodsPictureUrl,
        specInfo: orderItem.specifications.map((item, index) => ({
          specId: `${index + 1}`,
          specTitle: item.specTitle,
          specValue: item.specValue,
        })),
      },
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 36,
    success: true,
  };
}

export function genApplyReasonList(params) {
  const resp = {
    data: {
      saasId: '70000001',
      rightsReasonList: [
        { id: '1', desc: '商品破损或挤压' },
        { id: '2', desc: '品质不佳' },
        { id: '3', desc: '少件漏发' },
        { id: '4', desc: '规格与下单不符' },
        { id: '5', desc: '配送超时' },
        { id: '6', desc: '不想要了' },
      ],
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 6,
    success: true,
  };

  if (params.rightsReasonType === 'REFUND_MONEY') {
    resp.data.rightsReasonList = [
      { id: '7', desc: '商品未收到' },
      { id: '8', desc: '配送延误' },
      { id: '9', desc: '包装破损已拒收' },
      { id: '10', desc: '不想要了' },
    ];
  }

  return resp;
}

export function applyService() {
  return {
    data: {
      rightsNo: 'AS20260327999',
      saasId: '70000001',
      uid: '700000011070005',
      storeId: '1000',
      result: null,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 269,
    success: true,
  };
}
