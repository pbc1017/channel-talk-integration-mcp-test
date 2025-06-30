'use client';

import { useAuth } from '@/hooks/useAuth';
import { useChannelTalk } from '@/hooks/useChannelTalk';

export function ChannelTalkProvider() {
  const { user, loading } = useAuth();
  useChannelTalk({ user, loading });

  // 이 컴포넌트는 렌더링하지 않고 채널톡 초기화만 담당
  return null;
}
