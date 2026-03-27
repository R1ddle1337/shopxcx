import { STORE_SERVICE_PHONE, STORE_SERVICE_TIME } from './store';

const userInfo = {
  avatarUrl:
    'https://we-retail-static-1300977798.cos.ap-guangzhou.myqcloud.com/retail-ui/components-exp/avatar/avatar-1.jpg',
  nickName: '鲜蔬会员',
  phoneNumber: '13438358888',
  gender: 2,
};

const countsData = [];

const orderTagInfos = [
  {
    orderNum: 1,
    tabType: 5,
  },
  {
    orderNum: 1,
    tabType: 10,
  },
  {
    orderNum: 1,
    tabType: 40,
  },
  {
    orderNum: 0,
    tabType: 60,
  },
  {
    orderNum: 1,
    tabType: 0,
  },
];

const customerServiceInfo = {
  servicePhone: STORE_SERVICE_PHONE,
  serviceTimeDuration: STORE_SERVICE_TIME,
};

export const genSimpleUserInfo = () => ({ ...userInfo });

export const genUsercenter = () => ({
  userInfo,
  countsData,
  orderTagInfos,
  customerServiceInfo,
});
