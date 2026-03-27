import { mockIp, mockReqId } from '../../../utils/mock';
import { getMockAfterServices } from '../../../model/order/mockData';

const buildStates = (list) => ({
  audit: list.filter((item) => item.rights.rightsStatus === 10).length,
  approved: list.filter((item) => item.rights.rightsStatus === 20).length,
  complete: list.filter((item) => item.rights.rightsStatus === 50).length,
  closed: list.filter((item) => item.rights.rightsStatus === 60).length,
});

const all = getMockAfterServices();

export const resp = {
  data: {
    pageNum: 1,
    pageSize: 10,
    totalCount: all.length,
    states: buildStates(all),
    dataList: all,
  },
  code: 'Success',
  msg: null,
  requestId: mockReqId(),
  clientIp: mockIp(),
  rt: 79,
  success: true,
};

export function getRightsList({ parameter: { afterServiceStatus = -1, pageNum = 1, pageSize = 10 } }) {
  const filtered = afterServiceStatus > -1 ? all.filter((item) => item.rights.rightsStatus === afterServiceStatus) : all;

  return Promise.resolve({
    ...resp,
    data: {
      pageNum,
      pageSize,
      totalCount: filtered.length,
      states: buildStates(all),
      dataList: filtered.slice((pageNum - 1) * pageSize, pageNum * pageSize),
    },
  });
}
