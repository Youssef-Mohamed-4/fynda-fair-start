# 🚀 Fynda Secure Deployment Guide

## Overview
This guide provides step-by-step instructions for securely deploying the Fynda application with proper separation of frontend and backend security.

## 🔒 Security Architecture

### Frontend (Public)
- ✅ **Safe**: Public Supabase anon key
- ✅ **Safe**: Environment variables prefixed with `VITE_`
- ❌ **Never**: Service keys, admin credentials, or sensitive data

### Backend (Server-side)
- ✅ **Secure**: Supabase service key
- ✅ **Secure**: Admin credentials
- ✅ **Secure**: JWT secrets
- ✅ **Secure**: API tokens

## 📋 Environment Variables

### Frontend Environment (.env.local)
```bash
# Supabase Configuration (Safe to expose)
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here

# Admin Configuration (Development only)
VITE_ADMIN_MODE=false

# Security Configuration
VITE_STRICT_SECURITY=true
VITE_DEBUG_SECURITY=false
```

### Backend Environment (Server)
```bash
# Supabase Service Key (NEVER expose to frontend)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Admin Credentials (Server-side only)
ADMIN_EMAIL=admin@fynda.com
ADMIN_PASSWORD=your_secure_password_here

# JWT Configuration
JWT_SECRET=your_jwt_secret_here

# API Security
ADMIN_API_TOKEN=your_admin_api_token_here

# CORS Configuration
ALLOWED_ORIGIN=https://fynda.com
```

## 🛠️ Deployment Steps

### 1. Frontend Deployment

#### Vercel/Netlify
1. Set environment variables in your deployment platform:
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your_anon_key_here
   VITE_ADMIN_MODE=false
   VITE_STRICT_SECURITY=true
   ```

2. Deploy your frontend:
   ```bash
   npm run build
   # Deploy dist/ folder to your hosting platform
   ```

#### Manual Deployment
1. Create `.env.local` file:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your values
   ```

2. Build and deploy:
   ```bash
   npm run build
   # Upload dist/ folder to your web server
   ```

### 2. Backend Deployment

#### Vercel Functions
1. Create `api/` directory in your project root
2. Copy the API files:
   - `api/waitlist.js`
   - `api/admin/auth.js`
   - `api/admin/waitlist-data.js`

3. Set server environment variables in Vercel:
   ```bash
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ADMIN_EMAIL=admin@fynda.com
   ADMIN_PASSWORD=your_secure_password
   JWT_SECRET=your_jwt_secret
   ADMIN_API_TOKEN=your_admin_api_token
   ALLOWED_ORIGIN=https://fynda.com
   ```

#### Node.js Server
1. Install dependencies:
   ```bash
   npm install @supabase/supabase-js jsonwebtoken
   ```

2. Set environment variables:
   ```bash
   export SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   export ADMIN_EMAIL=admin@fynda.com
   export ADMIN_PASSWORD=your_secure_password
   export JWT_SECRET=your_jwt_secret
   export ADMIN_API_TOKEN=your_admin_api_token
   export ALLOWED_ORIGIN=https://fynda.com
   ```

3. Start server:
   ```bash
   node server.js
   ```

## 🔐 Security Configuration

### Supabase RLS Policies
Ensure these policies are in place:

```sql
-- Waitlist candidates: Public insert, admin read
CREATE POLICY "Public can insert candidates" 
ON waitlist_candidates 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can read candidates" 
ON waitlist_candidates 
FOR SELECT 
TO authenticated
USING (is_admin());

-- Waitlist employers: Public insert, admin read
CREATE POLICY "Public can insert employers" 
ON waitlist_employers 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Only admins can read employers" 
ON waitlist_employers 
FOR SELECT 
TO authenticated
USING (is_admin());
```

### Admin Access Setup
1. **Database Admin**: Add your email to `admin_users` table
2. **Server Admin**: Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in server environment
3. **Development**: Use `localStorage.setItem('fynda-admin', 'true')`

## 🧪 Testing Deployment

### 1. Frontend Testing
```bash
# Test public pages
curl https://your-domain.com/

# Test waitlist submission
curl -X POST https://your-domain.com/api/waitlist \
  -H "Content-Type: application/json" \
  -d '{"type":"candidate","data":{"name":"Test","email":"test@example.com","currentState":"student","fieldOfStudy":"Computer Science"}}'
```

### 2. Admin Testing
```bash
# Test admin authentication
curl -X POST https://your-domain.com/api/admin/auth \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@fynda.com","password":"your_password"}'

# Test admin data access (with token)
curl -X GET https://your-domain.com/api/admin/waitlist-data \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

## 🚨 Security Checklist

### Pre-Deployment
- [ ] All service keys removed from frontend code
- [ ] Environment variables properly configured
- [ ] RLS policies enabled in Supabase
- [ ] Admin credentials set in server environment
- [ ] CORS properly configured
- [ ] Rate limiting enabled

### Post-Deployment
- [ ] Frontend accessible without errors
- [ ] Waitlist form submissions working
- [ ] Admin login functional
- [ ] Admin dashboard loading data
- [ ] No console errors or warnings
- [ ] Security headers present

## 🔍 Monitoring

### Security Logs
Monitor these logs for security events:
- Admin login attempts
- Failed authentication
- Rate limit violations
- API access patterns

### Performance Monitoring
- API response times
- Database query performance
- Frontend load times
- Error rates

## 🆘 Troubleshooting

### Common Issues

#### "Missing Supabase environment variables"
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are set
- Check that variables are prefixed with `VITE_`

#### "Admin authentication failed"
- Verify `ADMIN_EMAIL` and `ADMIN_PASSWORD` are set in server environment
- Check that admin user exists in `admin_users` table

#### "CORS errors"
- Set `ALLOWED_ORIGIN` to your production domain
- Ensure frontend and backend domains match

#### "Rate limit exceeded"
- Check rate limiting configuration
- Verify IP detection is working correctly

### Emergency Access
If locked out of admin:
1. **Database**: Add admin user directly in Supabase
2. **Server**: Check server environment variables
3. **Development**: Use localStorage method
4. **Contact**: System administrator

## 📞 Support

For deployment issues:
1. Check this guide first
2. Review security logs
3. Verify environment variables
4. Test API endpoints individually
5. Contact development team

---

**Last Updated**: January 2025  
**Security Level**: Production Ready  
**Compliance**: OWASP Top 10 Protected
