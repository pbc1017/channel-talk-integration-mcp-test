'use client';

import { ReactNode } from 'react';
import { AuthContext, useAuthProvider } from '@/hooks/useAuth';
import { useChannelTalk } from '@/hooks/useChannelTalk';

interface AuthProviderProps {
  children: ReactNode;
}

const CHANNEL_TALK_PLUGIN_KEY = 'f78d4acf-4252-4b88-9958-996dff57b95a';

export function AuthProvider({ children }: AuthProviderProps) {
  const authValue = useAuthProvider();

  // 채널톡 통합 - 로딩 중에도 즉시 익명 사용자로 시작
  const channelTalk = useChannelTalk({
    pluginKey: CHANNEL_TALK_PLUGIN_KEY,
    user: authValue.user
      ? {
          id: authValue.user.id,
          email: authValue.user.email,
          name: authValue.user.name,
          // phone: authValue.user.phone, // 필요한 경우 추가
        }
      : null,
    loading: authValue.loading, // 로딩 상태 전달
  });

  return (
    <AuthContext.Provider value={authValue}>{children}</AuthContext.Provider>
  );
}
