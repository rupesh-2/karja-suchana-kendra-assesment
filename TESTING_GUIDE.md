# Testing Guide

## Overview

This project uses a comprehensive testing strategy with multiple layers:

| Layer | Tool | Purpose |
|-------|------|---------|
| **Backend API Tests** | Jest + Supertest | Test API endpoints and business logic |
| **Frontend Component Tests** | React Testing Library + Jest | Test React components and UI interactions |
| **End-to-End Tests** | Cypress | Test complete user workflows |
| **Static Analysis** | ESLint + Prettier | Code quality and formatting |

---

## Quick Start

### Install Dependencies

```bash
# Install all dependencies
npm run install:all

# Or install separately
cd server && npm install
cd ../client && npm install
```

### Run Tests

```bash
# Run all tests
npm test

# Run backend tests only
npm run test:server

# Run frontend tests only
npm run test:client

# Run E2E tests
npm run test:e2e
```

---

## Backend Testing (Jest + Supertest)

### Setup

Tests are located in `server/tests/`:
- `unit/` - Unit tests for controllers, services, models
- `integration/` - Integration tests for API endpoints

### Configuration

- **Config File**: `server/jest.config.js`
- **Setup File**: `server/tests/setup.js`
- **Test Environment**: Node.js

### Running Backend Tests

```bash
cd server

# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# Unit tests only
npm run test:unit

# Integration tests only
npm run test:integration
```

### Example Test Structure

```javascript
// server/tests/unit/authController.test.js
describe('Auth Controller', () => {
  it('should login successfully', async () => {
    // Test implementation
  });
});

// server/tests/integration/auth.test.js
describe('POST /api/auth/login', () => {
  it('should return token on valid credentials', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ username: 'admin', password: 'Admin123!' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
```

---

## Frontend Testing (React Testing Library + Jest)

### Setup

Tests are located in `client/src/__tests__/`:
- `components/` - Component tests
- `pages/` - Page component tests
- `hooks/` - Custom hook tests
- `services/` - Service/API tests

### Configuration

- **Config File**: `client/jest.config.js`
- **Setup File**: `client/src/setupTests.js`
- **Test Environment**: jsdom (browser-like)

### Running Frontend Tests

```bash
cd client

# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage

# Component tests only
npm run test:ui
```

### Example Test Structure

```javascript
// client/src/__tests__/components/ThemeToggle.test.jsx
import { render, screen, fireEvent } from '@testing-library/react';

describe('ThemeToggle Component', () => {
  it('should toggle theme on click', () => {
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark');
  });
});
```

---

## End-to-End Testing (Cypress)

### Setup

- **Config File**: `cypress.config.js`
- **Test Files**: `cypress/e2e/*.cy.js`
- **Fixtures**: `cypress/fixtures/` (if needed)

### Running E2E Tests

```bash
cd client

# Open Cypress UI
npm run test:e2e

# Run headless
npm run test:e2e:headless
```

### Example E2E Test

```javascript
// cypress/e2e/auth.cy.js
describe('Authentication', () => {
  it('should login successfully', () => {
    cy.visit('/login');
    cy.get('input[type="text"]').type('admin');
    cy.get('input[type="password"]').type('Admin123!');
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});
```

---

## Code Quality (ESLint + Prettier)

### ESLint

**Config**: `.eslintrc.js`

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Prettier

**Config**: `.prettierrc`

```bash
# Format all code
npm run format

# Format specific directory
prettier --write "src/**/*.{js,jsx}"
```

---

## Test Coverage

### View Coverage Reports

```bash
# Backend coverage
cd server && npm run test:coverage
# Open: server/coverage/lcov-report/index.html

# Frontend coverage
cd client && npm run test:coverage
# Open: client/coverage/lcov-report/index.html
```

### Coverage Goals

- **Backend**: 80%+ overall, 100% for critical paths
- **Frontend**: 70%+ overall, 100% for user interactions
- **E2E**: All critical user flows covered

---

## Writing Tests

### Best Practices

1. **Arrange-Act-Assert Pattern**
   ```javascript
   it('should do something', () => {
     // Arrange: Set up test data
     const input = { username: 'test' };
     
     // Act: Execute the function
     const result = functionToTest(input);
     
     // Assert: Verify the result
     expect(result).toBe(expected);
   });
   ```

2. **Test Independence**
   - Each test should be independent
   - Don't rely on test execution order
   - Clean up after each test

3. **Descriptive Test Names**
   ```javascript
   // Good
   it('should return 401 when token is missing', () => {});
   
   // Bad
   it('test auth', () => {});
   ```

4. **Mock External Dependencies**
   ```javascript
   jest.mock('../services/api');
   jest.mock('../models/User');
   ```

5. **Test Edge Cases**
   - Empty inputs
   - Invalid data
   - Error conditions
   - Boundary values

---

## Test Data Management

### Using Factories (Recommended)

Create test data factories for consistent test data:

```javascript
// server/tests/factories/userFactory.js
const createTestUser = (overrides = {}) => ({
  username: 'testuser',
  email: 'test@example.com',
  password: 'hashedpassword',
  role_id: 1,
  ...overrides
});
```

### Database Setup for Tests

```javascript
// server/tests/setup.js
beforeAll(async () => {
  // Set up test database
  await sequelize.sync({ force: true });
});

afterAll(async () => {
  // Clean up
  await sequelize.close();
});
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm install
      - run: npm test
      - run: npm run test:coverage
```

---

## Troubleshooting

### Common Issues

1. **Tests timing out**
   - Increase timeout: `jest.setTimeout(30000)`
   - Check database connection

2. **Module not found**
   - Check Jest moduleNameMapper in config
   - Verify file paths

3. **Cypress not finding elements**
   - Use `cy.wait()` for async operations
   - Check element selectors

4. **Coverage not generating**
   - Check collectCoverageFrom in jest.config
   - Verify test files are being executed

---

## Test Case Documentation

See `TEST_CASES.md` for comprehensive list of all test cases organized by:
- Feature
- Test type (Unit/Integration/E2E)
- Status (Implemented/Pending)
- Expected behavior

---

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Supertest](https://github.com/visionmedia/supertest)
- [Cypress Documentation](https://docs.cypress.io/)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)

