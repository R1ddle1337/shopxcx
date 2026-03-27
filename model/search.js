import { getGoodsList } from './goods';

export function getSearchHistory() {
  return {
    historyWords: ['苹果', '沃柑', '西兰花', '番茄', '生鲜礼盒'],
  };
}

export function getSearchPopular() {
  return {
    popularWords: ['当季苹果', '广西沃柑', '有机西兰花', '沙瓤番茄', '家庭果蔬箱'],
  };
}

export function getSearchResult(params = {}) {
  const { pageNum = 1, pageSize = 30, keyword = '' } = params;
  const all = getGoodsList(0, 20).filter((item) => {
    return keyword ? item.title.includes(keyword) || item.spuTagList.some((tag) => tag.title.includes(keyword)) : true;
  });
  const offset = Math.max(pageNum - 1, 0) * pageSize;
  const spuList = all.slice(offset, offset + pageSize);

  return {
    saasId: null,
    storeId: null,
    pageNum,
    pageSize,
    totalCount: all.length,
    spuList,
    algId: 0,
  };
}
