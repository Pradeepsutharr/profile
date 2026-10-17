# App Router Portfolio

A fresh JavaScript-only Next.js App Router portfolio with its backend built into route handlers. It uses PostgreSQL, HTTP-only JWT admin sessions, S3-compatible uploads, and an optional Gmail integration. There is no Supabase dependency or compatibility layer.

## Start locally

1. Create a PostgreSQL database, for example `pradeep_portfolio`.
2. Copy `.env.example` to `.env.local` and fill in the required database, JWT secret, and admin credentials.
3. Install dependencies with `npm install`.
4. Run `npm run db:migrate`, then `npm run db:seed`.
5. Start the app with `npm run dev` and open `http://localhost:3000`.

Sign in at `/login`. The admin panel lives at `/admin` and includes projects, posts, services, skills, experience, education, inquiries, inbox controls, profile settings, and every dark/light palette field.

## Production notes

- Set a unique `JWT_SECRET` of at least 32 characters and use HTTPS. Auth cookies are HTTP-only, `SameSite=Lax`, and secure in production.
- Configure S3-compatible storage before allowing production uploads. Local disk uploads intentionally refuse in production.
- Gmail actions are optional. Set the OAuth refresh-token variables in `.env.local` to enable inbox sync, replies, read/star, and archive actions.
- Run `npm run build` before deploying. The database schema is idempotent, so migrations may be safely rerun.
