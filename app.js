import updateManager from './common/updateManager';
import { config } from './config/index';

App({
  onLaunch: function () {
    if (!wx.getStorageSync(config.userIdStorageKey)) {
      wx.setStorageSync(config.userIdStorageKey, 'u-1000');
    }
  },
  onShow: function () {
    updateManager();
  },
});
