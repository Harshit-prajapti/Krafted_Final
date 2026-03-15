# MAINTENANCE.md - Operations & Maintenance Guide

## Overview

This document provides operational procedures, maintenance tasks, and troubleshooting guides for the Krafted Furniture e-commerce platform.

## Table of Contents

1. [Database Management](#database-management)
2. [Deployment Procedures](#deployment-procedures)
3. [Monitoring & Logging](#monitoring--logging)
4. [Performance Optimization](#performance-optimization)
5. [Security Checklist](#security-checklist)
6. [Backup & Recovery](#backup--recovery)
7. [Common Issues](#common-issues)
8. [Routine Maintenance](#routine-maintenance)

---

## Database Management

### Backup Procedures

#### Automated Backups (Recommended)

**Neon PostgreSQL** (if using Neon):
- Neon provides automatic backups
- Point-in-time recovery available
- Configure backup retention in Neon dashboard

#### Manual Backup

```bash
# Local PostgreSQL backup
pg_dump -U username -d krafted_furniture -F c -b -v -f backup_$(date +%Y%m%d_%H%M%S).dump

# Restore from backup
pg_restore -U username -d krafted_furniture -v backup_YYYYMMDD_HHMMSS.dump
```

#### Backup Schedule

- **Daily**: Automated database backup
- **Weekly**: Full system backup (database + media)
- **Monthly**: Archive old backups
- **Before migrations**: Always backup before schema changes

### Migration Best Practices

#### Development Environment

```bash
# 1. Create migration
npx prisma migrate dev --name descriptive_migration_name

# 2. Review generated SQL
cat prisma/migrations/[timestamp]_descriptive_migration_name/migration.sql

# 3. Test migration
# Run application and verify functionality

# 4. Commit migration files
git add prisma/migrations
git commit -m "Add migration: descriptive_migration_name"
```

#### Production Environment

```bash
# 1. Backup database first!
# 2. Deploy code with migration files
# 3. Run migrations
npx prisma migrate deploy

# 4. Verify application works
# 5. Monitor for errors
```

#### Rollback Strategy

If migration fails:

```bash
# 1. Restore from backup
pg_restore -U username -d krafted_furniture -v backup_file.dump

# 2. Revert code to previous version
git revert HEAD

# 3. Investigate issue
# 4. Fix and retry
```

### Database Optimization

#### Index Monitoring

```sql
-- Find missing indexes
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
ORDER BY n_distinct DESC;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read,
  idx_tup_fetch
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

#### Query Performance

```bash
# Enable query logging in Prisma
# Add to prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
  log      = ["query", "info", "warn", "error"]
}

# Analyze slow queries
# Use Prisma Studio or database logs
```

#### Vacuum & Analyze

```sql
-- Run weekly
VACUUM ANALYZE;

-- For specific tables
VACUUM ANALYZE products;
VACUUM ANALYZE orders;
```

---

## Deployment Procedures

### Vercel Deployment

#### Initial Setup

1. Connect GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Set build command: `npm run build`
4. Set output directory: `.next`

#### Environment Variables

Required in Vercel:

```
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
GOOGLE_CLIENT_ID
GOOGLE_CLIENT_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
EMAIL_SERVER_HOST
EMAIL_SERVER_PORT
EMAIL_SERVER_USER
EMAIL_SERVER_PASSWORD
EMAIL_FROM
NEXT_PUBLIC_APP_URL
```

#### Deployment Checklist

- [ ] All environment variables set
- [ ] Database migrations applied
- [ ] Build succeeds locally (`npm run build`)
- [ ] TypeScript compiles (`npx tsc --noEmit`)
- [ ] Linter passes (`npm run lint`)
- [ ] Test authentication flow
- [ ] Test critical user flows
- [ ] Monitor deployment logs
- [ ] Verify production site works

### Database Migration in Production

```bash
# 1. Backup production database
# 2. Deploy code to Vercel
# 3. Run migrations via Vercel CLI or build command

# Option 1: Add to package.json build script
"build": "prisma migrate deploy && next build"

# Option 2: Manual via Vercel CLI
vercel env pull .env.production
npx prisma migrate deploy
```

---

## Monitoring & Logging

### Application Monitoring

#### Error Tracking

**Recommended**: Sentry, LogRocket, or similar

```typescript
// Example: Sentry integration
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### Performance Monitoring

**Metrics to track**:
- Page load time
- API response time
- Database query time
- Error rate
- User session duration

**Tools**:
- Vercel Analytics
- Google Analytics
- Lighthouse CI

### Database Monitoring

**Neon Dashboard** (if using Neon):
- Connection pool usage
- Query performance
- Storage usage
- Backup status

**Custom Monitoring**:

```typescript
// Log slow queries
import { prisma } from "@/lib/prisma";

prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  if (after - before > 1000) {
    console.warn(`Slow query: ${params.model}.${params.action} took ${after - before}ms`);
  }
  
  return result;
});
```

### Log Management

#### Server Logs

```bash
# View Vercel logs
vercel logs [deployment-url]

# Filter by function
vercel logs [deployment-url] --filter="api/products"
```

#### Client-Side Logging

```typescript
// Disable console.log in production
if (process.env.NODE_ENV === 'production') {
  console.log = () => {};
  console.debug = () => {};
}
```

---

## Performance Optimization

### Next.js Optimization

#### Image Optimization

```typescript
// Use next/image
import Image from "next/image";

<Image
  src="/product.jpg"
  alt="Product"
  width={800}
  height={600}
  priority={isPrimary}
  placeholder="blur"
  blurDataURL={blurDataURL}
/>
```

#### Code Splitting

```typescript
// Dynamic imports for heavy components
import dynamic from "next/dynamic";

const HeavyComponent = dynamic(() => import("@/components/HeavyComponent"), {
  loading: () => <Skeleton />,
  ssr: false, // Disable SSR if not needed
});
```

#### Caching Strategy

```typescript
// ISR with revalidation
export const revalidate = 60; // Revalidate every 60 seconds

// API route caching
export async function GET() {
  return Response.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
    }
  });
}
```

### Database Optimization

#### Connection Pooling

```typescript
// lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

#### Query Optimization

```typescript
// Use select to limit fields
const products = await prisma.product.findMany({
  select: {
    id: true,
    name: true,
    price: true,
    images: {
      where: { isPrimary: true },
      select: { imageUrl: true }
    }
  }
});

// Use cursor-based pagination for large datasets
const products = await prisma.product.findMany({
  take: 20,
  skip: 1,
  cursor: { id: lastProductId },
  orderBy: { createdAt: 'desc' }
});
```

### Cloudinary Optimization

```typescript
// Optimize image delivery
const optimizedUrl = cloudinary.url('product.jpg', {
  transformation: [
    { width: 800, height: 600, crop: 'fill' },
    { quality: 'auto' },
    { fetch_format: 'auto' }
  ]
});
```

---

## Security Checklist

### Pre-Production

- [ ] All environment variables secured
- [ ] No secrets in code
- [ ] HTTPS enabled
- [ ] CORS configured correctly
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention
- [ ] CSRF protection
- [ ] Secure password hashing (bcrypt)
- [ ] Email verification required
- [ ] Password reset tokens expire
- [ ] Admin routes protected
- [ ] Vendor routes protected

### Ongoing

- [ ] Regular dependency updates
- [ ] Security audit quarterly
- [ ] Monitor for suspicious activity
- [ ] Review access logs
- [ ] Update SSL certificates
- [ ] Backup verification

### Security Headers

```typescript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

---

## Backup & Recovery

### Backup Strategy

#### Database Backups

**Frequency**:
- Hourly: Incremental (if supported)
- Daily: Full backup
- Weekly: Archive
- Monthly: Long-term storage

**Retention**:
- Daily: 7 days
- Weekly: 4 weeks
- Monthly: 12 months

#### Media Backups (Cloudinary)

- Cloudinary handles redundancy
- Export media list monthly
- Verify media accessibility quarterly

### Recovery Procedures

#### Database Recovery

```bash
# 1. Identify backup to restore
ls -lh backups/

# 2. Stop application (prevent new writes)
# 3. Restore database
pg_restore -U username -d krafted_furniture -c -v backup_file.dump

# 4. Verify data integrity
# 5. Restart application
# 6. Monitor for issues
```

#### Disaster Recovery Plan

1. **Assess damage**: Determine what was lost
2. **Notify stakeholders**: Inform team and users
3. **Restore from backup**: Use most recent backup
4. **Verify restoration**: Check data integrity
5. **Resume operations**: Bring application online
6. **Post-mortem**: Document incident and prevention

---

## Common Issues

### Issue: Database Connection Timeout

**Symptoms**: API routes fail with connection errors

**Solutions**:
1. Check DATABASE_URL is correct
2. Verify database is running
3. Check connection pool limits
4. Increase timeout in Prisma client
5. Check network/firewall rules

### Issue: NextAuth Session Not Persisting

**Symptoms**: Users logged out unexpectedly

**Solutions**:
1. Verify NEXTAUTH_SECRET is set
2. Check NEXTAUTH_URL matches domain
3. Clear browser cookies
4. Check session expiry settings
5. Verify JWT configuration

### Issue: Images Not Loading

**Symptoms**: Broken image links

**Solutions**:
1. Check Cloudinary credentials
2. Verify image URLs in database
3. Check next.config.js image domains
4. Verify CORS settings
5. Check network tab for errors

### Issue: Slow Page Load

**Symptoms**: Pages take >3 seconds to load

**Solutions**:
1. Check database query performance
2. Optimize images (use next/image)
3. Implement code splitting
4. Add caching headers
5. Use ISR for static content
6. Check Lighthouse report

### Issue: Build Failures

**Symptoms**: `npm run build` fails

**Solutions**:
1. Check TypeScript errors: `npx tsc --noEmit`
2. Run linter: `npm run lint`
3. Clear `.next` folder: `rm -rf .next`
4. Regenerate Prisma client: `npx prisma generate`
5. Check for missing environment variables
6. Review build logs for specific errors

---

## Routine Maintenance

### Daily

- [ ] Monitor error logs
- [ ] Check application uptime
- [ ] Review critical alerts

### Weekly

- [ ] Review performance metrics
- [ ] Check database size/growth
- [ ] Verify backups completed
- [ ] Update dependencies (patch versions)
- [ ] Review user feedback

### Monthly

- [ ] Security audit
- [ ] Performance optimization review
- [ ] Database vacuum and analyze
- [ ] Update dependencies (minor versions)
- [ ] Review and archive old backups
- [ ] Test disaster recovery procedure

### Quarterly

- [ ] Major dependency updates
- [ ] Comprehensive security audit
- [ ] Performance load testing
- [ ] Review and update documentation
- [ ] Vendor system review
- [ ] User experience review

### Annually

- [ ] Full system audit
- [ ] Disaster recovery drill
- [ ] Technology stack review
- [ ] Compliance review
- [ ] Long-term roadmap planning

---

## Contact & Escalation

### Development Team

- **Primary Contact**: [Your Name/Email]
- **Backup Contact**: [Backup Name/Email]

### Service Providers

- **Hosting**: Vercel Support
- **Database**: Neon Support
- **Media**: Cloudinary Support
- **Email**: [Email Provider] Support

### Escalation Path

1. **Level 1**: Development team
2. **Level 2**: Senior developer/architect
3. **Level 3**: External consultants
4. **Level 4**: Service provider support

---

**Last Updated**: 2025-12-28
**Version**: 1.0.0
**Maintained By**: Development Team
