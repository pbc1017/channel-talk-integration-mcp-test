# Channel Talk Integration MCP Test

pnpm monorepo로 구성된 풀스택 웹 애플리케이션입니다. Next.js 프론트엔드와 NestJS 백엔드로 구성되어 있습니다.

## 📋 프로젝트 구조

```
channel-talk-integration-mcp-test/
├── apps/
│   ├── frontend/          # Next.js 프론트엔드 애플리케이션
│   └── backend/           # NestJS 백엔드 API 서버
├── packages/
│   └── shared/            # 공유 타입 정의
└── ...
```

## 🛠 기술 스택

### Frontend

- **Next.js 14** - React 프레임워크
- **React 18** - UI 라이브러리
- **Tailwind CSS** - 스타일링
- **TypeScript** - 타입 안전성

### Backend

- **NestJS** - Node.js 프레임워크
- **TypeORM** - ORM
- **SQLite** - 데이터베이스
- **JWT** - 인증 시스템
- **bcrypt** - 비밀번호 해싱

## 📋 시스템 요구사항

- **Node.js** >= 18.0.0
- **pnpm** >= 8.0.0

## 🚀 시작하기

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd channel-talk-integration-mcp-test
```

### 2. 의존성 설치

```bash
pnpm install
```

### 3. 개발 서버 실행

```bash
pnpm dev
```

이 명령어는 다음을 동시에 실행합니다:

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001

## 🔧 사용 가능한 스크립트

### 루트 디렉토리에서

- `pnpm dev` - 프론트엔드와 백엔드 개발 서버를 동시 실행
- `pnpm build` - 모든 앱 빌드
- `pnpm start` - 모든 앱 프로덕션 실행
- `pnpm lint` - 코드 린팅
- `pnpm format` - 코드 포맷팅
- `pnpm type-check` - TypeScript 타입 체크

### 개별 앱 실행

Frontend만 실행:

```bash
pnpm -C apps/frontend dev
```

Backend만 실행:

```bash
pnpm -C apps/backend dev
```

## 📁 주요 기능

- **사용자 인증**: 회원가입/로그인 시스템
- **JWT 토큰**: 안전한 인증 관리
- **반응형 UI**: Tailwind CSS를 활용한 모던 디자인
- **타입 안전성**: TypeScript와 공유 타입 정의

## 🌐 접속 URL

개발 서버 실행 후 다음 URL로 접속할 수 있습니다:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001

---

**참고**: 이 프로젝트는 Channel Talk MCP(Model Context Protocol) 테스트를 위해 개발되었습니다.
