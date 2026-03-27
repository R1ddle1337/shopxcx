import { mockIp, mockReqId } from '../../utils/mock';
import { getMockOrders, getMockOrdersCount } from './mockData';

export function genOrders(params) {
  const { pageNum = 1, pageSize = 10, orderStatus = -1 } = params.parameter || {};
  let orders = getMockOrders();

  if (orderStatus > -1) {
    orders = orders.filter((order) => order.orderStatus === orderStatus);
  }

  return {
    data: {
      pageNum,
      pageSize,
      totalCount: orders.length,
      orders: orders.slice((pageNum - 1) * pageSize, pageNum * pageSize),
    },
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 113,
    success: true,
  };
}

export function genOrdersCount() {
  return {
    data: getMockOrdersCount(),
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 41,
    success: true,
  };
}
