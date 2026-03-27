import { config } from '../../config/index';

function mockFetchHome() {
  const { delay } = require('../_utils/delay');

  return delay().then(() => {
    return {
      tabList: [
        {
          text: '精选推荐',
          key: 0,
        },
        {
          text: '夏日新品',
          key: 1,
        },
      ],
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
