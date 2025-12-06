# Client - React Frontend

React frontend application built with Vite, React Router, and modern React hooks.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start development server:
```bash
npm run dev
```

The application will run on `http://localhost:3000`

## Features

- User authentication with JWT
- Protected routes
- Role-based UI rendering
- User management interface
- Roles and permissions management
- Multiple pages with static and dynamic sections
- Responsive design

## Project Structure

```
src/
├── components/       # Reusable components
│   ├── Layout.jsx   # Main layout with navigation
│   └── PrivateRoute.jsx
├── context/          # React context
│   └── AuthContext.jsx
├── pages/           # Page components
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   ├── Users.jsx
│   ├── Roles.jsx
│   ├── Page1.jsx
│   ├── Page2.jsx
│   └── Page3.jsx
├── services/        # API services
│   ├── api.js
│   ├── authService.js
│   ├── userService.js
│   └── roleService.js
├── App.jsx          # Main app component
├── main.jsx         # Entry point
└── index.css        # Global styles
```

## Pages

1. **Login** - User authentication
2. **Dashboard** - Overview with role-based content
3. **Users** - User management (CRUD operations)
4. **Roles** - Roles and permissions management
5. **Page 1** - Information page with role-based content
6. **Page 2** - Analytics page with role-based features
7. **Page 3** - Settings page with role-based options

## Role-Based Features

### Read-Only Role
- Can view all pages
- Cannot create, edit, or delete
- Limited UI elements

### Admin Role
- Can view all pages
- Can manage users (create, edit, delete)
- Cannot manage roles
- Additional UI features

### Super Admin Role
- Full access to all features
- Can manage users and roles
- All UI features available
- Exclusive sections visible

## Build

To build for production:
```bash
npm run build
```

The build output will be in the `dist/` directory.

