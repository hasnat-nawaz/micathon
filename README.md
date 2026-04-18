# The Equivalence Engine — Secure Directed Giving Platform

A full-stack PERN application (PostgreSQL, Express, React, Node) for transparent, directed donations. Donors fund verified needs uploaded by trusted institutions — no cash ever touches a beneficiary directly.

---

## 📦 What's Inside

```
equivalence-engine/
├── backend/         Express + PostgreSQL API server
├── frontend/        React (Vite) client app
├── schema.sql       Complete PostgreSQL schema + demo seed data
└── README.md        This file
```

---

## ✅ Prerequisites

Install these first:

| Tool         | Version | Check                     |
|--------------|---------|---------------------------|
| Node.js      | ≥ 18    | `node -v`                 |
| npm          | ≥ 9     | `npm -v`                  |
| PostgreSQL   | ≥ 13    | `psql --version`          |

---

## 🚀 Local Setup (5 steps)

### 1. Create the database

Open a terminal and run:

```bash
# Create the database (uses your default postgres user)
createdb equivalence_engine

# Load the schema + demo data
psql -d equivalence_engine -f schema.sql
```

> If `createdb` is not on your PATH, open `psql` and run `CREATE DATABASE equivalence_engine;` manually, then `\c equivalence_engine` and `\i schema.sql`.

### 2. Configure the backend

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and set `DATABASE_URL`.

- For **local Postgres**, a typical value looks like:

```
PORT=5000
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/equivalence_engine
JWT_SECRET=change-me-to-a-long-random-string
CLIENT_ORIGIN=http://localhost:5173
```

> Using **Neon**: paste your Neon connection string into `DATABASE_URL` and you're done. The backend auto-enables SSL for hosted databases like Neon.

### 3. Install + run the backend

```bash
cd backend
npm install
npm run dev
```

Backend runs on  **http://localhost:5000**. You should see:
```
✅ Connected to PostgreSQL
🚀 Server running on http://localhost:5000
```

### 4. Install + run the frontend

In a **new terminal**: 

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on **http://localhost:5173**.

### 5. Log in with demo accounts

Open http://localhost:5173 and use any of these:

| Role        | Username      | Password    |
|-------------|---------------|-------------|
| Donor       | `alice`       | `password`  |
| Donor       | `bob`         | `password`  |
| Institution | `hopeschool`  | `password`  |
| Institution | `careNGO`     | `password`  |

Or sign up a new account from `/signup`.

---

## 🧪 Testing the Flow

1. Log in as **`hopeschool`** → go to **Manage Needs → New Need** → create a need.
2. Log out, log in as **`alice`** → browse needs → click **Donate** → choose Card / EasyPaisa / JazzCash → confirm.
3. The need's funded amount updates; if fully funded its status becomes `funded`.
4. Visit `/leaderboard` to see top donors ranked by total contribution.

---

## 📡 API Reference (quick)

All routes are prefixed with `/api`.

**Auth**
- `POST /auth/signup` — `{ username, password, role, name, ...profile }`
- `POST /auth/login` — `{ username, password }` → `{ token, user }`

**Needs**
- `GET  /needs` — list all (filter: `?tag=urgent&status=pending`)
- `GET  /needs/:id` — single need
- `POST /needs` *(institution)* — create
- `PATCH /needs/:id` *(institution)* — update
- `PATCH /needs/:id/status` *(institution)* — change status

**Donations**
- `POST /donations` *(donor)* — `{ need_id, amount, method }`

**Institutions / Beneficiaries / Leaderboard**
- `GET  /institutions/:id`
- `GET  /beneficiaries` *(institution)*
- `POST /beneficiaries` *(institution)*
- `GET  /leaderboard`

Authenticated requests must send `Authorization: Bearer <token>`.

---

## 🛠️ Troubleshooting

**`ECONNREFUSED` on backend start**
→ Postgres isn't running, or `DATABASE_URL` is wrong. Test with `psql -d equivalence_engine -c "SELECT 1"`.

**Frontend shows "Network Error" on login**
→ Backend not running, or CORS blocked. Make sure backend is on port 5000 and `CLIENT_ORIGIN` matches your frontend URL.

**Port already in use**
→ Change `PORT` in `backend/.env` and update `VITE_API_URL` in `frontend/.env` to match.

**`uuid_generate_v4() does not exist`**
→ The schema enables `uuid-ossp`; if your Postgres user lacks permission, run `CREATE EXTENSION "uuid-ossp";` as a superuser first.

---

## 🏗️ Tech Stack

- **Backend**: Express, pg, bcryptjs, jsonwebtoken, cors, dotenv
- **Frontend**: React 18, Vite, React Router, Axios
- **Database**: PostgreSQL 13+

Built for clarity, simplicity, and real-world usability.
