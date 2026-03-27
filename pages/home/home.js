import { fetchGoodsList } from '../../services/good/fetchGoods';
import Toast from 'tdesign-miniprogram/toast/index';
import { addCartItem } from '../../services/cart/cart';

Page({
  data: {
    goodsList: [],
    goodsListLoadStatus: 0,
    pageLoading: false,
  },

  goodListPagination: {
    index: 0,
    num: 2,
  },

  onShow() {
    this.getTabBar().init();
  },

  onLoad() {
    this.init();
  },

  onReachBottom() {
    if (this.data.goodsListLoadStatus === 0) {
      this.loadGoodsList();
    }
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.loadHomePage();
  },

  async loadHomePage() {
    wx.stopPullDownRefresh();

    this.setData({
      pageLoading: true,
    });

    await this.loadGoodsList(true);
    this.setData({
      pageLoading: false,
    });
  },

  onReTry() {
    this.loadGoodsList();
  },

  async loadGoodsList(fresh = false) {
    if (fresh) {
      wx.pageScrollTo({
        scrollTop: 0,
      });
    }

    this.setData({ goodsListLoadStatus: 1 });

    const pageSize = this.goodListPagination.num;
    const pageIndex = fresh ? 0 : this.data.goodsList.length;

    try {
      const nextList = await fetchGoodsList(pageIndex, pageSize);
      const goodsList = fresh ? nextList : this.data.goodsList.concat(nextList);

      this.setData({
        goodsList,
        goodsListLoadStatus: nextList.length < pageSize ? 2 : 0,
      });

      this.goodListPagination.index = pageIndex;
      this.goodListPagination.num = pageSize;
    } catch (err) {
      this.setData({ goodsListLoadStatus: 3 });
    }
  },

  goodListClickHandle(e) {
    const { index } = e.detail;
    const { spuId } = this.data.goodsList[index];
    wx.navigateTo({
      url: `/pages/goods/details/index?spuId=${spuId}`,
    });
  },

  async goodListAddCartHandle(e) {
    const { goods } = e.detail || {};
    if (!goods?.spuId || !goods?.skuId) return;

    try {
      await addCartItem({
        spuId: goods.spuId,
        skuId: goods.skuId,
        quantity: 1,
      });
      Toast({
        context: this,
        selector: '#t-toast',
        message: '已加入菜篮',
      });
    } catch (error) {
      Toast({
        context: this,
        selector: '#t-toast',
        message: '加入失败，请稍后重试',
      });
    }
  },

  navToSearchPage() {
    wx.navigateTo({ url: '/pages/goods/search/index' });
  },
});
