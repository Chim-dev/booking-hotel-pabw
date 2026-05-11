# Booking Hotel PABW

Project ini telah dipisah menjadi dua project **SvelteKit** yang bekerja secara independen:

## Struktur Project

- `frontend/`: SvelteKit (UI & Client-side logic)
- `backend/`: SvelteKit (API-only backend)

## Kenapa dipisah?
Meskipun keduanya menggunakan SvelteKit, pemisahan ini memungkinkan:
1. Backend fokus pada logika data dan keamanan (API-only).
2. Frontend fokus pada pengalaman pengguna (UI).
3. Kemudahan jika ingin mengganti salah satu bagian di masa depan tanpa mengganggu bagian lainnya.

## Persiapan

1. **Database**: Pastikan PostgreSQL sudah berjalan.
2. **Backend**:
   ```bash
   cd backend
   bun install
   cp .env.example .env
   # Sesuaikan DATABASE_URL di .env
   bun run db:setup
   bun run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   bun install
   cp .env.example .env
   # Pastikan PUBLIC_BACKEND_URL mengarah ke http://localhost:3000
   bun run dev
   ```

## Menjalankan Bersama

```bash
# Terminal 1
cd backend && bun run dev

# Terminal 2
cd frontend && bun run dev
```

App: `http://localhost:5173`  
API: `http://localhost:3000/api/*`
