import { useEffect, useRef, useCallback } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { authApi } from '@/lib/api';

interface User {
  id: string;
  email: string;
  name?: string;
  phone?: string;
}

interface ChannelTalkOptions {
  pluginKey: string;
  user?: User | null;
  customProfile?: Record<string, any>;
  loading?: boolean; // 로딩 상태 추가
}

export const useChannelTalk = ({
  pluginKey,
  user,
  customProfile,
  loading = false,
}: ChannelTalkOptions) => {
  const isInitialized = useRef(false);
  const currentUser = useRef<User | null>(null);
  const isBooting = useRef(false);
  const hasInitialBoot = useRef(false); // 초기 부트 완료 여부

  // 페이지 트래킹 함수
  const trackPageView = useCallback((url: string) => {
    if (window.ChannelIO) {
      window.ChannelIO('setPage', url);
    }
  }, []);

  // 멤버 해시를 사용한 안전한 부트
  const bootWithMemberHash = useCallback(
    async (userData: User) => {
      if (isBooting.current) return;
      isBooting.current = true;

      try {
        // 서버에서 멤버 해시 획득
        const { memberHash } = await authApi.getMemberHash();

        // 기존 세션 종료
        ChannelService.shutdown();

        // 멤버 해시와 함께 부트
        ChannelService.boot({
          pluginKey,
          memberId: userData.id,
          memberHash: memberHash,
          profile: {
            name: userData.name || userData.email,
            email: userData.email,
            ...(userData.phone && { mobileNumber: userData.phone }),
            ...customProfile,
          },
        });

        console.log(
          'Channel Talk booted with member hash for user:',
          userData.id
        );
      } catch (error) {
        console.error('Failed to boot Channel Talk with member hash:', error);

        // 멤버 해시 실패 시 익명 사용자로 fallback
        ChannelService.shutdown();
        ChannelService.boot({ pluginKey });
        console.log('Fallback to anonymous user after member hash failure');
      } finally {
        isBooting.current = false;
      }
    },
    [pluginKey, customProfile]
  );

  // 익명 사용자 부트
  const bootAnonymous = useCallback(() => {
    if (isBooting.current) return;
    isBooting.current = true;

    ChannelService.shutdown();
    ChannelService.boot({ pluginKey });
    console.log('Channel Talk booted as anonymous user');

    isBooting.current = false;
  }, [pluginKey]);

  // 초기 스크립트 로드 및 즉시 익명 부트
  useEffect(() => {
    if (!isInitialized.current) {
      console.log('Initializing Channel Talk...');
      ChannelService.loadScript();
      isInitialized.current = true;

      // 스크립트 로드 후 즉시 익명 사용자로 부트
      setTimeout(() => {
        if (!hasInitialBoot.current) {
          bootAnonymous();
          hasInitialBoot.current = true;
        }
      }, 500); // 스크립트 로드를 위한 약간의 지연
    }
  }, [bootAnonymous]);

  // 페이지 변화 감지 및 트래킹
  useEffect(() => {
    const handleRouteChange = () => {
      const currentUrl = window.location.href;
      trackPageView(currentUrl);
      console.log('Page tracked:', currentUrl);
    };

    // 초기 페이지 로드 시 트래킹 (채널톡 부트 후)
    if (typeof window !== 'undefined' && hasInitialBoot.current) {
      setTimeout(() => {
        handleRouteChange();
      }, 1000);
    }

    // popstate 이벤트 리스너 (브라우저 뒤로가기/앞으로가기)
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, [trackPageView, hasInitialBoot.current]);

  // 사용자 상태 변화 관리 (로딩 완료 후)
  useEffect(() => {
    // 로딩 중이거나 초기 부트가 완료되지 않았으면 대기
    if (loading || !hasInitialBoot.current || isBooting.current) {
      return;
    }

    // 사용자 상태 변화 감지
    const userChanged = currentUser.current?.id !== user?.id;

    if (userChanged) {
      console.log('User state changed:', {
        from: currentUser.current?.id || 'anonymous',
        to: user?.id || 'anonymous',
      });

      if (user) {
        // 로그인된 사용자 - 익명에서 멤버로 업그레이드
        bootWithMemberHash(user);
      } else {
        // 로그아웃 - 멤버에서 익명으로 다운그레이드
        bootAnonymous();
      }

      currentUser.current = user || null;
    }
  }, [user, loading, bootWithMemberHash, bootAnonymous]);

  // 컴포넌트 언마운트 시 정리
  useEffect(() => {
    return () => {
      if (isInitialized.current) {
        ChannelService.shutdown();
        console.log('Channel Talk shutdown on unmount');
      }
    };
  }, []);

  return {
    // 채널톡 제어 함수들
    show: () => {
      ChannelService.showChannelButton();
      console.log('Channel Talk button shown');
    },
    hide: () => {
      ChannelService.hideChannelButton();
      console.log('Channel Talk button hidden');
    },
    track: (eventName: string, properties?: Record<string, any>) => {
      if (window.ChannelIO) {
        window.ChannelIO('track', eventName, properties);
        console.log('Event tracked:', eventName, properties);
      }
    },
    setPage: (url: string) => {
      trackPageView(url);
    },
    // 수동으로 페이지 트래킹 (필요한 경우)
    trackCurrentPage: () => {
      if (typeof window !== 'undefined') {
        trackPageView(window.location.href);
      }
    },
  };
};
