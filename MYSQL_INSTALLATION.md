# MySQL Installation Guide for Windows

## Option 1: MySQL Community Server (Recommended)

### Step 1: Download MySQL

1. Go to: https://dev.mysql.com/downloads/mysql/
2. Select **Windows (x86, 64-bit), ZIP Archive** (or use the MySQL Installer)
3. Download the ZIP file

### Step 2: Install MySQL

**Using MySQL Installer (Easiest):**
1. Download **MySQL Installer for Windows** from: https://dev.mysql.com/downloads/installer/
2. Run the installer
3. Choose **Developer Default** or **Server only**
4. Follow the installation wizard
5. **Remember the root password** you set during installation!

**Using ZIP Archive:**
1. Extract the ZIP to `C:\mysql` (or your preferred location)
2. Create `my.ini` file in the MySQL directory:
   ```ini
   [mysqld]
   basedir=C:/mysql
   datadir=C:/mysql/data
   port=3306
   ```
3. Open Command Prompt as Administrator
4. Navigate to MySQL bin directory:
   ```cmd
   cd C:\mysql\bin
   ```
5. Initialize MySQL:
   ```cmd
   mysqld --initialize --console
   ```
6. Note the temporary root password shown
7. Install MySQL as service:
   ```cmd
   mysqld --install
   ```
8. Start MySQL:
   ```cmd
   net start mysql
   ```
9. Login and change password:
   ```cmd
   mysql -u root -p
   # Enter temporary password
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_new_password';
   EXIT;
   ```

---

## Option 2: XAMPP (Easiest for Beginners)

XAMPP includes MySQL, Apache, PHP, and phpMyAdmin.

### Step 1: Download XAMPP

1. Go to: https://www.apachefriends.org/download.html
2. Download **XAMPP for Windows**
3. Run the installer

### Step 2: Start MySQL

1. Open **XAMPP Control Panel**
2. Click **Start** next to MySQL
3. MySQL will run on port 3306

### Step 3: Set Root Password (Optional but Recommended)

1. Open Command Prompt
2. Navigate to XAMPP MySQL:
   ```cmd
   cd C:\xampp\mysql\bin
   ```
3. Login:
   ```cmd
   mysql -u root
   ```
4. Set password:
   ```sql
   ALTER USER 'root'@'localhost' IDENTIFIED BY 'your_password';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Step 4: Update .env File

In `server/.env`:
```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fullstack_app
```

---

## Option 3: WAMP Server

Similar to XAMPP but Windows-specific.

1. Download from: https://www.wampserver.com/
2. Install and start MySQL service
3. Use phpMyAdmin to manage databases

---

## After Installation

### 1. Verify MySQL is Running

**Windows Services:**
```powershell
Get-Service -Name "*mysql*"
```

**Or check in Services:**
- Press `Win + R`
- Type `services.msc`
- Look for MySQL service (should be "Running")

### 2. Add MySQL to PATH (Optional)

If `mysql` command doesn't work:

1. Find MySQL installation directory (usually `C:\Program Files\MySQL\MySQL Server 8.0\bin`)
2. Add to System PATH:
   - Right-click **This PC** → **Properties**
   - **Advanced system settings** → **Environment Variables**
   - Under **System variables**, find **Path** → **Edit**
   - **New** → Add MySQL bin path
   - Click **OK** on all windows
3. Restart Command Prompt

### 3. Create Database

```cmd
mysql -u root -p
# Enter your password

CREATE DATABASE fullstack_app;
EXIT;
```

### 4. Test Connection

```cmd
mysql -u root -p fullstack_app
# If this works, you're good to go!
```

---

## Quick Start Commands

```powershell
# Check if MySQL service exists
Get-Service "*mysql*"

# Start MySQL (replace MySQL80 with your service name)
net start MySQL80

# Stop MySQL
net stop MySQL80

# Test connection
mysql -u root -p
```

---

## Troubleshooting

### MySQL service won't start

1. Check if port 3306 is in use:
   ```cmd
   netstat -ano | findstr :3306
   ```
2. Check MySQL error log (usually in `C:\ProgramData\MySQL\MySQL Server 8.0\Data\`)
3. Try restarting the service:
   ```cmd
   net stop MySQL80
   net start MySQL80
   ```

### "Access denied" errors

- Verify password in `.env` file
- Try resetting root password
- Check if user has proper permissions

### Port 3306 already in use

- Another MySQL instance might be running
- Check XAMPP/WAMP if installed
- Change MySQL port in `my.ini` if needed

---

## Recommended: XAMPP for Quick Setup

If you just want to get started quickly, **XAMPP is the easiest option**:
- One-click MySQL start/stop
- Includes phpMyAdmin for database management
- No complex configuration needed

Download: https://www.apachefriends.org/download.html

