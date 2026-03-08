# 🔗 Identity Reconciliation System

> A production-ready full-stack application to identify and merge customer identities based on shared email or phone number.

![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-14-000000?style=flat&logo=next.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=flat&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat&logo=prisma&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Business Logic](#business-logic)
- [Database Schema](#database-schema)
- [Docker Setup](#docker-setup)
- [Deploy to Render](#deploy-to-render)
- [Sample API Requests](#sample-api-requests)

---

## Overview

The Identity Reconciliation System solves the problem of customers using different email addresses and phone numbers across multiple interactions. When a customer provides contact information, this system:

1. Finds all existing contacts that share the same email **or** phone number
2. Identifies the **oldest (primary)** contact as the master record
3. Links all newer/additional contacts as **secondary** records
4. Returns a **consolidated identity profile** with all known emails, phone numbers, and linked IDs

---

## Architecture

```
┌─────────────────┐     HTTPS      ┌───────────────────────────────────────┐
│   Next.js UI    │ ─────────────► │          Express REST API              │
│  (Port 3000)    │ ◄────────────  │          (Port 5000)                   │
└─────────────────┘                │                                       │
                                   │  ┌──────────────────────────────────┐  │
                                   │  │  Controller Layer                │  │
                                   │  │  • Input validation (Zod)        │  │
                                   │  │  • HTTP request/response         │  │
                                   │  └─────────────┬────────────────────┘  │
                                   │                ▼                       │
                                   │  ┌──────────────────────────────────┐  │
                                   │  │  Service Layer                   │  │
                                   │  │  • Business logic                │  │
                                   │  │  • Identity reconciliation       │  │
                                   │  │  • Merge strategy                │  │
                                   │  └─────────────┬────────────────────┘  │
                                   │                ▼                       │
                                   │  ┌──────────────────────────────────┐  │
                                   │  │  Repository Layer                │  │
                                   │  │  • Database queries (Prisma)     │  │
                                   │  │  • Data access abstraction       │  │
                                   │  └─────────────┬────────────────────┘  │
                                   └────────────────┼───────────────────────┘
                                                    ▼
                                   ┌────────────────────────────┐
                                   │      PostgreSQL 16          │
                                   │   contacts table            │
                                   └────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14, React 18, TailwindCSS |
| Backend | Node.js 20, Express 4, TypeScript 5 |
| Database | PostgreSQL 16 |
| ORM | Prisma 5 |
| Validation | Zod |
| Logging | Winston |
| HTTP Client | Axios |
| Deployment | Render, Docker |

---

## Project Structure

```
identity-reconciliation/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts        # Prisma client singleton
│   │   │   └── env.ts             # Environment config
│   │   ├── controllers/
│   │   │   └── contact.controller.ts  # HTTP layer
│   │   ├── middleware/
│   │   │   ├── errorHandler.ts    # Global error handling
│   │   │   ├── requestLogger.ts   # HTTP request logging
│   │   │   └── validateRequest.ts # Zod validation
│   │   ├── repositories/
│   │   │   └── contact.repository.ts  # Data access layer
│   │   ├── routes/
│   │   │   └── contact.routes.ts  # Route definitions
│   │   ├── services/
│   │   │   └── contact.service.ts # Core business logic
│   │   ├── types/
│   │   │   └── contact.types.ts   # TypeScript types
│   │   ├── utils/
│   │   │   └── logger.ts          # Winston logger
│   │   └── app.ts                 # Express app entry point
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css        # Global styles
│   │   │   ├── layout.tsx         # Root layout
│   │   │   └── page.tsx           # Main page
│   │   ├── components/
│   │   │   ├── ApiStatus.tsx      # Backend health indicator
│   │   │   ├── ContactResult.tsx  # Results display
│   │   │   ├── HowItWorks.tsx     # Info section
│   │   │   └── IdentifyForm.tsx   # Input form
│   │   ├── lib/
│   │   │   └── api.ts             # Axios API client
│   │   └── types/
│   │       └── index.ts           # Shared TypeScript types
│   ├── Dockerfile
│   ├── next.config.js
│   ├── tailwind.config.ts
│   ├── package.json
│   └── .env.example
│
├── scripts/
│   └── init.sql                   # DB initialization script
├── docker-compose.yml             # Local dev with Docker
├── render.yaml                    # Render deployment config
└── README.md
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- npm or yarn
- Docker (optional)

### Option A: Local Development (Manual)

**1. Clone the repository**
```bash
git clone https://github.com/YOUR_USERNAME/identity-reconciliation.git
cd identity-reconciliation
```

**2. Setup Backend**
```bash
cd backend
cp .env.example .env
# Edit .env and set your DATABASE_URL
npm install
```

**3. Setup Database**
```bash
# Create PostgreSQL database
psql -U postgres -c "CREATE DATABASE identity_reconciliation;"

# Run Prisma migrations
npx prisma migrate dev --name init
npx prisma generate
```

**4. Start Backend**
```bash
npm run dev
# Server starts at http://localhost:5000
```

**5. Setup Frontend (new terminal)**
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:5000/api
npm install
npm run dev
# UI starts at http://localhost:3000
```

### Option B: Docker Compose (Recommended)

```bash
git clone https://github.com/YOUR_USERNAME/identity-reconciliation.git
cd identity-reconciliation

# Start all services
docker compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
# API:      http://localhost:5000/api/health
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `5000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `DATABASE_URL` | — | PostgreSQL connection string |
| `ALLOWED_ORIGINS` | `http://localhost:3000` | CORS allowed origins (comma-separated) |
| `RATE_LIMIT_WINDOW_MS` | `900000` | Rate limit window (15 min) |
| `RATE_LIMIT_MAX` | `100` | Max requests per window |
| `LOG_LEVEL` | `info` | Winston log level |

**Example `DATABASE_URL`:**
```
postgresql://postgres:password@localhost:5432/identity_reconciliation?schema=public
```

### Frontend (`frontend/.env.local`)

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:5000/api` | Backend API base URL |

---

## API Documentation

### POST `/api/identify`

Identifies and reconciles customer identity based on email and/or phone number.

**Request:**
```http
POST /api/identify
Content-Type: application/json

{
  "email": "user@example.com",
  "phoneNumber": "+1234567890"
}
```

**Rules:**
- At least one of `email` or `phoneNumber` must be provided
- Both fields are optional individually but not both null

**Response:**
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["primary@example.com", "secondary@example.com"],
    "phoneNumbers": ["+1234567890", "+9876543210"],
    "secondaryContactIds": [2, 3]
  }
}
```

**Response Fields:**

| Field | Type | Description |
|-------|------|-------------|
| `primaryContactId` | `number` | ID of the master (oldest) contact |
| `emails` | `string[]` | All unique emails (primary's first) |
| `phoneNumbers` | `string[]` | All unique phones (primary's first) |
| `secondaryContactIds` | `number[]` | IDs of all linked secondary contacts |

**Error Responses:**

| Status | Description |
|--------|-------------|
| `400` | Validation error (invalid email, no fields provided) |
| `429` | Rate limit exceeded |
| `500` | Internal server error |

---

### GET `/api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "service": "identity-reconciliation-api",
  "version": "1.0.0"
}
```

---

## Business Logic

### Identity Reconciliation Algorithm

```
Input: { email?, phoneNumber? }

1. Find all contacts where:
   - contact.email = input.email  OR
   - contact.phoneNumber = input.phoneNumber

2. If NO matches found:
   → Create new PRIMARY contact
   → Return { primaryContactId: newId, emails: [...], phones: [...] }

3. If matches found:
   a. Collect all primary IDs from matches
      (a contact is "primary" or points to one via linkedId)

   b. Fetch FULL cluster: all contacts sharing any of those primary IDs

   c. If MULTIPLE primaries found in cluster:
      → Sort by createdAt ascending (oldest = true primary)
      → Demote all newer primaries to SECONDARY
      → Re-fetch cluster

   d. Check if request contains NEW information:
      - Email not seen in cluster?  OR
      - Phone not seen in cluster?
      → Create new SECONDARY contact linked to true primary

   e. Build consolidated response

4. Response always includes:
   - Primary contact's email/phone first in arrays
   - All unique emails & phones across cluster
   - All secondary contact IDs
```

### Example Scenario

```
Request 1: { email: "lorraine@hillvalley.edu", phone: "123456" }
→ No match → Create PRIMARY id=1

Request 2: { email: "mcfly@hillvalley.edu", phone: "123456" }
→ Matches id=1 (same phone) → New email info → Create SECONDARY id=2 (linkedId=1)
→ Response: { primaryContactId: 1, emails: ["lorraine@...", "mcfly@..."], phones: ["123456"], secondaryContactIds: [2] }

Request 3: { email: "george@hillvalley.edu", phone: "717171" }
→ No match → Create PRIMARY id=3

Request 4: { email: "george@hillvalley.edu", phone: "123456" }
→ Matches id=1 (phone) AND id=3 (email) → Two primaries!
→ id=1 is older → Demote id=3 to SECONDARY (linkedId=1)
→ Response: { primaryContactId: 1, emails: ["lorraine@...", "mcfly@...", "george@..."], phones: ["123456", "717171"], secondaryContactIds: [2, 3] }
```

---

## Database Schema

```prisma
model Contact {
  id             Int            @id @default(autoincrement())
  phoneNumber    String?
  email          String?
  linkedId       Int?           // References the primary contact's id
  linkPrecedence LinkPrecedence @default(primary)
  createdAt      DateTime       @default(now())
  updatedAt      DateTime       @updatedAt
  deletedAt      DateTime?      // Soft delete

  linkedContact     Contact?  @relation("ContactLink", fields: [linkedId], references: [id])
  secondaryContacts Contact[] @relation("ContactLink")

  @@index([email])
  @@index([phoneNumber])
  @@index([linkedId])
}

enum LinkPrecedence {
  primary
  secondary
}
```

### Example Database Queries

```sql
-- Find all contacts for an email or phone
SELECT * FROM contacts
WHERE (email = 'user@example.com' OR "phoneNumber" = '1234567')
  AND "deletedAt" IS NULL
ORDER BY "createdAt" ASC;

-- Get full contact cluster for a primary
SELECT * FROM contacts
WHERE (id = 1 OR "linkedId" = 1)
  AND "deletedAt" IS NULL
ORDER BY "createdAt" ASC;

-- Count contacts per linkage type
SELECT "linkPrecedence", COUNT(*) 
FROM contacts 
WHERE "deletedAt" IS NULL
GROUP BY "linkPrecedence";
```

---

## Docker Setup

### Development with hot-reload

```bash
# Start only the database
docker compose up postgres -d

# Run backend locally
cd backend && npm run dev

# Run frontend locally
cd frontend && npm run dev
```

### Full stack with Docker

```bash
# Build and start everything
docker compose up --build

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop all services
docker compose down

# Remove volumes (reset DB)
docker compose down -v
```

---

## Deploy to Render

### Step-by-Step Guide

#### 1. Push to GitHub

```bash
git init
git add .
git commit -m "feat: initial commit - Identity Reconciliation System"
git remote add origin https://github.com/YOUR_USERNAME/identity-reconciliation.git
git push -u origin main
```

#### 2. Create PostgreSQL Database on Render

1. Go to [render.com](https://render.com) → **New** → **PostgreSQL**
2. Name: `identity-reconciliation-db`
3. Plan: Free
4. Click **Create Database**
5. Copy the **Internal Database URL** (for backend) and **External Database URL** (for migrations)

#### 3. Deploy Backend

1. **New** → **Web Service**
2. Connect your GitHub repo
3. Configure:
   - **Name:** `identity-reconciliation-api`
   - **Root Directory:** `backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npx prisma generate && npm run build`
   - **Start Command:** `npx prisma migrate deploy && npm start`
4. Add **Environment Variables:**
   ```
   NODE_ENV = production
   PORT = 5000
   DATABASE_URL = <paste Internal Database URL from step 2>
   ALLOWED_ORIGINS = https://your-frontend-name.onrender.com
   LOG_LEVEL = info
   ```
5. Click **Create Web Service**
6. Wait for deploy. Note the URL: `https://identity-reconciliation-api.onrender.com`

#### 4. Deploy Frontend

1. **New** → **Web Service**
2. Connect the same GitHub repo
3. Configure:
   - **Name:** `identity-reconciliation-ui`
   - **Root Directory:** `frontend`
   - **Environment:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
4. Add **Environment Variables:**
   ```
   NEXT_PUBLIC_API_URL = https://identity-reconciliation-api.onrender.com/api
   ```
5. Click **Create Web Service**

#### 5. Update CORS in Backend

Go back to the backend service → Environment → Update:
```
ALLOWED_ORIGINS = https://identity-reconciliation-ui.onrender.com
```

#### 6. Verify Deployment

```bash
# Test backend health
curl https://identity-reconciliation-api.onrender.com/api/health

# Test identify endpoint
curl -X POST https://identity-reconciliation-api.onrender.com/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","phoneNumber":"1234567890"}'
```

### Auto-Deploy with render.yaml

Alternatively, use the included `render.yaml` for Blueprint deployment:

1. Go to Render Dashboard → **Blueprints** → **New Blueprint Instance**
2. Connect your GitHub repo
3. Render detects `render.yaml` automatically
4. Update the `ALLOWED_ORIGINS` and `NEXT_PUBLIC_API_URL` values
5. Click **Apply**

---

## Sample API Requests

### 1. Create New Primary Contact
```bash
curl -X POST http://localhost:5000/api/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "lorraine@hillvalley.edu",
    "phoneNumber": "123456"
  }'
```
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": []
  }
}
```

### 2. Match Existing, Add New Email
```bash
curl -X POST http://localhost:5000/api/identify \
  -H "Content-Type: application/json" \
  -d '{
    "email": "mcfly@hillvalley.edu",
    "phoneNumber": "123456"
  }'
```
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu"],
    "phoneNumbers": ["123456"],
    "secondaryContactIds": [2]
  }
}
```

### 3. Trigger Primary Merge
```bash
# First create another primary
curl -X POST http://localhost:5000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "717171"}'

# Now link them (email matches id=3, phone matches id=1)
curl -X POST http://localhost:5000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "george@hillvalley.edu", "phoneNumber": "123456"}'
```
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["lorraine@hillvalley.edu", "mcfly@hillvalley.edu", "george@hillvalley.edu"],
    "phoneNumbers": ["123456", "717171"],
    "secondaryContactIds": [2, 3]
  }
}
```

### 4. Email Only
```bash
curl -X POST http://localhost:5000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"email": "newuser@example.com"}'
```

### 5. Phone Only
```bash
curl -X POST http://localhost:5000/api/identify \
  -H "Content-Type: application/json" \
  -d '{"phoneNumber": "+919876543210"}'
```

### 6. Validation Error
```bash
curl -X POST http://localhost:5000/api/identify \
  -H "Content-Type: application/json" \
  -d '{}'
```
```json
{
  "success": false,
  "error": "Validation failed: At least one of email or phoneNumber must be provided"
}
```

---

## Running Prisma Migrations

```bash
# Create a new migration (development)
cd backend
npx prisma migrate dev --name your_migration_name

# Apply existing migrations (production)
npx prisma migrate deploy

# Reset database (development only - destroys all data)
npx prisma migrate reset

# Open Prisma Studio (GUI for your database)
npx prisma studio

# Regenerate Prisma client after schema changes
npx prisma generate
```

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'feat: add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## License

MIT License - see [LICENSE](LICENSE) for details.

---

<div align="center">
  Built with ❤️ · Node.js · Next.js · PostgreSQL · Prisma · TypeScript
</div>
