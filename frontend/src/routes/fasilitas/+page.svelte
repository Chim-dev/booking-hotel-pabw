<svelte:head>
  <title>Fasilitas — Grand Maison</title>
</svelte:head>

<!-- HEADER -->
<section class="relative py-28 px-6 text-center overflow-hidden border-b border-[#d4a017]/30 bg-[#1f0a0a]">
  <!-- subtle gold pattern -->
  <div class="absolute inset-0 opacity-10"
       style="background-image:url('data:image/svg+xml,%3Csvg width=60 height=60 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=%23d4a017 fill-opacity=0.35%3E%3Cpath d=M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z/%3E%3C/g%3E%3C/svg%3E');">
  </div>

  <div class="relative z-10 max-w-3xl mx-auto">
    <p class="text-xs tracking-[0.5em] uppercase text-[#d4a017] mb-6">
      ✦ Fasilitas Eksklusif ✦
    </p>

    <h1 class="text-6xl font-light text-[#f5e8d3] leading-none mb-3">
      Kenyamanan
    </h1>
    <h1 class="text-6xl italic font-light text-[#d4a017] leading-none mb-8">
      Tanpa Batas
    </h1>

    <p class="text-[#c8aa6e] text-lg max-w-md mx-auto">
      Setiap fasilitas dirancang untuk menghadirkan pengalaman menginap yang tak terlupakan.
    </p>
  </div>
</section>

<!-- GRID FASILITAS -->
<section class="py-24 px-6 bg-[#1f0a0a]">
  <div class="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">

    {#each fasilitas as item}
      <div class="group relative p-8 border border-[#d4a017]/20 bg-[#2c1010] hover:bg-[#3a1818] 
                  transition-all duration-500 hover:border-[#d4a017]/50 hover:-translate-y-2 rounded-2xl">

        <!-- icon -->
        <div class="text-[#d4a017] text-4xl mb-6 transition-transform group-hover:scale-110">
          {item.icon}
        </div>

        <!-- title -->
        <h3 class="text-[#f5e8d3] text-2xl font-light mb-4">
          {item.title}
        </h3>

        <!-- gold line -->
        <div class="w-14 h-px bg-[#d4a017] mb-6"></div>

        <!-- description -->
        <p class="text-[#c8aa6e] leading-relaxed">
          {item.desc}
        </p>

        <!-- hover glow -->
        <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none rounded-2xl"
             style="background: radial-gradient(circle at center, rgba(212,160,23,0.18), transparent 75%)">
        </div>
      </div>
    {/each}

  </div>
</section>

<!-- CTA -->
<section class="py-24 text-center px-6 bg-[#1f0a0a] border-t border-[#d4a017]/20">
  <h2 class="text-4xl text-[#f5e8d3] font-light mb-4">
    Rasakan Kemewahan Sejati
  </h2>
  
  <p class="text-[#c8aa6e] italic mb-12 max-w-md mx-auto">
    Setiap detail dirancang untuk kenyamanan maksimal.
  </p>

  <a href="/booking"
     class="inline-flex items-center px-12 py-5 border-2 border-[#d4a017] text-[#d4a017] 
            hover:bg-[#d4a017] hover:text-[#1f0a0a] font-medium tracking-widest transition-all duration-300 text-lg">
    RESERVASI SEKARANG
  </a>
</section>

<script>
  const fasilitas = [
    { icon: "✦", title: "Infinity Pool", desc: "Kolam renang rooftop dengan pemandangan kota yang memukau." },
    { icon: "✧", title: "Royal Spa", desc: "Spa eksklusif dengan perawatan tradisional Jawa dan terapi modern." },
    { icon: "❖", title: "Grand Dining", desc: "Restoran fine dining dengan menu Perancis-Jawa klasik yang menggugah selera." },
    { icon: "✦", title: "Private Butler", desc: "Layanan personal untuk memenuhi setiap kebutuhan Anda." },
    { icon: "✧", title: "Ballroom Baroque", desc: "Ruang pesta megah berkapasitas 500 tamu dengan dekorasi baroque asli." },
    { icon: "❖", title: "Fitness Center", desc: "Fasilitas gym modern dengan peralatan lengkap." },
    { icon: "✦", title: "Perpustakaan", desc: "Perpustakaan privat dengan koleksi buku antik dan ruang baca tenang." },
    { icon: "❖", title: "Kolam Victoria", desc: "Kolam renang outdoor berbentuk oval dengan pahatan marmer klasik." },
    { icon: "✧", title: "Concierge 24/7", desc: "Layanan concierge personal siap memenuhi setiap kebutuhan Anda." }
  ];
</script>