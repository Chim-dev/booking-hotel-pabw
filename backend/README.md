# Backend Service

Backend service terpisah untuk API hotel booking.

## Setup

1. Install dependency:

```bash
bun install
```

2. Salin env:

```bash
cp .env.example .env
```

3. Isi minimal:

- `DATABASE_URL`
- `JWT_SECRET`
- `ANTHROPIC_API_KEY` (untuk endpoint `/api/chat`)

4. Setup database:

```bash
bun run db:setup
```

## Menjalankan

```bash
bun run dev
```

Default backend URL: `http://localhost:3001`

## Endpoint

- `GET /health`
- `GET /api/health`
- `GET /api/rooms`
- `GET /api/rooms/:id`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/bookings`
- `POST /api/chat`
