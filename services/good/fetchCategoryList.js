import { shouldUseMock } from '../../config/index';
import request from '../../utils/request';
import { withMockFallback } from '../_utils/withMockFallback';

/** 获取商品列表 */
function mockFetchGoodCategory() {
  const { delay } = require('../_utils/delay');
  const { getCategoryList } = require('../../model/category');
  return delay().then(() => getCategoryList());
}

/** 获取商品列表 */
export function getCategoryList() {
  if (shouldUseMock('goods')) {
    return mockFetchGoodCategory();
  }
  return withMockFallback(
    () =>
      request({
        url: '/categories',
      }),
    () => mockFetchGoodCategory(),
    'categories',
  );
}
