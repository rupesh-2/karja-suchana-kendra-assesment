# Test Setup Guide

## Test Database Configuration

Tests use a separate test database: `fullstack_app_test`

### Automatic Setup

The test setup automatically:

1. Creates the test database if it doesn't exist
2. Syncs all tables (creates schema)
3. Sets up test data
4. Cleans up after tests

### Manual Setup (Optional)

If you want to create the test database manually:

```sql
CREATE DATABASE fullstack_app_test;
```

---

## Running Tests

### Prerequisites

1. **MySQL must be running**
2. **Test database will be created automatically** (or create manually)

### Run Tests

```bash
# All tests
npm test

# Backend tests only
cd server && npm test

# Frontend tests only
cd client && npm test

# With coverage
npm run test:coverage
```

---

## Test Environment Variables

Tests use these environment variables (set in `server/tests/setup.js`):

```env
NODE_ENV=test
DB_NAME=fullstack_app_test
DB_HOST=localhost
DB_USER=root
DB_PASSWORD= (empty or your password)
JWT_SECRET=test_jwt_secret_key_for_testing_only
PORT=5001
```

---

## Test Database Isolation

- Tests use a separate database (`fullstack_app_test`)
- Tables are recreated fresh for each test run (`force: true`)
- Test data is cleaned up after each test suite
- No impact on development database

---

## Troubleshooting

### "Unknown database 'fullstack_app_test'"

**Solution**: The test setup will create it automatically. If it fails:

1. Make sure MySQL is running
2. Check database credentials in test setup
3. Create manually: `CREATE DATABASE fullstack_app_test;`

### "Connection refused"

**Solution**:

1. Start MySQL service
2. Check MySQL is accessible
3. Verify credentials

### Tests timing out

**Solution**:

- Increase timeout in `jest.setTimeout(30000)`
- Check database connection speed
- Ensure MySQL is responsive

---

## Test Structure

```
server/tests/
├── setup.js              # Test environment setup
├── helpers/
│   └── databaseHelper.js # Database setup/cleanup utilities
├── unit/                 # Unit tests (mocked dependencies)
│   └── authController.test.js
└── integration/          # Integration tests (real database)
    └── auth.test.js
```

---

## Best Practices

1. **Use test database** - Never use production database
2. **Clean up** - Always clean up test data
3. **Isolated tests** - Each test should be independent
4. **Mock external services** - Don't call real APIs in tests
5. **Fast tests** - Keep tests running quickly
