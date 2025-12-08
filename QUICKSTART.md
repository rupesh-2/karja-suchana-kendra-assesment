# Quick Start Guide

## Step-by-Step Instructions to Run the Application

### Prerequisites Check
- ✅ Node.js installed (check with: `node --version`)
- ✅ MySQL installed and running (check with: `mysql --version`)
- ✅ npm installed (comes with Node.js)

---

## Step 1: Install Dependencies

From the root directory, run:

```bash
npm run install:all
```

This will install dependencies for:
- Root workspace
- Server (backend)
- Client (frontend)

**OR** install individually:

```bash
# Root
npm install

# Server
cd server
npm install
cd ..

# Client
cd client
npm install
cd ..
```

---

## Step 2: Set Up MySQL Database

1. **Start MySQL service** (if not already running)

2. **Create the database:**
   ```sql
   CREATE DATABASE fullstack_app;
   ```

3. **Verify database exists:**
   ```sql
   SHOW DATABASES;
   ```

---

## Step 3: Configure Environment Variables

1. **Navigate to server folder:**
   ```bash
   cd server
   ```

2. **Check if `.env` file exists:**
   - If it doesn't exist, copy from `.env.example`:
     ```bash
     copy .env.example .env
     ```
   - On Linux/Mac:
     ```bash
     cp .env.example .env
     ```

3. **Edit `.env` file** with your MySQL credentials:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_mysql_password_here
   DB_NAME=fullstack_app
   PORT=5000
   NODE_ENV=development
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   ```

   **Important:** Replace `your_mysql_password_here` with your actual MySQL root password!

---

## Step 4: Run the Application

### Option A: Run Both Server and Client Together (Recommended)

From the **root directory**:

```bash
npm run dev
```

This will start:
- **Backend Server** on `http://localhost:5000`
- **Frontend Client** on `http://localhost:3000`

### Option B: Run Separately

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

---

## Step 5: Access the Application

1. **Open your browser** and go to:
   ```
   http://localhost:3000
   ```

2. **Login with default credentials:**
   - **Super Admin:**
     - Username: `superadmin`
     - Password: `SuperAdmin123!`
   
   - **Admin:**
     - Username: `admin`
     - Password: `Admin123!`
   
   - **Read-Only:**
     - Username: `readonly`
     - Password: `ReadOnly123!`

---

## Troubleshooting

### Server won't start

1. **Check MySQL is running:**
   ```bash
   # Windows
   net start MySQL80
   
   # Linux/Mac
   sudo systemctl start mysql
   ```

2. **Verify database exists:**
   ```sql
   SHOW DATABASES LIKE 'fullstack_app';
   ```

3. **Check `.env` file:**
   - Make sure it exists in `server/` folder
   - Verify all credentials are correct
   - No extra spaces or quotes

4. **Check port availability:**
   - Port 5000 should be free for backend
   - Port 3000 should be free for frontend

### Database connection errors

- Verify MySQL credentials in `.env`
- Make sure database `fullstack_app` exists
- Check MySQL user has proper permissions

### Frontend won't connect to backend

- Make sure backend is running on port 5000
- Check CORS settings in `server/src/app.js`
- Verify proxy settings in `client/vite.config.js`

---

## What Happens on First Run?

1. **Database tables are created automatically** (via Sequelize)
2. **Default roles are created:**
   - readonly
   - admin
   - superadmin
3. **Default permissions are assigned**
4. **Default users are created** (if no users exist)

---

## Development Commands

### Backend only:
```bash
cd server
npm run dev    # Development mode with nodemon
npm start      # Production mode
```

### Frontend only:
```bash
cd client
npm run dev    # Development server
npm run build  # Build for production
npm run preview # Preview production build
```

### Both together:
```bash
npm run dev    # From root directory
```

---

## Project Structure

```
my-fullstack-project/
├── client/          # React frontend (port 3000)
├── server/          # Node.js backend (port 5000)
├── package.json     # Root workspace config
└── README.md        # Full documentation
```

---

## Need Help?

- Check the main `README.md` for detailed documentation
- Check `server/README.md` for backend API docs
- Check `client/README.md` for frontend docs

