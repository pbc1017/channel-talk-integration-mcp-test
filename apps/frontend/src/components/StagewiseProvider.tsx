'use client';

import { useEffect } from 'react';

export default function StagewiseProvider() {
  useEffect(() => {
    // 개발 모드에서만 stagewise 로드
    if (process.env.NODE_ENV === 'development') {
      Promise.all([
        import('@stagewise/toolbar'),
        import('@stagewise-plugins/react'),
      ])
        .then(([toolbarModule, pluginModule]) => {
          const { initToolbar } = toolbarModule;
          const { ReactPlugin } = pluginModule;

          // 툴바 초기화
          initToolbar({
            plugins: [ReactPlugin],
          });
        })
        .catch((error) => {
          console.warn('Stagewise 툴바 로드 실패:', error);
        });
    }
  }, []);

  // 실제 컴포넌트는 렌더링하지 않음 (initToolbar가 DOM에 직접 추가)
  return null;
}
