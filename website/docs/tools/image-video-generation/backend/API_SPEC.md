# API 명세

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
-   **Request Body:** `CreateUserDTO`
-   **Successful Response (`201 Created`):** `UserResponseDTO`
-   **Error Responses:** `400 Bad Request`, `409 Conflict`

### 2.2 일반 로그인
-   **Endpoint:** `POST /login`
-   **설명:** 이메일과 비밀번호로 사용자를 인증하고, Access Token과 Refresh Token을 HttpOnly 쿠키로 설정합니다.
-   **인증:** 필요 없음 (Public)
-   **Request Body:** `LoginDTO`
-   **Successful Response (`200 OK`):** `LoginResponseDTO`
-   **Error Responses:** `401 Unauthorized`

### 2.3 Google 로그인 시작
-   **Endpoint:** `GET /google`
-   **설명:** 사용자를 Google의 OAuth 2.0 인증 페이지로 리디렉션시킵니다.
-   **Successful Response (`302 Found`):** Google 로그인 페이지로 리디렉션.

### 2.4 Google 로그인 콜백
-   **Endpoint:** `GET /google/callback`
-   **설명:** Google 인증 성공 후 호출되는 콜백 URL. 로그인 처리 후 프론트엔드로 리디렉션합니다.
-   **Successful Response (`302 Found`):** 프론트엔드 페이지로 리디렉션.

### 2.5 Access Token 재발급
-   **Endpoint:** `POST /refresh`
-   **설명:** 유효한 Refresh Token을 사용하여 만료된 Access Token을 재발급받습니다.
-   **인증:** Refresh Token 필요
-   **Successful Response (`200 OK`):** `{ "message": "Tokens refreshed successfully" }`

### 2.6 내 정보 조회
-   **Endpoint:** `GET /profile`
-   **설명:** 현재 로그인된 사용자의 상세 프로필 정보를 조회합니다.
-   **인증:** Access Token 필요
-   **Successful Response (`200 OK`):** `UserResponseDTO`

### 2.7 로그아웃
-   **Endpoint:** `POST /logout`
-   **설명:** 사용자의 Refresh Token을 무효화하고 쿠키를 삭제합니다.
-   **인증:** Access Token 필요
-   **Successful Response (`204 No Content`):** 응답 본문 없음.

---

## 3. 생성 결과물 (히스토리) API

> **Controller:** `GeneratedOutputController`
> **Base Path:** `/my-outputs`
> **인증:** 모든 API는 **Access Token**이 필요합니다.

### 3.1 나의 생성 기록 목록 조회
-   **Endpoint:** `GET /`
-   **Query Parameters:** `page: number`, `limit: number`
-   **Successful Response (`200 OK`):** `PaginatedHistoryResponse`

### 3.2 표시용 URL 요청
-   **Endpoint:** `GET /:id/view-url`
-   **설명:** 특정 결과물을 표시하기 위한 단기 유효 URL을 요청합니다.
-   **Successful Response (`200 OK`):** `{ "viewUrl": "https://..." }`

### 3.3 다운로드용 URL 요청
-   **Endpoint:** `GET /:id/download-url`
-   **설명:** 특정 결과물을 다운로드하기 위한 단기 유효 URL을 요청합니다.
-   **Successful Response (`200 OK`):** `{ "downloadUrl": "https://..." }`

### 3.4 생성 기록 삭제
-   **Endpoint:** `DELETE /:id`
-   **설명:** 특정 생성 기록과 관련 파일을 삭제합니다.
-   **Successful Response (`204 No Content`):** 응답 본문 없음.

---

## 4. 관리자 - 워크플로우 템플릿 API

> **Controller:** `AdminWorkflowController`
> **Base Path:** `/workflow-templates`
> **인증:** 모든 API는 **Access Token** 및 **Admin 역할**이 필요합니다.

### 4.1 워크플로우 카테고리 목록 조회
-   **Endpoint:** `GET /categories`
-   **설명:** 템플릿 생성 시 사용할 수 있는 모든 워크플로우 카테고리 목록을 조회합니다.
-   **Successful Response (`200 OK`):** `string[]`

### 4.2 파라미터 사전 설정(Preset) 목록 조회
-   **Endpoint:** `GET /parameter-presets`
-   **Query Parameters:** `category: string` (선택)
-   **Successful Response (`200 OK`):** `ParameterPreset[]`

### 4.3 [1단계] 새 워크플로우 템플릿 생성 (뼈대)
-   **Endpoint:** `POST /`
-   **설명:** `parameter_map`을 제외한 템플릿의 기본 정보를 저장하여 뼈대를 생성합니다.
-   **Request Body:** `CreateWorkflowTemplateDTO`
-   **Successful Response (`201 Created`):** `WorkflowTemplateResponseDTO`

### 4.4 [2단계] 파라미터 맵 설정
-   **Endpoint:** `PUT /:id/parameter-map`
-   **설명:** 생성된 템플릿에 파라미터 맵 정보를 설정(전체 교체)합니다.
-   **Request Body:** `Record<string, WorkflowParameterMappingItemDTO>`
-   **Successful Response (`200 OK`):** `WorkflowTemplateResponseDTO`

### 4.5 전체 워크플로우 템플릿 정보 수정
-   **Endpoint:** `PATCH /:id`
-   **설명:** 특정 템플릿의 모든 정보를 한 번에 수정합니다.
-   **Request Body:** `Partial<CreateWorkflowTemplateDTO & { parameter_map: ... }>`
-   **Successful Response (`200 OK`):** `WorkflowTemplateResponseDTO`

### 4.6 워크플로우 템플릿 목록 조회
-   **Endpoint:** `GET /`
-   **Successful Response (`200 OK`):** `WorkflowTemplateResponseDTO[]`

### 4.7 특정 워크플로우 템플릿 상세 조회
-   **Endpoint:** `GET /:id`
-   **Successful Response (`200 OK`):** `WorkflowTemplateResponseDTO`

### 4.8 워크플로우 템플릿 삭제
-   **Endpoint:** `DELETE /:id`
-   **Successful Response (`204 No Content`):** 응답 본문 없음.

---

## 5. 코인 (Coin) API

### 5.1 일반 사용자 - 코인 차감

> **Controller:** `CoinController`
> **Base Path:** `/coin`
> **인증:** Access Token 필요

-   **Endpoint:** `POST /deduct`
-   **설명:** 로그인된 사용자의 코인을 차감합니다. 이미지 생성과 같은 서비스 이용 시 사용됩니다.
-   **Request Body:** `DeductCoinDto`
    ```json
    {
      "amount": 100, // 차감할 코인 양
      "reason": "image_generation", // 차감 이유 (CoinTransactionReason enum 값 중 하나)
      "relatedEntityId": "uuid-of-generation-request" // (선택 사항) 관련 엔티티 ID
    }
    ```
-   **Successful Response (`200 OK`):** `User` (업데이트된 사용자 정보)
-   **Error Responses:** `400 Bad Request` (유효성 검사 실패), `402 Payment Required` (코인 잔액 부족)

### 5.2 관리자 - 사용자 코인 관리

> **Controller:** `AdminCoinController`
> **Base Path:** `/admin/coin`
> **인증:** Access Token 및 Admin 역할 필요

#### 5.2.1 사용자 코인 추가
-   **Endpoint:** `POST /add/:userId`
-   **설명:** 특정 사용자에게 코인을 추가합니다.
-   **Request Body:** `UpdateUserCoinDto`
    ```json
    {
      "amount": 100, // 추가할 코인 양
      "reason": "admin_adjustment" // 추가 이유 (CoinTransactionReason enum 값 중 하나)
    }
    ```
-   **Successful Response (`200 OK`):** `User` (업데이트된 사용자 정보)
-   **Error Responses:** `400 Bad Request` (유효성 검사 실패), `404 Not Found` (사용자 없음)

#### 5.2.2 사용자 코인 차감
-   **Endpoint:** `POST /deduct/:userId`
-   **설명:** 특정 사용자에게서 코인을 차감합니다.
-   **Request Body:** `UpdateUserCoinDto`
    ```json
    {
      "amount": 50, // 차감할 코인 양
      "reason": "admin_adjustment" // 차감 이유 (CoinTransactionReason enum 값 중 하나)
    }
    ```
-   **Successful Response (`200 OK`):** `User` (업데이트된 사용자 정보)
-   **Error Responses:** `400 Bad Request` (유효성 검사 실패), `402 Payment Required` (코인 잔액 부족), `404 Not Found` (사용자 없음)

---

## 6. 소셜 연동 및 게시 API

> **Controller:** `ConnectController`, `GeneratedOutputController`
> **인증:** 모든 API는 **Access Token**이 필요합니다.

### 6.1 SNS 계정 연동 시작
-   **Endpoint:** `GET /connect/:platform`
-   **설명:** 사용자를 지정된 플랫폼(예: `youtube`, `x`)의 OAuth 2.0 인증 페이지로 리디렉션시킵니다.
-   **Successful Response (`302 Found`):** 해당 플랫폼의 인증 페이지로 리디렉션.

### 6.2 SNS 계정 연동 콜백
-   **Endpoint:** `GET /connect/:platform/callback`
-   **설명:** 플랫폼 인증 성공 후 호출되는 콜백 URL. 백엔드에서 토큰을 교환하고 연동 정보를 DB에 저장합니다.
-   **Successful Response (`200 OK`):** 연동 성공/실패를 알리는 정적 페이지로 리디렉션.

### 6.3 연동된 계정 목록 조회
-   **Endpoint:** `GET /connections`
-   **설명:** 현재 로그인된 사용자가 연동한 모든 SNS 플랫폼의 목록을 조회합니다.
-   **Successful Response (`200 OK`):** `string[]` (예: `["YOUTUBE", "X"]`)

### 6.4 SNS 계정 연동 해제
-   **Endpoint:** `POST /disconnect/:platform`
-   **설명:** 지정된 플랫폼과의 연동을 해제하고 관련 정보를 DB에서 삭제합니다.
-   **Successful Response (`204 No Content`):** 응답 본문 없음.

### 6.5 결과물 SNS에 게시 요청
-   **Endpoint:** `POST /my-outputs/:id/publish`
-   **설명:** 특정 생성 결과물을 지정된 SNS 플랫폼들에 게시하도록 요청합니다. 실제 업로드는 백그라운드에서 처리됩니다.
-   **Request Body:**
    ```json
    {
      "platforms": ["YOUTUBE", "X"] 
    }
    ```
-   **Successful Response (`202 Accepted`):** `{ "message": "SNS 게시 작업이 시작되었습니다." }`

---

## 7. LangChain (LLM) API

> **Controller:** `LangchainController`
> **Base Path:** `/langchain`
> **인증:** 모든 API는 **Access Token**이 필요합니다.

### 7.1 AI 채팅
-   **Endpoint:** `POST /chat`
-   **설명:** 사용자로부터 받은 프롬프트를 FastAPI 서버로 전달하여 LLM의 답변을 받아옵니다.
-   **인증:** Access Token 필요 (JwtAuthGuard)
-   **Request Body:** `CreateChatDto`
    ```json
    {
      "prompt": "AI 시의 미래에 대해 한 문장으로 써줘"
    }
    ```
-   **Successful Response (`200 OK`):** 
    ```json
    {
      "response": "AI 시는 인간의 창의성과 기계의 무한한 가능성이 결합된 새로운 예술 형태로 발전할 것입니다."
    }
    ```
-   **Error Responses:** `401 Unauthorized`