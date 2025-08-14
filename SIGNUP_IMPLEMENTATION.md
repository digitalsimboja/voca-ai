# Voca AI - Signup Implementation

This document outlines the complete signup and authentication implementation for the Voca AI platform.

## Business Logic Overview

The Voca AI platform serves two main types of businesses:

1. **Microfinance Banks** - Need multiple users with different roles (admin, agent, viewer)
2. **Online Retailers** - Typically single user or small team

### Signup Flow

1. User selects business type (banking/retail)
2. User fills out signup form with personal and company information
3. System creates user account with admin role
4. JWT token is generated and stored securely
5. User is redirected to dashboard
6. Admin can invite additional users (for banks)

## Architecture

### Frontend (Next.js)
- **Location**: `/Users/sundaymgbogu/dev/bojalabs/voca-ai`
- **Framework**: Next.js 14 with TypeScript
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **State Management**: React Context for auth state

### Backend (Microservices)
- **Location**: `/Users/sundaymgbogu/dev/bojalabs/vocaai-backend`
- **Framework**: AWS Chalice (Python)
- **Database**: PostgreSQL
- **Authentication**: JWT with secure password hashing

## Key Components

### Frontend Components

1. **Signup Page** (`/src/app/signup/page.tsx`)
   - Business type selection
   - Form validation
   - API integration

2. **Login Page** (`/src/app/login/page.tsx`)
   - Email/password authentication
   - Redirect handling

3. **Auth Hook** (`/src/hooks/useAuth.ts`)
   - Authentication state management
   - API calls for auth operations

4. **API Routes**
   - `/api/auth/signup` - User registration
   - `/api/auth/login` - User authentication
   - `/api/auth/logout` - User logout
   - `/api/auth/verify` - Token verification

5. **Middleware** (`/src/middleware.ts`)
   - Route protection
   - Token verification
   - Automatic redirects

### Backend Components

1. **Auth Service** (`auth-service-api/`)
   - User registration and authentication
   - JWT token management
   - Password hashing and verification

2. **Database Layer** (`shared-utils/database.py`)
   - PostgreSQL connection management
   - Query execution utilities

3. **User Service** (`auth-service-api/chalicelib/user_service.py`)
   - User CRUD operations
   - Session management

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    business_type VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    is_verified BOOLEAN DEFAULT FALSE,
    email_verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    refresh_token_hash VARCHAR(255),
    expires_at TIMESTAMP NOT NULL,
    is_revoked BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Security Features

1. **Password Security**
   - Bcrypt hashing with salt
   - Minimum 8 characters
   - Complexity requirements

2. **JWT Security**
   - 24-hour expiration
   - Secure HTTP-only cookies
   - Token revocation on logout

3. **Input Validation**
   - Email format validation
   - SQL injection prevention
   - XSS protection

4. **Session Management**
   - Secure session storage
   - Automatic cleanup
   - Revocation capability

## Setup Instructions

### 1. Database Setup

```bash
# Create PostgreSQL database
createdb voca_ai

# Run initialization script
psql -d voca_ai -f init-db.sql
```

### 2. Backend Setup

```bash
cd bojalabs/vocaai-backend

# Install dependencies
pip install -r auth-service-api/requirements.txt

# Set environment variables
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=voca_ai
export DB_USER=postgres
export DB_PASSWORD=your_password
export JWT_SECRET=your-super-secret-jwt-key

# Start auth service
cd auth-service-api
chalice local --port 8001
```

### 3. Frontend Setup

```bash
cd bojalabs/voca-ai

# Install dependencies
npm install

# Set environment variables
export AUTH_SERVICE_URL=http://localhost:8001

# Start development server
npm run dev
```

## Testing the Signup Flow

### 1. Test Signup
1. Navigate to `http://localhost:3000/signup`
2. Select business type (banking or retail)
3. Fill out the form with valid data
4. Submit and verify account creation

### 2. Test Login
1. Navigate to `http://localhost:3000/login`
2. Use credentials from signup
3. Verify successful login and redirect

### 3. Test Protected Routes
1. Try accessing `/dashboard` without authentication
2. Verify redirect to login page
3. Login and verify access to dashboard

### 4. Test Logout
1. Login to the application
2. Click logout
3. Verify token invalidation and redirect

## API Endpoints

### Signup
```
POST /api/auth/signup
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "companyName": "Example Bank",
  "businessType": "banking",
  "agreeToMarketing": false
}
```

### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

### Verify Token
```
POST /api/auth/verify
Authorization: Bearer <jwt_token>
```

### Logout
```
POST /api/auth/logout
Authorization: Bearer <jwt_token>
```

## Error Handling

The system handles various error scenarios:

1. **Validation Errors** (400)
   - Missing required fields
   - Invalid email format
   - Weak password
   - Invalid business type

2. **Authentication Errors** (401)
   - Invalid credentials
   - Expired tokens
   - Missing tokens

3. **Conflict Errors** (409)
   - Email already exists
   - Username already taken

4. **Server Errors** (500)
   - Database connection issues
   - Service unavailability

## Future Enhancements

1. **Email Verification**
   - Send verification emails
   - Email verification flow
   - Resend verification

2. **Password Reset**
   - Forgot password flow
   - Password reset tokens
   - Secure reset process

3. **Multi-factor Authentication**
   - SMS verification
   - TOTP support
   - Backup codes

4. **User Roles and Permissions**
   - Role-based access control
   - Permission management
   - Admin user management

5. **Audit Logging**
   - Login attempts
   - Password changes
   - Account modifications

## Troubleshooting

### Common Issues

1. **Database Connection**
   - Verify PostgreSQL is running
   - Check connection credentials
   - Ensure database exists

2. **JWT Issues**
   - Verify JWT_SECRET is set
   - Check token expiration
   - Validate token format

3. **CORS Issues**
   - Check CORS configuration
   - Verify service URLs
   - Test with Postman

4. **Cookie Issues**
   - Check cookie settings
   - Verify HTTPS in production
   - Test in different browsers

### Debug Mode

Enable debug logging:

```bash
export LOG_LEVEL=DEBUG
export CHALICE_DEBUG=1
```

## Production Deployment

1. **Environment Variables**
   - Use secure JWT secrets
   - Configure production database
   - Set up HTTPS

2. **Security Headers**
   - Enable HSTS
   - Configure CSP
   - Set secure cookies

3. **Monitoring**
   - Set up logging
   - Configure alerts
   - Monitor performance

4. **Backup**
   - Database backups
   - Configuration backups
   - Disaster recovery plan
