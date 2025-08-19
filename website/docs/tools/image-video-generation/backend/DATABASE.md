# 데이터베이스 스키마
🗄️ 데이터베이스 스키마: SurfAI
최종 업데이트: 2025년 6월 29일

이 문서는 SurfAI 프로젝트의 PostgreSQL 데이터베이스 스키마, 주요 테이블, 그리고 테이블 간의 관계를 상세히 설명합니다. 모든 테이블과 컬럼은 TypeORM 엔티티를 기준으로 정의됩니다.

## 1. 개요

- **데이터베이스 시스템:** PostgreSQL
- **ORM:** TypeORM
- **주요 엔티티:** `User`, `Workflow`, `GeneratedOutput`

---

## 2. 테이블 상세 명세

### 가. `users` 테이블

사용자의 계정 정보를 저장하는 핵심 테이블입니다. Google 로그인과 일반 이메일/비밀번호 로그인을 모두 지원하는 하이브리드 구조를 가집니다.

| 컬럼명                      | 타입             | 제약 조건                  | 설명                                                       |
| --------------------------- | ---------------- | -------------------------- | ---------------------------------------------------------- |
| `id`                        | `integer`        | **PK**, Auto-increment     | 사용자의 고유 식별자                                       |
| `email`                     | `varchar`        | **Unique**                 | 사용자의 이메일 주소. 로그인 ID로 사용됩니다.              |
| `displayName`               | `varchar`        | Not Null                   | 사용자에게 보여질 이름 (닉네임).                           |
| `password`                  | `varchar`        | Nullable, `Select=false`   | 일반 회원가입 시 사용된 비밀번호의 bcrypt 해시값.          |
| `googleId`                  | `varchar`        | Unique, Nullable           | Google 로그인 시 사용자의 고유 Google ID.                  |
| `imageUrl`                  | `varchar(2048)`  | Nullable                   | 사용자의 프로필 사진 URL. (Google 또는 기본 이미지)        |
| `role`                      | `enum`           | Not Null, Default=`'user'` | 사용자의 역할. (`admin` 또는 `user`)                       |
| `currentHashedRefreshToken` | `varchar`        | Nullable, `Select=false`   | JWT Refresh Token의 bcrypt 해시값. 로그아웃 시 NULL로 설정. |
| `coinBalance`               | `integer`        | Not Null, Default=`0`      | 사용자의 현재 코인 잔액.                                   |
| `createdAt`                 | `timestamptz`    | Not Null                   | 레코드 생성 시각 (자동 생성)                               |
| `updatedAt`                 | `timestamptz`    | Not Null                   | 레코드 마지막 수정 시각 (자동 업데이트)                    |

### 나. `coin_transactions` 테이블

사용자의 코인 거래 내역을 기록하는 테이블입니다. 코인 획득 및 소모에 대한 모든 기록이 저장됩니다.

| 컬럼명           | 타입      | 제약 조건                               | 설명                                                                 |
| ---------------- | --------- | --------------------------------------- | -------------------------------------------------------------------- |
| `id`             | `integer` | **PK**, Auto-increment                  | 코인 거래 내역의 고유 식별자                                         |
| `userId`         | `integer` | Not Null, **FK** (`users.id`)           | 거래를 수행한 사용자의 ID.                                           |
| `type`           | `enum`    | Not Null                                | 거래 유형 (`gain` 또는 `deduct`).                                    |
| `amount`         | `integer` | Not Null                                | 변동된 코인 양 (항상 양수).                                          |
| `reason`         | `enum`    | Not Null                                | 거래 이유 (`purchase`, `promotion`, `admin_adjustment`, `image_generation`, `video_generation` 등). |
| `relatedEntityId`| `varchar` | Nullable                                | 관련 엔티티의 ID (예: 이미지 생성 시 `generated_output.id`).         |
| `currentBalance` | `integer` | Not Null                                | 이 거래 후 사용자의 최종 코인 잔액.                                  |
| `createdAt`      | `timestamptz` | Not Null                                | 레코드 생성 시각.                                                    |

### 다. `workflows` 테이블

워크플로우 "템플릿"과, 사용자가 파라미터를 저장한 "나만의 워크플로우" 인스턴스를 모두 관리하는 테이블입니다.

| 컬럼명               | 타입      | 제약 조건                               | 설명                                                                 |
| -------------------- | --------- | --------------------------------------- | -------------------------------------------------------------------- |
| `id`                 | `integer` | **PK**, Auto-increment                  | 워크플로우의 고유 식별자                                             |
| `name`               | `varchar` | Not Null                                | 워크플로우 템플릿 또는 인스턴스의 이름.                              |
| `description`        | `text`    | Nullable                                | 워크플로우에 대한 상세 설명.                                         |
| `category`           | `varchar` | Nullable                                | 템플릿 카테고리 (예: `image`, `video`).                              |
| `definition`         | `jsonb`   | Nullable                                | ComfyUI의 원본 워크플로우 API 포맷 JSON.                             |
| `parameter_map`      | `jsonb`   | Nullable                                | 동적 파라미터와 실제 노드를 매핑하는 정보.                           |
| `previewImageUrl`    | `text`    | Nullable                                | 목록에서 보여줄 템플릿의 미리보기 이미지 URL.                        |
| `tags`               | `text[]`  | Nullable                                | 템플릿 분류를 위한 태그 배열.                                        |
| `cost`               | `integer` | Not Null, Default=`1`                   | 이 워크플로우 템플릿을 사용하는 데 필요한 코인 비용.                 |
| `isPublicTemplate`   | `boolean` | Not Null, Default=`false`               | `true`이면 모든 사용자에게 공개되는 템플릿.                          |
| `user_parameter_values` | `jsonb`   | Nullable                                | 사용자 정의 파라미터 값.                                             |
| `isTemplate`         | `boolean` | Not Null, Default=`true`                | `true`이면 관리자가 만든 템플릿, `false`이면 사용자 인스턴스.        |
| `ownerUserId`        | `integer` | Nullable, **FK** (`users.id`)           | 이 워크플로우의 소유자 ID.                                           |
| `sourceTemplateId`   | `integer` | Nullable, **FK** (`workflows.id`)       | 이 워크플로우가 파생된 원본 템플릿의 ID.                             |
| `createdAt`          | `timestamptz` | Not Null                                | 레코드 생성 시각                                                     |
| `updatedAt`          | `timestamptz` | Not Null                                | 레코드 마지막 수정 시각                                              |

### 라. `generated_outputs` 테이블

사용자가 생성한 모든 결과물(이미지/비디오)에 대한 메타데이터를 저장하는 테이블입니다.

| 컬럼명              | 타입             | 제약 조건                       | 설명                                                         |
| ------------------- | ---------------- | ------------------------------- | ------------------------------------------------------------ |
| `id`                | `integer`        | **PK**, Auto-increment          | 생성 결과물의 고유 식별자                                    |
| `ownerUserId`       | `integer`        | Not Null, **FK** (`users.id`)   | 이 결과물을 생성한 사용자의 ID.                              |
| `sourceWorkflowId`  | `integer`        | Not Null, **FK** (`workflows.id`) | 생성에 사용된 워크플로우의 ID.                               |
| `r2Url`             | `varchar(2048)`  | Not Null                        | Cloudflare R2에 저장된 실제 파일의 고유 경로 URL.            |
| `originalFilename`  | `varchar`        | Not Null                        | ComfyUI가 생성한 원본 파일 이름.                             |
| `mimeType`          | `varchar`        | Not Null                        | 파일의 MIME 타입. (예: `image/png`, `video/mp4`)             |
| `promptId`          | `varchar`        | Not Null, **Index**             | 생성 작업을 식별하는 ComfyUI의 프롬프트 ID.                  |
| `usedParameters`    | `jsonb`          | Nullable                        | 생성 시 사용자가 입력한 동적 파라미터 값들의 기록.           |
| `duration`          | `float`          | Nullable                        | 결과물이 비디오일 경우, 초 단위 재생 시간.                   |
| `createdAt`         | `timestamptz`    | Not Null                        | 레코드 생성 시각                                             |

### 마. `social_connections` 테이블

사용자가 연동한 여러 SNS 계정 정보를 저장하는 테이블입니다.

| 컬럼명 | 타입 | 제약 조건 | 설명 |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | **PK**, Auto-increment | 고유 식별자 |
| `userId` | `integer` | Not Null, **FK** (`users.id`) | SurfAI 사용자 ID |
| `platform` | `enum` | Not Null | SNS 플랫폼 (`YOUTUBE`, `INSTAGRAM`, `X` 등) |
| `platformUsername` | `varchar` | Not Null | 해당 SNS에서의 사용자 이름 |
| `accessToken` | `varchar` | Not Null, Encrypted | API 요청에 사용할 Access Token |
| `refreshToken` | `varchar` | Nullable, Encrypted | Access Token 재발급에 사용할 Refresh Token |
| `connectedAt` | `timestamptz`| Not Null | 연동된 시각 |

---

## 3. 테이블 관계 (ERD 요약)

-   **User (1) : (N) SocialConnection:** 한 명의 사용자는 여러 개의 SNS 계정을 연동할 수 있습니다.
-   **User (1) : (N) Workflow:** 한 명의 사용자는 여러 개의 워크플로우 인스턴스를 소유할 수 있습니다.
-   **User (1) : (N) GeneratedOutput:** 한 명의 사용자는 여러 개의 결과물을 생성할 수 있습니다.
-   **User (1) : (N) CoinTransaction:** 한 명의 사용자는 여러 개의 코인 거래 내역을 가질 수 있습니다.
-   **Workflow (1) : (N) Workflow:** 하나의 워크플로우 템플릿은 여러 개의 사용자 인스턴스를 가질 수 있습니다. (자기 참조 관계)
-   **Workflow (1) : (N) GeneratedOutput:** 하나의 워크플로우는 여러 개의 결과물을 생성하는 데 사용될 수 있습니다.

---

## 4. TypeORM 마이그레이션

SurfAI 백엔드는 데이터베이스 스키마 관리를 위해 TypeORM 마이그레이션을 사용합니다. 개발 환경에서 `synchronize: true`를 사용하는 대신, 프로덕션 환경의 안정성과 데이터 무결성을 위해 마이그레이션 방식을 채택했습니다.

### 4.1. 마이그레이션 설정

`comfy-surfai-backend/src/app.module.ts` 파일에서 TypeORM 설정은 다음과 같이 구성됩니다.

```typescript
TypeOrmModule.forRoot({
  // ... 기존 설정 ...
  synchronize: false, // 프로덕션 환경에서는 반드시 false로 설정
  migrations: [__dirname + '/migrations/**/*.js'], // 마이그레이션 파일 경로
  cli: {
    migrationsDir: 'src/migrations', // TypeORM CLI가 마이그레이션 파일을 생성할 경로
  },
}),
```

### 4.2. 마이그레이션 명령어

`comfy-surfai-backend` 디렉토리에서 다음 명령어를 사용하여 마이그레이션을 관리할 수 있습니다.

#### 가. 마이그레이션 파일 생성

엔티티 변경 사항을 기반으로 새로운 마이그레이션 파일을 생성합니다.

```bash
npm run typeorm migration:generate -- -n <MigrationName>
# 예시: npm run typeorm migration:generate -- -n UserTableUpdate
```

#### 나. 마이그레이션 실행

생성된 마이그레이션 파일을 데이터베이스에 적용합니다.

```bash
npm run typeorm migration:run
```

#### 다. 마이그레이션 롤백

가장 최근에 적용된 마이그레이션을 롤백합니다.

```bash
npm run typeorm migration:revert
```