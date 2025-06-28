🗄️ 데이터베이스 스키마: SurfAI
최종 업데이트: 2025년 6월 29일

이 문서는 SurfAI 프로젝트의 PostgreSQL 데이터베이스 스키마, 주요 테이블, 그리고 테이블 간의 관계를 상세히 설명합니다. 모든 테이블과 컬럼은 TypeORM 엔티티를 기준으로 정의됩니다.

1. 개요
데이터베이스 시스템: PostgreSQL

ORM: TypeORM

주요 엔티티: User, Workflow, GeneratedOutput

2. 테이블 상세 명세
가. users 테이블
사용자의 계정 정보를 저장하는 핵심 테이블입니다. Google 로그인과 일반 이메일/비밀번호 로그인을 모두 지원하는 하이브리드 구조를 가집니다.

id: integer

PK, Auto-increment

설명: 사용자의 고유 식별자

email: varchar

Unique

설명: 사용자의 이메일 주소. 로그인 ID로 사용됩니다.

displayName: varchar

Not Null

설명: 사용자에게 보여질 이름 (닉네임).

password: varchar

Nullable, Select=false

설명: 일반 회원가입 시 사용된 비밀번호의 bcrypt 해시값.

googleId: varchar

Unique, Nullable

설명: Google 로그인 시 사용자의 고유 Google ID.

imageUrl: varchar(2048)

Nullable

설명: 사용자의 프로필 사진 URL. (Google 또는 기본 이미지)

role: enum

Not Null, Default='user'

설명: 사용자의 역할. (admin 또는 user)

currentHashedRefreshToken: varchar

Nullable, Select=false

설명: JWT Refresh Token의 bcrypt 해시값. 로그아웃 시 NULL로 설정됩니다.

createdAt: timestamptz

Not Null

설명: 레코드 생성 시각 (자동 생성)

updatedAt: timestamptz

Not Null

설명: 레코드 마지막 수정 시각 (자동 업데이트)

나. workflows 테이블
워크플로우 "템플릿"과, 사용자가 파라미터를 저장한 "나만의 워크플로우" 인스턴스를 모두 관리하는 테이블입니다.

id: integer - PK, Auto-increment - 워크플로우의 고유 식별자

name: varchar - Not Null - 워크플로우 템플릿 또는 인스턴스의 이름.

description: text - Nullable - 워크플로우에 대한 상세 설명.

definition: jsonb - Nullable - ComfyUI의 원본 워크플로우 API 포맷 JSON. (주로 isTemplate: true일 때 사용)

parameter_map: jsonb - Nullable - 동적 파라미터와 실제 노드를 매핑하는 정보.

previewImageUrl: text - Nullable - 목록에서 보여줄 템플릿의 미리보기 이미지 URL.

tags: text[] - Nullable - 템플릿 분류를 위한 태그 배열.

isTemplate: boolean - Not Null, Default=true - true이면 관리자가 만든 템플릿, false이면 사용자가 저장한 인스턴스.

isPublicTemplate: boolean - Not Null, Default=false - true이면 모든 사용자에게 공개되는 템플릿.

ownerUserId: integer - Nullable, FK (users.id) - 이 워크플로우의 소유자 ID.

sourceTemplateId: integer - Nullable, FK (workflows.id) - 이 워크플로우가 파생된 원본 템플릿의 ID. (isTemplate: false일 때 사용)

createdAt: timestamptz - Not Null - 레코드 생성 시각

updatedAt: timestamptz - Not Null - 레코드 마지막 수정 시각

다. generated_outputs 테이블
사용자가 생성한 모든 결과물(이미지/비디오)에 대한 메타데이터를 저장하는 테이블입니다.

id: integer - PK, Auto-increment - 생성 결과물의 고유 식별자

ownerUserId: integer - Not Null, FK (users.id) - 이 결과물을 생성한 사용자의 ID.

sourceWorkflowId: integer - Not Null, FK (workflows.id) - 생성에 사용된 워크플로우의 ID.

r2Url: varchar(2048) - Not Null - Cloudflare R2에 저장된 실제 파일의 고유 경로 URL.

originalFilename: varchar - Not Null - ComfyUI가 생성한 원본 파일 이름.

mimeType: varchar - Not Null - 파일의 MIME 타입. (예: image/png, video/mp4)

promptId: varchar - Not Null, Index - 생성 작업을 식별하는 ComfyUI의 프롬프트 ID.

usedParameters: jsonb - Nullable - 생성 시 사용자가 입력한 동적 파라미터 값들의 기록.

duration: float - Nullable - 결과물이 비디오일 경우, 초 단위 재생 시간.

createdAt: timestamptz - Not Null - 레코드 생성 시각

3. 테이블 관계 (ERD 요약)
User (1) : (N) Workflow: 한 명의 사용자는 여러 개의 워크플로우 인스턴스를 소유할 수 있습니다.

User (1) : (N) GeneratedOutput: 한 명의 사용자는 여러 개의 결과물을 생성할 수 있습니다.

Workflow (1) : (N) Workflow: 하나의 워크플로우 템플릿은 여러 개의 사용자 인스턴스를 가질 수 있습니다. (자기 참조 관계)

Workflow (1) : (N) GeneratedOutput: 하나의 워크플로우는 여러 개의 결과물을 생성하는 데 사용될 수 있습니다.