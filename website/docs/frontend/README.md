# 아키텍처 및 폴더 구조

> 최종 업데이트: 2025년 6월 29일

이 문서는 `comfy-surfai-frontend-next` 리포지토리의 기술 스택, 아키텍처 원칙, 주요 폴더 구조, 그리고 실행 방법을 설명합니다.

---

## 1. 기술 스택 (Tech Stack)

- **프레임워크:** Next.js (App Router)
- **UI 라이브러리:** React, TypeScript
- **스타일링:** Tailwind CSS
- **UI 컴포넌트:** shadcn/ui (Radix UI 기반)
- **아이콘:** `lucide-react`
- **API 통신:** `fetch` API 기반의 커스텀 `apiClient`
- **코드 품질:** ESLint, Prettier

## 2. 아키텍처 원칙

프론트엔드는 **컴포넌트 기반 아키텍처(Component-Based Architecture)**를 중심으로, 역할과 책임을 명확하게 분리하는 것을 목표로 합니다.

- **컴포넌트 계층화:**
  - **페이지 (Page):** `app/` 폴더 내의 `page.tsx` 파일들. 데이터 로딩, 상태 관리 등 "스마트"한 로직을 담당하는 컨테이너 역할을 합니다.
  - **복합 컴포넌트 (Compound):** `components/common/` 또는 `components/feature/`에 위치하며, 여러 UI 요소를 조합하여 특정 기능을 수행합니다. (예: `SessionGallery`)
  - **원자적 컴포넌트 (Atomic):** `components/ui/`에 위치하며, `Button`, `Input` 등 가장 기본적이고 재사용 가능한 UI 단위입니다. (주로 `shadcn/ui`로 생성)

- **상태 관리 (State Management):**
  - **전역 상태:** 사용자의 인증 정보와 같이 여러 페이지에서 공유되어야 하는 상태는 React Context API (`AuthContext`)를 통해 관리합니다.
  - **지역 상태:** 특정 페이지나 컴포넌트 내부에서만 사용되는 상태는 `useState` 훅을 사용하여 관리합니다.

- **데이터 통신:**
  - 모든 백엔드 API 요청은 `lib/apiClient.ts`를 통해 이루어집니다. 이 파일은 요청 헤더 설정, 에러 처리, 그리고 **Access Token 만료 시 자동 재발급**과 같은 공통 로직을 중앙에서 처리합니다.

## 3. 주요 폴더 구조


/src
├── 📁 app/                 # 라우팅의 기본이 되는 폴더 (App Router)
│   ├── 📁 (auth)/            # 인증 관련 페이지 그룹 (레이아웃에 영향 없음)
│   │   ├── 📁 callback/
│   │   └── 📁 login/
│   ├── 📁 admin/              # 관리자 전용 페이지
│   │   └── 📁 workflows/
│   └── 📁 history/            # 생성 기록 페이지
│   └── 📄 layout.tsx         # 모든 페이지에 적용되는 공통 레이아웃
│   └── 📄 page.tsx           # 홈페이지 (랜딩 페이지)
│
├── 📁 components/           # 재사용 가능한 UI 컴포넌트
│   ├── 📁 common/             # 여러 기능을 조합한 복합 컴포넌트 (예: GeneratedItem)
│   └── 📁 ui/               # Button, Card 등 원자적 UI 컴포넌트
│
├── 📁 contexts/             # 전역 상태 관리를 위한 React Context
│   └── 📄 AuthContext.tsx
│
├── 📁 hooks/               # 재사용 가능한 복잡한 로직 (Custom Hooks)
│   └── 📄 useComfyWebSocket.ts
│
├── 📁 interfaces/           # TypeScript 타입 정의
│   ├── 📄 history.interface.ts
│   └── 📄 user.interface.ts
│
└── 📁 lib/                  # 공통 유틸리티 및 라이브러리 설정
└── 📄 apiClient.ts


## 4. 실행 방법

### 개발 환경 실행
1.  프로젝트 루트에 `.env.local` 파일을 생성합니다.
2.  `NEXT_PUBLIC_API_URL`과 `NEXT_PUBLIC_WEBSOCKET_URL` 환경 변수를 설정합니다. (예: `http://localhost:3000`)
3.  `npm install` 명령어로 모든 의존성을 설치합니다.
4.  `npm run dev` 명령어로 개발 서버를 실행합니다. 서버는 `http://localhost:4000`에서 실행됩니다.

## 5. 주요 환경 변수

- **`NEXT_PUBLIC_API_URL`**: API 요청을 보낼 백엔드 서버의 기본 URL.
- **`NEXT_PUBLIC_WEBSOCKET_URL`**: WebSocket 연결을 위한 백엔드 서버의 URL.