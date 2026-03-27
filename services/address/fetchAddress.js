import { shouldUseMock } from '../../config/index';
import request from '../../utils/request';

/** 获取收货地址 */
function mockFetchDeliveryAddress(id) {
  const { delay } = require('../_utils/delay');
  const { genAddress } = require('../../model/address');

  return delay().then(() => genAddress(id));
}

/** 获取收货地址 */
export function fetchDeliveryAddress(id = 0) {
  if (shouldUseMock('address')) {
    return mockFetchDeliveryAddress(id);
  }
  return request({
    url: `/addresses/${id}`,
  });
}

/** 获取收货地址列表 */
function mockFetchDeliveryAddressList(len = 0) {
  const { delay } = require('../_utils/delay');
  const { genAddressList } = require('../../model/address');

  return delay().then(() =>
    genAddressList(len).map((address) => {
      return {
        ...address,
        phoneNumber: address.phone,
        address: `${address.provinceName}${address.cityName}${address.districtName}${address.detailAddress}`,
        tag: address.addressTag,
      };
    }),
  );
}

/** 获取收货地址列表 */
export function fetchDeliveryAddressList(len = 10) {
  if (shouldUseMock('address')) {
    return mockFetchDeliveryAddressList(len);
  }
  return request({
    url: '/addresses',
    data: {
      len,
    },
  });
}

export function saveDeliveryAddress(address) {
  const hasId = !!(address.addressId || address.id);
  return request({
    url: hasId ? `/addresses/${address.addressId || address.id}` : '/addresses',
    method: hasId ? 'PUT' : 'POST',
    data: address,
  });
}

export function removeDeliveryAddress(addressId) {
  return request({
    url: `/addresses/${addressId}`,
    method: 'DELETE',
  });
}
