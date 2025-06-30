/**
 * 채널톡 이벤트 트래킹 유틸리티
 */

// 채널톡 이벤트 트래킹
export const trackChannelEvent = (eventName: string, eventProperty?: any) => {
  if (typeof window !== 'undefined' && window.ChannelIO) {
    window.ChannelIO('track', eventName, eventProperty);
  }
};

// 페이지 설정
export const setChannelPage = (url?: string) => {
  if (typeof window !== 'undefined' && window.ChannelIO) {
    const currentUrl = url || window.location.href;
    window.ChannelIO('setPage', currentUrl);
  }
};

// 채널 버튼 제어
export const showChannelButton = () => {
  if (typeof window !== 'undefined' && window.ChannelIO) {
    window.ChannelIO('showChannelButton');
  }
};

export const hideChannelButton = () => {
  if (typeof window !== 'undefined' && window.ChannelIO) {
    window.ChannelIO('hideChannelButton');
  }
};

// 주요 비즈니스 이벤트 트래킹 함수들
export const trackUserLogin = (userId: string) => {
  trackChannelEvent('UserLogin', { userId });
};

export const trackUserRegistration = (userId: string) => {
  trackChannelEvent('UserRegistration', { userId });
};

export const trackUserLogout = () => {
  trackChannelEvent('UserLogout');
};

export const trackPageView = (pageName: string) => {
  trackChannelEvent('PageView', { pageName });
};

export const trackButtonClick = (buttonName: string, location?: string) => {
  trackChannelEvent('ButtonClick', { buttonName, location });
};
