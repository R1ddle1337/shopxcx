/* eslint-disable no-param-reassign */
import { shouldUseMock } from '../../config/index';
import request from '../../utils/request';
import { withMockFallback } from '../_utils/withMockFallback';

/** 获取搜索历史 */
function mockSearchResult(params) {
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
      if (item.spuTagList) {
        item.tags = item.spuTagList.map((tag) => ({ title: tag.title }));
      } else {
        item.tags = [];
      }
    });
  }
  return delay().then(() => {
    return data;
  });
}

/** 获取搜索历史 */
export function getSearchResult(params) {
  if (shouldUseMock('goods')) {
    return mockSearchResult(params);
  }
  return withMockFallback(
    () =>
      request({
        url: '/goods/search',
        data: params,
      }),
    () => mockSearchResult(params),
    'goods/search',
  );
}
