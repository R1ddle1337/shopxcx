import { shouldUseMock } from '../../config/index';
import request from '../../utils/request';

/** 获取订单详情mock数据 */
function mockFetchOrderDetail(params) {
  const { delay } = require('../_utils/delay');
  const { genOrderDetail } = require('../../model/order/orderDetail');

  return delay().then(() => genOrderDetail(params));
}

/** 获取订单详情数据 */
export function fetchOrderDetail(params) {
  if (shouldUseMock('order')) {
    return mockFetchOrderDetail(params);
  }
  return request({
    url: `/orders/${params.parameter}`,
  });
}

/** 获取客服mock数据 */
function mockFetchBusinessTime(params) {
  const { delay } = require('../_utils/delay');
  const { genBusinessTime } = require('../../model/order/orderDetail');

  return delay().then(() => genBusinessTime(params));
}

/** 获取客服数据 */
export function fetchBusinessTime(params) {
  if (shouldUseMock('order')) {
    return mockFetchBusinessTime(params);
  }
  return request({
    url: '/orders/business-time',
    data: params,
  });
}
