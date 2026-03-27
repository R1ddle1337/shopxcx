import Toast from 'tdesign-miniprogram/toast/index';
import { fetchAdminGoods } from '../../../services/admin/goods';
import {
  deleteAdminCategory,
  fetchAdminCategories,
} from '../../../services/admin/categories';
import { formatCategoryForList } from './utils';

Page({
  data: {
    loading: true,
    categoryList: [],
  },

  onShow() {
    this.loadCategories();
  },

  onPullDownRefresh() {
    this.loadCategories();
  },

  showMessage(message) {
    Toast({
      context: this,
      selector: '#t-toast',
      message,
    });
  },

  async loadCategories() {
    this.setData({ loading: true });

    try {
      const [categoryList, goodsList] = await Promise.all([
        fetchAdminCategories(),
        fetchAdminGoods().catch(() => []),
      ]);
      const goodsCountMap = goodsList.reduce((map, item) => {
        const categoryId = item.categoryIds?.[0];
        map[categoryId] = (map[categoryId] || 0) + 1;
        return map;
      }, {});

      this.setData({
        categoryList: categoryList.map((item) => ({
          ...formatCategoryForList(item),
          goodsCountText: `${goodsCountMap[item.groupId] || 0}`,
        })),
      });
    } catch (error) {
      this.showMessage('分类后台加载失败，请确认本地 API 已启动');
    } finally {
      this.setData({ loading: false });
      wx.stopPullDownRefresh();
    }
  },

  handleCreate() {
    wx.navigateTo({ url: '/pages/admin/category/edit/index' });
  },

  handleEdit(e) {
    const { groupId } = e.currentTarget.dataset;
    wx.navigateTo({ url: `/pages/admin/category/edit/index?groupId=${groupId}` });
  },

  handleDelete(e) {
    const { groupId, name } = e.currentTarget.dataset;

    wx.showModal({
      title: '删除分类',
      content: `确认删除“${name}”吗？若该分类下仍有关联商品，删除会被拦截。`,
      success: async ({ confirm }) => {
        if (!confirm) return;

        try {
          await deleteAdminCategory(groupId);
          this.showMessage('分类已删除');
          this.loadCategories();
        } catch (error) {
          this.showMessage(error?.msg || error?.message || '删除失败，请先处理关联商品');
        }
      },
    });
  },
});
