import request from '../../utils/request';

export function fetchAdminOrders(params = {}) {
  return request({
    url: '/admin/orders',
    data: params,
  }).then((res) => res.data || { orders: [], totalCount: 0 });
}

export function fetchAdminOrder(orderNo) {
  return request({
    url: `/admin/orders/${orderNo}`,
  }).then((res) => res.data || {});
}

export function updateAdminOrder(orderNo, data) {
  return request({
    url: `/admin/orders/${orderNo}`,
    method: 'PATCH',
    data,
  }).then((res) => res.data || {});
}
