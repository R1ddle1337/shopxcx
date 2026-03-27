import { genGood } from './good';

const exampleGoodsIds = [0, 1];

export function getGoodsList(offset = 0, length = exampleGoodsIds.length) {
  const start = Math.max(0, Number(offset) || 0);
  return exampleGoodsIds.slice(start, start + length).map((id) => genGood(id));
}

export const goodsList = getGoodsList();
