import { mockIp, mockReqId } from '../../utils/mock';
import { getBusinessTimeData, getMockOrder } from './mockData';

export function genOrderDetail(params) {
  const orderNo = params.parameter;

  return {
    data: getMockOrder(orderNo),
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 79,
    success: true,
  };
}

export function genBusinessTime() {
  return {
    data: getBusinessTimeData(),
    code: 'Success',
    msg: null,
    requestId: mockReqId(),
    clientIp: mockIp(),
    rt: 3,
    success: true,
  };
}
