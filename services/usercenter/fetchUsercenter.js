import { shouldUseMock } from '../../config/index';
import request from '../../utils/request';

/** 获取个人中心信息 */
function mockFetchUserCenter() {
  const { delay } = require('../_utils/delay');
  const { genUsercenter } = require('../../model/usercenter');
  return delay(200).then(() => genUsercenter());
}

/** 获取个人中心信息 */
export function fetchUserCenter() {
  if (shouldUseMock('usercenter')) {
    return mockFetchUserCenter();
  }
  return request({
    url: '/user/center',
  });
}
