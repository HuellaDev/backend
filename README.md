# Huella — Backend

REST API for **Huella**, a platform to report lost and sighted pets, and connect people with animal-rescue organizations.

Built with Express 5, Sequelize (PostgreSQL), and Supabase (Auth + Storage).

- Frontend repo: [HuellaDev/frontend](https://github.com/HuellaDev/frontend)
- API docs (Postman): [View collection](https://documenter.getpostman.com/view/47022693/2sBYArUsef)
- Live API: [huella-backend-k28p.onrender.com](https://huella-backend-k28p.onrender.com)

## Tech stack

- **Runtime:** Node.js (ESM)
- **Framework:** Express 5
- **ORM / DB:** Sequelize + PostgreSQL
- **Auth & Storage:** Supabase
- **File uploads:** Multer
- **Push notifications:** web-push
- **Security / logging:** Helmet, Morgan, CORS

## Requirements

- Node.js 18+
- pnpm
- PostgreSQL database (Supabase-hosted or your own)
- Supabase project (Auth + Storage)

## Setup

```bash
git clone https://github.com/HuellaDev/backend.git
cd backend
pnpm install
cp .env.example .env   # fill in the variables below
pnpm start
```

For auto-reload during development:

```bash
npx nodemon app.js
```

## Environment variables

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on. |
| `NODE_ENV` | `development` enables request logging (Morgan). |
| `CORS_ORIGINS` | Comma-separated list of allowed CORS origins. |
| `DATABASE_URL` | PostgreSQL connection string. |
| `SUPABASE_PROJECT_URL` | Supabase project URL. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key. Server-side only — verifies JWTs, manages Storage and Auth users. Never expose to the client. |
| `VAPID_PUBLIC_KEY` | Public VAPID key for Web Push. |
| `VAPID_PRIVATE_KEY` | Private VAPID key for Web Push. |

## Project structure

```
Backend-ia/
├── app.js              # Entry point
├── server/Server.js    # Express setup, middlewares, route mounting
├── routers/             # Route definitions per resource
├── controllers/         # Request handlers / business logic
├── middlewares/          # Auth, admin, upload, error handling
├── models/               # Sequelize models + associations
├── db/                   # Sequelize & Supabase client setup
└── helpers/              # AppError, catchAsync, validateEnv, etc.
```

## API overview

All routes are mounted under `/api/huella`.

| Resource | Base path | Notes |
|---|---|---|
| Profile | `/api/huella/profile` | Current user's profile, account deletion |
| Lost reports | `/api/huella/lost-reports` | Report a lost pet |
| Sighting reports | `/api/huella/sighting-reports` | Report a pet sighting |
| Photos | `/api/huella/photos` | Upload/delete photos attached to reports |
| Comments | `/api/huella/comments` | Comments on reports |
| Notifications | `/api/huella/notifications` | In-app notifications |
| Organizations | `/api/huella/organizations` | Rescue/help center organizations |
| Push | `/api/huella/push` | Web Push subscription management |
| Health | `/api/huella/health` | Health check |

Full endpoint reference, request/response bodies, and examples: [Postman documentation](https://documenter.getpostman.com/view/47022693/2sBYArUsef).

## Authentication

Handled via Supabase Auth. Protected routes require:

```
Authorization: Bearer <supabase_access_token>
```

- `requireAuth` — validates the token against Supabase.
- `attachProfile` — loads (or creates) the matching `profiles` row.
- `requireAdmin` / `requireRole` — restrict admin-only routes.

## Database

Schema lives in Supabase/PostgreSQL, mirrored by the Sequelize models in `models/`.

Key tables: `profiles`, `organizations`, `animals`, `animal_profiles`, `lost_reports`, `sighting_reports`, `photos`, `comments`, `notifications`, `push_subscriptions`, `status_history`.

## License

ISC. See [LICENSE](./LICENSE).
