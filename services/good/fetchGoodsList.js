/* eslint-disable no-param-reassign */
import { shouldUseMock } from '../../config/index';
import request from '../../utils/request';
import { withMockFallback } from '../_utils/withMockFallback';

/** 获取商品列表 */
function mockFetchGoodsList(params) {
  const { delay } = require('../_utils/delay');
  const { getSearchResult } = require('../../model/search');

  const data = getSearchResult(params);

  if (data.spuList.length) {
    data.spuList.forEach((item) => {
      item.spuId = item.spuId;
      item.thumb = item.primaryImage;
      item.title = item.title;
      item.price = item.minSalePrice;
      item.originPrice = item.maxLinePrice;
      item.desc = '';
      if (item.spuTagList) {
        item.tags = item.spuTagList.map((tag) => tag.title);
      } else {
        item.tags = [];
      }
    });
  }
  return delay().then(() => {
    return data;
  });
}

/** 获取商品列表 */
export function fetchGoodsList(params) {
  if (shouldUseMock('goods')) {
    return mockFetchGoodsList(params);
  }
  return withMockFallback(
    () =>
      request({
        url: '/goods/list',
        data: params,
      }),
    () => mockFetchGoodsList(params),
    'goods/list',
  );
}
