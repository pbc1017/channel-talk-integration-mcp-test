'use client';

import { useEffect, useCallback, useState } from 'react';
import * as ChannelService from '@channel.io/channel-web-sdk-loader';
import { User } from '@shared/types/auth';
import { channelTalkApi } from '@/lib/api';

const PLUGIN_KEY = 'f78d4acf-4252-4b88-9958-996dff57b95a';

interface UseChannelTalkProps {
  user: User | null;
  loading: boolean;
}

export const useChannelTalk = ({ user, loading }: UseChannelTalkProps) => {
  const [isChannelTalkReady, setIsChannelTalkReady] = useState(false);

  // 채널톡 스크립트 로드
  useEffect(() => {
    ChannelService.loadScript();
    setIsChannelTalkReady(true);
  }, []);

  // 보안이 강화된 채널톡 부트 (멤버 해시 사용)
  const bootChannelTalkSecure = useCallback(async (userData: User | null) => {
    if (userData) {
      try {
        // 서버에서 멤버 해시 요청
        const { memberHash } = await channelTalkApi.getMemberHash(userData.id);

        // 멤버 해시와 함께 부트
        ChannelService.boot({
          pluginKey: PLUGIN_KEY,
          memberId: userData.id,
          memberHash: memberHash,
          profile: {
            name: userData.name,
            email: userData.email,
          },
        });

        console.log(
          '✅ Channel Talk booted with member hash for user:',
          userData.id
        );
      } catch (error) {
        console.error(
          '❌ Failed to boot Channel Talk with member hash:',
          error
        );

        // 멤버 해시 생성 실패 시 익명 유저로 폴백
        console.warn('⚠️ Falling back to anonymous user mode');
        ChannelService.boot({
          pluginKey: PLUGIN_KEY,
        });
      }
    } else {
      // 로그아웃된 사용자 - 익명 유저로 부트
      ChannelService.boot({
        pluginKey: PLUGIN_KEY,
      });

      console.log('✅ Channel Talk booted as anonymous user');
    }
  }, []);

  // 사용자 상태 변경 시 채널톡 재시작
  useEffect(() => {
    if (loading || !isChannelTalkReady) return; // 로딩 중이거나 채널톡이 준비되지 않았을 때는 아무것도 하지 않음

    // 기존 채널톡 세션 종료
    ChannelService.shutdown();

    // 새로운 상태로 부트
    bootChannelTalkSecure(user);
  }, [user, loading, isChannelTalkReady, bootChannelTalkSecure]);

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
    isChannelTalkReady,
  };
};
