import Toast from 'tdesign-miniprogram/toast/index';
import { fetchAdminOrders } from '../../../services/admin/orders';
import {
  formatOrderForList,
  getStatusIndex,
  orderStatusOptions,
} from './utils';

Page({
  data: {
    loading: true,
    totalCount: 0,
    orderList: [],
    statusOptions: orderStatusOptions,
    statusIndex: 0,
    currentStatus: -1,
  },

  onShow() {
    this.loadOrders();
  },

  onPullDownRefresh() {
    this.loadOrders();
  },

  showMessage(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
  },

  async loadOrders() {
    this.setData({ loading: true });

    try {
      const result = await fetchAdminOrders({
        orderStatus: this.data.currentStatus,
        pageNum: 1,
        pageSize: 50,
      });
      this.setData({
        orderList: (result.orders || []).map((item) => formatOrderForList(item)),
        totalCount: result.totalCount || 0,
      });
    } catch (error) {
      this.showMessage('订单后台加载失败，请确认本地 API 已启动');
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  onStatusChange(e) {
    const statusIndex = Number(e.detail.value || 0);
    const currentStatus = this.data.statusOptions[statusIndex]?.value ?? -1;
    this.setData(
      {
        statusIndex,
        currentStatus,
      },
      () => {
        this.loadOrders();
      },
    );
  },

  openDetail(e) {
    const { orderNo } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/admin/order/detail/index?orderNo=${orderNo}` });
  },

  resetFilter() {
    this.setData(
      {
        statusIndex: getStatusIndex(-1),
        currentStatus: -1,
      },
      () => {
        this.loadOrders();
      },
    );
  },
});
