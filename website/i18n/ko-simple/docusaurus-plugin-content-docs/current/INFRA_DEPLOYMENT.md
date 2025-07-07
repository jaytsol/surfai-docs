# 서비스 운영 환경과 배포 방법
최종 업데이트: 2025년 6월 29일

이 문서는 SurfAI 프로젝트가 어떤 인터넷 환경에서 작동하고, 어떻게 서비스가 만들어져서 사용자에게 보여지는지, 그리고 코드를 고치면 자동으로 서비스에 반영되는 과정(자동 배포)에 대해 쉽게 설명해 드립니다.

---

## 1. 간단한 설명

우리 서비스는 웹사이트 화면(프론트엔드)과 뒤에서 일하는 프로그램(백엔드)을 각각 '도커(Docker)'라는 상자에 담아서 '구글 클라우드 런(Google Cloud Run)'이라는 곳에 올려서 사용합니다. 코드를 고치면 자동으로 서비스에 반영되는 과정은 '깃허브 액션(GitHub Actions)'이라는 도구로 자동화되어 있으며, 로그인 정보는 '워크로드 아이덴티티 제휴(Workload Identity Federation)'라는 안전한 방법으로 처리됩니다.

---

## 2. 구글 클라우드 플랫폼 (GCP) 설정

### 가. 프로젝트와 필요한 기능 켜기

-   **프로젝트 이름:** `surfai-463212`
-   서비스를 배포하려면, 구글 클라우드 프로젝트에서 다음 기능들이 반드시 **켜져 있어야(활성화)** 합니다.
    -   **클라우드 런 API:** 프로그램을 배포하고 실행하는 기능
    -   **클라우드 빌드 API:** '도커(Docker)' 상자를 만드는 기능
    -   **아티팩트 레지스트리 API:** 만들어진 '도커(Docker)' 상자를 저장하는 기능
    -   **IAM API (사용자 권한 관리):** 누가 어떤 기능을 쓸 수 있는지 권한을 관리하는 기능
    -   **IAM 서비스 계정 자격증명 API:** 로그인 정보를 만드는 기능

### 나. 서비스 계정 (자동으로 일하는 계정) 설정

'깃허브 액션(GitHub Actions)'이 서비스를 배포할 때 사용하는 특별한 '로봇 계정'입니다.

-   **서비스 계정 만들기:**
    -   **이름:** `github-actions-deployer`
    -   **이메일 (자동으로 만들어짐):** `github-actions-deployer@surfai-463212.iam.gserviceaccount.com`
-   **서비스 계정에 권한 주기:**
    -   'IAM' 페이지에서 `github-actions-deployer` 계정을 찾아서 다음 권한들을 줍니다.
        -   `클라우드 런 관리자 (Cloud Run Admin)`
        -   `클라우드 빌드 편집자 (Cloud Build Editor)`
        -   `서비스 계정 사용자 (Service Account User)`

### 다. 워크로드 아이덴티티 제휴 (깃허브 액션 로그인)

'깃허브 액션(GitHub Actions)'이 비밀번호 없이도 안전하게 구글 클라우드에 로그인할 수 있도록 설정하는 방법입니다.

-   **ID 풀(Pool) 만들기:**
    -   **이름 / 풀 ID:** `github-actions-pool`
-   **OIDC 제공자(Provider) 추가:**
    -   **제공자 ID:** `github-actions-provider`
    -   **주소 (URL):** `https://token.actions.githubusercontent.com`
    -   **조건:** `assertion.repository_owner == 'jaytsol'` (이 조건이 맞을 때만 로그인 허용)
-   **서비스 계정과 외부 ID 연결 (가장 중요):**
    -   `github-actions-deployer` 서비스 계정의 '권한' 탭으로 갑니다.
    -   **"+ 액세스 권한 주기"**를 누릅니다.
    -   **새로운 사용자:** `principalSet://iam.googleapis.com/projects/781704308120/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository_owner/jaytsol`
    -   **권한 주기:** 다음 두 가지 권한을 모두 추가하고 저장합니다.
        -   `워크로드 아이덴티티 사용자 (Workload Identity User)`
        -   `서비스 계정 토큰 생성자 (Service Account Token Creator)`

---

## 3. 프로그램 배포 (클라우드 런)

웹사이트 화면과 뒤에서 일하는 프로그램은 각각 따로 '클라우드 런(Cloud Run)' 서비스에 배포됩니다.

### 가. 뒤에서 일하는 프로그램 (백엔드) - `surfai-backend`

-   **배포 지역:** `asia-northeast1` (타이완)
-   **인터넷 주소:** `api.surfai.org`
-   **꼭 필요한 설정 값들 (환경 변수):**
    -   `NODE_ENV`: `production` (서비스 운영 모드)
    -   `API_BASE_URL`: `https://api.surfai.org` (뒤에서 일하는 프로그램의 주소)
    -   `FRONTEND_URL`: `https://surfai.org` (웹사이트 화면의 주소)
    -   `ROOT_DOMAIN`: `surfai.org` (서비스의 기본 인터넷 주소)
    -   `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`: 실제 사용하는 데이터베이스 정보
    -   `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRATION_TIME`: 로그인 정보 관련 비밀 키
    -   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`: 구글 로그인 관련 비밀 키
    -   `ADMIN_EMAILS`: 관리자 이메일 주소
    -   ...그 외 그림/영상 파일 저장소(`R2`), 그림/영상 만드는 프로그램(`ComfyUI`) 관련 비밀 키

### 나. 웹사이트 화면 (프론트엔드) - `surfai-frontend`

-   **배포 지역:** `asia-northeast1` (타이완)
-   **인터넷 주소:** `surfai.org`
-   **중요:** 웹사이트 화면의 설정 값들은 프로그램이 실행될 때가 아니라, **만들어질 때(빌드 시점)** 미리 넣어줘야 합니다. ('깃허브 액션(GitHub Actions)'에서 `substitutions`라는 기능을 사용해서 전달해요)

---

## 4. 자동 배포 (깃허브 액션)

### 가. 깃허브 저장소 비밀 값들 (Secrets)

각 프로그램 저장소의 **"설정" > "비밀 값과 변수" > "액션"**에서 다음 비밀 값들을 설정합니다.

-   **공통 비밀 값 (웹사이트와 뒤에서 일하는 프로그램 모두):**
    -   `GCP_PROJECT_ID`: `surfai-463212` (구글 클라우드 프로젝트 이름)
    -   `GCP_WORKLOAD_IDENTITY_PROVIDER`: `projects/781704308120/...` (로그인 제공자의 전체 이름)
-   **웹사이트 화면 전용 비밀 값:**
    -   `NEXT_PUBLIC_API_URL`: `https://api.surfai.org` (뒤에서 일하는 프로그램의 주소)
    -   `NEXT_PUBLIC_WEBSOCKET_URL`: `wss://api.surfai.org/events` (실시간 소통 주소)

### 나. 자동 배포 파일 (워크플로우 파일)

-   각 프로그램 저장소의 `.github/workflows/` 폴더에 `deploy-backend.yml`과 `deploy-frontend.yml` 파일을 놓습니다.
-   이 파일들은 `main`이라는 이름의 코드가 저장소에 올라올 때마다 자동으로 실행되어, '도커(Docker)' 상자를 만들고 '클라우드 런(Cloud Run)'에 배포합니다. 이때 `cloudbuild.yaml`이라는 파일을 참고합니다.