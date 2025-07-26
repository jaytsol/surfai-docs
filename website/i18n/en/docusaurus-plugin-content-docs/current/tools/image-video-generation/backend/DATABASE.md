# Database Schema
🗄️ Database Schema: SurfAI
Last Updated: June 29, 2025

This document details the PostgreSQL database schema, key tables, and relationships between tables in the SurfAI project. All tables and columns are defined based on TypeORM entities.

## 1. Overview

-   **Database System:** PostgreSQL
-   **ORM:** TypeORM
-   **Key Entities:** `User`, `Workflow`, `GeneratedOutput`

---

## 2. Detailed Table Specifications

### A. `users` Table

This is the core table that stores user account information. It has a hybrid structure that supports both Google login and general email/password login.

| Column Name                 | Type            | Constraints                | Description                                                              |
| :-------------------------- | :-------------- | :------------------------- | :----------------------------------------------------------------------- |
| `id`                        | `integer`       | **PK**, Auto-increment     | Unique identifier for the user                                           |
| `email`                     | `varchar`       | **Unique**                 | User's email address. Used as login ID.                                  |
| `displayName`               | `varchar`       | Not Null                   | Name to be displayed to the user (nickname).                             |
| `password`                  | `varchar`       | Nullable, `Select=false`   | bcrypt hash of the password used for general sign-up.                    |
| `googleId`                  | `varchar`       | Unique, Nullable           | Unique Google ID for Google login.                                       |
| `imageUrl`                  | `varchar(2048)` | Nullable                   | URL of the user's profile picture. (Google or default image)             |
| `role`                      | `enum`          | Not Null, Default=`'user'` | User's role. (`admin` or `user`)                                         |
| `currentHashedRefreshToken` | `varchar`       | Nullable, `Select=false`   | bcrypt hash of the JWT Refresh Token. Set to NULL on logout.             |
| `coinBalance`               | `integer`       | Not Null, Default=`0`      | User's current coin balance.                                             |
| `createdAt`                 | `timestamptz`   | Not Null                   | Record creation timestamp (auto-generated)                               |
| `updatedAt`                 | `timestamptz`   | Not Null                   | Record last modification timestamp (auto-updated)                        |

### B. `coin_transactions` Table

This table records the user's coin transaction history. All records of coin acquisition and consumption are stored here.

| Column Name       | Type          | Constraints                             | Description                                                              |
| :---------------- | :------------ | :-------------------------------------- | :----------------------------------------------------------------------- |
| `id`              | `integer`     | **PK**, Auto-increment                  | Unique identifier for the coin transaction                               |
| `userId`          | `integer`     | Not Null, **FK** (`users.id`)           | ID of the user who performed the transaction.                            |
| `type`            | `enum`        | Not Null                                | Transaction type (`gain` or `deduct`).                                   |
| `amount`          | `integer`     | Not Null                                | Amount of coins changed (always positive).                               |
| `reason`          | `enum`        | Not Null                                | Reason for the transaction (`purchase`, `promotion`, `admin_adjustment`, `image_generation`, `video_generation`, etc.). |
| `relatedEntityId` | `varchar`     | Nullable                                | ID of the related entity (e.g., `generated_output.id` for image generation). |
| `currentBalance`  | `integer`     | Not Null                                | User's final coin balance after this transaction.                        |
| `createdAt`       | `timestamptz` | Not Null                                | Record creation timestamp.                                               |

### C. `workflows` Table

This table manages both workflow "templates" and "user-specific workflow" instances where users have saved parameters.

| Column Name           | Type          | Constraints                             | Description                                                              |
| :-------------------- | :------------ | :-------------------------------------- | :----------------------------------------------------------------------- |
| `id`                  | `integer`     | **PK**, Auto-increment                  | Unique identifier for the workflow                                       |
| `name`                | `varchar`     | Not Null                                | Name of the workflow template or instance.                               |
| `description`         | `text`        | Nullable                                | Detailed description of the workflow.                                    |
| `category`            | `varchar`     | Nullable                                | Template category (e.g., `image`, `video`).                              |
| `definition`          | `jsonb`       | Nullable                                | ComfyUI's original workflow API format JSON.                           |
| `parameter_map`       | `jsonb`       | Nullable                                | Information mapping dynamic parameters to actual nodes.                  |
| `previewImageUrl`     | `text`        | Nullable                                | URL of the template's preview image to show in lists.                    |
| `tags`                | `text[]`      | Nullable                                | Array of tags for template classification.                               |
| `cost`                | `integer`     | Not Null, Default=`1`                   | Coin cost required to use this workflow template.                        |
| `isPublicTemplate`    | `boolean`     | Not Null, Default=`false`               | `true` if this is a public template visible to all users.                |
| `user_parameter_values` | `jsonb`       | Nullable                                | User-defined parameter values.                                           |
| `isTemplate`          | `boolean`     | Not Null, Default=`true`                | `true` if it's an admin-created template, `false` if it's a user instance. |
| `ownerUserId`         | `integer`     | Nullable, **FK** (`users.id`)           | Owner ID of this workflow.                                               |
| `sourceTemplateId`    | `integer`     | Nullable, **FK** (`workflows.id`)       | ID of the original template from which this workflow was derived.        |
| `createdAt`           | `timestamptz` | Not Null                                | Record creation timestamp                                                |
| `updatedAt`           | `timestamptz` | Not Null                                | Record last modification timestamp                                       |

### D. `generated_outputs` Table

This table stores metadata for all generated outputs (images/videos) by users.

| Column Name        | Type            | Constraints                     | Description                                                              |
| :----------------- | :-------------- | :------------------------------ | :----------------------------------------------------------------------- |
| `id`               | `integer`       | **PK**, Auto-increment          | Unique identifier for the generated output                               |
| `ownerUserId`      | `integer`       | Not Null, **FK** (`users.id`)   | ID of the user who generated this output.                                |
| `sourceWorkflowId` | `integer`       | Not Null, **FK** (`workflows.id`) | ID of the workflow used for generation.                                  |
| `r2Url`            | `varchar(2048)` | Not Null                        | Unique path URL of the actual file stored in Cloudflare R2.              |
| `originalFilename` | `varchar`       | Not Null                        | Original filename generated by ComfyUI.                                  |
| `mimeType`         | `varchar`       | Not Null                        | MIME type of the file. (e.g., `image/png`, `video/mp4`)                  |
| `promptId`         | `varchar`       | Not Null, **Index**             | ComfyUI's prompt ID identifying the generation task.                     |
| `usedParameters`   | `jsonb`         | Nullable                        | Record of dynamic parameter values entered by the user during generation. |
| `duration`         | `float`         | Nullable                        | Playback time in seconds if the output is a video.                       |
| `createdAt`        | `timestamptz`   | Not Null                        | Record creation timestamp                                                |

---

## 3. Table Relationships (ERD Summary)

-   **User (1) : (N) Workflow:** One user can own multiple workflow instances.
-   **User (1) : (N) GeneratedOutput:** One user can generate multiple outputs.
-   **User (1) : (N) CoinTransaction:** One user can have multiple coin transaction records.
-   **Workflow (1) : (N) Workflow:** One workflow template can have multiple user instances. (Self-referencing relationship)
-   **Workflow (1) : (N) GeneratedOutput:** One workflow can be used to generate multiple outputs.

---

## 4. TypeORM Migrations

The SurfAI backend uses TypeORM migrations for database schema management. Instead of using `synchronize: true` in development, the migration approach is adopted for production environment stability and data integrity.

### 4.1. Migration Configuration

In the `comfy-surfai-backend/src/app.module.ts` file, the TypeORM configuration is as follows:

```typescript
TypeOrmModule.forRoot({
  // ... existing configuration ...
  synchronize: false, // Must be set to false in production environments
  migrations: [__dirname + '/migrations/**/*.js'], // Path to migration files
  cli: {
    migrationsDir: 'src/migrations', // Path where TypeORM CLI will generate migration files
  },
}),
```

### 4.2. Migration Commands

You can manage migrations using the following commands in the `comfy-surfai-backend` directory.

#### A. Generate Migration File

Generates a new migration file based on entity changes.

```bash
npm run typeorm migration:generate -- -n <MigrationName>
# 예시: npm run typeorm migration:generate -- -n UserTableUpdate
```

#### B. Run Migrations

Applies generated migration files to the database.

```bash
npm run typeorm migration:run
```

#### C. Rollback Migrations

Rolls back the most recently applied migration.

```bash
npm run typeorm migration:revert
```