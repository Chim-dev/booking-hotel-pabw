# Phase 1 Setup (Environment & API Foundation)

Catatan arsitektur:
- Backend API dijalankan di SvelteKit (`frontend/src/routes/api/*`)
- Tidak perlu service Express terpisah

## 1. Prasyarat

- Bun terpasang
- PostgreSQL terpasang
- Ollama terpasang

## 2. Setup Ollama

1. Jalankan service Ollama.
2. Pull model lokal (contoh):

```bash
ollama pull llama3.1
```

3. Verifikasi service:

```bash
curl http://localhost:11434/api/tags
```

## 3. Setup PostgreSQL

1. Buat database:

```sql
CREATE DATABASE booking_hotel;
```

2. Salin env:

```bash
cp .env.example .env
```

3. Pastikan `DATABASE_URL` mengarah ke database baru.

4. Jalankan schema + seed:

```bash
bun run db:setup
```

### Alternatif: Supabase PostgreSQL

1. Buat project Supabase.
2. Ambil `Transaction pooler` connection string dari menu `Connect`.
3. Isi `DATABASE_URL` di `.env` dengan connection string Supabase.
4. Set `DATABASE_SSL=true`.
5. Jalankan:

```bash
bun run db:setup
```

Jika `db:setup` gagal di bagian extension, pastikan extension `btree_gist` dan `citext` aktif di project Supabase.

## 4. Endpoint yang tersedia (Phase 1)

- `GET /api/rooms`
- `GET /api/rooms/:id` (`:id` bisa numeric id atau code seperti `superior`)
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`
- `POST /api/bookings`

## 5. Contoh payload

### Register

```json
{
  "firstName": "Tenma",
  "lastName": "User",
  "email": "tenma@example.com",
  "phone": "+628123456789",
  "password": "secret123"
}
```

### Login

```json
{
  "email": "tenma@example.com",
  "password": "secret123"
}
```

### Booking

```json
{
  "roomCode": "deluxe",
  "checkIn": "2026-04-12",
  "checkOut": "2026-04-14",
  "guests": 2,
  "firstName": "Tenma",
  "lastName": "User",
  "email": "tenma@example.com",
  "phone": "+628123456789",
  "nationality": "ID",
  "specialRequest": "Kamar non-smoking",
  "paymentMethod": "transfer"
}
```

## 6. Catatan desain

- Password disimpan dengan hash `bcrypt`.
- Booking overlap per kamar dicegah di level database dengan exclusion constraint.
- Tax dihitung 11% di server saat membuat booking.
