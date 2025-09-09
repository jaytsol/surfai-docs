# 주요 컴포넌트 명세
🧩 프론트엔드 주요 컴포넌트 명세
최종 업데이트: 2025년 6월 29일

이 문서는 `comfy-surfai-frontend-next` 프로젝트의 주요 `React` 컴포넌트, `Context`, 그리고 커스텀 `Hook`의 역할과 구조를 설명합니다.

---

## 1. 전역 컨텍스트 및 훅 (Global Context & Hooks)

애플리케이션 전반의 상태와 로직을 관리하는 핵심 요소입니다.

### 가. `AuthContext.tsx`

-   **위치:** `src/contexts/AuthContext.tsx`
-   **역할:** 사용자의 인증 상태(로그인 여부, 사용자 정보, 코인 잔액)를 전역적으로 관리하고, 관련 함수(로그인, 로그아웃, 프로필 업데이트)를 제공하는 **"인증 및 사용자 상태 관리자"**입니다.
-   **주요 제공 값 (`value`):**
    -   `user: User | null`: 현재 로그인된 사용자의 정보 객체. 비로그인 시 `null`.
    -   `isLoading: boolean`: 앱 시작 시 또는 로그인/로그아웃 시 인증 상태를 확인하는 동안 `true`가 됩니다.
    -   `login(credentials)`: 일반 이메일/비밀번호 로그인을 처리하는 함수.
    -   `logout()`: 사용자를 로그아웃 처리하고 관련 쿠키를 삭제하는 함수.
    -   `fetchUserProfile()`: 서버에 프로필 정보를 요청하여 `user` 상태를 갱신하는 함수.
    -   `setUser()`: 클라이언트 측에서 `user` 객체를 직접 업데이트하는 함수 (예: 낙관적 업데이트).

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
    -   `useAuth` 훅을 통해 사용자 정보(코인 잔액 포함)를 가져와 표시합니다.
    -   `useComfyWebSocket` 훅을 사용하여 실시간 상태를 관리합니다.
    -   워크플로우 템플릿 목록을 API로 불러와 `TemplateForm`에 전달합니다.
    -   `TemplateForm`에서 입력받은 파라미터로 코인 차감 API(`POST /api/coin/deduct`)를 먼저 호출하고, 성공 시에만 이미지 생성 API(`POST /api/generate`)를 호출합니다.
    -   `SessionGallery`를 통해 현재 세션의 결과물을 임시로 확인하는 기능.
    -   `ImageLightbox`의 열림/닫힘 상태를 관리합니다.

### 나. `history/page.tsx`

-   **역할:** 사용자가 생성했던 모든 결과물을 영구적으로 보여주는 "나의 앨범" 페이지.
-   **주요 로직:**
    -   백엔드의 `/my-outputs` API를 호출하여 자신의 생성 기록 목록을 가져옵니다.
    -   "더 보기" 버튼을 통해 페이지네이션(무한 스크롤) 기능을 구현합니다.
    -   `HistoryGallery`와 `GeneratedItem` 컴포넌트를 재사용하여 결과물을 표시합니다.
    -   `ImageLightbox`의 열림/닫힘 상태를 관리합니다.

### 다. `admin/workflows/new/page.tsx` 및 `admin/workflows/[id]/edit/page.tsx`

-   **역할:** 관리자용 워크플로우 템플릿 생성 및 수정 페이지.
-   **주요 로직:**
    -   페이지 접근 시 `useAuth`를 통해 사용자의 `role`이 `admin`인지 확인하고, 아닐 경우 즉시 리디렉션시키는 접근 제어 로직을 포함합니다.
    -   **`ParameterMappingForm` 컴포넌트를 재사용**하여 파라미터 설정 UI를 렌더링합니다.
    -   **생성 페이지:** 2단계(기본 정보 입력 -> 파라미터 매핑) 흐름을 관리하며, 각 단계에 맞는 API(`POST /workflow-templates`, `PUT /.../parameter-map`)를 호출합니다.
    -   **수정 페이지:** 페이지 로드 시 기존 템플릿 데이터를 불러와 모든 폼을 채우고, '저장' 시 `PATCH /workflow-templates/:id` API를 호출하여 모든 변경사항을 한 번에 업데이트합니다.

---

## 3. 재사용 컴포넌트 (Reusable Components)

`src/components/` 디렉토리에 위치하며, 특정 UI 조각이나 기능을 담당하는 "단순한(Dumb)" 컴포넌트입니다.

### 가. `TemplateForm.tsx`

-   **위치:** `src/components/template/TemplateForm.tsx`
-   **역할:** 워크플로우 템플릿 선택 및 파라미터 입력을 위한 폼 UI를 제공합니다. 사용자 코인 잔액을 표시하고, 이미지 생성 버튼을 포함합니다.
-   **주요 기능:**
    -   템플릿 선택 드롭다운.
    -   선택된 템플릿의 `parameter_map`에 따라 동적으로 파라미터 입력 필드를 렌더링.
    -   `user` prop을 통해 받은 코인 잔액을 이미지 생성 버튼 옆에 표시.
    -   `isSubmitting` 상태에 따라 버튼 비활성화 및 텍스트 변경.

### 나. `ParameterMappingForm.tsx`

-   **위치:** `src/components/admin/ParameterMappingForm.tsx`
-   **역할:** 워크플로우 템플릿의 `parameter_map`을 생성하고 수정하는 데 사용되는 매우 복잡하고 동적인 폼 UI 전체를 담당하는 **"파라미터 매핑 전문 컴포넌트"**입니다.
-   **재사용:**
    -   **생성 페이지 (`new/page.tsx`):** 2단계 화면에서 사용됩니다. `onSave`, `onBack` 함수를 전달받아 폼 내부의 버튼으로 자체적인 저장/취소 로직을 수행합니다.
    -   **편집 페이지 (`edit/page.tsx`):** 페이지의 일부로 포함됩니다. `onSave`, `onBack` 없이 렌더링되며, 데이터 표시와 수정 역할만 담당합니다. 최종 저장은 편집 페이지의 메인 '저장' 버튼이 처리합니다.
-   **주요 기능:**
    -   **카테고리 기반 로직:** `prop`으로 받은 `category`에 따라 API를 호출하여 관련 파라미터 사전 설정(Preset) 목록을 불러옵니다.
    -   **필수 파라미터 자동 추가:** `new` 페이지 모드일 때, 카테고리에 해당하는 필수 파라미터들을 자동으로 목록에 추가합니다.
    -   **지능형 UI:**
        -   노드 선택 시 해당 노드의 상세 정보(`inputs`, `class_type`)를 보여줍니다.
        -   `input_name`을 클릭 한 번으로 자동 완성할 수 있습니다.
        -   사전 설정으로 추가된 파라미터는 `key`와 `type`이 잠금 처리되어 실수를 방지합니다.
        -   필수 파라미터는 삭제할 수 없도록 비활성화됩니다.
        -   이미 추가된 사전 설정은 '파라미터 추가' 드롭다운에서 비활성화됩니다.
    -   **상태 관리:** `props`로 `parameterMap` 상태와 `setParameterMap` 함수를 직접 전달받아, 부모 컴포넌트(페이지)의 상태를 직접 제어합니다.

### 다. `GeneratedItem.tsx`

-   **위치:** `src/components/admin/GeneratedItem.tsx`
-   **역할:** 갤러리에 표시되는 개별 결과물 카드 하나를 렌더링합니다. `SessionGallery`와 `HistoryGallery`에서 모두 재사용됩니다.
-   **주요 기능:**
    -   `prop`으로 받은 `item` 데이터(`HistoryItemData`)를 기반으로 UI를 그립니다.
    -   `item.mimeType`에 따라 이미지(`<img>`) 또는 비디오(`<video>`)를 조건부로 렌더링합니다.
    -   `item.usedParameters`를 분석하여 비디오의 재생 시간을 계산하고 표시합니다.
    -   `item.createdAt`을 기준으로 파일 만료 여부를 판단하고, 만료 시 대체 UI를 보여줍니다.
    -   확대보기/다운로드/삭제 버튼을 포함하며, 클릭 시 부모로부터 받은 핸들러 함수(`onImageClick`, `onDelete`)를 호출합니다.

### 라. `ImageLightbox.tsx`

-   **위치:** `src/components/admin/ImageLightbox.tsx`
-   **역할:** 사용자가 갤러리에서 이미지를 클릭했을 때, 화면 전체를 덮으며 확대된 이미지와 상세 메타데이터를 보여주는 모달입니다.
-   **주요 기능:**
    -   `prop`으로 받은 `item` 객체(`HistoryItemData | null`)를 기반으로 렌더링됩니다. `item`이 `null`이면 숨겨집니다.
    -   왼쪽에는 `item.viewUrl`을 사용하여 미디어(이미지/비디오)를 크게 표시합니다.
    -   오른쪽에는 `item.usedParameters`, `item.createdAt` 등 상세 메타데이터를 스크롤 가능한 영역에 표시합니다.
    -   바깥쪽 배경이나 'X' 버튼을 클릭하면 `onClose` 핸들러를 호출하여 닫힙니다.

### 마. `ChatModal.tsx`

-   **위치:** `src/components/common/ChatModal.tsx`
-   **역할:** AI 채팅 기능을 제공하는 재사용 가능한 모달 컴포넌트입니다. `/surf` 페이지에서 사용됩니다.
-   **주요 기능:**
    -   `Dialog` 컴포넌트를 기반으로 한 팝업 UI를 가집니다.
    -   사용자 입력을 위한 `Input`과 '전송' `Button`을 포함합니다.
    -   `isLoading`, `error`, `response` 등의 내부 상태를 관리하여 API 요청 상태를 표시합니다.
    -   '전송' 버튼 클릭 시 `apiClient`를 통해 백엔드의 `/langchain/chat` 엔드포인트를 호출합니다.
    -   AI의 답변을 스크롤 가능한 영역에 표시합니다.