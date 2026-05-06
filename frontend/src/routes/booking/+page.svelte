<script>
  import { page } from '$app/stores';
  import { get } from 'svelte/store';
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
   * @property {string[]} features
   * @property {boolean} available
   */

  /**
   * @typedef {object} BookingForm
   * @property {string} checkIn
   * @property {string} checkOut
   * @property {string} guests
   * @property {string} roomType
   * @property {string} firstName
   * @property {string} lastName
   * @property {string} email
   * @property {string} phone
   * @property {string} nationality
   * @property {string} specialRequest
   * @property {'transfer' | 'card' | 'cash'} paymentMethod
   */

  let step = 1;
  let selectedRoom = /** @type {Room | null} */ (null);
  let rooms = /** @type {Room[]} */ ([]);
  let loadingRooms = true;
  let roomsError = '';
  let submitting = false;
  let submitError = '';
  let bookingRef = '';

  let form = /** @type {BookingForm} */ ({
    checkIn: '',
    checkOut: '',
    guests: '2',
    roomType: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    specialRequest: '',
    paymentMethod: 'transfer'
  });

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
   *   features?: unknown;
   *   is_available: unknown;
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
      features: Array.isArray(room.features) ? room.features : [],
      available: Boolean(room.is_available)
    };
  }

  async function prefillUser() {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include'
      });
      if (!res.ok) return;

      const data = await res.json();
      const user = data.data;
      if (!user) return;

      if (!form.firstName) form.firstName = user.first_name || '';
      if (!form.lastName) form.lastName = user.last_name || '';
      if (!form.email) form.email = user.email || '';
      if (!form.phone) form.phone = user.phone || '';
    } catch {
      // ignore
    }
  }

  async function loadRooms() {
    loadingRooms = true;
    roomsError = '';

    try {
      const res = await fetch(`${API_BASE_URL}/api/rooms`);
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        roomsError = data.error || 'Gagal mengambil data kamar.';
        rooms = [];
        return;
      }

      rooms = Array.isArray(data.data) ? data.data.map(mapRoom) : [];

      const requestedType = form.roomType.trim().toLowerCase();
      if (requestedType) {
        const preselected = rooms.find(
          (room) => room.code === requestedType || String(room.id) === requestedType
        );
        if (preselected && preselected.available) {
          selectedRoom = preselected;
          step = 2;
        }
      }
    } catch {
      roomsError = 'Tidak dapat terhubung ke server.';
      rooms = [];
    } finally {
      loadingRooms = false;
    }
  }

  onMount(async () => {
    const p = get(page).url.searchParams;
    form.checkIn = p.get('checkIn') || '';
    form.checkOut = p.get('checkOut') || '';
    form.guests = p.get('guests') || '2';
    form.roomType = p.get('roomType') || '';

    await Promise.all([loadRooms(), prefillUser()]);
  });

  $: nights = (() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const a = new Date(form.checkIn).getTime();
    const b = new Date(form.checkOut).getTime();
    if (!Number.isFinite(a) || !Number.isFinite(b)) return 0;
    return Math.max(0, Math.round((b - a) / 86400000));
  })();

  $: totalPrice = selectedRoom ? selectedRoom.price * nights : 0;
  $: taxAmount = Math.round(totalPrice * 0.11);
  $: grandTotal = totalPrice + taxAmount;

  /**
   * @param {Room} room
   */
  function selectRoom(room) {
    if (!room.available) return;
    selectedRoom = room;
    submitError = '';
    step = 2;
  }

  async function submitBooking() {
    if (!selectedRoom) {
      submitError = 'Silakan pilih kamar terlebih dahulu.';
      return;
    }

    if (!form.firstName || !form.lastName || !form.email || !form.checkIn || !form.checkOut) {
      submitError = 'Mohon lengkapi data wajib sebelum melanjutkan.';
      return;
    }

    submitError = '';
    submitting = true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          roomCode: selectedRoom.code,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: Number(form.guests),
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          nationality: form.nationality,
          specialRequest: form.specialRequest,
          paymentMethod: form.paymentMethod
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        submitError = data.error || 'Gagal membuat booking.';
        return;
      }

      bookingRef = data?.data?.booking?.booking_reference || '-';
      step = 3;
    } catch {
      submitError = 'Tidak dapat terhubung ke server.';
    } finally {
      submitting = false;
    }
  }
</script>

<svelte:head>
  <title>Reservasi - Grand Maison</title>
</svelte:head>

<div class="relative py-16 px-6 text-center border-b border-gold-700/20">
  <p class="text-gold-500 text-xs tracking-[0.4em] uppercase font-body mb-3">Grand Maison</p>
  <h1 class="font-display text-4xl md:text-5xl text-ivory-100">Reservasi Kamar</h1>
</div>

<div class="max-w-7xl mx-auto px-6 py-8">
  <div class="flex items-center justify-center gap-4 text-xs tracking-widest uppercase font-body mb-8">
    <span class:text-gold-400={step >= 1} class:text-ivory-700={step < 1}>1 Pilih Kamar</span>
    <span class="text-ivory-700">/</span>
    <span class:text-gold-400={step >= 2} class:text-ivory-700={step < 2}>2 Data Tamu</span>
    <span class="text-ivory-700">/</span>
    <span class:text-gold-400={step >= 3} class:text-ivory-700={step < 3}>3 Konfirmasi</span>
  </div>

  {#if step === 1}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-1">
        <div class="bg-velvet-800 border border-gold-700/30 p-6 sticky top-24 space-y-4">
          <h3 class="font-display text-xl text-gold-400 text-center">Detail Menginap</h3>

          <div>
            <label for="check-in" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Tanggal Check-in</label>
            <input id="check-in" type="date" bind:value={form.checkIn} class="input-baroque" />
          </div>

          <div>
            <label for="check-out" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Tanggal Check-out</label>
            <input id="check-out" type="date" bind:value={form.checkOut} class="input-baroque" />
          </div>

          <div>
            <label for="guests" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Jumlah Tamu</label>
            <select id="guests" bind:value={form.guests} class="input-baroque cursor-pointer">
              {#each [1, 2, 3, 4] as n}
                <option value={n}>{n} Tamu</option>
              {/each}
            </select>
          </div>

          {#if nights > 0}
            <div class="pt-4 border-t border-gold-700/20 text-center">
              <div class="text-ivory-700 text-sm font-body">Durasi</div>
              <div class="font-display text-3xl text-gold-400">{nights}</div>
              <div class="text-ivory-700 text-sm font-body">malam</div>
            </div>
          {/if}
        </div>
      </div>

      <div class="lg:col-span-2 space-y-4">
        {#if loadingRooms}
          <div class="border border-gold-700/30 bg-velvet-800/40 p-6 text-center text-ivory-500">Memuat data kamar...</div>
        {:else if roomsError}
          <div class="border border-red-500/30 bg-red-900/10 p-6 text-center text-red-200">{roomsError}</div>
        {:else if rooms.length === 0}
          <div class="border border-gold-700/30 bg-velvet-800/40 p-6 text-center text-ivory-500">Data kamar kosong.</div>
        {:else}
          {#each rooms as room}
            <article
              class="card-baroque p-5"
              class:opacity-50={!room.available}
              class:cursor-not-allowed={!room.available}
              class:border-gold-400={selectedRoom?.id === room.id}
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <h2 class="font-display text-xl text-ivory-100">{room.name}</h2>
                  <p class="text-sm text-ivory-600 mt-1">{room.description}</p>
                </div>
                {#if !room.available}
                  <span class="text-xs border border-gold-700/30 px-2 py-1 text-ivory-600 uppercase">Penuh</span>
                {/if}
              </div>

              <div class="mt-3 text-xs text-ivory-700 font-body flex flex-wrap gap-4">
                <span>Luas {room.size}</span>
                <span>Maks {room.guests} tamu</span>
                <span>Kategori {room.category}</span>
              </div>

              <div class="mt-3 flex flex-wrap gap-2">
                {#each room.features as f}
                  <span class="text-xs bg-velvet-700 text-ivory-500 border border-gold-700/20 px-2 py-1">{f}</span>
                {/each}
              </div>

              <div class="mt-4 pt-4 border-t border-gold-700/20 flex items-center justify-between">
                <div>
                  <div class="font-display text-xl text-gold-400">{formatRp(room.price)}</div>
                  <div class="text-xs text-ivory-700">per malam</div>
                </div>
                {#if room.available}
                  <button class="btn-primary text-xs px-5 py-2" on:click={() => selectRoom(room)}>Pilih</button>
                {/if}
              </div>
            </article>
          {/each}
        {/if}
      </div>
    </div>
  {:else if step === 2}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div class="lg:col-span-2 bg-velvet-800 border border-gold-700/30 p-8">
        <h3 class="font-display text-2xl text-gold-400 mb-6">Informasi Tamu</h3>

        {#if submitError}
          <div class="mb-6 border border-red-500/30 bg-red-900/10 p-3 text-red-200 text-sm">{submitError}</div>
        {/if}

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          <div>
            <label for="first-name" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Nama Depan *</label>
            <input id="first-name" bind:value={form.firstName} type="text" class="input-baroque" />
          </div>
          <div>
            <label for="last-name" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Nama Belakang *</label>
            <input id="last-name" bind:value={form.lastName} type="text" class="input-baroque" />
          </div>
          <div>
            <label for="email" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Email *</label>
            <input id="email" bind:value={form.email} type="email" class="input-baroque" />
          </div>
          <div>
            <label for="phone" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Nomor Telepon</label>
            <input id="phone" bind:value={form.phone} type="tel" class="input-baroque" />
          </div>
          <div class="sm:col-span-2">
            <label for="nationality" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Kewarganegaraan</label>
            <select id="nationality" bind:value={form.nationality} class="input-baroque cursor-pointer">
              <option value="">Pilih negara...</option>
              <option value="ID">Indonesia</option>
              <option value="SG">Singapura</option>
              <option value="MY">Malaysia</option>
              <option value="AU">Australia</option>
              <option value="US">Amerika Serikat</option>
              <option value="OTHER">Lainnya</option>
            </select>
          </div>
        </div>

        <div class="mb-6">
          <label for="special-request" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Permintaan Khusus</label>
          <textarea id="special-request" bind:value={form.specialRequest} rows="3" class="input-baroque resize-none"></textarea>
        </div>

        <div class="mb-8">
          <h4 class="font-display text-lg text-gold-400 mb-3">Metode Pembayaran</h4>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {#each [['transfer', 'Transfer Bank'], ['card', 'Kartu Kredit'], ['cash', 'Bayar di Hotel']] as [val, label]}
              <label class="flex items-center gap-3 p-4 border cursor-pointer transition-all duration-200 {form.paymentMethod === val ? 'border-gold-500 bg-velvet-700' : 'border-gold-700/30 hover:border-gold-600/50'}">
                <input type="radio" bind:group={form.paymentMethod} value={val} class="accent-gold-500" />
                <span class="text-sm font-body text-ivory-300">{label}</span>
              </label>
            {/each}
          </div>
        </div>

        <div class="flex gap-4">
          <button on:click={() => step = 1} class="btn-outline flex-1">Kembali</button>
          <button
            on:click={submitBooking}
            disabled={submitting || !form.firstName || !form.lastName || !form.email || !form.checkIn || !form.checkOut}
            class="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {#if submitting}
              Memproses...
            {:else}
              Konfirmasi Pemesanan
            {/if}
          </button>
        </div>
      </div>

      <div class="lg:col-span-1 bg-velvet-800 border border-gold-700/30 p-6 sticky top-24 h-fit">
        <h3 class="font-display text-lg text-gold-400 mb-4 text-center">Ringkasan Pesanan</h3>

        {#if selectedRoom}
          <div class="mb-4 p-4 border border-gold-700/20 bg-velvet-700/50">
            <div class="text-xs tracking-widest uppercase text-gold-600 font-body mb-1">{selectedRoom.category}</div>
            <div class="font-display text-lg text-ivory-100">{selectedRoom.name}</div>
          </div>
        {/if}

        <div class="space-y-2 text-sm font-body">
          <div class="flex justify-between text-ivory-600"><span>Check-in</span><span class="text-ivory-300">{form.checkIn || '-'}</span></div>
          <div class="flex justify-between text-ivory-600"><span>Check-out</span><span class="text-ivory-300">{form.checkOut || '-'}</span></div>
          <div class="flex justify-between text-ivory-600"><span>Durasi</span><span class="text-ivory-300">{nights} malam</span></div>
          <div class="flex justify-between text-ivory-600"><span>Tamu</span><span class="text-ivory-300">{form.guests} orang</span></div>
        </div>

        {#if selectedRoom && nights > 0}
          <div class="mt-4 pt-4 border-t border-gold-700/20 space-y-2 text-sm font-body">
            <div class="flex justify-between text-ivory-600">
              <span>{formatRp(selectedRoom.price)} x {nights}</span>
              <span class="text-ivory-300">{formatRp(totalPrice)}</span>
            </div>
            <div class="flex justify-between text-ivory-600">
              <span>Pajak 11%</span>
              <span class="text-ivory-300">{formatRp(taxAmount)}</span>
            </div>
            <div class="flex justify-between text-gold-400 font-serif text-base pt-2 border-t border-gold-700/20">
              <span>Total</span>
              <span>{formatRp(grandTotal)}</span>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {:else}
    <div class="max-w-2xl mx-auto text-center bg-velvet-800 border border-gold-500/40 p-10">
      <h2 class="font-display text-4xl text-gold-400 mb-3">Reservasi Berhasil</h2>
      <p class="text-ivory-600 font-body italic mb-6">Terima kasih, {form.firstName}. Reservasi Anda sudah tercatat.</p>

      <div class="border border-gold-700/30 bg-velvet-700/50 p-5 mb-6">
        <div class="text-xs tracking-widest uppercase text-gold-600 font-body mb-2">Kode Reservasi</div>
        <div class="font-display text-3xl text-gold-400">{bookingRef}</div>
      </div>

      <p class="text-xs text-ivory-700 font-body mb-6">
        Detail konfirmasi akan dikirimkan ke <span class="text-gold-500">{form.email}</span>.
      </p>

      <a href="/" class="btn-primary inline-flex">Kembali ke Beranda</a>
    </div>
  {/if}
</div>
