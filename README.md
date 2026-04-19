# Yaqeen — Directed Giving Platform

**Yaqeen** is a full-stack web application for transparent, institution-verified giving. Donors fund specific **needs** (tuition, relief, medical support, and similar) posted by registered institutions; beneficiaries receive services and accountability, not cash payouts. The repository is named **equivalence-engine**; this document describes the codebase as it ships today.

---

## Overview

| Layer | Technology |
|--------|------------|
| **API** | Node.js, Express, `pg` (PostgreSQL), JWT auth, bcrypt |
| **Client** | React 18, Vite, React Router, Axios |
| **Data** | PostgreSQL 13+ (`schema.sql` includes schema and seed data) |

**Core capabilities**

- **Donors** — Browse and filter needs, view need detail, donate (recorded contributions), donor dashboard, profile, and public leaderboard.
- **Institutions** — Dashboard with metrics, create and manage needs (including optional cover image upload), beneficiaries, and profile.
- **Auth** — Signup and login with role-based access (`donor` | `institution`); protected routes on both client and server.

**Need images** — Multipart uploads are handled on the server (Multer). Configure **ImageKit** (`IMAGEKIT_*`) for cloud URLs, or omit those variables to store files under `backend/uploads/` and serve them at `/uploads/`.

---

## Repository layout

```
equivalence-engine/
├── package.json          # Root: setup + concurrent dev (backend + frontend)
├── schema.sql            # PostgreSQL DDL + demo seed
├── README.md
├── backend/
│   ├── .env.example      # Copy to .env — see Environment variables
│   ├── src/
│   │   ├── server.js     # Express app, `/api/*`, static `/uploads`
│   │   ├── routes/       # auth, needs, donations, institutions, beneficiaries, leaderboard, me
│   │   ├── db/           # Pool configuration
│   │   └── lib/          # Need image upload (ImageKit + local fallback)
│   └── uploads/          # Local image storage (gitignored when used)
└── frontend/
    ├── .env              # Optional: VITE_API_URL (see Development)
    ├── vite.config.js    # Dev proxy: /api and /uploads → backend
    └── src/              # Pages, components, API client, auth context
```

---

## Prerequisites

- **Node.js** 18 or newer (`node -v`)
- **npm** 9+ (`npm -v`)
- **PostgreSQL** 13+ (`psql --version`)

---

## Quick start

From the repository root:

```bash
npm run setup
```

This installs dependencies for the root workspace, `backend/`, and `frontend/`.

### Database

```bash
createdb equivalence_engine
psql -d equivalence_engine -f schema.sql
```

If `createdb` is unavailable, create the database in `psql`, connect with `\c equivalence_engine`, then run `\i schema.sql`.

### Environment — backend

```bash
cp backend/.env.example backend/.env
```

Edit `backend/.env` at minimum:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | PostgreSQL connection string (local or hosted, e.g. Neon) |
| `JWT_SECRET` | Long random string used to sign JWTs |
| `PORT` | API port (default `5000`) |
| `CLIENT_ORIGIN` | Browser origin for CORS (default `http://localhost:5173`) |
| `IMAGEKIT_PUBLIC_KEY` | Optional — ImageKit public key for need cover uploads |
| `IMAGEKIT_PRIVATE_KEY` | Optional — ImageKit private key |
| `IMAGEKIT_URL_ENDPOINT` | Optional — e.g. `https://ik.imagekit.io/your_id/` |
| `IMAGEKIT_FOLDER` | Optional — folder segment in ImageKit (no leading/trailing slashes) |

If ImageKit variables are **not** set, uploaded images are written to `backend/uploads/` and served by Express at `/uploads/...`.

### Run locally

**Option A — single command (recommended)**

```bash
npm start
```

Runs the API (nodemon) and the Vite dev server together. Default URLs:

- **Frontend:** http://localhost:5173  
- **API:** http://localhost:5000 (health check: `GET http://localhost:5000/api/health`)

**Option B — two terminals**

```bash
cd backend && npm run dev
cd frontend && npm run dev
```

### Frontend API base URL

- **Development with Vite:** The client defaults to relative `/api`, which Vite proxies to `http://127.0.0.1:5000` (see `frontend/vite.config.js`). You normally do **not** need `frontend/.env` for local work.
- **Production or preview without proxy:** Set `VITE_API_URL` to your deployed API base, including `/api`, e.g. `https://api.example.com/api`.

### Production build (frontend only)

```bash
cd frontend && npm run build
```

Serve the `frontend/dist` output behind any static host; ensure API calls target the correct origin via `VITE_API_URL` at build time.

---

## Demo accounts

After loading `schema.sql`, you can sign in at `/login`:

| Role | Username | Password |
|------|----------|----------|
| Donor | `alice` | `password` |
| Donor | `bob` | `password` |
| Institution | `hopeschool` | `password` |
| Institution | `careNGO` | `password` |

New accounts can be created from `/signup`.

---

## Suggested manual test flow

1. Sign in as an **institution** → create a need (optionally upload a cover image) → confirm it appears in manage-needs and for donors.
2. Sign in as a **donor** → browse needs → open a need → **Donate now** → enter amount and choose payment method (EasyPaisa, JazzCash, or card/Mastercard in the UI) → confirm; funded totals and status update accordingly.
3. Open `/leaderboard` to verify donor rankings by total contributed amount.

---

## API summary

All JSON routes are under **`/api`**. Authenticated requests send `Authorization: Bearer <token>` unless noted as public.

| Area | Methods | Notes |
|------|---------|--------|
| **Health** | `GET /api/health` | Public |
| **Auth** | `POST /api/auth/signup`, `POST /api/auth/login` | Public |
| **Needs** | `GET /api/needs`, `GET /api/needs/:id` | Query: `tag`, `status`, `institution_id` |
| **Needs** | `POST /api/needs`, `PATCH /api/needs/:id`, `PATCH /api/needs/:id/status` | Institution role; `POST` supports JSON or `multipart/form-data` with `image` field |
| **Donations** | `POST /api/donations` | Donor role; body `{ need_id, amount, method }` |
| **Institutions** | `GET /api/institutions/:id` | Public |
| **Beneficiaries** | `GET`, `POST /api/beneficiaries` | Institution role |
| **Leaderboard** | `GET /api/leaderboard` | Public |
| **Me** | `GET /api/me` | Authenticated donor or institution profile + stats |

---

## Troubleshooting

| Symptom | What to check |
|---------|----------------|
| **`EADDRINUSE` on port 5000** | Another process is bound to that port. Use `ss -tlnp` or `lsof -i :5000` to find the listener, stop the old Node process, or set `PORT` in `backend/.env` and align the Vite proxy / `VITE_API_URL`. |
| **PostgreSQL connection errors** | `DATABASE_URL`, Postgres running, database created, `psql` connectivity. |
| **401 / login issues** | `JWT_SECRET` set and stable; token stored after login; clock skew minimal on JWT expiry if you customize it. |
| **CORS in production** | `CLIENT_ORIGIN` must match the deployed SPA origin. |
| **`uuid_generate_v4()` errors** | Ensure extension `uuid-ossp` is available; `schema.sql` enables it where appropriate. Superuser may need to run `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` once. |

---

## License and contributions

This project is maintained as a private application repository. For internal or partner use, follow your organization’s policies for secrets, `.env` files, and production deployment.

If you extend the API or database, keep `schema.sql` (or a migrations folder, if you introduce one) in sync with production so new environments remain reproducible.
