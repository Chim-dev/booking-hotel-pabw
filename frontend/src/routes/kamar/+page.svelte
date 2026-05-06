<script>
  import { onMount } from 'svelte';
  import { API_BASE_URL } from '$lib/config/api';

  /**
   * @typedef {object} Room
   * @property {number} id
   * @property {string} code
   * @property {string} name
   * @property {string} category
   * @property {string} description
   * @property {number} price
   * @property {string} size
   * @property {number} guests
   * @property {boolean} available
   * @property {string[]} features
   */

  let rooms = /** @type {Room[]} */ ([]);
  let loading = true;
  let error = '';

  /**
   * @param {number | string} value
   */
  function formatSize(value) {
    const number = Number(value);
    if (!Number.isFinite(number)) return `${value} m2`;
    return `${Number.isInteger(number) ? number : number.toFixed(1)} m2`;
  }

  /**
   * @param {number} n
   */
  function formatRp(n) {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(n);
  }

  /**
   * @param {{
   *   id: number | string;
   *   code: string;
   *   name: string;
   *   category: string;
   *   description: string;
   *   price_per_night: number | string;
   *   size_sqm: number | string;
   *   max_guests: number | string;
   *   is_available: unknown;
   *   features?: unknown;
   * }} room
   * @returns {Room}
   */
  function mapRoom(room) {
    return {
      id: Number(room.id),
      code: room.code,
      name: room.name,
      category: room.category,
      description: room.description,
      price: Number(room.price_per_night),
      size: formatSize(room.size_sqm),
      guests: Number(room.max_guests),
      available: Boolean(room.is_available),
      features: Array.isArray(room.features) ? room.features : []
    };
  }

  async function loadRooms() {
    loading = true;
    error = '';

    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        error = data.error || 'Gagal mengambil data kamar.';
        rooms = [];
        return;
      }

      rooms = Array.isArray(data.data) ? data.data.map(mapRoom) : [];
    } catch {
      error = 'Tidak dapat terhubung ke backend.';
      rooms = [];
    } finally {
      loading = false;
    }
  }

  onMount(loadRooms);
</script>

<svelte:head>
  <title>Kamar dan Suite - Grand Maison</title>
</svelte:head>

<div class="relative py-16 px-6 text-center border-b border-gold-700/20">
  <p class="text-gold-500 text-xs tracking-[0.4em] uppercase font-body mb-3">Akomodasi Premium</p>
  <h1 class="font-display text-4xl md:text-5xl text-ivory-100">Kamar dan Suite</h1>
  <p class="mt-4 font-body italic text-ivory-600 max-w-lg mx-auto">
    Pilih tipe kamar sesuai kebutuhan Anda.
  </p>
</div>

<div class="max-w-5xl mx-auto px-6 py-16 space-y-6">
  {#if loading}
    <div class="border border-gold-700/30 bg-velvet-800/40 p-6 text-center text-ivory-500">Memuat data kamar...</div>
  {:else if error}
    <div class="border border-red-500/30 bg-red-900/10 p-6 text-center text-red-200">{error}</div>
  {:else if rooms.length === 0}
    <div class="border border-gold-700/30 bg-velvet-800/40 p-6 text-center text-ivory-500">Belum ada data kamar.</div>
  {:else}
    {#each rooms as room}
      <article class="group border border-gold-700/25 hover:border-gold-500/50 transition-all duration-300 overflow-hidden bg-velvet-800/40 p-6">
        <div class="flex flex-col md:flex-row md:items-start gap-6 justify-between">
          <div class="flex-1">
            <div class="flex items-center gap-3 mb-2">
              <h2 class="font-display text-2xl text-ivory-100">{room.name}</h2>
              {#if !room.available}
                <span class="text-xs border border-gold-700/30 px-2 py-1 text-ivory-600 uppercase">Penuh</span>
              {/if}
            </div>

            <p class="text-sm text-ivory-600 mb-4">{room.description}</p>

            <div class="flex flex-wrap gap-4 text-xs text-ivory-700 font-body mb-3">
              <span>Luas {room.size}</span>
              <span>Maks {room.guests} tamu</span>
              <span>Kategori {room.category}</span>
            </div>

            <div class="flex flex-wrap gap-2">
              {#each room.features as f}
                <span class="text-xs bg-velvet-700 text-ivory-500 border border-gold-700/20 px-2.5 py-1">{f}</span>
              {/each}
            </div>
          </div>

          <div class="md:w-56 flex-shrink-0 md:text-right">
            <div class="font-display text-2xl text-gold-400">{formatRp(room.price)}</div>
            <div class="text-xs text-ivory-700 font-body mb-4">per malam</div>
            <a
              href="/booking?roomType={room.code}"
              class="btn-primary inline-flex"
              aria-disabled={!room.available}
            >
              Pesan Kamar
            </a>
          </div>
        </div>
      </article>
    {/each}
  {/if}
</div>

<div class="text-center py-14 px-6 border-t border-gold-700/20">
  <a href="/booking" class="btn-outline">Lanjut ke Reservasi</a>
</div>
