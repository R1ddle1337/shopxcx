import Toast from 'tdesign-miniprogram/toast/index';
import { getCategoryList } from '../../../services/good/fetchCategoryList';
import { deleteAdminGood, fetchAdminGoods } from '../../../services/admin/goods';
import { formatGoodForList, getCategoryOptions } from './utils';

Page({
  data: {
    loading: true,
    goodsList: [],
  },

  onShow() {
    this.loadGoods();
  },

  onPullDownRefresh() {
    this.loadGoods();
  },

  async loadGoods() {
    this.setData({ loading: true });

    try {
      const [goodsList, categoryList] = await Promise.all([
        fetchAdminGoods(),
        getCategoryList().catch(() => []),
      ]);
      const categoryMap = getCategoryOptions(categoryList).reduce((map, item) => {
        map[item.value] = item.label;
        return map;
      }, {});

      this.setData({
        goodsList: goodsList.map((item) => formatGoodForList(item, categoryMap)),
      });
    } catch (error) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '商品后台加载失败，请确认本地 API 已启动',
      });
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  handleCreate() {
    wx.navigateTo({ url: '/pages/admin/goods/edit/index' });
  },

  handleEdit(e) {
    const { spuId } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/admin/goods/edit/index?spuId=${spuId}` });
  },

  handleDelete(e) {
    const { spuId, title } = e.currentTarget.dataset;

    wx.showModal({
      title: '删除商品',
      content: `确认删除“${title}”吗？删除后菜篮中的同商品也会被移除。`,
      success: async ({ confirm }) => {
        if (!confirm) return;

        try {
          await deleteAdminGood(spuId);
          Toast({
            context: this,
            selector: '#t-toast',
            message: '商品已删除',
          });
          this.loadGoods();
        } catch (error) {
          Toast({
            context: this,
            selector: '#t-toast',
            message: '删除失败，请稍后重试',
          });
        }
      },
    });
  },
});
