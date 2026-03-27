import { shouldUseMock } from '../../config/index';
import { mockIp, mockReqId } from '../../utils/mock';
import request from '../../utils/request';

/** 获取结算mock数据 */
function mockFetchSettleDetail(params) {
  const { delay } = require('../_utils/delay');
  const { genSettleDetail } = require('../../model/order/orderConfirm');

  return delay().then(() => genSettleDetail(params));
}

/** 提交mock订单 */
function mockDispatchCommitPay() {
  const { delay } = require('../_utils/delay');

  return delay().then(() => ({
    data: {
      isSuccess: true,
      tradeNo: '350930961469409099',
      payInfo: '{}',
      code: null,
      transactionId: 'E-200915180100299000',
      msg: null,
      interactId: '15145',
      channel: 'wechat',
      limitGoodsList: null,
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 891,
    success: true,
  }));
}

/** 获取结算数据 */
export function fetchSettleDetail(params) {
  if (shouldUseMock('order')) {
    return mockFetchSettleDetail(params);
  }
  return request({
    url: '/orders/settle',
    method: 'POST',
    data: params,
  });
}

/* 提交订单 */
export function dispatchCommitPay(params) {
  if (shouldUseMock('order')) {
    return mockDispatchCommitPay(params);
  }
  return request({
    url: '/orders/submit',
    method: 'POST',
    data: params,
  });
}

/** 开发票 */
export function dispatchSupplementInvoice() {
  if (config.useMock) {
    const { delay } = require('../_utils/delay');
    return delay();
  }

  return new Promise((resolve) => {
    resolve('real api');
  });
}
