# Test Cases Documentation

## Overview

This document outlines all test cases for the Full-Stack Application, organized by testing layer and feature.

---

## Testing Layers

| Layer | Tool | Location |
|-------|------|----------|
| **Backend API Tests** | Jest + Supertest | `server/tests/` |
| **Frontend Component/UI Tests** | React Testing Library + Jest | `client/src/__tests__/` |
| **End-to-End Tests** | Cypress | `cypress/e2e/` |
| **Mocking/Stubs** | Jest mocks | In test files |
| **Static Analysis** | ESLint + Prettier | Root config files |

---

## Backend API Tests (Jest + Supertest)

### Authentication Module

#### POST /api/auth/login
- ✅ **TC-AUTH-001**: Login with valid credentials
  - Input: `{ username: "admin", password: "Admin123!" }`
  - Expected: 200, returns token and user object
  - File: `server/tests/integration/auth.test.js`

- ✅ **TC-AUTH-002**: Login with invalid credentials
  - Input: `{ username: "admin", password: "wrong" }`
  - Expected: 401, error message
  - File: `server/tests/integration/auth.test.js`

- ✅ **TC-AUTH-003**: Login with missing credentials
  - Input: `{}`
  - Expected: 400, validation error
  - File: `server/tests/integration/auth.test.js`

- ✅ **TC-AUTH-004**: Login with non-existent user
  - Input: `{ username: "nonexistent", password: "password" }`
  - Expected: 401, invalid credentials
  - File: `server/tests/unit/authController.test.js`

#### GET /api/auth/me
- ✅ **TC-AUTH-005**: Get current user with valid token
  - Headers: `Authorization: Bearer <token>`
  - Expected: 200, user profile
  - File: `server/tests/integration/auth.test.js`

- ✅ **TC-AUTH-006**: Get current user without token
  - Headers: None
  - Expected: 401, authentication required
  - File: `server/tests/integration/auth.test.js`

- ✅ **TC-AUTH-007**: Get current user with expired token
  - Headers: `Authorization: Bearer <expired_token>`
  - Expected: 401, token expired
  - File: `server/tests/integration/auth.test.js`

#### POST /api/auth/forgot
- ⏳ **TC-AUTH-008**: Request password reset with valid email
  - Input: `{ email: "user@example.com" }`
  - Expected: 200, success message
  - Status: Pending implementation

- ⏳ **TC-AUTH-009**: Request password reset with invalid email
  - Input: `{ email: "invalid" }`
  - Expected: 400, validation error
  - Status: Pending implementation

#### POST /api/auth/reset
- ⏳ **TC-AUTH-010**: Reset password with valid token
  - Input: `{ token: "<valid_token>", newPassword: "NewPass123!" }`
  - Expected: 200, success message
  - Status: Pending implementation

- ⏳ **TC-AUTH-011**: Reset password with expired token
  - Input: `{ token: "<expired_token>", newPassword: "NewPass123!" }`
  - Expected: 400, token expired
  - Status: Pending implementation

---

### Profile Module

#### GET /api/profile/me
- ⏳ **TC-PROF-001**: Get own profile
  - Auth: Required
  - Expected: 200, user profile data
  - Status: Pending test

- ⏳ **TC-PROF-002**: Get profile without authentication
  - Auth: None
  - Expected: 401, unauthorized
  - Status: Pending test

#### PUT /api/profile/update
- ⏳ **TC-PROF-003**: Update username
  - Input: `{ username: "newusername" }`
  - Expected: 200, updated profile
  - Status: Pending test

- ⏳ **TC-PROF-004**: Update email
  - Input: `{ email: "newemail@example.com" }`
  - Expected: 200, updated profile
  - Status: Pending test

- ⏳ **TC-PROF-005**: Update password with correct current password
  - Input: `{ password: "NewPass123!", currentPassword: "OldPass123!" }`
  - Expected: 200, success
  - Status: Pending test

- ⏳ **TC-PROF-006**: Update password with incorrect current password
  - Input: `{ password: "NewPass123!", currentPassword: "WrongPass" }`
  - Expected: 401, incorrect current password
  - Status: Pending test

- ⏳ **TC-PROF-007**: Update with duplicate username
  - Input: `{ username: "existinguser" }`
  - Expected: 400, username already exists
  - Status: Pending test

---

### User Management Module

#### GET /api/users
- ⏳ **TC-USER-001**: Get all users as Admin
  - Auth: Admin role
  - Expected: 200, list of users
  - Status: Pending test

- ⏳ **TC-USER-002**: Get all users as Read-Only
  - Auth: Read-Only role
  - Expected: 403, forbidden
  - Status: Pending test

- ⏳ **TC-USER-003**: Get all users without authentication
  - Auth: None
  - Expected: 401, unauthorized
  - Status: Pending test

#### POST /api/users
- ⏳ **TC-USER-004**: Create user as Admin
  - Input: `{ username: "newuser", email: "new@example.com", password: "Pass123!", role_id: 1 }`
  - Expected: 201, created user
  - Status: Pending test

- ⏳ **TC-USER-005**: Create user with duplicate username
  - Input: `{ username: "existing", ... }`
  - Expected: 400, username exists
  - Status: Pending test

- ⏳ **TC-USER-006**: Create user as Read-Only (should fail)
  - Auth: Read-Only role
  - Expected: 403, forbidden
  - Status: Pending test

#### PUT /api/users/:id
- ⏳ **TC-USER-007**: Update user as Admin
  - Input: `{ username: "updated" }`
  - Expected: 200, updated user
  - Status: Pending test

- ⏳ **TC-USER-008**: Update user as Read-Only (should fail)
  - Auth: Read-Only role
  - Expected: 403, forbidden
  - Status: Pending test

#### DELETE /api/users/:id
- ⏳ **TC-USER-009**: Delete user as Super Admin
  - Auth: Super Admin
  - Expected: 200, success
  - Status: Pending test

- ⏳ **TC-USER-010**: Delete user as Admin (should fail)
  - Auth: Admin role
  - Expected: 403, forbidden
  - Status: Pending test

---

### Logs Module

#### GET /api/logs
- ⏳ **TC-LOG-001**: Get all logs as Super Admin
  - Auth: Super Admin
  - Expected: 200, list of logs
  - Status: Pending test

- ⏳ **TC-LOG-002**: Get all logs as Admin (should fail)
  - Auth: Admin role
  - Expected: 403, forbidden
  - Status: Pending test

#### GET /api/logs/user/:userId
- ⏳ **TC-LOG-003**: Get own logs
  - Auth: User
  - Expected: 200, user's logs
  - Status: Pending test

- ⏳ **TC-LOG-004**: Get other user's logs (should fail)
  - Auth: Regular user
  - Expected: 403, forbidden
  - Status: Pending test

---

### Notifications Module

#### GET /api/notifications
- ⏳ **TC-NOTIF-001**: Get user notifications
  - Auth: Required
  - Expected: 200, list of notifications
  - Status: Pending test

- ⏳ **TC-NOTIF-002**: Get unread notifications only
  - Query: `?read=false`
  - Expected: 200, unread notifications
  - Status: Pending test

#### PUT /api/notifications/:id/read
- ⏳ **TC-NOTIF-003**: Mark notification as read
  - Expected: 200, success
  - Status: Pending test

#### PUT /api/notifications/read-all
- ⏳ **TC-NOTIF-004**: Mark all notifications as read
  - Expected: 200, success
  - Status: Pending test

---

### File Upload Module

#### POST /api/upload/upload
- ⏳ **TC-UPLOAD-001**: Upload valid file
  - Input: Multipart file
  - Expected: 201, file record
  - Status: Pending test

- ⏳ **TC-UPLOAD-002**: Upload file exceeding size limit
  - Input: Large file (>10MB)
  - Expected: 400, file too large
  - Status: Pending test

- ⏳ **TC-UPLOAD-003**: Upload invalid file type
  - Input: Executable file
  - Expected: 400, invalid file type
  - Status: Pending test

#### GET /api/upload/files
- ⏳ **TC-UPLOAD-004**: Get own files
  - Expected: 200, user's files
  - Status: Pending test

- ⏳ **TC-UPLOAD-005**: Get all files as Super Admin
  - Auth: Super Admin
  - Expected: 200, all files
  - Status: Pending test

#### DELETE /api/upload/files/:id
- ⏳ **TC-UPLOAD-006**: Delete own file
  - Expected: 200, success
  - Status: Pending test

- ⏳ **TC-UPLOAD-007**: Delete other user's file (should fail)
  - Expected: 403, forbidden
  - Status: Pending test

---

## Frontend Component Tests (React Testing Library)

### Theme Toggle Component

- ✅ **TC-COMP-001**: Render theme toggle button
  - File: `client/src/__tests__/components/ThemeToggle.test.jsx`
  - Expected: Button visible with icon

- ✅ **TC-COMP-002**: Toggle theme on click
  - Action: Click toggle button
  - Expected: Theme changes between light/dark
  - File: `client/src/__tests__/components/ThemeToggle.test.jsx`

- ✅ **TC-COMP-003**: Display correct icon based on theme
  - Expected: Moon icon in light mode, sun in dark mode
  - File: `client/src/__tests__/components/ThemeToggle.test.jsx`

### Login Page

- ✅ **TC-COMP-004**: Render login form
  - Expected: Username, password fields, submit button visible
  - File: `client/src/__tests__/pages/Login.test.jsx`

- ✅ **TC-COMP-005**: Show error on invalid credentials
  - Action: Submit with wrong credentials
  - Expected: Error message displayed
  - File: `client/src/__tests__/pages/Login.test.jsx`

- ✅ **TC-COMP-006**: Validate required fields
  - Action: Submit empty form
  - Expected: Validation errors shown
  - File: `client/src/__tests__/pages/Login.test.jsx`

### Dashboard Component

- ⏳ **TC-COMP-007**: Display dashboard content
  - Expected: Welcome message, stats visible
  - Status: Pending test

- ⏳ **TC-COMP-008**: Show role-based content
  - Expected: Dynamic sections based on user role
  - Status: Pending test

### Users Page

- ⏳ **TC-COMP-009**: Display users table
  - Expected: Users list rendered
  - Status: Pending test

- ⏳ **TC-COMP-010**: Create user modal
  - Action: Click "Add New User"
  - Expected: Modal opens with form
  - Status: Pending test

- ⏳ **TC-COMP-011**: Edit user
  - Action: Click edit button
  - Expected: Modal opens with pre-filled data
  - Status: Pending test

- ⏳ **TC-COMP-012**: Delete user confirmation
  - Action: Click delete button
  - Expected: Confirmation dialog appears
  - Status: Pending test

### Layout Component

- ⏳ **TC-COMP-013**: Display navigation menu
  - Expected: All menu items visible
  - Status: Pending test

- ⏳ **TC-COMP-014**: Highlight active route
  - Expected: Current page highlighted in nav
  - Status: Pending test

- ⏳ **TC-COMP-015**: Show user info in navbar
  - Expected: Username and role displayed
  - Status: Pending test

---

## End-to-End Tests (Cypress)

### Authentication Flow

- ✅ **TC-E2E-001**: Complete login flow
  - Steps:
    1. Visit `/login`
    2. Enter credentials
    3. Submit form
    4. Verify redirect to dashboard
  - File: `cypress/e2e/auth.cy.js`

- ✅ **TC-E2E-002**: Login with invalid credentials
  - Steps:
    1. Visit `/login`
    2. Enter wrong credentials
    3. Submit form
    4. Verify error message
  - File: `cypress/e2e/auth.cy.js`

- ✅ **TC-E2E-003**: Logout flow
  - Steps:
    1. Login
    2. Click logout
    3. Verify redirect to login
  - File: `cypress/e2e/auth.cy.js`

### Dashboard Flow

- ✅ **TC-E2E-004**: Navigate to dashboard
  - Steps:
    1. Login
    2. Verify dashboard content
  - File: `cypress/e2e/dashboard.cy.js`

- ✅ **TC-E2E-005**: Navigate to users page
  - Steps:
    1. Login
    2. Click "Users" in nav
    3. Verify users page
  - File: `cypress/e2e/dashboard.cy.js`

- ✅ **TC-E2E-006**: Toggle theme
  - Steps:
    1. Login
    2. Click theme toggle
    3. Verify theme changes
  - File: `cypress/e2e/dashboard.cy.js`

### User Management Flow

- ⏳ **TC-E2E-007**: Create new user
  - Steps:
    1. Login as Admin
    2. Navigate to Users
    3. Click "Add New User"
    4. Fill form and submit
    5. Verify user appears in list
  - Status: Pending test

- ⏳ **TC-E2E-008**: Edit user
  - Steps:
    1. Login as Admin
    2. Navigate to Users
    3. Click edit on a user
    4. Update fields and save
    5. Verify changes reflected
  - Status: Pending test

- ⏳ **TC-E2E-009**: Delete user
  - Steps:
    1. Login as Super Admin
    2. Navigate to Users
    3. Click delete on a user
    4. Confirm deletion
    5. Verify user removed
  - Status: Pending test

### Role-Based Access

- ⏳ **TC-E2E-010**: Read-Only user restrictions
  - Steps:
    1. Login as Read-Only user
    2. Verify no create/edit/delete buttons
    3. Attempt to access admin routes
    4. Verify access denied
  - Status: Pending test

- ⏳ **TC-E2E-011**: Admin user permissions
  - Steps:
    1. Login as Admin
    2. Verify can manage users
    3. Verify cannot manage roles
  - Status: Pending test

---

## Test Coverage Goals

### Backend
- **Unit Tests**: 80%+ coverage
- **Integration Tests**: All API endpoints covered
- **Critical Paths**: 100% coverage

### Frontend
- **Component Tests**: 70%+ coverage
- **User Interactions**: All major flows tested
- **Edge Cases**: Error states, loading states

### E2E
- **Critical User Flows**: 100% coverage
- **Authentication**: Complete flow
- **Role-Based Access**: All roles tested

---

## Running Tests

### Backend Tests
```bash
cd server
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
npm run test:unit     # Unit tests only
npm run test:integration # Integration tests only
```

### Frontend Tests
```bash
cd client
npm test              # Run all tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
npm run test:ui       # Component tests only
```

### E2E Tests
```bash
cd client
npm run test:e2e      # Open Cypress UI
npm run test:e2e:headless # Run headless
```

### All Tests
```bash
npm test              # From root - runs all
npm run test:coverage # All with coverage
```

---

## Test Status Legend

- ✅ **Implemented** - Test written and passing
- ⏳ **Pending** - Test case defined, not yet implemented
- 🔄 **In Progress** - Currently being written
- ❌ **Failing** - Test exists but currently failing

---

## Notes

- All tests should be independent and not rely on each other
- Use test databases for integration tests
- Mock external services (email, file storage)
- Clean up test data after each test
- Use factories/fixtures for test data generation
- Maintain test coverage reports

---

## Future Test Cases

### Performance Tests
- Load testing with multiple concurrent users
- API response time benchmarks
- Database query optimization tests

### Security Tests
- SQL injection prevention
- XSS attack prevention
- CSRF protection
- JWT token validation

### Accessibility Tests
- Screen reader compatibility
- Keyboard navigation
- ARIA labels validation
- Color contrast checks

