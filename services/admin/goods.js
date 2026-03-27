import request from '../../utils/request';

export function fetchAdminGoods() {
  return request({
    url: '/admin/goods',
  }).then((res) => res.data || []);
}

export function fetchAdminGood(spuId) {
  return request({
    url: `/admin/goods/${spuId}`,
  }).then((res) => res.data || {});
}

export function createAdminGood(data) {
  return request({
    url: '/admin/goods',
    method: 'POST',
    data,
  }).then((res) => res.data || {});
}

export function updateAdminGood(spuId, data) {
  return request({
    url: `/admin/goods/${spuId}`,
    method: 'PATCH',
    data,
  }).then((res) => res.data || {});
}

export function deleteAdminGood(spuId) {
  return request({
    url: `/admin/goods/${spuId}`,
    method: 'DELETE',
  });
}
