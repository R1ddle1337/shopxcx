import { config } from '../../config/index';

/**
 * 真实接口不可用时，自动回退到 mock，避免页面直接空白。
 */
export function withMockFallback(requestTask, mockTask, label = 'request') {
  return requestTask().catch((error) => {
    if (!config.useMock) {
      throw error;
    }

    console.warn(`[mock-fallback] ${label}`, error);
    return mockTask();
  });
}
