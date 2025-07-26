# Service Operating Environment and Deployment Methods
Last Updated: June 29, 2025

This document provides a comprehensive guide to the cloud infrastructure configuration, deployment, and CI/CD pipeline setup for the SurfAI project.

---

## 1. Overview

This service builds frontend and backend applications as separate `Docker` containers and deploys them to `Google Cloud Run`. CI/CD is automated through `GitHub Actions`, and authentication is securely handled using `Workload Identity Federation`.

---

## 2. Google Cloud Platform (GCP) Setup

### A. Project and API Activation

-   **Project ID:** `surfai-463212`
-   For deployment, the following APIs must be **Enabled** in your GCP project:
    -   **Cloud Run API:** Deploy and run applications
    -   **Cloud Build API:** Build `Docker` images
    -   **Artifact Registry API:** Store built `Docker` images
    -   **IAM API (Identity and Access Management):** Manage permissions
    -   **IAM Service Account Credentials API:** Generate authentication tokens

### B. Service Account Setup

This is a dedicated "robot account" that `GitHub Actions` will use to perform deployment tasks.

-   **Create Service Account:**
    -   **Name:** `github-actions-deployer`
    -   **Email (auto-generated):** `github-actions-deployer@surfai-463212.iam.gserviceaccount.com`
-   **Grant Roles to Service Account:**
    -   On the "IAM" page, find the `github-actions-deployer` account and grant the following roles:
        -   `Cloud Run Admin`
        -   `Cloud Build Editor`
        -   `Service Account User`

### C. Workload Identity Federation (GitHub Actions Authentication)

Configures `GitHub Actions` to securely authenticate to GCP without secret keys.

-   **Create ID Pool:**
    -   **Name / Pool ID:** `github-actions-pool`
-   **Add OIDC Provider:**
    -   **Provider ID:** `github-actions-provider`
    -   **Issuer (URL):** `https://token.actions.githubusercontent.com`
    -   **Attribute Condition:** `assertion.repository_owner == 'jaytsol'`
-   **Connect Service Account to External ID (Most Important):**
    -   Go to the "Permissions" tab of the `github-actions-deployer` service account.
    -   Click **"+ Grant Access"**.
    -   **New Principal:** `principalSet://iam.googleapis.com/projects/781704308120/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository_owner/jaytsol`
    -   **Grant Roles:** Add and save both of the following roles:
        -   `Workload Identity User`
        -   `Service Account Token Creator`

---

## 3. Application Deployment (Cloud Run)

Frontend and backend are deployed as separate `Cloud Run` services.

### A. Backend (`surfai-backend`)

-   **Deployment Region:** `asia-northeast1` (Taiwan)
-   **Domain:** `api.surfai.org`
-   **Required Environment Variables:**
    -   `NODE_ENV`: `production`
    -   `API_BASE_URL`: `https://api.surfai.org`
    -   `FRONTEND_URL`: `https://surfai.org`
    -   `ROOT_DOMAIN`: `surfai.org`
    -   `DB_HOST`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`, `DB_DATABASE`: Production PostgreSQL (Supabase) information
    -   `JWT_SECRET`, `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRATION_TIME`
    -   `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
    -   `ADMIN_EMAILS`
    -   ...other `R2`, `ComfyUI` related keys

### B. Frontend (`surfai-frontend`)

-   **Deployment Region:** `asia-northeast1` (Taiwan)
-   **Domain:** `surfai.org`
-   **Note:** Frontend environment variables must be injected at **build time**, not runtime. (Passed via `substitutions` flag in `GitHub Actions` workflow)

---

## 4. CI/CD (GitHub Actions)

### A. GitHub Repository Secrets

Set the following Secrets in **"Settings" > "Secrets and variables" > "Actions"** for each repository.

-   **Common Secrets (Both Frontend/Backend):**
    -   `GCP_PROJECT_ID`: `surfai-463212`
    -   `GCP_WORKLOAD_IDENTITY_PROVIDER`: `projects/781704308120/...` (Full name of Workload Identity provider)
-   **Frontend-Specific Secrets:**
    -   `NEXT_PUBLIC_API_URL`: `https://api.surfai.org`
    -   `NEXT_PUBLIC_WEBSOCKET_URL`: `wss://api.surfai.org/events`

### B. Workflow Files

-   Place `deploy-backend.yml` and `deploy-frontend.yml` in the `.github/workflows/` folder of each repository.
-   These files will automatically execute whenever code is pushed to the `main` branch, building `Docker` images and deploying them to `Cloud Run` by referencing `cloudbuild.yaml`.
