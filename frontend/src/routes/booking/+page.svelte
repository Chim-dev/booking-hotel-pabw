<script>
  import { page } from '$app/stores';
  import { onMount } from 'svelte';

  let step = 1; // 1: pilih kamar, 2: detail tamu, 3: konfirmasi
  let selectedRoom = null;

  // Form data
  let form = {
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
    paymentMethod: 'transfer',
  };

  onMount(() => {
    const p = $page.url.searchParams;
    form.checkIn  = p.get('checkIn')   || '';
    form.checkOut = p.get('checkOut')  || '';
    form.guests   = p.get('guests')    || '2';
    form.roomType = p.get('roomType')  || '';
  });

  const rooms = [
    {
      id: 'superior',
      name: 'Kamar Superior Klasik',
      category: 'Superior',
      price: 1750000,
      size: '32 m²',
      guests: 2,
      features: ['Queen Bed', 'Rain Shower', 'City View', 'Sarapan'],
      available: true,
    },
    {
      id: 'deluxe',
      name: 'Kamar Deluxe Victoria',
      category: 'Deluxe',
      price: 2850000,
      size: '45 m²',
      guests: 2,
      features: ['King Bed', 'Bathtub Antik', 'Balkon', 'Butler'],
      available: true,
    },
    {
      id: 'suite',
      name: 'Suite Baroque Grand',
      category: 'Suite',
      price: 5500000,
      size: '90 m²',
      guests: 4,
      features: ['King Bed', 'Living Room', 'Marble Bath', 'Champagne'],
      available: true,
    },
    {
      id: 'premier',
      name: 'Kamar Premier Mezzanine',
      category: 'Premier',
      price: 3900000,
      size: '60 m²',
      guests: 2,
      features: ['King Bed', 'Mezzanine Level', 'Soaking Tub', 'Mini Bar'],
      available: false,
    },
  ];

  $: nights = (() => {
    if (!form.checkIn || !form.checkOut) return 0;
    const a = new Date(form.checkIn), b = new Date(form.checkOut);
    return Math.max(0, Math.round((b - a) / 86400000));
  })();

  $: totalPrice = selectedRoom ? selectedRoom.price * nights : 0;
  $: taxAmount  = Math.round(totalPrice * 0.11);
  $: grandTotal = totalPrice + taxAmount;

  function formatRp(n) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
  }

  function selectRoom(room) {
    if (!room.available) return;
    selectedRoom = room;
    if (step === 1) step = 2;
  }

  function submitBooking() {
    step = 3;
  }

  $: bookingRef = 'GM-' + Date.now().toString(36).toUpperCase().slice(-8);
</script>

<svelte:head>
  <title>Reservasi — Grand Maison</title>
</svelte:head>

<!-- Page Header -->
<div class="relative py-20 px-6 text-center overflow-hidden border-b border-gold-700/20">
  <div class="absolute inset-0 bg-baroque-pattern opacity-10"></div>
  <div class="absolute top-4 left-8 text-gold-700/20 text-5xl font-display">❦</div>
  <div class="absolute top-4 right-8 text-gold-700/20 text-5xl font-display" style="transform:scaleX(-1)">❦</div>
  <p class="text-gold-500 text-xs tracking-[0.4em] uppercase font-body mb-3">✦ Grand Maison</p>
  <h1 class="font-display text-5xl md:text-6xl text-ivory-100">Reservasi Kamar</h1>
  <div class="divider-baroque mt-4"><span class="text-gold-600 text-sm">⸻ ✦ ⸻</span></div>
</div>

<!-- Step Indicator -->
<div class="max-w-2xl mx-auto px-6 py-8">
  <div class="flex items-center justify-center gap-0">
    {#each [['1','Pilih Kamar'],['2','Data Tamu'],['3','Konfirmasi']] as [s, label], i}
      <div class="flex items-center">
        <div class="flex flex-col items-center">
          <div class="w-10 h-10 flex items-center justify-center border text-sm font-body transition-all duration-300"
            class:border-gold-500={step >= parseInt(s)}
            class:bg-gold-500={step >= parseInt(s)}
            class:text-velvet-900={step >= parseInt(s)}
            class:border-gold-700={step < parseInt(s)}
            class:text-ivory-700={step < parseInt(s)}>
            {#if step > parseInt(s)}✓{:else}{s}{/if}
          </div>
          <span class="text-xs mt-1 tracking-widest uppercase font-body"
            class:text-gold-400={step >= parseInt(s)}
            class:text-ivory-700={step < parseInt(s)}>{label}</span>
        </div>
        {#if i < 2}
          <div class="w-16 md:w-24 h-px mx-2 mb-5 transition-colors duration-300"
            class:bg-gold-500={step > i + 1}
            class:bg-gold-700={step <= i + 1}></div>
        {/if}
      </div>
    {/each}
  </div>
</div>

<div class="max-w-7xl mx-auto px-6 pb-24">

  <!-- ── STEP 1: Pilih Kamar ── -->
  {#if step === 1}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      <!-- Left: date filter -->
      <div class="lg:col-span-1">
        <div class="bg-velvet-800 border border-gold-700/30 p-6 sticky top-24">
          <div class="h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-6"></div>
          <h3 class="font-display text-xl text-gold-400 mb-5 text-center">Detail Menginap</h3>
          
          <div class="space-y-4">
            <div>
              <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Tanggal Check-in</label>
              <input type="date" bind:value={form.checkIn} class="input-baroque" />
            </div>
            <div>
              <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Tanggal Check-out</label>
              <input type="date" bind:value={form.checkOut} class="input-baroque" />
            </div>
            <div>
              <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Jumlah Tamu</label>
              <select bind:value={form.guests} class="input-baroque cursor-pointer">
                {#each [1,2,3,4] as n}
                  <option value={n}>{n} Tamu</option>
                {/each}
              </select>
            </div>
          </div>

          {#if nights > 0}
            <div class="mt-6 pt-6 border-t border-gold-700/20 text-center">
              <div class="text-ivory-700 text-sm font-body">Durasi Menginap</div>
              <div class="font-display text-3xl text-gold-400">{nights}</div>
              <div class="text-ivory-700 text-sm font-body">malam</div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Right: room cards -->
      <div class="lg:col-span-2 space-y-5">
        <p class="text-ivory-700 text-sm font-body tracking-wide">
          Menampilkan {rooms.length} tipe kamar &nbsp;—&nbsp; pilih yang sesuai dengan keinginan Anda
        </p>

        {#each rooms as room}
          <div class="card-baroque relative cursor-pointer" 
            on:click={() => selectRoom(room)}
            on:keydown={(e) => e.key === 'Enter' && selectRoom(room)}
            role="button" tabindex="0"
            class:opacity-50={!room.available}
            class:cursor-not-allowed={!room.available}
            class:border-gold-400={selectedRoom?.id === room.id}>
            
            {#if !room.available}
              <div class="absolute top-3 right-3 text-xs bg-velvet-700 text-ivory-600 border border-gold-700/20 px-2 py-1 font-body tracking-wide uppercase z-10">
                Penuh
              </div>
            {/if}

            <div class="flex flex-col sm:flex-row">
              <!-- Room image placeholder -->
              <div class="sm:w-48 h-40 sm:h-auto bg-gradient-to-br from-velvet-700 to-velvet-900 flex items-center justify-center flex-shrink-0 relative overflow-hidden">
                <div class="absolute inset-0 bg-baroque-pattern opacity-20"></div>
                <span class="text-gold-700/40 font-display text-6xl select-none">❦</span>
                <div class="absolute bottom-2 left-2 text-xs bg-gold-600 text-velvet-900 px-2 py-0.5 font-body tracking-wide">
                  {room.category}
                </div>
              </div>

              <!-- Details -->
              <div class="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 class="font-display text-xl text-ivory-100 mb-1">{room.name}</h3>
                  <div class="flex gap-4 text-xs text-ivory-700 font-body mb-3">
                    <span>📐 {room.size}</span>
                    <span>👤 Maks. {room.guests} Tamu</span>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    {#each room.features as f}
                      <span class="text-xs bg-velvet-700 text-ivory-500 border border-gold-700/20 px-2 py-0.5 font-body">{f}</span>
                    {/each}
                  </div>
                </div>

                <div class="flex items-end justify-between mt-4 pt-4 border-t border-gold-700/20">
                  <div>
                    <div class="font-display text-xl text-gold-400">{formatRp(room.price)}</div>
                    <div class="text-xs text-ivory-700 font-body">per malam · belum termasuk pajak</div>
                    {#if nights > 0}
                      <div class="text-xs text-gold-600 font-body mt-1">{nights} malam = {formatRp(room.price * nights)}</div>
                    {/if}
                  </div>
                  {#if room.available}
                    <button class="btn-primary text-xs px-5 py-2">Pilih</button>
                  {/if}
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>

  <!-- ── STEP 2: Data Tamu ── -->
  {:else if step === 2}
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

      <!-- Form -->
      <div class="lg:col-span-2">
        <div class="bg-velvet-800 border border-gold-700/30 p-8">
          <div class="h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent mb-8"></div>
          <h3 class="font-display text-2xl text-gold-400 mb-6">Informasi Tamu</h3>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
            <div>
              <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Nama Depan *</label>
              <input bind:value={form.firstName} type="text" placeholder="Nama depan" class="input-baroque" />
            </div>
            <div>
              <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Nama Belakang *</label>
              <input bind:value={form.lastName} type="text" placeholder="Nama belakang" class="input-baroque" />
            </div>
            <div>
              <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Email *</label>
              <input bind:value={form.email} type="email" placeholder="email@contoh.com" class="input-baroque" />
            </div>
            <div>
              <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Nomor Telepon *</label>
              <input bind:value={form.phone} type="tel" placeholder="+62 8xx xxxx xxxx" class="input-baroque" />
            </div>
            <div class="sm:col-span-2">
              <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Kewarganegaraan</label>
              <select bind:value={form.nationality} class="input-baroque cursor-pointer">
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

          <div class="mb-8">
            <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Permintaan Khusus</label>
            <textarea bind:value={form.specialRequest} rows="3" 
              placeholder="Contoh: Kamar di lantai tinggi, dekorasi untuk anniversari, alergi makanan, dll."
              class="input-baroque resize-none"></textarea>
          </div>

          <div class="mb-8">
            <h4 class="font-display text-lg text-gold-400 mb-4">Metode Pembayaran</h4>
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {#each [['transfer','Transfer Bank'],['card','Kartu Kredit'],['cash','Bayar di Hotel']] as [val, label]}
                <label class="flex items-center gap-3 p-4 border cursor-pointer transition-all duration-200
                  {form.paymentMethod === val ? 'border-gold-500 bg-velvet-700' : 'border-gold-700/30 hover:border-gold-600/50'}">
                  <input type="radio" bind:group={form.paymentMethod} value={val} class="accent-gold-500" />
                  <span class="text-sm font-body text-ivory-300">{label}</span>
                </label>
              {/each}
            </div>
          </div>

          <div class="flex gap-4">
            <button on:click={() => step = 1} class="btn-outline flex-1">← Kembali</button>
            <button on:click={submitBooking}
              disabled={!form.firstName || !form.email || !form.phone}
              class="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed">
              Konfirmasi Pemesanan →
            </button>
          </div>
        </div>
      </div>

      <!-- Summary -->
      <div class="lg:col-span-1">
        <div class="bg-velvet-800 border border-gold-700/30 p-6 sticky top-24">
          <div class="h-0.5 bg-linear-to-r from-transparent via-gold-500 to-transparent mb-6"></div>
          <h3 class="font-display text-lg text-gold-400 mb-5 text-center">Ringkasan Pesanan</h3>

          {#if selectedRoom}
            <div class="text-center mb-5 p-4 border border-gold-700/20 bg-velvet-700/50">
              <div class="text-xs tracking-widest uppercase text-gold-600 font-body mb-1">{selectedRoom.category}</div>
              <div class="font-display text-lg text-ivory-100">{selectedRoom.name}</div>
            </div>
          {/if}

          <div class="space-y-3 text-sm font-body">
            {#if form.checkIn}
              <div class="flex justify-between text-ivory-600">
                <span>Check-in</span>
                <span class="text-ivory-300">{new Date(form.checkIn).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'})}</span>
              </div>
            {/if}
            {#if form.checkOut}
              <div class="flex justify-between text-ivory-600">
                <span>Check-out</span>
                <span class="text-ivory-300">{new Date(form.checkOut).toLocaleDateString('id-ID', {day:'numeric',month:'long',year:'numeric'})}</span>
              </div>
            {/if}
            <div class="flex justify-between text-ivory-600">
              <span>Durasi</span>
              <span class="text-ivory-300">{nights} malam</span>
            </div>
            <div class="flex justify-between text-ivory-600">
              <span>Tamu</span>
              <span class="text-ivory-300">{form.guests} orang</span>
            </div>
          </div>

          {#if selectedRoom && nights > 0}
            <div class="mt-5 pt-5 border-t border-gold-700/20 space-y-2 text-sm font-body">
              <div class="flex justify-between text-ivory-600">
                <span>{formatRp(selectedRoom.price)} × {nights} malam</span>
                <span class="text-ivory-300">{formatRp(totalPrice)}</span>
              </div>
              <div class="flex justify-between text-ivory-600">
                <span>Pajak (11%)</span>
                <span class="text-ivory-300">{formatRp(taxAmount)}</span>
              </div>
              <div class="flex justify-between text-gold-400 font-serif text-base pt-2 border-t border-gold-700/20 mt-2">
                <span>Total</span>
                <span>{formatRp(grandTotal)}</span>
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

  <!-- ── STEP 3: Konfirmasi ── -->
  {:else if step === 3}
    <div class="max-w-2xl mx-auto text-center">
      <div class="bg-velvet-800 border border-gold-500/40 p-10 relative overflow-hidden">
        <div class="absolute inset-0 bg-baroque-pattern opacity-10"></div>
        <span class="absolute top-4 left-5 text-gold-600/25 text-3xl font-display">❦</span>
        <span class="absolute top-4 right-5 text-gold-600/25 text-3xl font-display" style="transform:scaleX(-1)">❦</span>
        <span class="absolute bottom-4 left-5 text-gold-600/25 text-3xl font-display" style="transform:scaleY(-1)">❦</span>
        <span class="absolute bottom-4 right-5 text-gold-600/25 text-3xl font-display" style="transform:scale(-1)">❦</span>

        <div class="relative z-10">
          <div class="text-gold-500 text-5xl mb-4">✦</div>
          <h2 class="font-display text-4xl text-gold-400 mb-2">Reservasi Berhasil!</h2>
          <p class="text-ivory-600 font-body italic mb-6">
            Terima kasih, {form.firstName}. Kami menantikan kedatangan Anda.
          </p>
          
          <div class="divider-baroque mb-6"><span class="text-gold-600">⸻ ✦ ⸻</span></div>

          <div class="bg-velvet-700/50 border border-gold-700/30 p-5 mb-6 text-left">
            <div class="text-xs tracking-widest uppercase text-gold-600 font-body text-center mb-4">Kode Reservasi</div>
            <div class="font-display text-3xl text-gold-400 text-center mb-4">{bookingRef}</div>

            <div class="space-y-2 text-sm font-body">
              {#each [
                ['Kamar', selectedRoom?.name ?? '-'],
                ['Check-in', form.checkIn ? new Date(form.checkIn).toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'}) : '-'],
                ['Check-out', form.checkOut ? new Date(form.checkOut).toLocaleDateString('id-ID', {weekday:'long', day:'numeric', month:'long', year:'numeric'}) : '-'],
                ['Durasi', nights + ' malam'],
                ['Tamu', form.firstName + ' ' + form.lastName],
                ['Total Pembayaran', formatRp(grandTotal)],
              ] as [k, v]}
                <div class="flex justify-between py-1 border-b border-gold-700/10">
                  <span class="text-ivory-700">{k}</span>
                  <span class="text-ivory-300 text-right">{v}</span>
                </div>
              {/each}
            </div>
          </div>

          <p class="text-xs text-ivory-700 font-body mb-6">
            Detail konfirmasi telah dikirimkan ke <span class="text-gold-500">{form.email}</span>.<br/>
            Tim concierge kami akan menghubungi Anda dalam 24 jam.
          </p>

          <a href="/" class="btn-primary inline-flex">Kembali ke Beranda</a>
        </div>
      </div>
    </div>
  {/if}
</div>
