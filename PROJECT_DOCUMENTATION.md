# Complete Project Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture & Folder Structure](#architecture--folder-structure)
3. [Technologies & Libraries](#technologies--libraries)
4. [Database Schema](#database-schema)
5. [Authentication & Authorization](#authentication--authorization)
6. [API Endpoints](#api-endpoints)
7. [Frontend Architecture](#frontend-architecture)
8. [Features & Implementation Details](#features--implementation-details)
9. [Development Workflow](#development-workflow)
10. [Testing](#testing)

---

## Project Overview

**Karja Suchana Kendra Assessment** is a full-stack web application designed for enterprise-level user management with role-based access control (RBAC). The application provides secure authentication, comprehensive user management, role and permission management, and various enterprise features like logging, notifications, file uploads, and system settings.

### Key Characteristics:
- **Full-Stack Architecture**: React frontend + Node.js/Express backend
- **Database**: MySQL with Sequelize ORM
- **Authentication**: JWT-based with refresh tokens
- **Authorization**: Role-based access control (RBAC) with granular permissions
- **Internationalization**: Multi-language support (English & Nepali)
- **Theme Support**: Dark/Light mode
- **Enterprise Features**: Logging, notifications, file uploads, system settings

---

## Architecture & Folder Structure

### Root Structure
```
karja-suchana-kendra-assesment/
├── client/              # React frontend application
├── server/              # Node.js backend application
├── cypress/             # End-to-end testing
├── docker-compose.yml   # Docker orchestration
└── package.json         # Root workspace configuration
```

### Why This Structure?

**Monorepo with Workspaces**: The root `package.json` uses npm workspaces to manage both client and server as a single project. This allows:
- Shared dependencies management
- Unified scripts (`npm run dev` runs both)
- Easier development workflow
- Single repository for full-stack development

---

### Client Structure (`/client`)

```
client/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Layout.jsx           # Main layout wrapper
│   │   ├── PrivateRoute.jsx     # Route protection component
│   │   ├── ThemeToggle.jsx      # Dark/Light mode toggle
│   │   └── LanguageSwitcher.jsx # i18n language switcher
│   ├── pages/           # Page components (routes)
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Users.jsx
│   │   ├── Roles.jsx
│   │   ├── Profile.jsx
│   │   └── Page1-3.jsx
│   ├── context/         # React Context API for state
│   │   ├── AuthContext.jsx      # Authentication state
│   │   └── ThemeContext.jsx     # Theme state
│   ├── services/        # API service layer
│   │   ├── api.js               # Axios instance & interceptors
│   │   ├── authService.js       # Auth API calls
│   │   ├── userService.js       # User API calls
│   │   ├── roleService.js       # Role API calls
│   │   └── profileService.js    # Profile API calls
│   ├── i18n/            # Internationalization
│   │   ├── config.js            # i18next configuration
│   │   └── locales/
│   │       ├── en.json          # English translations
│   │       └── ne.json          # Nepali translations
│   ├── App.jsx          # Root component with routing
│   └── main.jsx         # Application entry point
├── public/              # Static assets
├── package.json
├── vite.config.js       # Vite build configuration
└── jest.config.js       # Jest test configuration
```

**Why This Structure?**

1. **Separation of Concerns**: 
   - `components/` for reusable UI
   - `pages/` for route-specific views
   - `services/` for API communication
   - `context/` for global state

2. **Service Layer Pattern**: All API calls are abstracted in services, making:
   - API changes easier to manage
   - Testing simpler (mock services)
   - Code reuse across components

3. **Context API**: Used instead of Redux for simpler state management:
   - Auth state (user, tokens)
   - Theme state (dark/light mode)
   - Less boilerplate than Redux

---

### Server Structure (`/server`)

```
server/
├── src/
│   ├── app.js           # Express application entry
│   ├── config/          # Configuration files
│   │   ├── sequelize.js        # Database connection
│   │   └── initDatabase.js     # Database initialization
│   ├── models/          # Sequelize models (database schema)
│   │   ├── User.js
│   │   ├── Role.js
│   │   ├── Permission.js
│   │   ├── RolePermission.js
│   │   ├── UserLog.js
│   │   ├── Notification.js
│   │   ├── File.js
│   │   ├── PasswordReset.js
│   │   ├── RefreshToken.js
│   │   ├── SystemSetting.js
│   │   └── index.js            # Model associations
│   ├── controllers/     # Request handlers
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── roleController.js
│   ├── routes/          # API route definitions
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── roleRoutes.js
│   ├── middleware/      # Express middleware
│   │   ├── auth.js             # JWT authentication
│   │   └── validation.js       # Request validation
│   ├── modules/         # Feature modules (modular architecture)
│   │   ├── auth/
│   │   │   ├── passwordResetController.js
│   │   │   └── passwordResetRoutes.js
│   │   ├── profile/
│   │   ├── logs/
│   │   ├── notifications/
│   │   ├── uploads/
│   │   └── settings/
│   ├── services/        # Business logic services
│   │   ├── emailService.js
│   │   └── logService.js
│   └── scripts/         # Utility scripts
│       └── addDeletedAtColumn.js
├── tests/               # Test files
│   ├── unit/
│   ├── integration/
│   └── helpers/
├── uploads/             # File uploads directory
│   └── avatars/
├── package.json
└── jest.config.js
```

**Why This Structure?**

1. **MVC-like Pattern**:
   - `models/` = Data layer
   - `controllers/` = Business logic
   - `routes/` = API endpoints
   - `middleware/` = Request processing

2. **Modular Architecture** (`modules/`):
   - Each feature is self-contained
   - Easy to add/remove features
   - Better code organization
   - Example: `modules/auth/` contains password reset logic

3. **Service Layer** (`services/`):
   - Reusable business logic
   - Email sending, logging, etc.
   - Separated from controllers for testability

4. **Separation of Concerns**:
   - `config/` for configuration
   - `scripts/` for one-time operations
   - `tests/` for test files

---

## Technologies & Libraries

### Backend Dependencies

#### Core Framework
- **express** (`^4.18.2`): Web framework for Node.js
  - **Why**: Industry standard, minimal, flexible
  - **Usage**: HTTP server, routing, middleware

#### Database
- **mysql2** (`^3.6.5`): MySQL driver for Node.js
  - **Why**: Native async/await support, better performance than `mysql`
  - **Usage**: Direct database connection (used by Sequelize)

- **sequelize** (`^6.35.2`): ORM (Object-Relational Mapping)
  - **Why**: 
    - Abstracts SQL queries into JavaScript objects
    - Handles migrations, associations, validations
    - Database-agnostic (can switch to PostgreSQL, etc.)
  - **Usage**: Model definitions, queries, relationships

#### Authentication & Security
- **bcryptjs** (`^2.4.3`): Password hashing
  - **Why**: Industry standard for password hashing
  - **Usage**: Hash passwords before storing, compare on login
  - **Security**: Uses bcrypt algorithm (slow by design to prevent brute force)

- **jsonwebtoken** (`^9.0.2`): JWT (JSON Web Tokens)
  - **Why**: Stateless authentication, scalable
  - **Usage**: Generate access tokens and refresh tokens
  - **Benefits**: No server-side session storage needed

#### File Handling
- **multer** (`^1.4.5-lts.1`): File upload middleware
  - **Why**: Handles multipart/form-data (file uploads)
  - **Usage**: Avatar uploads, file management

#### Email
- **nodemailer** (`^6.9.7`): Email sending
  - **Why**: Simple, supports multiple email providers
  - **Usage**: Password reset emails, notifications

#### Validation
- **express-validator** (`^7.0.1`): Request validation
  - **Why**: Validates and sanitizes user input
  - **Usage**: Validate email format, password strength, etc.

#### Utilities
- **cors** (`^2.8.5`): Cross-Origin Resource Sharing
  - **Why**: Allows frontend (port 3000) to call backend (port 5000)
  - **Usage**: Configure allowed origins

- **dotenv** (`^16.3.1`): Environment variables
  - **Why**: Store sensitive config (DB credentials, JWT secret)
  - **Usage**: Load `.env` file

### Frontend Dependencies

#### Core Framework
- **react** (`^18.2.0`): UI library
  - **Why**: Most popular, component-based, virtual DOM
  - **Usage**: All UI components

- **react-dom** (`^18.2.0`): React DOM renderer
  - **Why**: Required for React to render to browser

#### Routing
- **react-router-dom** (`^6.20.1`): Client-side routing
  - **Why**: Single Page Application (SPA) routing
  - **Usage**: Navigate between pages without page reload

#### HTTP Client
- **axios** (`^1.6.2`): HTTP client
  - **Why**: Better than `fetch` (interceptors, automatic JSON parsing)
  - **Usage**: All API calls to backend

#### Internationalization
- **i18next** (`^23.16.8`): i18n framework
  - **Why**: Industry standard for translations
  - **Usage**: Multi-language support

- **react-i18next** (`^13.5.0`): React bindings for i18next
  - **Why**: React hooks for translations
  - **Usage**: `useTranslation()` hook in components

#### Build Tool
- **vite** (`^5.0.8`): Build tool and dev server
  - **Why**: 
    - Faster than Create React App
    - Hot Module Replacement (HMR)
    - Modern ES modules
  - **Usage**: Development server, production builds

- **@vitejs/plugin-react** (`^4.2.1`): Vite plugin for React
  - **Why**: Enables React support in Vite

### Development Dependencies

#### Testing
- **jest** (`^29.7.0`): Testing framework
  - **Why**: Most popular JavaScript testing framework
  - **Usage**: Unit and integration tests

- **supertest** (`^6.3.3`): HTTP assertion library
  - **Why**: Test Express routes
  - **Usage**: Integration tests for API endpoints

- **cypress** (`^13.6.2`): End-to-end testing
  - **Why**: Browser-based testing
  - **Usage**: E2E tests for user flows

- **@testing-library/react** (`^14.1.2`): React testing utilities
  - **Why**: Test React components
  - **Usage**: Component unit tests

#### Code Quality
- **eslint** (`^8.56.0`): Linter
  - **Why**: Catch errors, enforce code style
  - **Usage**: Code quality checks

- **prettier** (`^3.1.1`): Code formatter
  - **Why**: Consistent code formatting
  - **Usage**: Auto-format code

#### Development Tools
- **nodemon** (`^3.0.2`): Auto-restart server on changes
  - **Why**: Faster development workflow
  - **Usage**: Watch for file changes and restart server

- **concurrently** (`^8.2.2`): Run multiple commands
  - **Why**: Run client and server simultaneously
  - **Usage**: `npm run dev` runs both

---

## Database Schema

### Overview
The database uses **MySQL** with **Sequelize ORM**. All tables use:
- **Primary Keys**: Auto-incrementing integers (`id`)
- **Timestamps**: `created_at` and `updated_at` (automatic)
- **Foreign Keys**: Referential integrity between tables
- **Indexes**: For performance (unique constraints, foreign keys)

---

### Table: `users`

**Purpose**: Store user accounts and authentication information.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique user identifier |
| `username` | VARCHAR(50) | NOT NULL, UNIQUE | User's login username |
| `email` | VARCHAR(100) | NOT NULL, UNIQUE, VALIDATE (isEmail) | User's email address |
| `password` | VARCHAR(255) | NOT NULL | Bcrypt-hashed password |
| `role_id` | INTEGER | NOT NULL, FOREIGN KEY → `roles.id` | User's role (readonly/admin/superadmin) |
| `deleted_at` | DATETIME | NULL | Soft delete timestamp (NULL = active) |
| `avatar` | VARCHAR(255) | NULL | Path to avatar image file |
| `created_at` | DATETIME | NOT NULL | Account creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Last update timestamp |

**Why These Columns?**

- **`id`**: Primary key for unique identification and foreign key references
- **`username`**: Unique login identifier (alternative to email)
- **`email`**: Unique identifier, validated format, used for password reset
- **`password`**: Hashed with bcrypt (never store plain text)
- **`role_id`**: Links to `roles` table for RBAC (Role-Based Access Control)
- **`deleted_at`**: Soft delete (mark as deleted instead of hard delete)
  - **Why**: Preserve data for auditing, can restore if needed
- **`avatar`**: Profile picture file path
- **Timestamps**: Track creation and modification times

**Foreign Keys:**
- `role_id` → `roles.id`: Ensures user always has a valid role

**Indexes:**
- Primary key on `id`
- Unique index on `username`
- Unique index on `email`
- Index on `role_id` (foreign key)

---

### Table: `roles`

**Purpose**: Define user roles in the system.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique role identifier |
| `name` | VARCHAR(50) | NOT NULL, UNIQUE | Role name (readonly/admin/superadmin) |
| `description` | TEXT | NULL | Human-readable role description |
| `created_at` | DATETIME | NOT NULL | Role creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Last update timestamp |

**Why These Columns?**

- **`id`**: Primary key, referenced by `users.role_id`
- **`name`**: Unique role identifier (used in code for authorization)
- **`description`**: Helpful for UI display and documentation

**Default Roles:**
1. `readonly` (id: 1) - View-only access
2. `admin` (id: 2) - User management access
3. `superadmin` (id: 3) - Full system access

**Foreign Keys:**
- None (top-level table)

**Indexes:**
- Primary key on `id`
- Unique index on `name`

---

### Table: `permissions`

**Purpose**: Define granular permissions (actions users can perform).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique permission identifier |
| `name` | VARCHAR(100) | NOT NULL, UNIQUE | Permission name (e.g., 'view_users') |
| `description` | TEXT | NULL | Human-readable permission description |
| `created_at` | DATETIME | NOT NULL | Permission creation timestamp |
| `updated_at` | DATETIME | NULL | Not used (permissions rarely change) |

**Why These Columns?**

- **`id`**: Primary key, referenced by `role_permissions`
- **`name`**: Unique permission identifier (used in code)
- **`description`**: Helpful for UI and documentation

**Default Permissions:**
1. `view_users` - View users list
2. `create_users` - Create new users
3. `edit_users` - Edit existing users
4. `delete_users` - Delete users
5. `view_roles` - View roles list
6. `create_roles` - Create new roles
7. `edit_roles` - Edit existing roles
8. `delete_roles` - Delete roles
9. `view_dashboard` - View dashboard
10. `view_pages` - View all pages

**Foreign Keys:**
- None (top-level table)

**Indexes:**
- Primary key on `id`
- Unique index on `name`

---

### Table: `role_permissions`

**Purpose**: Many-to-many relationship between roles and permissions (junction table).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique record identifier |
| `role_id` | INTEGER | NOT NULL, FOREIGN KEY → `roles.id` | Role identifier |
| `permission_id` | INTEGER | NOT NULL, FOREIGN KEY → `permissions.id` | Permission identifier |

**Why This Table?**

- **Many-to-Many Relationship**: One role can have many permissions, one permission can belong to many roles
- **Junction Table**: Required to represent this relationship in relational databases
- **Example**: `admin` role has `view_users`, `create_users`, `edit_users` permissions

**Why These Columns?**

- **`id`**: Primary key (though not strictly necessary, useful for ORM)
- **`role_id`**: Links to `roles` table
- **`permission_id`**: Links to `permissions` table

**Foreign Keys:**
- `role_id` → `roles.id`: Ensures valid role
- `permission_id` → `permissions.id`: Ensures valid permission

**Indexes:**
- Primary key on `id`
- **Unique composite index** on `(role_id, permission_id)`: Prevents duplicate role-permission pairs
- Index on `role_id` (foreign key)
- Index on `permission_id` (foreign key)

**Example Data:**
```
role_id | permission_id
--------|---------------
1       | 1  (readonly can view_users)
1       | 5  (readonly can view_roles)
2       | 1  (admin can view_users)
2       | 2  (admin can create_users)
2       | 3  (admin can edit_users)
```

---

### Table: `user_logs`

**Purpose**: Audit trail of user actions (logging system).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique log entry identifier |
| `user_id` | INTEGER | NULL, FOREIGN KEY → `users.id` | User who performed the action (NULL if deleted user) |
| `action` | VARCHAR(100) | NOT NULL | Action name (e.g., 'user.created', 'user.deleted') |
| `performed_by` | INTEGER | NULL, FOREIGN KEY → `users.id` | User who triggered the action (for admin actions) |
| `ip_address` | VARCHAR(45) | NULL | IP address of the request (supports IPv6) |
| `user_agent` | TEXT | NULL | Browser/client information |
| `details` | TEXT | NULL | JSON or text details about the action |
| `timestamp` | DATETIME | NOT NULL | When the action occurred |

**Why These Columns?**

- **`user_id`**: The user record that was affected (can be NULL if user was deleted)
- **`action`**: What happened (e.g., 'user.created', 'user.updated')
- **`performed_by`**: Who did it (important for admin actions on other users)
- **`ip_address`**: Security/audit trail (max 45 chars for IPv6)
- **`user_agent`**: Browser/client info for debugging
- **`details`**: Additional context (JSON string with more info)
- **`timestamp`**: When it happened (uses `created_at` field)

**Why This Table?**

- **Audit Trail**: Track all important actions
- **Security**: Investigate suspicious activity
- **Compliance**: Some regulations require audit logs
- **Debugging**: Understand what users did

**Foreign Keys:**
- `user_id` → `users.id`: Links to affected user (nullable for deleted users)
- `performed_by` → `users.id`: Links to user who performed action (nullable)

**Indexes:**
- Primary key on `id`
- Index on `user_id` (for querying user's logs)
- Index on `performed_by` (for querying actions by admin)
- Index on `timestamp` (for time-based queries)

---

### Table: `notifications`

**Purpose**: Store system notifications for users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique notification identifier |
| `user_id` | INTEGER | NULL, FOREIGN KEY → `users.id` | Target user (NULL = all users) |
| `role_id` | INTEGER | NULL, FOREIGN KEY → `roles.id` | Target role (NULL = all roles) |
| `title` | VARCHAR(255) | NOT NULL | Notification title |
| `message` | TEXT | NOT NULL | Notification message body |
| `type` | ENUM | DEFAULT 'info' | Notification type (info/success/warning/error) |
| `is_read` | BOOLEAN | DEFAULT false | Whether user has read the notification |
| `link` | VARCHAR(255) | NULL | Optional link to related page |
| `created_at` | DATETIME | NOT NULL | Notification creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Last update timestamp |

**Why These Columns?**

- **`user_id`**: Send to specific user (NULL = broadcast to all)
- **`role_id`**: Send to all users with specific role (NULL = all roles)
- **`title`**: Short notification title
- **`message`**: Full notification text
- **`type`**: Visual styling (info/success/warning/error)
- **`is_read`**: Track read status (unread notifications badge)
- **`link`**: Optional deep link to related page
- **Timestamps**: Track creation and updates

**Why This Table?**

- **User Engagement**: Keep users informed
- **System Alerts**: Notify about important events
- **Targeted Messaging**: Send to specific users or roles

**Foreign Keys:**
- `user_id` → `users.id`: Links to target user (nullable for broadcasts)
- `role_id` → `roles.id`: Links to target role (nullable)

**Indexes:**
- Primary key on `id`
- Index on `user_id` (for user's notifications)
- Index on `role_id` (for role-based notifications)
- Index on `is_read` (for unread notifications query)

---

### Table: `files`

**Purpose**: Track uploaded files (avatars, documents, etc.).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique file identifier |
| `user_id` | INTEGER | NOT NULL, FOREIGN KEY → `users.id` | User who uploaded the file |
| `filename` | VARCHAR(255) | NOT NULL | Stored filename (with timestamp) |
| `original_name` | VARCHAR(255) | NOT NULL | Original filename from user |
| `mime_type` | VARCHAR(100) | NOT NULL | File MIME type (e.g., 'image/png') |
| `size` | INTEGER | NOT NULL | File size in bytes |
| `path` | VARCHAR(500) | NOT NULL | File system path |
| `url` | VARCHAR(500) | NULL | Public URL to access file |
| `category` | VARCHAR(50) | NULL | File category (e.g., 'avatar', 'document') |
| `created_at` | DATETIME | NOT NULL | Upload timestamp |
| `updated_at` | DATETIME | NOT NULL | Last update timestamp |

**Why These Columns?**

- **`user_id`**: Track who uploaded the file
- **`filename`**: Unique stored filename (prevents conflicts)
- **`original_name`**: Preserve user's original filename
- **`mime_type`**: Validate file type, set correct headers
- **`size`**: Enforce size limits, display to user
- **`path`**: File system location
- **`url`**: Public URL for frontend access
- **`category`**: Organize files (avatar, document, etc.)

**Why This Table?**

- **File Management**: Track all uploaded files
- **Security**: Control file access
- **Audit**: Know who uploaded what
- **Cleanup**: Can delete orphaned files

**Foreign Keys:**
- `user_id` → `users.id`: Links to uploader

**Indexes:**
- Primary key on `id`
- Index on `user_id` (for user's files)
- Index on `category` (for category-based queries)

---

### Table: `password_resets`

**Purpose**: Store password reset tokens (secure password recovery).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique reset token identifier |
| `user_id` | INTEGER | NOT NULL, FOREIGN KEY → `users.id` | User requesting password reset |
| `token` | VARCHAR(255) | NOT NULL, UNIQUE | Secure random token |
| `expires_at` | DATETIME | NOT NULL | Token expiration time |
| `used` | BOOLEAN | DEFAULT false | Whether token has been used |
| `created_at` | DATETIME | NOT NULL | Token creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Last update timestamp |

**Why These Columns?**

- **`user_id`**: Link to user account
- **`token`**: Secure random token (sent via email)
- **`expires_at`**: Security (tokens expire after 1 hour typically)
- **`used`**: Prevent token reuse (one-time use)
- **Timestamps**: Track creation and usage

**Why This Table?**

- **Security**: Secure password reset flow
- **Token Management**: Track valid/expired tokens
- **Prevent Reuse**: One-time use tokens

**Foreign Keys:**
- `user_id` → `users.id`: Links to user account

**Indexes:**
- Primary key on `id`
- Unique index on `token` (for fast lookup)
- Index on `user_id` (for user's reset requests)
- Index on `expires_at` (for cleanup of expired tokens)

**Security Flow:**
1. User requests password reset
2. Generate random token, store in this table
3. Send token via email
4. User clicks link with token
5. Verify token (not expired, not used)
6. Allow password reset
7. Mark token as used

---

### Table: `refresh_tokens`

**Purpose**: Store refresh tokens for JWT authentication (token refresh mechanism).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique refresh token identifier |
| `user_id` | INTEGER | NOT NULL, FOREIGN KEY → `users.id` | User who owns the token |
| `token` | VARCHAR(500) | NOT NULL, UNIQUE | Refresh token string |
| `expires_at` | DATETIME | NOT NULL | Token expiration time |
| `revoked` | BOOLEAN | DEFAULT false | Whether token has been revoked |
| `revoked_at` | DATETIME | NULL | When token was revoked |
| `ip_address` | VARCHAR(45) | NULL | IP address when token was created |
| `user_agent` | TEXT | NULL | Browser/client information |
| `created_at` | DATETIME | NOT NULL | Token creation timestamp |

**Why These Columns?**

- **`user_id`**: Link to user account
- **`token`**: Refresh token string (longer than access token)
- **`expires_at`**: Token expiration (typically 7-30 days)
- **`revoked`**: Security (revoke on logout or suspicious activity)
- **`revoked_at`**: Track when revoked
- **`ip_address`**: Security (detect token theft)
- **`user_agent`**: Security (detect device changes)
- **`created_at`**: Track creation time

**Why This Table?**

- **JWT Refresh Flow**: 
  - Access tokens expire quickly (15 min) for security
  - Refresh tokens last longer (7-30 days) for convenience
  - User can get new access token without re-login
- **Security**: 
  - Can revoke refresh tokens (logout)
  - Track token usage (detect theft)
  - One refresh token per user (or per device)

**Foreign Keys:**
- `user_id` → `users.id`: Links to user account

**Indexes:**
- Primary key on `id`
- Unique index on `token` (for fast lookup)
- Index on `user_id` (for user's tokens)
- Index on `expires_at` (for cleanup of expired tokens)
- Index on `revoked` (for active tokens query)

**JWT Flow:**
1. User logs in → Get access token (15 min) + refresh token (7 days)
2. Access token expires → Use refresh token to get new access token
3. Refresh token expires → User must login again
4. User logs out → Revoke refresh token

---

### Table: `system_settings`

**Purpose**: Store system-wide configuration settings (key-value store).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | INTEGER | PRIMARY KEY, AUTO_INCREMENT | Unique setting identifier |
| `key` | VARCHAR(100) | NOT NULL, UNIQUE | Setting key (e.g., 'site_title') |
| `value` | TEXT | NULL | Setting value (string, number, boolean, JSON) |
| `type` | ENUM | DEFAULT 'string' | Value type (string/number/boolean/json) |
| `description` | TEXT | NULL | Human-readable description |
| `updated_by` | INTEGER | NULL, FOREIGN KEY → `users.id` | User who last updated this setting |
| `created_at` | DATETIME | NOT NULL | Setting creation timestamp |
| `updated_at` | DATETIME | NOT NULL | Last update timestamp |

**Why These Columns?**

- **`key`**: Unique setting identifier (e.g., 'site_title', 'maintenance_mode')
- **`value`**: Setting value (stored as text, parsed by `type`)
- **`type`**: How to parse `value` (string/number/boolean/json)
- **`description`**: Helpful for admin UI
- **`updated_by`**: Audit trail (who changed what)
- **Timestamps**: Track creation and updates

**Why This Table?**

- **Dynamic Configuration**: Change settings without code changes
- **Admin Panel**: Allow admins to configure system
- **Flexibility**: Store various types of settings

**Default Settings:**
- `site_title`: 'Full-Stack Application'
- `maintenance_mode`: false
- `pagination_limit`: 10
- `max_file_size`: 10485760 (10MB)
- `session_timeout`: 900 (15 minutes)

**Foreign Keys:**
- `updated_by` → `users.id`: Links to user who updated (nullable)

**Indexes:**
- Primary key on `id`
- Unique index on `key` (for fast lookup)

---

## Database Relationships (ER Diagram)

```
users
  ├── role_id → roles.id (Many-to-One)
  ├── user_logs.user_id → users.id (One-to-Many)
  ├── user_logs.performed_by → users.id (One-to-Many)
  ├── notifications.user_id → users.id (One-to-Many)
  ├── files.user_id → users.id (One-to-Many)
  ├── password_resets.user_id → users.id (One-to-Many)
  ├── refresh_tokens.user_id → users.id (One-to-Many)
  └── system_settings.updated_by → users.id (One-to-Many)

roles
  ├── users.role_id → roles.id (One-to-Many)
  ├── notifications.role_id → roles.id (One-to-Many)
  └── role_permissions.role_id → roles.id (Many-to-Many via junction)

permissions
  └── role_permissions.permission_id → permissions.id (Many-to-Many via junction)

role_permissions (Junction Table)
  ├── role_id → roles.id
  └── permission_id → permissions.id
```

**Key Relationships:**

1. **Users → Roles**: Many users can have one role (Many-to-One)
2. **Roles → Permissions**: Many roles can have many permissions (Many-to-Many via `role_permissions`)
3. **Users → Logs**: One user can have many log entries
4. **Users → Files**: One user can upload many files
5. **Users → Refresh Tokens**: One user can have multiple refresh tokens (multi-device)

---

## Authentication & Authorization

### Authentication Flow

1. **Login**:
   - User submits username/password
   - Server validates credentials
   - Server generates:
     - **Access Token** (JWT, expires in 15 minutes)
     - **Refresh Token** (stored in database, expires in 7 days)
   - Client stores both tokens (localStorage)

2. **API Requests**:
   - Client sends access token in `Authorization: Bearer <token>` header
   - Server validates token (JWT verification)
   - Server extracts user info from token
   - Request proceeds

3. **Token Refresh**:
   - Access token expires (15 min)
   - Client uses refresh token to get new access token
   - Server validates refresh token (check database)
   - Server issues new access token
   - Client updates access token

4. **Logout**:
   - Client calls logout endpoint
   - Server revokes refresh token (marks as revoked)
   - Client clears tokens from localStorage

### Authorization (RBAC)

**Role-Based Access Control (RBAC)**:

1. **Roles**: 
   - `readonly`: View-only access
   - `admin`: User management
   - `superadmin`: Full access

2. **Permissions**: Granular actions
   - `view_users`, `create_users`, `edit_users`, `delete_users`
   - `view_roles`, `create_roles`, `edit_roles`, `delete_roles`
   - `view_dashboard`, `view_pages`

3. **Permission Check**:
   - Middleware checks user's role
   - Middleware checks role's permissions
   - Allow/deny based on permission

**Middleware Functions**:

- **`authenticate`**: Verify JWT token, load user
- **`authorize(...roles)`**: Check if user has one of the allowed roles
- **`checkPermission(permission)`**: Check if user's role has specific permission

**Example Usage**:
```javascript
// Only authenticated users
router.get('/users', authenticate, getUsers);

// Only admin or superadmin
router.post('/users', authenticate, authorize('admin', 'superadmin'), createUser);

// Check specific permission
router.delete('/users/:id', authenticate, checkPermission('delete_users'), deleteUser);
```

---

## API Endpoints

### Authentication (`/api/auth`)

- `POST /api/auth/login` - User login
  - Body: `{ username, password }`
  - Returns: `{ accessToken, refreshToken, user }`

- `POST /api/auth/logout` - User logout
  - Body: `{ refreshToken }`
  - Revokes refresh token

- `POST /api/auth/refresh` - Refresh access token
  - Body: `{ refreshToken }`
  - Returns: `{ accessToken }`

- `GET /api/auth/me` - Get current user
  - Headers: `Authorization: Bearer <token>`
  - Returns: `{ user }`

- `POST /api/auth/forgot-password` - Request password reset
  - Body: `{ email }`
  - Sends reset email

- `POST /api/auth/reset-password` - Reset password with token
  - Body: `{ token, password }`
  - Resets password

### Users (`/api/users`)

- `GET /api/users` - Get all users (paginated)
  - Query: `?page=1&limit=10&search=...`
  - Requires: Authentication

- `GET /api/users/:id` - Get user by ID
  - Requires: Authentication

- `POST /api/users` - Create new user
  - Body: `{ username, email, password, role_id }`
  - Requires: `create_users` permission

- `PUT /api/users/:id` - Update user
  - Body: `{ username, email, role_id }`
  - Requires: `edit_users` permission

- `DELETE /api/users/:id` - Delete user (soft delete)
  - Requires: `delete_users` permission

### Roles (`/api/roles`)

- `GET /api/roles` - Get all roles
  - Requires: Authentication

- `GET /api/roles/:id` - Get role by ID with permissions
  - Requires: Authentication

- `POST /api/roles` - Create new role
  - Body: `{ name, description, permissions: [1,2,3] }`
  - Requires: `create_roles` permission

- `PUT /api/roles/:id` - Update role
  - Body: `{ name, description, permissions: [1,2,3] }`
  - Requires: `edit_roles` permission

- `DELETE /api/roles/:id` - Delete role
  - Requires: `delete_roles` permission

### Profile (`/api/profile`)

- `GET /api/profile` - Get current user's profile
  - Requires: Authentication

- `PUT /api/profile` - Update current user's profile
  - Body: `{ username, email }`
  - Requires: Authentication

- `PUT /api/profile/password` - Change password
  - Body: `{ currentPassword, newPassword }`
  - Requires: Authentication

- `POST /api/profile/avatar` - Upload avatar
  - Body: `multipart/form-data` (file)
  - Requires: Authentication

### Other Modules

- **Logs** (`/api/logs`): View user activity logs
- **Notifications** (`/api/notifications`): Manage notifications
- **Uploads** (`/api/upload`): File upload handling
- **Settings** (`/api/settings`): System settings management

---

## Frontend Architecture

### Component Structure

**Layout Component** (`Layout.jsx`):
- Main application wrapper
- Sidebar navigation
- Header with user info
- Theme toggle, language switcher
- Renders child routes

**PrivateRoute Component** (`PrivateRoute.jsx`):
- Protects routes from unauthenticated users
- Checks authentication status
- Redirects to login if not authenticated

**Pages**:
- `Login.jsx`: Login form
- `Dashboard.jsx`: Main dashboard (role-based content)
- `Users.jsx`: User management (CRUD)
- `Roles.jsx`: Role management (CRUD)
- `Profile.jsx`: User profile management
- `Page1-3.jsx`: Additional content pages

### State Management

**AuthContext** (`context/AuthContext.jsx`):
- Global authentication state
- User information
- Login/logout functions
- Permission checking (`hasPermission`, `hasRole`)

**ThemeContext** (`context/ThemeContext.jsx`):
- Dark/light mode state
- Theme toggle function

**Why Context API?**
- Simpler than Redux for this use case
- Built into React (no extra dependencies)
- Sufficient for global state (auth, theme)

### Service Layer

**API Service** (`services/api.js`):
- Axios instance with base URL
- Request interceptor: Adds JWT token to headers
- Response interceptor: Handles token refresh, errors

**Service Files**:
- `authService.js`: Authentication API calls
- `userService.js`: User management API calls
- `roleService.js`: Role management API calls
- `profileService.js`: Profile API calls

**Why Service Layer?**
- Centralized API calls
- Easy to mock for testing
- Consistent error handling
- Reusable across components

### Internationalization (i18n)

**Configuration** (`i18n/config.js`):
- Uses `i18next` and `react-i18next`
- Supports English (`en`) and Nepali (`ne`)
- Stores language preference in localStorage

**Usage**:
```javascript
import { useTranslation } from 'react-i18next';

function Component() {
  const { t } = useTranslation();
  return <h1>{t('welcome')}</h1>;
}
```

**Translation Files**:
- `locales/en.json`: English translations
- `locales/ne.json`: Nepali translations

---

## Features & Implementation Details

### 1. User Authentication

**Why JWT?**
- Stateless (no server-side session storage)
- Scalable (works with load balancers)
- Secure (signed tokens)

**Why Refresh Tokens?**
- Access tokens expire quickly (security)
- Refresh tokens last longer (convenience)
- Can revoke refresh tokens (logout)

**Password Security**:
- Passwords hashed with bcrypt (one-way hash)
- Never store plain text passwords
- Bcrypt is slow by design (prevents brute force)

### 2. Role-Based Access Control (RBAC)

**Why RBAC?**
- Flexible permission system
- Easy to add new roles/permissions
- Granular control over actions

**Implementation**:
- Roles stored in `roles` table
- Permissions stored in `permissions` table
- Many-to-many relationship via `role_permissions`
- Middleware checks permissions before allowing actions

### 3. Soft Delete

**Why Soft Delete?**
- Preserve data for auditing
- Can restore deleted users
- Maintain referential integrity (foreign keys)

**Implementation**:
- `deleted_at` column in `users` table
- NULL = active, DATETIME = deleted
- Queries filter out soft-deleted users
- Hard delete only for superadmin (optional)

### 4. File Uploads

**Why Multer?**
- Handles multipart/form-data
- Validates file types/sizes
- Stores files securely

**Implementation**:
- Files stored in `uploads/` directory
- File metadata stored in `files` table
- Avatar uploads in `uploads/avatars/`
- Public URLs generated for frontend access

### 5. Logging System

**Why User Logs?**
- Audit trail for compliance
- Security monitoring
- Debugging user issues

**Implementation**:
- All important actions logged to `user_logs`
- Includes IP address, user agent, details
- Tracks who did what and when

### 6. Notifications

**Why Notifications?**
- Keep users informed
- System alerts
- User engagement

**Implementation**:
- Stored in `notifications` table
- Can target specific users or roles
- Read/unread status tracking

### 7. System Settings

**Why System Settings Table?**
- Dynamic configuration (no code changes)
- Admin-configurable settings
- Flexible key-value store

**Implementation**:
- Key-value pairs in `system_settings`
- Supports string, number, boolean, JSON types
- Cached for performance (optional)

### 8. Internationalization (i18n)

**Why i18n?**
- Support multiple languages
- Better user experience
- Required for some markets

**Implementation**:
- `i18next` for translation management
- Translation files in `locales/`
- Language switcher in UI
- Preference stored in localStorage

### 9. Theme Support

**Why Dark/Light Mode?**
- User preference
- Better UX (reduce eye strain)
- Modern feature

**Implementation**:
- Theme state in `ThemeContext`
- CSS variables for colors
- Preference stored in localStorage
- Toggle button in header

---

## Development Workflow

### Setup

1. **Install Dependencies**:
   ```bash
   npm run install:all
   ```

2. **Database Setup**:
   - Create MySQL database
   - Configure `.env` file in `server/`
   - Database auto-initializes on first run

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   - Runs both client (port 3000) and server (port 5000)

### Scripts

**Root (`package.json`)**:
- `npm run dev`: Run client + server concurrently
- `npm run build`: Build client for production
- `npm run test`: Run all tests
- `npm run lint`: Lint all code

**Client**:
- `npm run dev`: Vite dev server
- `npm run build`: Production build
- `npm run test`: Jest tests
- `npm run test:e2e`: Cypress E2E tests

**Server**:
- `npm run dev`: Nodemon (auto-restart)
- `npm run start`: Production server
- `npm run test`: Jest tests

### Environment Variables

**Server (`.env`)**:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fullstack_app
PORT=5000
JWT_SECRET=your_super_secret_jwt_key
CLIENT_URL=http://localhost:3000
```

---

## Testing

### Test Structure

**Unit Tests**:
- Test individual functions/components
- Mock dependencies
- Fast execution

**Integration Tests**:
- Test API endpoints
- Test database operations
- Test authentication flow

**E2E Tests** (Cypress):
- Test user flows
- Browser-based testing
- Full application testing

### Test Files

**Server**:
- `tests/unit/authController.test.js`: Unit tests for auth
- `tests/integration/auth.test.js`: Integration tests for auth

**Client**:
- `__tests__/components/ThemeToggle.test.jsx`: Component tests
- `__tests__/pages/Login.test.jsx`: Page tests
- `cypress/e2e/auth.cy.js`: E2E auth tests
- `cypress/e2e/dashboard.cy.js`: E2E dashboard tests

---

## Summary

This project is a **comprehensive full-stack application** with:

✅ **Secure Authentication**: JWT with refresh tokens
✅ **Role-Based Access Control**: Flexible permissions system
✅ **User Management**: CRUD operations with soft delete
✅ **Audit Logging**: Track all user actions
✅ **File Uploads**: Avatar and document management
✅ **Notifications**: User and role-based messaging
✅ **System Settings**: Dynamic configuration
✅ **Internationalization**: Multi-language support
✅ **Theme Support**: Dark/light mode
✅ **Modern Stack**: React, Node.js, MySQL, Sequelize
✅ **Testing**: Unit, integration, and E2E tests
✅ **Docker Support**: Containerized deployment

The architecture is **scalable**, **maintainable**, and follows **best practices** for enterprise applications.

---

## Additional Resources

- **Sequelize Documentation**: https://sequelize.org/
- **React Router**: https://reactrouter.com/
- **JWT**: https://jwt.io/
- **i18next**: https://www.i18next.com/
- **Vite**: https://vitejs.dev/

---

*Last Updated: 2024*

