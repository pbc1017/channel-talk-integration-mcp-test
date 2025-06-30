'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export function ChannelTalkPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window !== 'undefined' && window.ChannelIO) {
      const url =
        pathname +
        (searchParams.toString() ? `?${searchParams.toString()}` : '');
      window.ChannelIO('setPage', url);
    }
  }, [pathname, searchParams]);

  return null;
}
