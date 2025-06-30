import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/components/AuthProvider';
import dynamic from 'next/dynamic';

// StagewiseProvider를 클라이언트에서만 렌더링
const StagewiseProvider = dynamic(
  () => import('@/components/StagewiseProvider'),
  {
    ssr: false,
    loading: () => null,
  }
);

// ErrorBoundary를 클라이언트에서만 렌더링
const ErrorBoundary = dynamic(
  () =>
    import('@/components/ErrorBoundary').then((mod) => ({
      default: mod.ErrorBoundary,
    })),
  {
    ssr: false,
    loading: () => null,
  }
);

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Channel Talk Integration Test',
  description: 'Next.js + Nest.js 인증 시스템 테스트',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
        <ErrorBoundary>
          <StagewiseProvider />
        </ErrorBoundary>
      </body>
    </html>
  );
}
