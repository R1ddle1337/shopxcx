import { shouldUseMock } from '../../config/index';
import request from '../../utils/request';
import { withMockFallback } from '../_utils/withMockFallback';

/** 获取商品列表 */
function mockFetchGood(ID = 0) {
  const { delay } = require('../_utils/delay');
  const { genGood } = require('../../model/good');
  return delay().then(() => genGood(ID));
}

/** 获取商品列表 */
export function fetchGood(ID = 0) {
  if (shouldUseMock('goods')) {
    return mockFetchGood(ID);
  }
  return withMockFallback(
    () =>
      request({
        url: `/goods/${ID}`,
      }),
    () => mockFetchGood(ID),
    `goods/${ID}`,
  );
}
