'use client';

import { useAuth } from '@/hooks/useAuth';
import { LoginForm } from './LoginForm';

export function Dashboard() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">로딩 중...</div>
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold">
                Channel Talk Integration Test
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">환영합니다, {user.name}님!</span>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                로그아웃
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 로그인 성공!
              </h2>
              <div className="bg-white shadow rounded-lg p-6 max-w-md mx-auto">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  사용자 정보
                </h3>
                <div className="space-y-2 text-left">
                  <div className="flex justify-between">
                    <span className="text-gray-600">이름:</span>
                    <span className="font-medium">{user.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">이메일:</span>
                    <span className="font-medium">{user.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">가입일:</span>
                    <span className="font-medium">
                      {new Date(user.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-gray-600">
                <p>✅ Next.js + Nest.js 인증 시스템이 정상적으로 작동합니다!</p>
                <p>✅ JWT 토큰 기반 인증이 완료되었습니다.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
