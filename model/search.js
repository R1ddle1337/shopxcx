import { getGoodsList } from './goods';

export function getSearchHistory() {
  return {
    historyWords: ['T恤', '连衣裙', '帆布鞋', '短袖', '双肩包'],
  };
}

export function getSearchPopular() {
  return {
    popularWords: ['T恤', '连衣裙', '帆布鞋', '短袖', '双肩包'],
  };
}

export function getSearchResult(params = {}) {
  const { pageNum = 1, pageSize = 30 } = params;
  const totalCount = getGoodsList().length;
  const offset = Math.max(pageNum - 1, 0) * pageSize;
  const spuList = getGoodsList(offset, pageSize);

  return {
    saasId: null,
    storeId: null,
    pageNum,
    pageSize,
    totalCount,
    spuList,
    algId: 0,
  };
}
