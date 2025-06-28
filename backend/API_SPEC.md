# 📡 백엔드 API 명세서 (API Specification)

> **최종 업데이트:** 2025년 6월 29일
>
> 이 문서는 SurfAI 백엔드 API의 모든 엔드포인트, 요청/응답 형식, 그리고 인증 요구사항을 상세히 기술합니다.

---

## 1. 기본 정보

-   **API Base URL (운영):** `https://api.surfai.org`
-   **API Base URL (개발):** `http://localhost:3000`
-   **인증 방식:** 모든 보호된 API는 **HttpOnly 쿠키**에 담긴 JWT(Access Token)를 통해 인증됩니다. Swagger 테스트 시에는 "Authorize" 버튼에 `Bearer <token>` 형식으로 토큰을 입력해야 합니다.

---

## 2. 인증 (Authentication) API

> **Controller:** `AuthController`
> **Base Path:** `/auth`

### 2.1 일반 회원가입
-   **Endpoint:** `POST /register`
-   **설명:** 이메일, 비밀번호, 표시 이름을 사용하여 새로운 사용자를 생성합니다.
-   **인증:** 필요 없음 (Public)
-   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123!",
      "displayName": "서파이"
    }
    ```
-   **Successful Response (`201 Created`):**
    -   생성된 사용자 정보를 반환합니다 (비밀번호 등 민감 정보 제외).
    -   **Body:** `UserResponseDTO`
-   **Error Responses:**
    -   `400 Bad Request`: 입력 값 유효성 검사 실패 (예: 이메일 형식 오류, 비밀번호 길이 부족).
    -   `409 Conflict`: 이미 존재하는 이메일일 경우.

### 2.2 일반 로그인
-   **Endpoint:** `POST /login`
-   **설명:** 이메일과 비밀번호로 사용자를 인증하고, Access Token과 Refresh Token을 HttpOnly 쿠키로 설정합니다.
-   **인증:** 필요 없음 (Public)
-   **Request Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "password123!"
    }
    ```
-   **Successful Response (`200 OK`):**
    -   로그인한 사용자 정보와 Access Token을 반환합니다.
    -   **Body:** `LoginResponseDTO`
-   **Error Responses:**
    -   `401 Unauthorized`: 이메일 또는 비밀번호가 일치하지 않을 경우.

### 2.3 Google 로그인 시작
-   **Endpoint:** `GET /google`
-   **설명:** 사용자를 Google의 OAuth 2.0 인증 페이지로 리디렉션시킵니다.
-   **인증:** 필요 없음 (Public)
-   **Successful Response (`302 Found`):**
    -   Google 로그인 페이지로 리디렉션됩니다.

### 2.4 Google 로그인 콜백
-   **Endpoint:** `GET /google/callback`
-   **설명:** Google 인증 성공 후 호출되는 콜백 URL입니다. 내부적으로 로그인 처리를 완료하고 토큰을 쿠키로 설정한 뒤, 프론트엔드의 최종 목적지로 리디렉션합니다.
-   **인증:** Google에 의해 처리됨.
-   **Successful Response (`302 Found`):**
    -   프론트엔드의 히스토리 페이지(`FRONTEND_URL/history`)로 리디렉션됩니다.

### 2.5 Access Token 재발급
-   **Endpoint:** `POST /refresh`
-   **설명:** 유효한 Refresh Token 쿠키를 사용하여 만료된 Access Token을 재발급받습니다.
-   **인증:** **Refresh Token 필요** (`JwtRefreshGuard` 사용)
-   **Successful Response (`200 OK`):**
    -   새로운 Access/Refresh Token이 HttpOnly 쿠키로 재설정됩니다.
    -   **Body:** `{ "message": "Tokens refreshed successfully" }`
-   **Error Responses:**
    -   `401 Unauthorized`: Refresh Token이 유효하지 않거나 만료된 경우.

### 2.6 내 정보 조회
-   **Endpoint:** `GET /profile`
-   **설명:** 현재 로그인된 사용자의 상세 프로필 정보를 조회합니다.
-   **인증:** **Access Token 필요** (`JwtAuthGuard` 사용)
-   **Successful Response (`200 OK`):**
    -   **Body:** `UserResponseDTO`
-   **Error Responses:**
    -   `401 Unauthorized`: 유효한 Access Token이 없을 경우.

### 2.7 로그아웃
-   **Endpoint:** `POST /logout`
-   **설명:** DB에 저장된 사용자의 Refresh Token을 무효화하고, 브라우저의 토큰 쿠키를 삭제합니다.
-   **인증:** **Access Token 필요** (`JwtAuthGuard` 사용)
-   **Successful Response (`204 No Content`):**
    -   응답 본문 없음.

---

## 3. 생성 결과물 (히스토리) API

> **Controller:** `GeneratedOutputController`
> **Base Path:** `/my-outputs`
> **인증:** 모든 API는 **Access Token**이 필요합니다.

### 3.1 나의 생성 기록 목록 조회
-   **Endpoint:** `GET /`
-   **Query Parameters:**
    -   `page: number` (선택, 기본값 1)
    -   `limit: number` (선택, 기본값 12)
-   **Successful Response (`200 OK`):**
    -   페이지네이션된 히스토리 목록을 반환합니다. 각 아이템에는 표시용 `viewUrl`이 포함됩니다.
    -   **Body:** `PaginatedHistoryResponse`

### 3.2 표시용 URL 요청
-   **Endpoint:** `GET /:id/view-url`
-   **설명:** 특정 결과물을 `<img>`나 `<video>` 태그에 표시하기 위한 단기 유효 URL을 요청합니다.
-   **Successful Response (`200 OK`):**
    -   **Body:** `{ "viewUrl": "https://..." }`

### 3.3 다운로드용 URL 요청
-   **Endpoint:** `GET /:id/download-url`
-   **설명:** 특정 결과물을 파일로 다운로드하기 위한 단기 유효 URL을 요청합니다.
-   **Successful Response (`200 OK`):**
    -   **Body:** `{ "downloadUrl": "https://..." }`

### 3.4 생성 기록 삭제
-   **Endpoint:** `DELETE /:id`
-   **설명:** 특정 생성 기록을 DB에서 삭제하고, R2 스토리지의 관련 파일도 함께 삭제합니다.
-   **Successful Response (`204 No Content`):**
    -   응답 본문 없음.

---

## 4. 관리자 (Admin) API

> **Controller:** `AdminWorkflowController`
> **Base Path:** `/admin/workflows`
> **인증:** 모든 API는 **Access Token** 및 **Admin 역할**이 필요합니다.

### 4.1 워크플로우 템플릿 목록 조회
-   **Endpoint:** `GET /`
-   **설명:** 모든 워크플로우 템플릿 목록을 조회합니다.
-   **Successful Response (`200 OK`):**
    -   **Body:** `WorkflowTemplateResponseDTO[]`

*(향후 여기에 워크플로우 템플릿 생성/수정/삭제 API 명세가 추가됩니다.)*