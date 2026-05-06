# Booking Hotel PABW

Project ini sekarang memakai satu framework: **SvelteKit**.
Frontend dan backend API dijalankan dari folder `frontend`.

## Stack

- Framework: SvelteKit
- Runtime + package manager: Bun
- Database: PostgreSQL (local atau Supabase)

## Menjalankan Project

```bash
cd frontend
bun install
cp .env.example .env
bun run db:setup
bun run dev
```

App: `http://localhost:5173`  
API: `http://localhost:5173/api/*`

## Script Utama (di `frontend`)

- `bun run dev`
- `bun run check`
- `bun run build`
- `bun run db:setup`
- `bun run db:seed`
