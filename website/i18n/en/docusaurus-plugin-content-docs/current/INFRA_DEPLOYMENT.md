# Infrastructure & Deployment
⚙️ Infrastructure Configuration and Deployment Guide
Last Updated: June 29, 2025

This document provides a comprehensive guide to the SurfAI project's cloud infrastructure configuration, deployment, and CI/CD pipeline setup.

---

## 1. Overview

This service deploys frontend and backend applications as separate `Docker` containers to `Google Cloud Run`. CI/CD is automated via `GitHub Actions`, and authentication is securely handled using `Workload Identity Federation`.

---

## 2. Google Cloud Platform (GCP) Setup

### a. Project and API Activation

-   **Project ID:** `surfai-463212`
-   For deployment, the following APIs must be **Enabled** in your GCP project:
    -   **Cloud Run API:** Deploying and running applications
    -   **Cloud Build API:** Building `Docker` images
    -   **Artifact Registry API:** Storing built `Docker` images
    -   **IAM API (Identity and Access Management):** Managing permissions
    -   **IAM Service Account Credentials API:** Generating authentication tokens

### b. Service Account Setup

A dedicated "robot account" for `GitHub Actions` to perform deployment tasks.

-   **Create Service Account:**
    -   **Name:** `github-actions-deployer`
    -   **Email (auto-generated):** `github-actions-deployer@surfai-463212.iam.gserviceaccount.com`
-   **Grant Roles to the Service Account itself:**
    -   On the "IAM" page, find the `github-actions-deployer` account and grant the following roles:
        -   `Cloud Run Admin`
        -   `Cloud Build Editor`
        -   `Service Account User`

### c. Workload Identity Federation (GitHub Actions Authentication)

Configures `GitHub Actions` to securely authenticate to GCP without a secret key.

-   **Create ID Pool:**
    -   **Name / Pool ID:** `github-actions-pool`
-   **Add OIDC Provider:**
    -   **Provider ID:** `github-actions-provider`
    -   **Issuer (URL):** `https://token.actions.githubusercontent.com`
    -   **Attribute Condition:** `assertion.repository_owner == 'jaytsol'`
-   **Connect Service Account with External ID (Most Important):**
    -   Go to the "Permissions" tab of the `github-actions-deployer` service account.
    -   Click **"+ Grant Access"**.
    -   **New Principal:** `principalSet://iam.googleapis.com/projects/781704308120/locations/global/workloadIdentityPools/github-actions-pool/attribute.repository_owner/jaytsol`
    -   **Grant Roles:** Add and save both of the following roles:
        -   `Workload Identity User`
        -   `Service Account Token Creator`

---

## 3. Application Deployment (Cloud Run)

Frontend and backend are deployed as separate `Cloud Run` services.

### a. Backend (`surfai-backend`)

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

### b. Frontend (`surfai-frontend`)

-   **Deployment Region:** `asia-northeast1` (Taiwan)
-   **Domain:** `surfai.org`
-   **Note:** Frontend environment variables must be injected at **build time**, not runtime. (Passed via `substitutions` flag in `GitHub Actions` workflow)

---

## 4. CI/CD (GitHub Actions)

### a. GitHub Repository Secrets

Set the following Secrets in **"Settings" > "Secrets and variables" > "Actions"** for each repository.

-   **Common Secrets (for both Frontend/Backend):**
    -   `GCP_PROJECT_ID`: `surfai-463212`
    -   `GCP_WORKLOAD_IDENTITY_PROVIDER`: `projects/781704308120/...` (Full name of the Workload Identity provider)
-   **Frontend-specific Secrets:**
    -   `NEXT_PUBLIC_API_URL`: `https://api.surfai.org`
    -   `NEXT_PUBLIC_WEBSOCKET_URL`: `wss://api.surfai.org/events`

### b. Workflow Files

-   Place `deploy-backend.yml` and `deploy-frontend.yml` in the `.github/workflows/` folder of each repository.
-   These files automatically execute whenever code is pushed to the `main` branch, building `Docker` images and deploying them to `Cloud Run` by referencing `cloudbuild.yaml`.
