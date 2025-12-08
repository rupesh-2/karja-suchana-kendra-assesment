# Troubleshooting Guide

## Server Crashes on Startup

### Issue: `[nodemon] app crashed - waiting for file changes before starting...`

This usually means the server encountered an error during startup. Common causes:

---

### 1. MySQL Not Running

**Symptoms:**
- Server crashes immediately
- Error messages about database connection

**Solution:**

**Windows:**
```powershell
# Check if MySQL service exists
Get-Service -Name "*mysql*"

# Start MySQL service (replace MySQL80 with your service name)
net start MySQL80

# Or use Services app:
# Win + R → services.msc → Find MySQL → Start
```

**Linux/Mac:**
```bash
# Check status
sudo systemctl status mysql
# or
sudo service mysql status

# Start MySQL
sudo systemctl start mysql
# or
sudo service mysql start
```

---

### 2. Database Doesn't Exist

**Symptoms:**
- Error: `Unknown database 'fullstack_app'`
- Connection works but initialization fails

**Solution:**

1. Connect to MySQL:
   ```bash
   mysql -u root -p
   ```

2. Create the database:
   ```sql
   CREATE DATABASE fullstack_app;
   ```

3. Verify:
   ```sql
   SHOW DATABASES;
   ```

---

### 3. Wrong Database Credentials

**Symptoms:**
- Error: `Access denied for user`
- Connection refused errors

**Solution:**

1. Check your `server/.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_actual_password_here
   DB_NAME=fullstack_app
   ```

2. Test connection manually:
   ```bash
   mysql -u root -p
   # Enter your password
   ```

3. If password is wrong, update `.env` file

---

### 4. Port Already in Use

**Symptoms:**
- Error: `EADDRINUSE` or `Port 5000 is already in use`

**Solution:**

**Option A: Stop the other process**
```bash
# Windows - Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Option B: Change port in `.env`**
```env
PORT=5001
```

---

### 5. Missing Dependencies

**Symptoms:**
- Error: `Cannot find module 'sequelize'`
- Module not found errors

**Solution:**

```bash
cd server
npm install
```

---

## Frontend Proxy Error

### Issue: `http proxy error: /api/auth/login`

This means the frontend can't reach the backend.

**Solutions:**

1. **Make sure backend is running:**
   - Check terminal for `🚀 Server running on http://localhost:5000`
   - If not, fix backend issues first

2. **Check CORS settings:**
   - Backend should allow `http://localhost:3000`
   - Check `server/src/app.js` CORS configuration

3. **Verify proxy in `client/vite.config.js`:**
   ```js
   proxy: {
     '/api': {
       target: 'http://localhost:5000',
       changeOrigin: true
     }
   }
   ```

---

## Quick Diagnostic Commands

Run these to diagnose issues:

```bash
# 1. Check Node.js
node --version

# 2. Check npm
npm --version

# 3. Check if MySQL is running (Windows)
Get-Service "*mysql*"

# 4. Test MySQL connection
mysql -u root -p

# 5. Check if database exists
mysql -u root -p -e "SHOW DATABASES LIKE 'fullstack_app';"

# 6. Check if ports are free
netstat -ano | findstr :5000
netstat -ano | findstr :3000
```

---

## Step-by-Step Recovery

1. **Stop all running servers** (Ctrl+C in all terminals)

2. **Check MySQL:**
   ```bash
   # Start MySQL if not running
   net start MySQL80  # Windows
   # or
   sudo systemctl start mysql  # Linux/Mac
   ```

3. **Create database if needed:**
   ```sql
   mysql -u root -p
   CREATE DATABASE fullstack_app;
   EXIT;
   ```

4. **Verify `.env` file:**
   - File exists in `server/` folder
   - Has correct MySQL credentials
   - No extra spaces or quotes

5. **Reinstall dependencies:**
   ```bash
   cd server
   npm install
   ```

6. **Start server:**
   ```bash
   npm run dev
   ```

7. **Check for error messages** and address them

---

## Still Having Issues?

1. Check the terminal output for specific error messages
2. Look for error codes (e.g., `ECONNREFUSED`, `EADDRINUSE`)
3. Verify all prerequisites are installed
4. Check the main `README.md` for setup instructions

