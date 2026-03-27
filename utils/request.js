import { config } from '../config/index';

const buildUrl = (url) => {
  if (/^https?:\/\//.test(url)) return url;
  return `${config.apiBaseUrl}${url.startsWith('/') ? url : `/${url}`}`;
};

export default function request(options = {}) {
  const { url, method = 'GET', data, header = {}, timeout = 12000 } = options;

  return new Promise((resolve, reject) => {
    wx.request({
      url: buildUrl(url),
      method,
      data,
      timeout,
      header: {
        'Content-Type': 'application/json',
        'X-User-Id': wx.getStorageSync(config.userIdStorageKey) || 'u-1000',
        ...header,
      },
      success: (res) => {
        const { statusCode, data: responseData } = res;
        if (statusCode >= 200 && statusCode < 300) {
          resolve(responseData);
          return;
        }
        reject(responseData || new Error(`HTTP ${statusCode}`));
      },
      fail: reject,
    });
  });
}
