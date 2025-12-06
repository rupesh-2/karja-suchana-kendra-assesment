# Full-Stack Web Application

A modern full-stack web application built with Node.js backend and React frontend, featuring user authentication, role-based access control, and comprehensive user management.

## Project Structure

```
my-fullstack-project/
├── client/                # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── App.jsx
│   ├── public/
│   ├── package.json
│   └── README.md
├── server/                # Node backend
│   ├── src/
│   │   ├── controllers/
│   │   ├── routes/
│   │   ├── models/
│   │   ├── middleware/
│   │   └── app.js
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── docker-compose.yml     # Optional for DB/server/client orchestration
├── package.json           # Root workspace config
├── .gitignore
└── README.md              # Main documentation
```

## Features

- ✅ User Authentication with secure password hashing
- ✅ Dashboard with role-based content
- ✅ User Management (CRUD operations)
- ✅ Roles and Permissions System
- ✅ Three distinct roles: Read-Only, Admin, Super Administrator
- ✅ Multiple pages with static and dynamic sections
- ✅ Role-based access control throughout the application

## Prerequisites

- Node.js (v18 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## Setup Instructions

### 1. Install Dependencies

```bash
npm run install:all
```

Or install individually:
```bash
npm install
cd server && npm install
cd ../client && npm install
```

### 2. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE fullstack_app;
```

2. Copy the environment example file:
```bash
cd server
cp .env.example .env
```

3. Update `server/.env` with your database credentials:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fullstack_app
PORT=5000
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
```

4. Run database migrations (the server will create tables automatically on first run)

### 3. Run the Application

#### Development Mode (runs both server and client)

```bash
npm run dev
```

#### Run Separately

**Backend only:**
```bash
cd server
npm run dev
```

**Frontend only:**
```bash
cd client
npm run dev
```

The backend will run on `http://localhost:5000`
The frontend will run on `http://localhost:3000`

## Default Users

After running the application for the first time, you can use these default credentials:

- **Super Administrator:**
  - Username: `superadmin`
  - Password: `SuperAdmin123!`

- **Administrator:**
  - Username: `admin`
  - Password: `Admin123!`

- **Read-Only User:**
  - Username: `readonly`
  - Password: `ReadOnly123!`

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Users
- `GET /api/users` - Get all users (requires authentication)
- `GET /api/users/:id` - Get user by ID
- `POST /api/users` - Create new user (Admin/Super Admin only)
- `PUT /api/users/:id` - Update user (Admin/Super Admin only)
- `DELETE /api/users/:id` - Delete user (Super Admin only)

### Roles
- `GET /api/roles` - Get all roles
- `GET /api/roles/:id` - Get role by ID
- `POST /api/roles` - Create new role (Super Admin only)
- `PUT /api/roles/:id` - Update role (Super Admin only)
- `DELETE /api/roles/:id` - Delete role (Super Admin only)

## Roles and Permissions

### Read-Only Role
- Can view all pages and content
- Cannot create, edit, or delete any data
- Limited to read operations

### Admin Role
- Can view all pages
- Can manage users (create, edit, delete)
- Cannot manage roles or permissions
- Cannot delete other admins

### Super Administrator Role
- Full access to all features
- Can manage users, roles, and permissions
- Can delete any user including admins
- Complete system control

## Technologies Used

### Backend
- Node.js
- Express.js
- MySQL2
- bcryptjs (password hashing)
- jsonwebtoken (JWT authentication)
- cors
- dotenv

### Frontend
- React.js
- React Router
- Axios
- CSS3

## Development

### Project Structure Details

**Server (`/server`):**
- `src/controllers/` - Request handlers
- `src/routes/` - API route definitions
- `src/models/` - Database models and queries
- `src/middleware/` - Authentication and authorization middleware
- `src/config/` - Database configuration
- `src/utils/` - Utility functions

**Client (`/client`):**
- `src/components/` - Reusable React components
- `src/pages/` - Page components
- `src/hooks/` - Custom React hooks
- `src/services/` - API service functions
- `src/context/` - React context for state management
- `src/utils/` - Utility functions

## Testing

Run tests (when implemented):
```bash
npm test
```

## Deployment

1. Build the React frontend:
```bash
npm run build
```

2. Set production environment variables in `server/.env`

3. Start the production server:
```bash
npm start
```

## License

ISC

## Support

For issues or questions, please refer to the individual README files in the `client/` and `server/` directories.

