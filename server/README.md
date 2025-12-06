# Server - Node.js Backend

Express.js backend server with MySQL database, JWT authentication, and role-based access control.

## Setup

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Update `.env` with your database credentials

3. Install dependencies:
```bash
npm install
```

4. Make sure MySQL is running and the database exists

5. Start the server:
```bash
npm run dev
```

The server will run on `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### POST /api/auth/login
Login with username and password.

**Request Body:**
```json
{
  "username": "admin",
  "password": "Admin123!"
}
```

**Response:**
```json
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

#### GET /api/auth/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

#### POST /api/auth/logout
Logout (client-side token removal).

### User Management Endpoints

All user endpoints require authentication.

#### GET /api/users
Get all users (Admin/Super Admin only).

#### GET /api/users/:id
Get user by ID.

#### POST /api/users
Create new user (Admin/Super Admin only).

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@example.com",
  "password": "Password123!",
  "roleId": 2
}
```

#### PUT /api/users/:id
Update user (Admin/Super Admin only).

#### DELETE /api/users/:id
Delete user (Super Admin only).

### Roles Endpoints

#### GET /api/roles
Get all roles.

#### GET /api/roles/:id
Get role by ID.

#### POST /api/roles
Create new role (Super Admin only).

#### PUT /api/roles/:id
Update role (Super Admin only).

#### DELETE /api/roles/:id
Delete role (Super Admin only).

## Database Schema

The server automatically creates the following tables on first run:

- `users` - User accounts
- `roles` - User roles
- `permissions` - Available permissions
- `role_permissions` - Role-permission mappings

## Default Roles

1. **readonly** - Read-Only Role (ID: 1)
2. **admin** - Admin Role (ID: 2)
3. **superadmin** - Super Administrator Role (ID: 3)

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based authorization middleware
- SQL injection protection with parameterized queries
- CORS configuration

