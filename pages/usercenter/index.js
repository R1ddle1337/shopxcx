import { fetchUserCenter } from '../../services/usercenter/fetchUsercenter';
import Toast from 'tdesign-miniprogram/toast/index';

const menuData = [
  [
    {
      title: '配送地址',
      tit: '',
      url: '',
      type: 'address',
    },
  ],
  [
    {
      title: '售后帮助',
      tit: '',
      url: '',
      type: 'help-center',
    },
    {
      title: '客服热线',
      tit: '',
      url: '',
      type: 'service',
      icon: 'service',
    },
  ],
];

menuData[1].unshift({
  title: '商品后台',
  tit: '',
  url: '',
  type: 'admin-goods',
});

menuData[1].splice(
  1,
  0,
  {
    title: '分类后台',
    tit: '',
    url: '',
    type: 'admin-category',
  },
  {
    title: '订单后台',
    tit: '',
    url: '',
    type: 'admin-order',
  },
);

const orderTagInfos = [
  {
    title: '待付款',
    iconName: 'wallet',
    orderNum: 0,
    tabType: 5,
    status: 1,
  },
  {
    title: '待发货',
    iconName: 'deliver',
    orderNum: 0,
    tabType: 10,
    status: 1,
  },
  {
    title: '待收货',
    iconName: 'package',
    orderNum: 0,
    tabType: 40,
    status: 1,
  },
  {
    title: '待评价',
    iconName: 'comment',
    orderNum: 0,
    tabType: 60,
    status: 1,
  },
  {
    title: '退款/售后',
    iconName: 'exchang',
    orderNum: 0,
    tabType: 0,
    status: 1,
  },
];

const getDefaultData = () => ({
  showMakePhone: false,
  userInfo: {
    avatarUrl: '',
    nickName: '正在登录...',
    phoneNumber: '',
  },
  menuData,
  orderTagInfos,
  customerServiceInfo: {},
  currAuthStep: 1,
  showKefu: true,
  versionNo: '',
});

Page({
  data: getDefaultData(),

  onLoad() {
    this.getVersionInfo();
  },

  onShow() {
    this.getTabBar().init();
    this.init();
  },

  onPullDownRefresh() {
    this.init();
  },

  init() {
    this.fetUseriInfoHandle();
  },

  fetUseriInfoHandle() {
    fetchUserCenter().then(({ userInfo, countsData, orderTagInfos: orderInfo, customerServiceInfo }) => {
      menuData?.[0].forEach((v) => {
        countsData.forEach((counts) => {
          if (counts.type === v.type) {
            v.tit = counts.num;
          }
        });
      });

      const info = orderTagInfos.map((v, index) => ({
        ...v,
        ...orderInfo[index],
      }));

      this.setData({
        userInfo,
        menuData,
        orderTagInfos: info,
        customerServiceInfo,
        currAuthStep: 2,
      });
      wx.stopPullDownRefresh();
    });
  },

  onClickCell({ currentTarget }) {
    const { type } = currentTarget.dataset;

    switch (type) {
      case 'address': {
        wx.navigateTo({ url: '/pages/user/address/list/index' });
        break;
      }
      case 'admin-goods': {
        wx.navigateTo({ url: '/pages/admin/goods/index' });
        break;
      }
      case 'admin-category': {
        wx.navigateTo({ url: '/pages/admin/category/index' });
        break;
      }
      case 'admin-order': {
        wx.navigateTo({ url: '/pages/admin/order/index' });
        break;
      }
      case 'service': {
        this.openMakePhone();
        break;
      }
      case 'help-center': {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '售后帮助整理中',
          icon: '',
          duration: 1000,
        });
        break;
      }
      default: {
        Toast({
          context: this,
          selector: '#t-toast',
          message: '功能开发中',
          icon: '',
          duration: 1000,
        });
        break;
      }
    }
  },

  jumpNav(e) {
    const status = e.detail.tabType;

    if (status === 0) {
      wx.navigateTo({ url: '/pages/order/after-service-list/index' });
    } else {
      wx.navigateTo({ url: `/pages/order/order-list/index?status=${status}` });
    }
  },

  jumpAllOrder() {
    wx.navigateTo({ url: '/pages/order/order-list/index' });
  },

  openMakePhone() {
    this.setData({ showMakePhone: true });
  },

  closeMakePhone() {
    this.setData({ showMakePhone: false });
  },

  call() {
    wx.makePhoneCall({
      phoneNumber: this.data.customerServiceInfo.servicePhone,
    });
  },

  gotoUserEditPage() {
    const { currAuthStep } = this.data;
    if (currAuthStep === 2) {
      wx.navigateTo({ url: '/pages/user/person-info/index' });
    } else {
      this.fetUseriInfoHandle();
    }
  },

  getVersionInfo() {
    const versionInfo = wx.getAccountInfoSync();
    const { version, envVersion = __wxConfig } = versionInfo.miniProgram;
    this.setData({
      versionNo: envVersion === 'release' ? version : envVersion,
    });
  },
});
