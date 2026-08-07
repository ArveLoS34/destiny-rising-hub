# RC-4 Step 2: Authentication & Authorization Security Tests

## Status: ⏳ MANUAL TESTING REQUIRED

**Date:** 2026-08-07  
**Environment:** Docker (user's local environment)  
**Duration:** ~30 minutes

---

## Executive Summary

Authentication & Authorization security tests require manual execution in a running Docker environment. This document provides comprehensive test scenarios, expected results, and success criteria.

---

## Prerequisites

✅ Docker Compose environment running  
✅ Application accessible at http://localhost:3000  
✅ All services healthy (PostgreSQL, Redis, MinIO, Mailpit)  
✅ `/api/health` endpoint returning 200 OK

---

## Test Categories

### 1. Authentication Flow Tests

#### Test 1.1: Health Endpoint Accessibility
**Objective:** Verify health endpoint is accessible without authentication

**Steps:**
```bash
curl http://localhost:3000/api/health
```

**Expected Result:**
```json
{
  "status": "healthy",
  "checks": {
    "database": "healthy",
    "application": "healthy"
  }
}
```

**Status:** ⏳ Manual Test Required

---

#### Test 1.2: Get Current User Without Auth
**Objective:** Verify unauthenticated requests return null user

**Steps:**
```bash
curl http://localhost:3000/api/auth
```

**Expected Result:**
```json
{
  "user": null
}
```

**Status:** ⏳ Manual Test Required

---

#### Test 1.3: Sign Up - Valid Credentials
**Objective:** Verify new user registration works

**Steps:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-up",
    "email": "test@example.com",
    "username": "testuser",
    "displayName": "Test User",
    "password": "TestPass123!"
  }'
```

**Expected Result:**
```json
{
  "user": {
    "id": "user_...",
    "email": "test@example.com",
    "username": "testuser",
    "displayName": "Test User",
    ...
  }
}
```

**Status:** ⏳ Manual Test Required

---

#### Test 1.4: Sign Up - Duplicate Email
**Objective:** Verify duplicate email rejection

**Steps:**
```bash
# First sign up
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-up",
    "email": "duplicate@example.com",
    "username": "user1",
    "displayName": "User 1",
    "password": "TestPass123!"
  }'

# Second sign up with same email
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-up",
    "email": "duplicate@example.com",
    "username": "user2",
    "displayName": "User 2",
    "password": "TestPass123!"
  }'
```

**Expected Result:**
```json
{
  "error": "Email already in use"
}
```

**Status:** ⏳ Manual Test Required

---

#### Test 1.5: Sign In - Valid Credentials
**Objective:** Verify sign in with valid credentials

**Steps:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-in",
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

**Expected Result:**
```json
{
  "user": {
    "id": "user_...",
    "email": "test@example.com",
    ...
  }
}
```

**Status:** ⏳ Manual Test Required

---

#### Test 1.6: Sign In - Invalid Credentials
**Objective:** Verify sign in rejection with invalid credentials

**Steps:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-in",
    "email": "nonexistent@example.com",
    "password": "WrongPassword123!"
  }'
```

**Expected Result:**
```json
{
  "error": "Invalid credentials"
}
```

**Status:** ⏳ Manual Test Required

---

#### Test 1.7: Sign Out
**Objective:** Verify sign out clears session

**Steps:**
```bash
# Sign in first
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "demo-login"}'

# Sign out
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "sign-out"}'

# Check user is null
curl http://localhost:3000/api/auth
```

**Expected Result:**
```json
{
  "user": null
}
```

**Status:** ⏳ Manual Test Required

---

#### Test 1.8: Demo Login
**Objective:** Verify demo login functionality

**Steps:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "demo-login"}'
```

**Expected Result:**
```json
{
  "user": {
    "id": "user_demo_001",
    "username": "guardian",
    "displayName": "Guardian",
    ...
  }
}
```

**Status:** ⏳ Manual Test Required

---

### 2. Authorization Tests

#### Test 2.1: Public API Accessibility
**Objective:** Verify public APIs accessible without auth

**Steps:**
```bash
curl http://localhost:3000/api/v1/characters
```

**Expected Result:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

**Status:** ⏳ Manual Test Required

---

#### Test 2.2: Invalid Action Handling
**Objective:** Verify invalid action returns 400

**Steps:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "invalid-action"}'
```

**Expected Result:**
```json
{
  "error": "Unknown action"
}
```
Status Code: 400

**Status:** ⏳ Manual Test Required

---

### 3. Security Tests

#### Test 3.1: SQL Injection Prevention
**Objective:** Verify SQL injection attempts are handled safely

**Steps:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-in",
    "email": "\"'; DROP TABLE users; --",
    "password": "TestPass123!"
  }'
```

**Expected Result:**
- No database error
- Returns null user or invalid credentials error
- No SQL execution

**Severity:** 🔴 Critical

**Status:** ⏳ Manual Test Required

---

#### Test 3.2: XSS Prevention
**Objective:** Verify XSS attempts are sanitized or rejected

**Steps:**
```bash
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-up",
    "email": "xss@example.com",
    "username": "<script>alert(\"xss\")</script>",
    "displayName": "XSS User",
    "password": "TestPass123!"
  }'
```

**Expected Result:**
- Either rejects the input OR
- Sanitizes the username (removes script tags)
- No script execution

**Severity:** 🔴 Critical

**Status:** ⏳ Manual Test Required

---

#### Test 3.3: Password Strength Validation
**Objective:** Verify password strength requirements

**Steps:**
```bash
# Test weak password
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sign-up",
    "email": "weak@example.com",
    "username": "weakuser",
    "displayName": "Weak User",
    "password": "123"
  }'
```

**Expected Result:**
- Either rejects weak password OR
- Password policy is enforced

**Severity:** 🟠 High

**Status:** ⏳ Manual Test Required

---

#### Test 3.4: Session Management
**Objective:** Verify session expiration and management

**Steps:**
```bash
# Sign in
curl -X POST http://localhost:3000/api/auth \
  -H "Content-Type: application/json" \
  -d '{"action": "demo-login"}'

# Wait 7+ days (session expiration)
# Or manually check session expiration logic in code
```

**Expected Result:**
- Sessions expire after configured time
- Expired sessions return null user

**Severity:** 🟠 High

**Status:** ⏳ Manual Test Required

---

## Success Criteria

### Authentication
- [ ] Sign up works with valid credentials
- [ ] Sign up rejects duplicate emails
- [ ] Sign in works with valid credentials
- [ ] Sign in rejects invalid credentials
- [ ] Sign out clears session
- [ ] Demo login works
- [ ] Unauthenticated requests handled correctly

### Authorization
- [ ] Public APIs accessible without auth
- [ ] Protected APIs require authentication
- [ ] Invalid actions return 400

### Security
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized or blocked
- [ ] Password strength validated
- [ ] Sessions expire correctly
- [ ] No sensitive data exposure

---

## Test Execution Instructions

### Option 1: Manual curl Tests
Execute all curl commands listed above and document results.

### Option 2: Automated Test Script
Run the test script in your Docker environment:
```bash
cd /home/user/destiny-rising-hub
npx tsx tests/security/rc4-auth-security.test.ts
```

### Option 3: Browser Testing
Use browser developer tools or Postman to test endpoints.

---

## Documentation Requirements

For each test, document:
1. Test name
2. Steps performed
3. Expected result
4. Actual result
5. Pass/Fail status
6. Screenshots (if applicable)
7. Security implications (if any)

---

## Next Steps

After completing all tests:
1. Document all results
2. Identify any security issues
3. Fix critical/high severity issues
4. Re-test fixed issues
5. Create RC-4 Step 2 Final Report
6. Proceed to Step 3: API Security

---

## References

- [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)
- [OWASP Session Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html)
- [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html)

---

**Test Status:** ⏳ Manual Testing Required  
**Tester:** [Your Name]  
**Date:** [Test Date]  
**Environment:** Docker (localhost:3000)
