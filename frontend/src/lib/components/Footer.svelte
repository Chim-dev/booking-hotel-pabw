<footer class="relative bg-velvet-900 border-t border-gold-700/30 pt-16 pb-8">
  <!-- Top gradient -->
  <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold-500 to-transparent"></div>

  <div class="max-w-7xl mx-auto px-6">
    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
      
      <!-- Brand -->
      <div class="md:col-span-1">
        <div class="text-gold-500 text-xs tracking-[0.3em] uppercase font-body mb-1">Est. 1887</div>
        <h3 class="font-display text-3xl text-ivory-100 mb-4">Grand Maison</h3>
        <p class="text-ivory-700 text-sm leading-relaxed font-body">
          Pengalaman menginap yang tak terlupakan, 
          di mana kemewahan klasik bertemu kenyamanan modern.
        </p>
        <div class="flex gap-4 mt-6">
          {#each ['✦', '◆', '✦'] as s}
            <span class="text-gold-600 text-xs">{s}</span>
          {/each}
        </div>
      </div>

      <!-- Links -->
      <div>
        <h4 class="font-serif text-gold-500 tracking-widest text-xs uppercase mb-5">Navigasi</h4>
        <ul class="space-y-3 font-body text-sm text-ivory-600">
          {#each ['Beranda', 'Kamar & Suite', 'Fasilitas', 'Galeri', 'Tentang Kami'] as item}
            <li><a href="/" class="hover:text-gold-400 transition-colors">{item}</a></li>
          {/each}
        </ul>
      </div>

      

      <!-- Contact -->
      <div>
        <h4 class="font-serif text-gold-500 tracking-widest text-xs uppercase mb-5">Kontak</h4>
        <ul class="space-y-4 font-body text-sm text-ivory-600">
          <li class="flex gap-3">
            <span class="text-gold-600 mt-0.5">⊕</span>
            <span>Jl. Merdeka Raya No. 1<br/>Jakarta Pusat, 10110</span>
          </li>
          <li class="flex gap-3">
            <span class="text-gold-600">✆</span>
            <span>+62 21 1234 5678</span>
          </li>
          <li class="flex gap-3">
            <span class="text-gold-600">✉</span>
            <span>reservation@grandmaison.id</span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Divider -->
    <div class="divider-baroque mb-6">
      <span class="text-gold-600 text-xs tracking-widest">✦ ✦ ✦</span>
    </div>

    <!-- Bottom -->
    <div class="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-ivory-800 font-body tracking-wide">
      <span>© 2024 Grand Maison. Semua hak dilindungi.</span>
      <div class="flex gap-6">
        <a href="/" class="hover:text-gold-500 transition-colors">Kebijakan Privasi</a>
        <a href="/" class="hover:text-gold-500 transition-colors">Syarat & Ketentuan</a>
        <a href="/" class="hover:text-gold-500 transition-colors">Cookie</a>
      </div>
    </div>
  </div>
</footer>
