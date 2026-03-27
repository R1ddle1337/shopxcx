import { shouldUseMock } from '../../config/index';
import request from '../../utils/request';

/** 获取购物车mock数据 */
function mockFetchCartGroupData(params) {
  const { delay } = require('../_utils/delay');
  const { genCartGroupData } = require('../../model/cart');

  return delay().then(() => genCartGroupData(params));
}

/** 获取购物车数据 */
export function fetchCartGroupData(params) {
  if (shouldUseMock('cart')) {
    return mockFetchCartGroupData(params);
  }
  return request({
    url: '/cart',
    data: params,
  });
}

export function addCartItem(params) {
  return request({
    url: '/cart/items',
    method: 'POST',
    data: params,
  });
}

export function updateCartItem(params) {
  const { skuId, ...payload } = params;
  return request({
    url: `/cart/items/${skuId}`,
    method: 'PATCH',
    data: payload,
  });
}

export function deleteCartItem(skuId) {
  return request({
    url: `/cart/items/${skuId}`,
    method: 'DELETE',
  });
}

export function updateCartStoreSelected(params) {
  return request({
    url: '/cart/store-selected',
    method: 'PATCH',
    data: params,
  });
}

export function updateCartAllSelected(params) {
  return request({
    url: '/cart/all-selected',
    method: 'PATCH',
    data: params,
  });
}
