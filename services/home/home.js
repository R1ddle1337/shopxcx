import { config } from '../../config/index';

function mockFetchHome() {
  const { delay } = require('../_utils/delay');

  return delay().then(() => {
    return {
      tabList: [],
    };
  });
}

export function fetchHome() {
  if (config.useMock) {
    return mockFetchHome();
  }
  return new Promise((resolve) => {
    resolve('real api');
  });
}
