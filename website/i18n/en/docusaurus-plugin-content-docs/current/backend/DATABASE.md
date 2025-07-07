# Database Schema
Last Updated: June 29, 2025

This document details the PostgreSQL database schema, main tables, and relationships between tables for the SurfAI project. All tables and columns are defined based on TypeORM entities.

## 1. Overview

- **Database System:** PostgreSQL
- **ORM:** TypeORM
- **Main Entities:** `User`, `Workflow`, `GeneratedOutput`

---

## 2. Table Details

### a. `users` table

This is the core table for storing user account information. It has a hybrid structure supporting both Google login and standard email/password login.

| Column Name                 | Type             | Constraints                | Description                                                |
| --------------------------- | ---------------- | -------------------------- | ---------------------------------------------------------- |
| `id`                        | `integer`        | **PK**, Auto-increment     | Unique identifier for the user                             |
| `email`                     | `varchar`        | **Unique**                 | User's email address. Used as login ID.                    |
| `displayName`               | `varchar`        | Not Null                   | Display name for the user (nickname).                      |
| `password`                  | `varchar`        | Nullable, `Select=false`   | bcrypt hash of the password used for standard registration. |
| `googleId`                  | `varchar`        | Unique, Nullable           | Unique Google ID for Google login.                         |
| `imageUrl`                  | `varchar(2048)`  | Nullable                   | URL of the user's profile picture (Google or default image). |
| `role`                      | `enum`           | Not Null, Default=`'user'` | User's role. (`admin` or `user`)                           |
| `currentHashedRefreshToken` | `varchar`        | Nullable, `Select=false`   | bcrypt hash of the JWT Refresh Token. Set to NULL on logout. |
| `createdAt`                 | `timestamptz`    | Not Null                   | Timestamp of record creation (auto-generated)              |
| `updatedAt`                 | `timestamptz`    | Not Null                   | Timestamp of last record modification (auto-updated)       |

### b. `workflows` table

This table manages both workflow "templates" and user-saved "my workflow" instances with custom parameters.

| Column Name          | Type      | Constraints                             | Description                                                                 |
| -------------------- | --------- | --------------------------------------- | --------------------------------------------------------------------------- |
| `id`                 | `integer` | **PK**, Auto-increment                  | Unique identifier for the workflow                                          |
| `name`               | `varchar` | Not Null                                | Name of the workflow template or instance.                                  |
| `description`        | `text`    | Nullable                                | Detailed description of the workflow.                                       |
| `definition`         | `jsonb`   | Nullable                                | Original ComfyUI workflow API format JSON. (Mainly used when `isTemplate: true`) |
| `parameter_map`      | `jsonb`   | Nullable                                | Information mapping dynamic parameters to actual nodes.                     |
| `previewImageUrl`    | `text`    | Nullable                                | URL of the template's preview image to display in lists.                    |
| `tags`               | `text[]`  | Nullable                                | Array of tags for template classification.                                  |
| `isTemplate`         | `boolean` | Not Null, Default=`true`                | `true` if it's an admin-created template, `false` if it's a user-saved instance. |
| `isPublicTemplate`   | `boolean` | Not Null, Default=`false`               | `true` if it's a template publicly available to all users.                  |
| `ownerUserId`        | `integer` | Nullable, **FK** (`users.id`)           | ID of the user who owns this workflow.                                      |
| `sourceTemplateId`   | `integer` | Nullable, **FK** (`workflows.id`)       | ID of the original template from which this workflow was derived. (Used when `isTemplate: false`) |
| `createdAt`          | `timestamptz` | Not Null                                | Timestamp of record creation                                                |
| `updatedAt`          | `timestamptz` | Not Null                                | Timestamp of last record modification                                       |

### c. `generated_outputs` table

This table stores metadata for all generated outputs (images/videos) by users.

| Column Name         | Type             | Constraints                     | Description                                                  |
| ------------------- | ---------------- | ------------------------------- | ------------------------------------------------------------ |
| `id`                | `integer`        | **PK**, Auto-increment          | Unique identifier for the generated output                   |
| `ownerUserId`       | `integer`        | Not Null, **FK** (`users.id`)   | ID of the user who generated this output.                    |
| `sourceWorkflowId`  | `integer`        | Not Null, **FK** (`workflows.id`) | ID of the workflow used for generation.                      |
| `r2Url`             | `varchar(2048)`  | Not Null                        | Unique path URL of the actual file stored in Cloudflare R2. |
| `originalFilename`  | `varchar`        | Not Null                        | Original filename generated by ComfyUI.                      |
| `mimeType`          | `varchar`        | Not Null                        | MIME type of the file. (e.g., `image/png`, `video/mp4`)      |
| `promptId`          | `varchar`        | Not Null, **Index**             | ComfyUI's prompt ID identifying the generation task.         |
| `usedParameters`    | `jsonb`          | Nullable                        | Record of dynamic parameter values entered by the user during generation. |
| `duration`          | `float`          | Nullable                        | Playback duration in seconds if the output is a video.       |
| `createdAt`         | `timestamptz`    | Not Null                        | Timestamp of record creation                                 |

---

## 3. Table Relationships (ERD Summary)

-   **User (1) : (N) Workflow:** One user can own multiple workflow instances.
-   **User (1) : (N) GeneratedOutput:** One user can generate multiple outputs.
-   **Workflow (1) : (N) Workflow:** One workflow template can have multiple user instances. (Self-referencing relationship)
-   **Workflow (1) : (N) GeneratedOutput:** One workflow can be used to generate multiple outputs.
