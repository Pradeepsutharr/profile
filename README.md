# Pradeep's Portfolio

A JavaScript-only Next.js App Router portfolio with Tailwind CSS, DM Sans, PostgreSQL, HTTP-only JWT admin sessions, S3-compatible uploads, and optional Gmail integration. There is no Supabase runtime dependency or compatibility layer.

## Start locally

1. Create a PostgreSQL database, for example `pradeep_portfolio`.
2. Copy `.env.example` to `.env.local` and fill in the required database, JWT secret, and admin credentials.
3. Install dependencies with `npm install`.
4. Run `npm run db:migrate`, then `npm run db:seed`.
5. Start the app with `npm run dev` and open `http://localhost:3000`.

`npm run dev` starts both the frontend and backend together: this is a full-stack Next.js App Router application, so its `/api/*` route handlers run in the same server process as the website. No second backend command is needed.

Sign in at `/login`. The admin panel lives at `/admin` and includes projects, posts, services, skills, experience, education, inquiries, inbox controls, profile settings, and every dark/light palette field.

### Local login troubleshooting

If login returns “Database is not configured” or a generic server error, the new app was started without its own environment file. It does not use the old website's Supabase session cookie. Create `.env.local` from `.env.example`, then set `DATABASE_URL` to your migrated `pradeep_portfolio_app_router` database, use `DATABASE_SSL=false` for a local non-SSL PostgreSQL connection, and provide a unique `JWT_SECRET` of at least 32 characters. Restart `npm run dev` after changing environment variables.

Never paste browser cookies, JWTs, or passwords into source files or tickets; clear and rotate any token that has been shared.

## Import an existing portfolio backend

The one-time importer maps the old PostgreSQL portfolio tables to this application's schema and stores an immutable server-only copy of every imported content row in `legacy_source_records`. It preserves the old admin account, public content, contacts, and inbox records when private import is explicitly enabled.

1. Create and migrate the destination database.
2. Set `SOURCE_DATABASE_URL` to the old database, `SOURCE_UPLOAD_DIR` to its `uploads` directory, and `DATABASE_URL` to the new one.
3. Run `IMPORT_PRIVATE_DATA=true npm run db:import-legacy`.

The importer is idempotent and may be rerun. It never writes to the source database. In this workspace, the destination database is named `pradeep_portfolio_app_router`; configure its connection string as `DATABASE_URL` in the new application's deployment environment.

## Production notes

- Set a unique `JWT_SECRET` of at least 32 characters and use HTTPS. Auth cookies are HTTP-only, `SameSite=Lax`, and secure in production.
- Configure S3-compatible storage before allowing production uploads. Local disk uploads intentionally refuse in production.
- Gmail actions are optional. Set the OAuth refresh-token variables in `.env.local` to enable inbox sync, replies, read/star, and archive actions.
- Run `npm run build` before deploying. The database schema is idempotent, so migrations may be safely rerun.
