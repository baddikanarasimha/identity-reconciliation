-- Identity Reconciliation System - Database Initialization
-- This runs automatically when PostgreSQL container starts

-- Create the database if it doesn't exist (handled by POSTGRES_DB env var)
-- This file is for any additional setup

-- Enable useful extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- The actual tables are managed by Prisma migrations
