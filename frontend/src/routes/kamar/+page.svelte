<script>
  const rooms = [
    {
      id: 'superior',
      name: 'Kamar Superior Klasik',
      category: 'Superior',
      price: 1750000,
      size: '32 m²',
      guests: 2,
      floor: '3–5',
      bed: 'Queen Bed',
      features: ['Rain Shower', 'City View', 'Sarapan', 'WiFi', 'AC', 'Mini Bar'],
      desc: 'Kamar Superior kami menawarkan keeleganan Eropa klasik dalam dimensi yang nyaman. Dilengkapi tempat tidur Queen bertepi kayu mahoni ukiran, shower berkualitas tinggi, dan pemandangan kota yang memukau.',
    },
    {
      id: 'deluxe',
      name: 'Kamar Deluxe Victoria',
      category: 'Deluxe',
      price: 2850000,
      size: '45 m²',
      guests: 2,
      floor: '6–8',
      bed: 'King Bed',
      features: ['Bathtub Antik', 'Balkon Privat', 'Butler Service', 'Sarapan', 'WiFi', 'City View'],
      desc: 'Merasakan keagungan era Victoria dalam kamar Deluxe kami. Bathtub besi cor antik bergaya clawfoot menjadi pusat kamar mandi yang megah, sementara balkon privat menghadirkan panorama kota yang menakjubkan.',
      badge: 'Terpopuler',
    },
    {
      id: 'premier',
      name: 'Kamar Premier Mezzanine',
      category: 'Premier',
      price: 3900000,
      size: '60 m²',
      guests: 2,
      floor: '9–10',
      bed: 'King Bed',
      features: ['Mezzanine Level', 'Soaking Tub', 'Mini Bar', 'Sarapan', 'WiFi', 'Panoramic View'],
      desc: 'Arsitektur mezzanine unik menciptakan dua level ruang yang dramatis. Area tidur di lantai atas dengan plafon tinggi memberi kesan anggun, sementara ruang bawah menjadi ruang santai privat yang sempurna.',
    },
    {
      id: 'suite',
      name: 'Suite Baroque Grand',
      category: 'Suite',
      price: 5500000,
      size: '90 m²',
      guests: 4,
      floor: '11',
      bed: 'King Bed + Sofa Bed',
      features: ['Living Room', 'Marble Bathroom', 'Butler 24/7', 'Champagne', 'Dining Area', 'Panoramic'],
      desc: 'Puncak kemewahan Grand Maison. Suite Baroque Grand menghadirkan pengalaman seperti menginap di istana, dengan langit-langit berornamen stucco, lantai marmer impor, ruang tamu terpisah, dan layanan butler personal sepanjang waktu.',
      badge: 'Eksklusif',
    },
  ];

  function formatRp(n) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(n);
  }
</script>

<svelte:head>
  <title>Kamar & Suite — Grand Maison</title>
</svelte:head>

<!-- Page Header -->
<div class="relative py-20 px-6 text-center overflow-hidden border-b border-gold-700/20">
  <div class="absolute inset-0 bg-baroque-pattern opacity-10"></div>
  <div class="absolute top-4 left-8 text-gold-700/20 text-5xl font-display">❦</div>
  <div class="absolute top-4 right-8 text-gold-700/20 text-5xl font-display" style="transform:scaleX(-1)">❦</div>
  <p class="text-gold-500 text-xs tracking-[0.4em] uppercase font-body mb-3">✦ Akomodasi Premium</p>
  <h1 class="font-display text-5xl md:text-6xl text-ivory-100">Kamar <em class="italic text-gold-400">& Suite</em></h1>
  <div class="divider-baroque mt-4"><span class="text-gold-600 text-sm">⸻ ✦ ⸻</span></div>
  <p class="mt-4 font-body italic text-ivory-600 max-w-lg mx-auto">
    Setiap kamar adalah sebuah kanvas kemewahan, dirancang untuk memberikan pengalaman menginap yang tak terlupakan.
  </p>
</div>

<div class="max-w-5xl mx-auto px-6 py-20 space-y-12">
  {#each rooms as room, i}
    <article class="group border border-gold-700/25 hover:border-gold-500/50 transition-all duration-500 overflow-hidden bg-velvet-800/40">
      <div class="flex flex-col {i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}">
        
        <!-- Image -->
        <div class="md:w-2/5 min-h-64 bg-gradient-to-br from-velvet-700 to-velvet-900 relative overflow-hidden flex-shrink-0">
          <div class="absolute inset-0 bg-baroque-pattern opacity-20"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <span class="text-gold-700/25 font-display select-none" style="font-size: 7rem">❦</span>
          </div>
          {#if room.badge}
            <div class="absolute top-4 {i % 2 === 0 ? 'right-4' : 'left-4'} bg-gold-500 text-velvet-900 text-xs tracking-widest uppercase px-3 py-1 font-body">
              {room.badge}
            </div>
          {/if}
          <div class="absolute bottom-4 left-4 text-xs tracking-widest uppercase text-gold-400 font-body">{room.category}</div>
        </div>

        <!-- Content -->
        <div class="flex-1 p-8 flex flex-col justify-between">
          <div>
            <div class="flex items-start justify-between mb-3">
              <h2 class="font-display text-2xl md:text-3xl text-ivory-100">{room.name}</h2>
            </div>
            
            <div class="flex flex-wrap gap-5 text-xs text-ivory-700 font-body mb-4">
              <span>📐 {room.size}</span>
              <span>🛏 {room.bed}</span>
              <span>👤 Maks. {room.guests} tamu</span>
              <span>🏢 Lantai {room.floor}</span>
            </div>

            <p class="text-ivory-600 font-body leading-relaxed mb-5 text-sm">{room.desc}</p>

            <div class="flex flex-wrap gap-2 mb-6">
              {#each room.features as f}
                <span class="text-xs bg-velvet-700 text-ivory-500 border border-gold-700/20 px-2.5 py-1 font-body">✦ {f}</span>
              {/each}
            </div>
          </div>

          <div class="flex items-end justify-between border-t border-gold-700/20 pt-5">
            <div>
              <div class="text-xs text-ivory-700 font-body">Mulai dari</div>
              <div class="font-display text-2xl text-gold-400">{formatRp(room.price)}</div>
              <div class="text-xs text-ivory-700 font-body">per malam · belum termasuk pajak</div>
            </div>
            <a href="/booking?roomType={room.id}" class="btn-primary">
              Pesan Kamar Ini
            </a>
          </div>
        </div>
      </div>
    </article>
  {/each}
</div>

<!-- Bottom CTA -->
<div class="text-center py-16 px-6 border-t border-gold-700/20">
  <p class="text-ivory-600 font-body italic mb-4 max-w-lg mx-auto">
    Butuh bantuan memilih kamar yang tepat? Tim concierge kami siap membantu Anda.
  </p>
  <a href="tel:+62211234567" class="btn-outline">✆ Hubungi Concierge</a>
</div>
