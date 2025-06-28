🧩 프론트엔드 주요 컴포넌트 명세
최종 업데이트: 2025년 6월 29일

이 문서는 `comfy-surfai-frontend-next` 프로젝트의 주요 `React` 컴포넌트, `Context`, 그리고 커스텀 `Hook`의 역할과 구조를 설명합니다.

---

## 1. 전역 컨텍스트 및 훅 (Global Context & Hooks)

애플리케이션 전반의 상태와 로직을 관리하는 핵심 요소입니다.

### 가. `AuthContext.tsx`

-   **위치:** `src/contexts/AuthContext.tsx`
-   **역할:** 사용자의 인증 상태(로그인 여부, 사용자 정보)를 전역적으로 관리하고, 관련 함수(로그인, 로그아웃)를 제공하는 **"인증 상태 관리자"**입니다.
-   **주요 제공 값 (`value`):**
    -   `user: User | null`: 현재 로그인된 사용자의 정보 객체. 비로그인 시 `null`.
    -   `isLoading: boolean`: 앱 시작 시 또는 로그인/로그아웃 시 인증 상태를 확인하는 동안 `true`가 됩니다.
    -   `login(credentials)`: 일반 이메일/비밀번호 로그인을 처리하는 함수.
    -   `logout()`: 사용자를 로그아웃 처리하고 관련 쿠키를 삭제하는 함수.
    -   `fetchUserProfile()`: 서버에 프로필 정보를 요청하여 `user` 상태를 갱신하는 함수.

### 나. `useComfyWebSocket.ts`

-   **위치:** `src/hooks/useComfyWebSocket.ts`
-   **역할:** 백엔드의 `WebSocket` 서버와 실시간으로 통신하며, AI 생성 과정에서 발생하는 모든 이벤트를 수신하고 관련 상태를 관리하는 **"실시간 통신 관리자"**입니다.
-   **주요 반환 값:**
    -   `isWsConnected: boolean`: `WebSocket` 연결 상태.
    -   `executionStatus: string | null`: "생성 중...", "최종 결과 수신 완료!" 등 현재 작업 상태 텍스트.
    -   `progressValue: { value, max } | null`: `KSampler` 등 노드의 진행률.
    -   `sessionOutputs: HistoryItemData[]`: `Generate` 페이지에서 현재 세션 동안 생성된 결과물들의 목록. (최대 20개 유지)

### 다. `apiClient.ts`

-   **위치:** `src/lib/apiClient.ts`
-   **역할:** 백엔드 API와의 모든 `HTTP` 통신을 담당하는 **"중앙 통신 게이트웨이"**입니다.
-   **핵심 기능:**
    -   **자동 토큰 재발급:** API 요청 시 Access Token이 만료되어 `401` 에러를 받으면, 자동으로 Refresh Token을 사용하여 새로운 토큰을 재발급받고, 원래 실패했던 요청을 다시 시도합니다.
    -   **CSRF 헤더 자동 추가:** `POST`, `PUT`, `DELETE` 등 상태를 변경하는 요청 시, `XSRF-TOKEN` 쿠키 값을 읽어 `X-XSRF-TOKEN` 헤더를 자동으로 추가하여 CSRF 공격을 방어합니다.
    -   **쿠키 자동 전송:** `credentials: 'include'` 옵션을 통해, 모든 요청에 브라우저가 보관 중인 인증 관련 `HttpOnly` 쿠키가 자동으로 포함되도록 합니다.

---

## 2. 페이지 컴포넌트 (Page Components)

`src/app/` 디렉토리 내에 위치하며, 각 라우트의 진입점 역할을 하는 "스마트" 컴포넌트입니다.

### 가. `generate/page.tsx`

-   **역할:** AI 이미지/비디오 생성의 메인 페이지.
-   **주요 로직:**
    -   `useComfyWebSocket` 훅을 사용하여 실시간 상태를 관리합니다.
    -   워크플로우 템플릿 목록을 API로 불러와 `TemplateForm`에 전달합니다.
    -   `TemplateForm`에서 입력받은 파라미터로 생성 API(`POST /api/generate`)를 호출합니다.
    -   `SessionGallery`를 통해 현재 세션의 생성 결과물을 표시합니다.
    -   `ImageLightbox`의 열림/닫힘 상태를 관리합니다.

### 나. `history/page.tsx`

-   **역할:** 사용자가 생성했던 모든 결과물을 영구적으로 보여주는 "나의 앨범" 페이지.
-   **주요 로직:**
    -   백엔드의 `/my-outputs` API를 호출하여 자신의 생성 기록 목록을 가져옵니다.
    -   "더 보기" 버튼을 통해 페이지네이션(무한 스크롤) 기능을 구현합니다.
    -   `HistoryGallery`와 `GeneratedItem` 컴포넌트를 재사용하여 결과물을 표시합니다.
    -   `ImageLightbox`의 열림/닫힘 상태를 관리합니다.

### 다. `admin/workflows/page.tsx` 등

-   **역할:** 관리자 전용 기능 페이지.
-   **주요 로직:**
    -   페이지 접근 시 `useAuth`를 통해 사용자의 `role`이 `admin`인지 확인하고, 아닐 경우 즉시 리디렉션시키는 접근 제어 로직을 포함합니다.
    -   관리자용 API를 호출하여 데이터를 가져와 표시합니다.

---

## 3. 재사용 컴포넌트 (Reusable Components)

`src/components/` 디렉토리에 위치하며, 특정 UI 조각이나 기능을 담당하는 "단순한(Dumb)" 컴포넌트입니다.

### 가. `GeneratedItem.tsx`

-   **역할:** 갤러리에 표시되는 개별 결과물 카드 하나를 렌더링합니다. `SessionGallery`와 `HistoryGallery`에서 모두 재사용됩니다.
-   **주요 기능:**
    -   `prop`으로 받은 `item` 데이터(`HistoryItemData`)를 기반으로 UI를 그립니다.
    -   `item.mimeType`에 따라 이미지(`<img>`) 또는 비디오(`<video>`)를 조건부로 렌더링합니다.
    -   `item.usedParameters`를 분석하여 비디오의 재생 시간을 계산하고 표시합니다.
    -   `item.createdAt`을 기준으로 파일 만료 여부를 판단하고, 만료 시 대체 UI를 보여줍니다.
    -   확대보기/다운로드/삭제 버튼을 포함하며, 클릭 시 부모로부터 받은 핸들러 함수(`onImageClick`, `onDelete`)를 호출합니다.

### 나. `ImageLightbox.tsx`

-   **역할:** 사용자가 갤러리에서 이미지를 클릭했을 때, 화면 전체를 덮으며 확대된 이미지와 상세 메타데이터를 보여주는 모달입니다.
-   **주요 기능:**
    -   `prop`으로 받은 `item` 객체(`HistoryItemData | null`)를 기반으로 렌더링됩니다. `item`이 `null`이면 숨겨집니다.
    -   왼쪽에는 `item.viewUrl`을 사용하여 미디어(이미지/비디오)를 크게 표시합니다.
    -   오른쪽에는 `item.usedParameters`, `item.createdAt` 등 상세 메타데이터를 스크롤 가능한 영역에 표시합니다.
    -   바깥쪽 배경이나 'X' 버튼을 클릭하면 `onClose` 핸들러를 호출하여 닫힙니다.
