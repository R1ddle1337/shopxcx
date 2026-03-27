import request from '../../utils/request';

export function fetchAdminCategories() {
  return request({
    url: '/admin/categories',
  }).then((res) => res.data || []);
}

export function fetchAdminCategory(groupId) {
  return request({
    url: `/admin/categories/${groupId}`,
  }).then((res) => res.data || {});
}

export function createAdminCategory(data) {
  return request({
    url: '/admin/categories',
    method: 'POST',
    data,
  }).then((res) => res.data || {});
}

export function updateAdminCategory(groupId, data) {
  return request({
    url: `/admin/categories/${groupId}`,
    method: 'PATCH',
    data,
  }).then((res) => res.data || {});
}

export function deleteAdminCategory(groupId) {
  return request({
    url: `/admin/categories/${groupId}`,
    method: 'DELETE',
  });
}
