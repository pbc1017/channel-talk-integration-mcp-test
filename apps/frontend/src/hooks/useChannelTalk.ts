'use client';

import { useEffect, useCallback } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { User } from '@shared/types/auth';

const PLUGIN_KEY = 'f78d4acf-4252-4b88-9958-996dff57b95a';

interface UseChannelTalkProps {
  user: User | null;
  loading: boolean;
}

export const useChannelTalk = ({ user, loading }: UseChannelTalkProps) => {
  // 채널톡 스크립트 로드
  useEffect(() => {
    ChannelService.loadScript();
  }, []);

  // 채널톡 부트
  const bootChannelTalk = useCallback((userData: User | null) => {
    if (userData) {
      // 로그인된 사용자 - 멤버 유저로 부트
      ChannelService.boot({
        pluginKey: PLUGIN_KEY,
        memberId: userData.id,
        profile: {
          name: userData.name,
          email: userData.email,
        },
      });
    } else {
      // 로그아웃된 사용자 - 익명 유저로 부트
      ChannelService.boot({
        pluginKey: PLUGIN_KEY,
      });
    }
  }, []);

  // 사용자 상태 변경 시 채널톡 재시작
  useEffect(() => {
    if (loading) return; // 로딩 중일 때는 아무것도 하지 않음

    // 기존 채널톡 세션 종료
    ChannelService.shutdown();

    // 새로운 상태로 부트
    bootChannelTalk(user);
  }, [user, loading, bootChannelTalk]);

  // 채널톡 제어 함수들
  const showChannelButton = useCallback(() => {
    ChannelService.showChannelButton();
  }, []);

  const hideChannelButton = useCallback(() => {
    ChannelService.hideChannelButton();
  }, []);

  const track = useCallback((eventName: string, eventProperty?: any) => {
    if (typeof window !== 'undefined' && window.ChannelIO) {
      window.ChannelIO('track', eventName, eventProperty);
    }
  }, []);

  const setPage = useCallback((url?: string) => {
    if (typeof window !== 'undefined' && window.ChannelIO) {
      const currentUrl = url || window.location.href;
      window.ChannelIO('setPage', currentUrl);
    }
  }, []);

  return {
    showChannelButton,
    hideChannelButton,
    track,
    setPage,
  };
};
