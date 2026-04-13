# Frontend + API (SvelteKit)

Folder ini berisi aplikasi **SvelteKit** lengkap:
- UI frontend
- Backend API di `src/routes/api/*`

## Prasyarat

- Bun
- PostgreSQL

## Database Provider

Kamu bisa pakai:
- PostgreSQL lokal
- Supabase PostgreSQL (recommended untuk cloud)

## Setup

```bash
bun install
cp .env.example .env
bun run db:setup
```

Untuk Supabase:
1. Ambil connection string dari **Supabase Dashboard -> Connect -> Transaction pooler**.
2. Isi `DATABASE_URL` di `.env`.
3. Pastikan `DATABASE_SSL=true`.

## Development

```bash
bun run dev
```

## Validasi

```bash
bun run check
bun run build
```

## Endpoint API

- `GET /api/health`
- `GET /api/rooms`
- `GET /api/rooms/:id`
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/bookings`
- `POST /api/chat`
