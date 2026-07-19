# Voyager — AI-Powered Travel Experience Platform

Voyager is a full-stack agentic AI application for discovering, booking-style browsing, and
planning curated travel experiences. It pairs a real catalog of host-run experiences with three
agentic AI features: a reasoning itinerary generator, a behavior-aware recommendation engine, and
a tool-using concierge chat assistant.

Built for the Agentic AI Project assignment — a from-scratch project, not a reuse of prior work.

## Live deployment

- **Live site:** https://frontend-delta-seven-19.vercel.app
- **API:** https://backend-sigma-six-96.vercel.app/api
- **Repo:** https://github.com/hassan25bd/Agentic-AI-Project

Both are deployed as Vercel Node.js serverless functions/apps, backed by a real MongoDB Atlas
cluster and a live Gemini API key. Use the **"Try the demo account"** button on the login page for
an instant logged-in session with saved experiences and review history already populated.

> **Note on AI feature quota:** Google's Gemini free tier caps each model at 20 requests/day per
> project, tracked separately per model. If the AI itinerary/recommendations/chat features show a
> rate-limit message, the day's free quota has likely been used up (heavy use while
> testing/grading can hit this) — it resets daily, or enabling billing on the Gemini API project
> removes the cap entirely (flash-tier pricing is a fraction of a cent per request).

## Tech stack

**Frontend:** Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · TanStack Query · Recharts
**Backend:** Node.js · Express · TypeScript · MongoDB (Mongoose) · JWT auth + Google OAuth
**AI:** Google Gemini (`@google/generative-ai`) — structured JSON generation + native function calling

## Project structure

```
backend/     Express + TypeScript API, MongoDB models, AI services, seed script
frontend/    Next.js App Router site (TypeScript, Tailwind, TanStack Query)
```

## AI features (the agentic core)

1. **AI Itinerary Generator** (`/ai/itinerary`) — given a destination, day count, budget, pace, and
   interests, Gemini reasons through pacing/logistics/budget and returns a structured day-by-day
   plan (JSON-schema-constrained output). Supports regenerate and adjustable trip length.
2. **AI Smart Recommendation Engine** (`/ai/recommendations`) — reads the signed-in user's saved
   experiences, past reviews, interests, and budget level, then has Gemini rank a live candidate
   pool from MongoDB and explain each pick. Refinable by category/price/location; re-ranks as the
   user's saved/reviewed history grows.
3. **Voyager Concierge chat** (floating widget, site-wide once logged in) — a genuine tool-using
   agent: Gemini function-calls `search_experiences` / `get_experience_details` against the live
   database mid-conversation before answering, so prices/availability it states are real. Keeps
   per-session conversation memory, streams responses over SSE, shows typing/tool-call indicators,
   and offers suggested follow-ups.

## Getting started

### Prerequisites

- Node.js 20+
- A MongoDB instance — local (`mongodb://127.0.0.1:27017`) or a free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) cluster
- A free [Gemini API key](https://aistudio.google.com/app/apikey) (Google AI Studio) to enable the AI features
- (Optional) A [Google OAuth Client ID](https://console.cloud.google.com/apis/credentials) to enable "Continue with Google"

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # then fill in MONGODB_URI, JWT_SECRET, GEMINI_API_KEY, etc.
npm run seed            # populates 20 real experiences, hosts, reviews, and a demo account
npm run dev              # http://localhost:5000
```

Env vars (`backend/.env`):

| Variable | Required | Notes |
|---|---|---|
| `MONGODB_URI` | Yes | Local or Atlas connection string |
| `JWT_SECRET` | Yes | Any long random string |
| `CLIENT_URL` | Yes | `http://localhost:3000` in dev, your deployed frontend URL in prod |
| `GEMINI_API_KEY` | For AI features | Without it, AI endpoints return a clear "not configured" message instead of crashing |
| `GOOGLE_CLIENT_ID` | For Google login | Without it, the Google button renders disabled with an explanatory tooltip |
| `DEMO_USER_EMAIL` / `DEMO_USER_PASSWORD` | No | Used by the seed script and the "Try the demo account" login button |

### 2. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local   # or create it — see below
npm run dev   # http://localhost:3000
```

Env vars (`frontend/.env.local`):

```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=       # same client ID as backend, optional
```

### 3. Try it

- Visit `http://localhost:3000`
- Click **"Try the demo account"** on the login page for an instant logged-in session with saved
  experiences and review history already populated
- Or register a new account — Explore, experience details, and reviews are public; the AI tools,
  saving, adding/managing listings, and the concierge chat require login

## Demo & seeded accounts

The seed script (`npm run seed` in `backend/`) creates:

- **1 demo traveler** — `demo@voyager.app` / `DemoPass123!` (or whatever you set in `.env`), with
  interests, budget level, 3 saved experiences, and review history already populated so the
  recommendation engine has real signal to work with immediately.
- **4 hosts** (password `VoyagerHost123!`) who between them own 20 real, distinct experiences
  across all 6 categories (Adventure, Culture, Food & Drink, Nature, Relaxation, City Life), each
  with real Unsplash photography matched to the actual destination, realistic pricing, and
  seeded reviews.
- **5 additional traveler reviewers** used to populate realistic review counts/ratings.

## Notable design decisions

- **Two apps, one repo** — `backend/` and `frontend/` are independent deployable services
  (matches the "frontend and backend" GitHub link requirement), talking over a REST API.
- **Client-side data fetching via TanStack Query** for all interactive pages — Next.js officially
  supports this "SPA within Next.js" pattern; it kept auth-gated, filter-heavy pages simple
  without mixing server/client data-fetching models.
- **The chat assistant is a real agent, not a wrapped prompt** — it has tool definitions, executes
  them against MongoDB mid-turn, and only answers after seeing real tool results. This is the
  clearest demonstration of "agent workflows" in the project.
- **Recharts appears where the data is real**, not decorative: a live "experiences by category"
  breakdown on the homepage (computed from actual API data) and a per-day cost breakdown on every
  AI-generated itinerary.
- **Color system**: two brand hues (teal `brand-*` for primary actions/trust, amber-orange
  `accent-*` for CTAs/energy) plus a neutral ink/slate scale — stays within the "max 3 primary
  colors + neutral" rule and is applied consistently via Tailwind theme tokens in `globals.css`.

## Known limitations / what needs a real key to unlock

- AI itinerary generation, AI recommendations, and the concierge chat all require a valid
  `GEMINI_API_KEY`. Without one, the UI shows a clean, specific error rather than failing silently
  or crashing — this was verified end-to-end during development.
- Google Sign-In requires a `GOOGLE_CLIENT_ID` on both backend and frontend; without it the button
  is visibly disabled rather than silently broken.
- There is no payment/booking flow — the assignment spec does not require one, so "Save" (a real,
  persisted action that feeds the recommendation engine) stands in for booking intent.

## Scripts reference

| Location | Command | What it does |
|---|---|---|
| `backend/` | `npm run dev` | Start API with hot reload (ts-node-dev) |
| `backend/` | `npm run build` / `npm start` | Compile to `dist/` and run compiled output |
| `backend/` | `npm run seed` | Wipe and reseed demo data |
| `frontend/` | `npm run dev` | Start Next.js dev server (Turbopack) |
| `frontend/` | `npm run build` / `npm start` | Production build and serve |

## Deployment notes

- Backend: any Node host (Render, Railway, Fly.io, etc.) — set the env vars above, point
  `MONGODB_URI` at an Atlas cluster, set `CLIENT_URL` to your deployed frontend origin.
- Frontend: Vercel is the path of least resistance for Next.js — set `NEXT_PUBLIC_API_URL` to your
  deployed backend's `/api` URL and `NEXT_PUBLIC_GOOGLE_CLIENT_ID` if using Google login.
- Update the Google OAuth client's authorized JavaScript origins/redirect URIs to include your
  deployed frontend URL.
