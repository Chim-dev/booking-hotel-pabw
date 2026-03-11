<script>
  import { onMount } from 'svelte';

  let visible = false;
  onMount(() => { setTimeout(() => visible = true, 100); });

  const rooms = [
    {
      name: 'Kamar Deluxe Victoria',
      category: 'Deluxe',
      price: 'Rp 2.850.000',
      size: '45 m²',
      guests: '2 Tamu',
      description: 'Kamar elegan dengan sentuhan Victoria yang autentik, dilengkapi tempat tidur kanopi empat tiang dan pemandangan taman.',
      features: ['King Bed', 'Bathtub Antik', 'Balkon Privat', 'Butler Service'],
      badge: 'Paling Populer',
    },
    {
      name: 'Suite Baroque Grand',
      category: 'Suite',
      price: 'Rp 5.500.000',
      size: '90 m²',
      guests: '2–4 Tamu',
      description: 'Suite agung dengan langit-langit berornamen, ruang tamu terpisah, dan kamar mandi marmer mewah bergaya Eropa klasik.',
      features: ['King Bed', 'Living Room', 'Marble Bathroom', 'Champagne Welcome'],
      badge: 'Eksklusif',
    },
    {
      name: 'Kamar Superior Klasik',
      category: 'Superior',
      price: 'Rp 1.750.000',
      size: '32 m²',
      guests: '2 Tamu',
      description: 'Kamar nyaman dengan dekorasi periode yang indah, cocok untuk pasangan yang menginginkan kemewahan terjangkau.',
      features: ['Queen Bed', 'Rain Shower', 'City View', 'Breakfast Included'],
      badge: null,
    },
  ];

  const amenities = [
    { icon: '✦', title: 'Grand Dining', desc: 'Restoran fine dining dengan menu Perancis-Jawa klasik yang menggugah selera.' },
    { icon: '◈', title: 'Royal Spa', desc: 'Spa eksklusif dengan perawatan tradisional Jawa dan terapi modern.' },
    { icon: '⬡', title: 'Ballroom Baroque', desc: 'Ruang pesta megah berkapasitas 500 tamu dengan dekorasi baroque asli.' },
    { icon: '✧', title: 'Perpustakaan', desc: 'Perpustakaan privat dengan koleksi buku antik dan ruang baca tenang.' },
    { icon: '⊕', title: 'Kolam Victoria', desc: 'Kolam renang outdoor berbentuk oval dengan pahatan marmer klasik.' },
    { icon: '◉', title: 'Concierge 24/7', desc: 'Layanan concierge personal siap memenuhi setiap kebutuhan Anda.' },
  ];

  const testimonials = [
    {
      name: 'Siti Rahayu',
      title: 'Tamu Setia sejak 2018',
      text: 'Grand Maison bukan sekadar hotel — ini adalah perjalanan waktu. Setiap sudut berbicara tentang keindahan masa lampau yang terjaga dengan sempurna.',
    },
    {
      name: 'Dr. Budi Santoso',
      title: 'Tamu Bisnis',
      text: 'Suasana baroque yang autentik namun tetap profesional. Tempat sempurna untuk pertemuan bisnis yang berkesan dan tak terlupakan.',
    },
    {
      name: 'Anita & Reza',
      title: 'Tamu Bulan Madu',
      text: 'Momen paling indah dalam hidup kami. Pelayanan butler suite kami sungguh luar biasa — kami merasa seperti bangsawan.',
    },
  ];

  // Booking form
  let checkIn = '';
  let checkOut = '';
  let guests = '2';
  let roomType = '';

  function handleQuickBook() {
    const params = new URLSearchParams({ checkIn, checkOut, guests, roomType });
    window.location.href = `/booking?${params.toString()}`;
  }
</script>

<svelte:head>
  <title>Grand Maison — Penginapan Mewah Bergaya Victoria</title>
</svelte:head>

<!-- ═══════════════════════ HERO ═══════════════════════ -->
<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <!-- Background gradient -->
  <div class="absolute inset-0 bg-gradient-to-b from-velvet-900 via-velvet-800 to-velvet-900"></div>
  
  <!-- Decorative circles / halos -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full border border-gold-700/10"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-gold-600/10"></div>
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-gold-500/15"></div>

  <!-- Baroque pattern overlay -->
  <div class="absolute inset-0 bg-baroque-pattern opacity-30"></div>

  <!-- Corner ornaments -->
  <div class="absolute top-8 left-8 text-gold-600/30 text-5xl select-none leading-none font-display">❦</div>
  <div class="absolute top-8 right-8 text-gold-600/30 text-5xl select-none leading-none font-display" style="transform: scaleX(-1)">❦</div>
  <div class="absolute bottom-8 left-8 text-gold-600/30 text-5xl select-none leading-none font-display" style="transform: scaleY(-1)">❦</div>
  <div class="absolute bottom-8 right-8 text-gold-600/30 text-5xl select-none leading-none font-display" style="transform: scale(-1)">❦</div>

  <!-- Content -->
  <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
    <div class="opacity-0 animate-fade-in" class:opacity-100={visible}>
      <p class="text-gold-500 text-xs tracking-[0.5em] uppercase mb-6 font-body">
        ✦ &nbsp; Selamat Datang di &nbsp; ✦
      </p>
    </div>
    
    <div class="opacity-0 animate-slide-up delay-200" class:opacity-100={visible}>
      <h1 class="font-display text-6xl md:text-8xl lg:text-9xl text-ivory-100 leading-[0.9] tracking-tight mb-2">
        Grand
      </h1>
      <h1 class="font-display text-6xl md:text-8xl lg:text-9xl text-gold-500 leading-[0.9] tracking-tight italic mb-6">
        Maison
      </h1>
    </div>

    <div class="divider-baroque mb-8 opacity-0 animate-fade-in delay-300" class:opacity-100={visible}>
      <span class="text-gold-600 text-base">⸻ ✦ ⸻</span>
    </div>

    <div class="opacity-0 animate-slide-up delay-400" class:opacity-100={visible}>
      <p class="font-body text-ivory-500 text-xl md:text-2xl italic leading-relaxed mb-10 max-w-2xl mx-auto">
        Di mana setiap kamar adalah sebuah mahakarya,<br/>
        dan setiap momen menjadi kenangan abadi.
      </p>
    </div>

    <div class="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in delay-500" class:opacity-100={visible}>
      <a href="/booking" class="btn-primary">
        Reservasi Sekarang
      </a>
      <a href="/kamar" class="btn-outline">
        Jelajahi Kamar
      </a>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gold-600/50 animate-shimmer">
    <span class="text-xs tracking-widest uppercase font-body">Gulir</span>
    <div class="w-px h-12 bg-gradient-to-b from-gold-600/50 to-transparent"></div>
  </div>
</section>

<!-- ═══════════════════════ QUICK BOOKING WIDGET ═══════════════════════ -->
<section class="relative -mt-1 py-0">
  <div class="max-w-5xl mx-auto px-6">
    <div class="bg-velvet-800 border border-gold-700/40 shadow-baroque relative overflow-hidden">
      <!-- Top accent -->
      <div class="h-0.5 bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>
      
      <!-- Corner fleur -->
      <span class="absolute top-3 left-4 text-gold-600/30 text-xl">❧</span>
      <span class="absolute top-3 right-4 text-gold-600/30 text-xl" style="transform: scaleX(-1)">❧</span>

      <div class="p-8">
        <h2 class="text-center font-display text-2xl text-gold-400 mb-1">Reservasi Cepat</h2>
        <p class="text-center text-xs tracking-widest text-ivory-700 uppercase mb-6">— Pesan dalam hitungan menit —</p>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Check-in</label>
            <input type="date" bind:value={checkIn} class="input-baroque" />
          </div>
          <div>
            <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Check-out</label>
            <input type="date" bind:value={checkOut} class="input-baroque" />
          </div>
          <div>
            <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Tamu</label>
            <select bind:value={guests} class="input-baroque cursor-pointer">
              <option value="1">1 Tamu</option>
              <option value="2">2 Tamu</option>
              <option value="3">3 Tamu</option>
              <option value="4">4 Tamu</option>
            </select>
          </div>
          <div>
            <label class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Tipe Kamar</label>
            <select bind:value={roomType} class="input-baroque cursor-pointer">
              <option value="">Semua Tipe</option>
              <option value="superior">Superior Klasik</option>
              <option value="deluxe">Deluxe Victoria</option>
              <option value="suite">Suite Baroque</option>
            </select>
          </div>
        </div>

        <div class="text-center">
          <button on:click={handleQuickBook} class="btn-primary px-12">
            Cari Ketersediaan
          </button>
        </div>
      </div>
    </div>
  </div>
</section>

<!-- ═══════════════════════ INTRO / ABOUT ═══════════════════════ -->
<section class="py-28 px-6">
  <div class="max-w-4xl mx-auto text-center">
    <p class="text-gold-500 text-xs tracking-[0.4em] uppercase font-body mb-4">✦ Warisan Kemewahan</p>
    <h2 class="section-title mb-6">
      Sejak 1887, Kami Menjaga<br/>
      <em class="text-gold-400 not-italic font-display">Tradisi Kemewahan</em>
    </h2>
    <div class="divider-baroque mb-8">
      <span class="text-gold-600">⸻ ❦ ⸻</span>
    </div>
    <p class="section-subtitle max-w-2xl mx-auto italic">
      "Grand Maison berdiri sebagai monumen keindahan arsitektur Victoria dan Baroque yang telah menjadi 
      saksi bisu ribuan kisah cinta, perayaan, dan pertemuan bersejarah selama lebih dari satu abad."
    </p>
    <div class="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
      {#each [['137', 'Tahun Warisan'], ['48', 'Kamar & Suite'], ['15', 'Penghargaan']] as [num, label]}
        <div class="text-center">
          <div class="font-display text-5xl text-gold-500 leading-none mb-1">{num}</div>
          <div class="text-xs tracking-widest text-ivory-700 uppercase font-body">{label}</div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════ ROOMS ═══════════════════════ -->
<section class="py-20 px-6 bg-velvet-800/40">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <p class="text-gold-500 text-xs tracking-[0.4em] uppercase font-body mb-4">✦ Akomodasi Kami</p>
      <h2 class="section-title">Kamar & <em class="text-gold-400 font-display not-italic">Suite</em></h2>
      <div class="divider-baroque mt-4">
        <span class="text-gold-600">⸻ ✦ ⸻</span>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each rooms as room}
        <article class="card-baroque group">
          <!-- Image placeholder with baroque pattern -->
          <div class="relative h-56 bg-gradient-to-br from-velvet-700 to-velvet-900 overflow-hidden">
            <div class="absolute inset-0 bg-baroque-pattern opacity-20"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <span class="text-gold-600/30 text-8xl font-display select-none">❦</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-velvet-800/80 to-transparent"></div>
            {#if room.badge}
              <div class="absolute top-4 right-4 bg-gold-500 text-velvet-900 text-xs tracking-widest uppercase px-3 py-1 font-body">
                {room.badge}
              </div>
            {/if}
            <div class="absolute bottom-4 left-4">
              <span class="text-xs tracking-widest uppercase text-gold-400 font-body">{room.category}</span>
            </div>
          </div>

          <div class="p-6">
            <h3 class="font-display text-xl text-ivory-100 mb-2">{room.name}</h3>
            <p class="text-sm text-ivory-600 font-body leading-relaxed mb-4">{room.description}</p>

            <div class="flex gap-4 mb-4 text-xs text-ivory-700 font-body">
              <span>📐 {room.size}</span>
              <span>👤 {room.guests}</span>
            </div>

            <div class="flex flex-wrap gap-2 mb-5">
              {#each room.features as f}
                <span class="text-xs bg-velvet-700 text-ivory-500 border border-gold-700/20 px-2.5 py-1 font-body tracking-wide">
                  {f}
                </span>
              {/each}
            </div>

            <div class="flex items-end justify-between border-t border-gold-700/20 pt-4">
              <div>
                <span class="text-xs text-ivory-700 font-body">Mulai dari</span>
                <div class="font-display text-xl text-gold-400">{room.price}</div>
                <span class="text-xs text-ivory-700 font-body">/ malam</span>
              </div>
              <a href="/booking" class="btn-outline text-xs px-4 py-2">
                Pesan
              </a>
            </div>
          </div>
        </article>
      {/each}
    </div>

    <div class="text-center mt-10">
      <a href="/kamar" class="btn-outline">Lihat Semua Kamar</a>
    </div>
  </div>
</section>

<!-- ═══════════════════════ AMENITIES ═══════════════════════ -->
<section class="py-28 px-6">
  <div class="max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <p class="text-gold-500 text-xs tracking-[0.4em] uppercase font-body mb-4">✦ Fasilitas Eksklusif</p>
      <h2 class="section-title">Pengalaman yang <em class="text-gold-400 font-display not-italic">Tak Tertandingi</em></h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each amenities as item}
        <div class="group p-6 border border-gold-700/20 hover:border-gold-500/50 transition-all duration-300 hover:bg-velvet-800/50 relative overflow-hidden">
          <!-- Decorative corner -->
          <span class="absolute top-3 right-3 text-gold-700/20 text-lg group-hover:text-gold-600/40 transition-colors">✦</span>
          
          <div class="text-gold-500 text-2xl mb-4 group-hover:scale-110 transition-transform">{item.icon}</div>
          <h3 class="font-serif text-lg text-ivory-100 mb-2">{item.title}</h3>
          <p class="text-sm text-ivory-600 font-body leading-relaxed">{item.desc}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════ TESTIMONIALS ═══════════════════════ -->
<section class="py-24 px-6 bg-velvet-800/30 relative overflow-hidden">
  <!-- Background ornament -->
  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
    <span class="text-gold-900/10 font-display opacity-20" style="font-size: 30rem; line-height: 1; select-none">❦</span>
  </div>

  <div class="relative max-w-7xl mx-auto">
    <div class="text-center mb-16">
      <p class="text-gold-500 text-xs tracking-[0.4em] uppercase font-body mb-4">✦ Kata Mereka</p>
      <h2 class="section-title">Pengalaman <em class="text-gold-400 font-display not-italic">Para Tamu</em></h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each testimonials as t}
        <blockquote class="relative p-8 border border-gold-700/25 bg-velvet-800/50">
          <span class="absolute top-4 left-6 text-gold-600/30 font-display text-6xl leading-none">"</span>
          <p class="font-body text-ivory-500 leading-relaxed italic relative z-10 mt-4 mb-6">{t.text}</p>
          <div class="divider-baroque mb-5">
            <span class="text-gold-700 text-xs">⸻</span>
          </div>
          <footer>
            <div class="font-serif text-ivory-200">{t.name}</div>
            <div class="text-xs tracking-widest text-gold-600 uppercase font-body">{t.title}</div>
          </footer>
        </blockquote>
      {/each}
    </div>
  </div>
</section>

<!-- ═══════════════════════ CTA ═══════════════════════ -->
<section class="py-28 px-6 text-center relative overflow-hidden">
  <div class="absolute inset-0 bg-gradient-to-r from-velvet-900 via-velvet-800 to-velvet-900"></div>
  <div class="absolute inset-0 bg-baroque-pattern opacity-20"></div>
  
  <!-- Horizontal lines -->
  <div class="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-700/30 to-transparent -translate-y-16"></div>
  <div class="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-700/30 to-transparent translate-y-16"></div>

  <div class="relative max-w-2xl mx-auto">
    <p class="text-gold-500 text-xs tracking-[0.5em] uppercase font-body mb-4">✦ Mulai Perjalanan Anda ✦</p>
    <h2 class="font-display text-5xl md:text-6xl text-ivory-100 mb-4 leading-tight">
      Reservasi Kamar<br/>
      <em class="text-gold-400 italic">Impian Anda</em>
    </h2>
    <p class="font-body text-ivory-600 mb-10 text-lg">
      Hubungi tim concierge kami atau pesan langsung secara online.<br/>
      Kami siap mewujudkan pengalaman menginap yang sempurna.
    </p>
    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <a href="/booking" class="btn-primary">Pesan Sekarang</a>
      <a href="tel:+62211234567" class="btn-outline">Hubungi Kami</a>
    </div>
  </div>
</section>
