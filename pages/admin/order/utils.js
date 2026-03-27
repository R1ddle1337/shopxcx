import { formatTime } from '../../../utils/util';

export const orderStatusOptions = [
  { label: '全部', value: -1 },
  { label: '待付款', value: 5 },
  { label: '待发货', value: 10 },
  { label: '待收货', value: 40 },
  { label: '交易完成', value: 50 },
  { label: '已取消', value: 80 },
];

export function formatPrice(value) {
  return (Number(value || 0) / 100).toFixed(2);
}

export function getStatusIndex(status) {
  const index = orderStatusOptions.findIndex((item) => item.value === Number(status));
  return index > -1 ? index : 0;
}

export function formatOrderForList(order = {}) {
  return {
    ...order,
    amountText: formatPrice(order.paymentAmount || 0),
    goodsCountText: `${(order.orderItemVOs || []).reduce((sum, item) => sum + Number(item.buyQuantity || 0), 0)}`,
    customerText: `${order.logisticsVO?.receiverName || '-'} ${order.logisticsVO?.receiverPhone || ''}`.trim(),
    createTimeText: formatTime(Number(order.createTime || Date.now()), 'YYYY-MM-DD HH:mm'),
  };
}

export function formatOrderForForm(order = {}) {
  return {
    orderStatus: Number(order.orderStatus || 10),
    logisticsNo: order.logisticsVO?.logisticsNo || '',
    logisticsCompanyName: order.logisticsVO?.logisticsCompanyName || '',
    logisticsCompanyTel: order.logisticsVO?.logisticsCompanyTel || '',
    remark: order.remark || '',
  };
}
