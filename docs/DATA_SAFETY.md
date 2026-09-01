# FreshMart Production Data Safety & Backup Strategy

**Date**: September 1, 2026  
**Audience**: DevOps & Database Administrators  

---

## 1. Overview
Production data safety is paramount. FreshMart safeguards customer accounts, order history, inventory, and payment transactions against accidental deletion, schema mismatch, or regional failure.

---

## 2. Safe Database Migration Rules
1. **Never Drop Production Tables**: Always use additive migrations (`ALTER TABLE ... ADD COLUMN IF NOT EXISTS`).
2. **Pre-Migration Backups**: Take a full physical database snapshot in Supabase before executing schema changes.
3. **Idempotent Migration Scripts**: Ensure all SQL scripts use `IF NOT EXISTS` guards.

---

## 3. Automated Backup Protocol
- **Daily Automated Point-In-Time Backups (PITR)** enabled in Supabase PostgreSQL settings.
- **Retention Period**: 30-day point-in-time recovery for immediate rollback in case of corruption.
- **Offsite Backup Snapshots**: Weekly exports stored securely in GCS bucket with restricted KMS encryption.

---

## 4. Rollback Plan
If an unexpected schema failure occurs during deployment:
1. Revert backend API container to previous image tag in Render.
2. Execute SQL rollback script or restore Supabase database to pre-deployment snapshot timestamp.
3. Verify `/api/health` status returns `online` (HTTP 200 OK).
