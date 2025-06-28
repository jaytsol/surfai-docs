⚙️ 인프라 구성 및 배포 가이드
최종 업데이트: 2025년 6월 29일

이 문서는 SurfAI 프로젝트의 클라우드 인프라 구성, 배포, 그리고 CI/CD 파이프라인 설정에 대한 전체 가이드를 제공합니다.

---

## 1. 개요

이 서비스는 프론트엔드와 백엔드 애플리케이션을 각각의 `Docker` 컨테이너로 빌드하여, `Google Cloud Run`에 배포합니다. CI/CD는 `GitHub Actions`를 통해 자동화되며, 인증은 `Workload Identity Federation`을 사용하여 안전하게 처리됩니다.

---

## 2. Google Cloud Platform (GCP) 설정

### 가. 프로젝트 및 API 활성화

-   **프로젝트 ID:** `surfai-463212`
-   배포를 위해, GCP 프로젝트에서 다음 API들이 반드시 **활성화(Enabled)**되어 있어야 합니다.
    -   **Cloud Run API:** 애플리케이션 배포 및 실행
    -   **Cloud Build API:** `Docker` 이미지 빌드
    -   **Artifact Registry API:** 빌드된 `Docker` 이미지 저장
    -   **IAM API (Identity and Access Management):** 권한 관리
    -   **IAM Service Account Credentials API:** 인증 토큰 생���

### 나. 서비스 계정 (Service Account) 설정

`GitHub Actions`가 배포 작업을 수행할 때 사용할 전용 "로봇 계정"입니다.

-   **서비스 계정 생성:**
    -   **이름:** `github-actions-deployer`
    -   **이메일 (자동 생성):** `github-actions-deployer@surfai-463212.iam.gserviceaccount.com`
-   **서비스 계정 자체의 역할 부여:**
    -   "IAM" 페이지에서 `github-actions-deployer` 계정을 찾아 다음 역할들을 부여합니다.
        -   `Cloud Run 관리자 (Cloud Run Admin)`
        -   `Cloud Build 편집자 (Cloud Build Editor)`
        -   `서비스 계정 사용자 (Service Account User)`

### 다. Workload Identity 제휴 (GitHub Actions 인증)

`GitHub Actions`가 비밀 키 없이 안전하게 GCP에 인증하도록 설정합니다.

-   **ID 풀(Pool) 생성:**
    -   **이름 / 풀 ID:** `github-actions-pool`
-   **OIDC 공급업체(Provider) 추가:**
    -   **공급업체 ID:** `github-actions-provider`
    -   **발급자 (URL):** `https://token.actions.githubusercontent.com`
    -   **속성 조건:** `assertion.repository_owner == 'jaytsol'`
-   **서비스 계정과 외부 ID 연결 (가장 중요):**
    -   `github-actions-deployer` 서비스 계정의 "권한" 탭으로 이동합니다.
    -   **"+ 액세스 권한 부여"**를 클릭���니다.
    -   **새 주 구성원:** `principalSet://iam.googleapis.com/projects/781704308120/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository_owner/jaytsol`
    -   **역할 부여:** 다음 두 가지 역할을 모두 추가하고 저장합니다.
        -   `워크로드 아이덴티티 사용자 (Workload Identity User)`
        -   `서비스 계정 토큰 생성자 (Service Account Token Creator)`

---

## 3. 애플리케이션 배포 (Cloud Run)

프론트엔드와 백엔드는 각각 별도의 `Cloud Run` 서비스로 배포됩니다.

### 가. 백엔드 (`surfai-backend`)

-   **배포 리전:** `asia-northeast1` (타이완)
-   **도메인:** `api.surfai.org`
-   **필수 환경 변수:**
    -   `NODE_ENV`: `production`
    -   `API_BASE_URL`: `https://api.surfai.org`
    -   `FRONTEND_URL`: `https://surfai.org`
    -   `ROOT_DOMAIN`: `surfai.org`
    -   `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`: 운영용 PostgreSQL (Supabase) 정보
    -   `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRATION_TIME`
    -   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
    -   `ADMIN_EMAILS`
    -   ...기타 `R2`, `ComfyUI` 관련 키

### 나. 프론트엔드 (`surfai-frontend`)

-   **배포 리전:** `asia-northeast1` (타이완)
-   **도메인:** `surfai.org`
-   **참고:** 프론트엔드의 환경 변수는 런타임이 아닌, **빌드 시점**에 주입되어야 합니다. (`GitHub Actions` 워크플로우의 `substitutions` 플래그를 통해 전달)

---

## 4. CI/CD (GitHub Actions)

### 가. GitHub 저장소 Secrets

각 리포지토리의 **"Settings" > "Secrets and variables" > "Actions"** 에서 다음 Secret들을 설정합니다.

-   **공통 Secret (프론트/백엔드 모두):**
    -   `GCP_PROJECT_ID`: `surfai-463212`
    -   `GCP_WORKLOAD_IDENTITY_PROVIDER`: `projects/781704308120/...` (Workload Identity 공급자의 전체 이름)
-   **프론트엔드 전용 Secret:**
    -   `NEXT_PUBLIC_API_URL`: `https://api.surfai.org`
    -   `NEXT_PUBLIC_WEBSOCKET_URL`: `wss://api.surfai.org/events`

### 나. 워크플로우 파일

-   각 리포지토리의 `.github/workflows/` 폴더에 `deploy-backend.yml`과 `deploy-frontend.yml`을 배치합니다.
-   이 파일들은 `main` 브랜치에 코드가 푸시될 때마다 자동으로 실행되어, `cloudbuild.yaml`을 참조하여 `Docker` 이미지를 빌드하고 `Cloud Run`에 배포합니다.
