import Toast from 'tdesign-miniprogram/toast/index';
import {
  fetchAdminOrder,
  updateAdminOrder,
} from '../../../../services/admin/orders';
import {
  formatOrderForForm,
  formatPrice,
  getStatusIndex,
  orderStatusOptions,
} from '../utils';

Page({
  data: {
    loading: true,
    saving: false,
    orderNo: '',
    order: null,
    form: formatOrderForForm(),
    statusOptions: orderStatusOptions.filter((item) => item.value !== -1),
    statusIndex: 1,
  },

  onLoad(options) {
    const orderNo = options?.orderNo || '';
    this.setData(
      {
        orderNo,
      },
      () => {
        this.loadOrder();
      },
    );
  },

  showMessage(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
  },

  async loadOrder() {
    this.setData({ loading: true });

    try {
      const rawOrder = await fetchAdminOrder(this.data.orderNo);
      const order = {
        ...rawOrder,
        orderItemVOs: (rawOrder.orderItemVOs || []).map((item) => ({
          ...item,
          specText: (item.specifications || []).map((spec) => spec.specValue).filter(Boolean).join(' / '),
        })),
        paymentAmountText: formatPrice(rawOrder.paymentAmount || 0),
        goodsAmountText: formatPrice(rawOrder.goodsAmount || rawOrder.totalAmount || 0),
      };
      const form = formatOrderForForm(rawOrder);
      const statusIndex = getStatusIndex(form.orderStatus) - 1;

      this.setData({
        order,
        form,
        statusIndex: statusIndex > -1 ? statusIndex : 0,
      });
    } catch (error) {
      this.showMessage('订单详情加载失败，请稍后重试');
    } finally {
      this.setData({ loading: false });
    }
  },

  onStatusChange(e) {
    const statusIndex = Number(e.detail.value || 0);
    this.setData({
      statusIndex,
      'form.orderStatus': this.data.statusOptions[statusIndex].value,
    });
  },

  onFieldChange(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({
      [`form.${field}`]: e.detail.value,
    });
  },

  async handleSave() {
    if (this.data.saving) return;

    this.setData({ saving: true });

    try {
      await updateAdminOrder(this.data.orderNo, this.data.form);
      this.showMessage('订单已更新');
      this.loadOrder();
    } catch (error) {
      this.showMessage(error?.msg || error?.message || '更新失败，请稍后重试');
    } finally {
      this.setData({ saving: false });
    }
  },
});
