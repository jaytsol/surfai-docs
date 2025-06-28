⚙️ 백엔드 아키텍처 및 폴더 구조 (Backend)
최종 업데이트: 2025년 6월 29일

이 문서는 `comfy-surfai-backend` 리포지토리의 기술 스택, 아키텍처 원칙, 주요 폴더 구조, 그리고 실행 방법을 설명합니다.

---

## 1. 기술 스택 (Tech Stack)

-   **프레임워크:** `NestJS` (`@nestjs/core`)
-   **데이터베이스:** `PostgreSQL`
-   **ORM:** `TypeORM` (`@nestjs/typeorm`, `typeorm`, `pg`)
-   **인증 (Authentication):**
    -   **전략:** `Passport.js` (`@nestjs/passport`, `passport`)
    -   **JWT:** `JSON Web Token` (`@nestjs/jwt`, `passport-jwt`)
    -   **Google OAuth 2.0:** `passport-google-oauth20`
    -   **로컬(이메일/비밀번호):** `passport-local`
-   **실시간 통신:** `WebSocket` (`@nestjs/platform-ws`, `ws`)
-   **보안:**
    -   **비밀번호 해싱:** `bcrypt`
    -   **CSRF 방어:** `csurf`
    -   **쿠키 파싱:** `cookie-parser`
-   **유효성 검사:** `class-validator`, `class-transformer`
-   **API 문서화:** `Swagger` (`@nestjs/swagger`)

---

## 2. 아키텍처 원칙

백엔드는 **모듈(Module) 기반의 계층형 아키텍처(Layered Architecture)**를 따릅니다.

-   **모듈화:** 기능별로 책임을 명���히 나누기 위해 `AuthModule`, `WorkflowModule` 등 독립적인 모듈로 구성됩니다. 각 모듈은 자체적으로 `Controller`, `Service`, `Provider`를 가집니다.
-   **계층 분리:**
    -   **Controller:** `HTTP` 요청을 받고, 유효성을 검사한 뒤, 적절한 서비스 메소드를 호출하는 역할만 합니다. 비즈니스 로직을 포함하지 않습니다.
    -   **Service:** 핵심 비즈니스 로직을 처리합니다. 데이터베이스와 통신하거나 다른 서비스를 호출하는 등 실제 작업이 이루어집니다.
    -   **Repository/Entity:** 데이터베이스와의 상호작용을 추상화합니다. `TypeORM`이 이 역할을 담당합니다.
-   **의존성 주입 (DI):** 모든 의존성은 생성자 주입을 통해 관리되어, 컴포넌트 간의 결합도를 낮추고 테스트 용이성을 높입니다.

---

## 3. 주요 폴더 구조

```
/src
├── 📁 admin/              # 관리자 전용 기능 모듈
│   └── 📁 workflow/
├── 📁 auth/               # 인증/인가 (로그인, 가드, 전략) 관련 모듈
│   ├── 📁 guards/
│   └── 📁 strategies/
├── 📁 comfyui/            # ComfyUI 연산 서버와의 통신을 담당하는 모듈
├── 📁 common/             # 여러 모듈에서 공통으로 사용하�� 요소
│   ├── 📁 decorators/
│   ├── 📁 dto/            # 데이터 전송 객체 (Data Transfer Objects)
│   ├── 📁 entities/       # 데이터베이스 테이블과 매핑되는 TypeORM 엔티티
│   ├── 📁 enums/
│   ├── 📁 events/         # WebSocket 게이트웨이
│   └── 📁 interfaces/     # 타입 정의를 위한 인터페이스
├── 📁 generated-output/   # 생성된 결과물(히스토리) 관리 모듈
├── 📁 storage/            # 파일 스토리지(Cloudflare R2) 연동 모듈
├── 📁 workflow/           # 워크플로우 템플릿 관리 모듈
│
└── 📄 main.ts             # 애플리케이션의 진입점 (미들웨어, 파이프 등 설정)
```

---

## 4. 실행 및 테스트 방법

### 개발 환경 실행

1.  로컬에 `PostgreSQL` 데이터베이스를 설치하고 실행합니다.
2.  프로젝트 루트에 `.env.development` 파일을 생성하고 필요한 환경 변수(DB 정보, JWT 시크릿 등)를 설정합니다.
3.  `npm install` 명령어로 모든 의존성을 설치합니다.
4.  `npm run start:dev` 명령어로 개발 서버를 실행합니다. 서버는 `http://localhost:3000`에서 실행됩니다.

### 단위/통합 테스트 실행

-   프로젝트에 작성된 모든 테스트를 실행합니��.
    ```bash
    npm test
    ```

---

## 5. 주요 환경 변수

애플리케이션을 실행하기 위해 `.env` 파일 또는 운영 환경에 다음 변수들이 필요합니다.

-   **`NODE_ENV`**: `development` 또는 `production`
-   **`PORT`**: 서버 실행 포트 (기본값: `3000`)
-   **데이터베이스:** `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE` 또는 `DATABASE_URL`
-   **인증:** `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRATION_TIME`
-   **Google OAuth:** `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
-   **서비스 URL:** `API_BASE_URL` (백엔드 자신의 주소), `FRONTEND_URL` (프론트엔드 주소), `ROOT_DOMAIN` (운영용 공통 도메인)
-   **연산 서버:** `COMFYUI_HOST`, `NGINX_USERNAME`, `NGINX_PASSWORD`
-   **파일 스토리지:** `R2_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`
-   **관리자:** `ADMIN_EMAILS`
