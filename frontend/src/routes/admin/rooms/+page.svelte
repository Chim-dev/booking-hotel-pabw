<script>
  let { data } = $props();

  function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }
</script>

<div class="space-y-6 animate-fade-in">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="font-display text-3xl text-[#faf5e8]">Daftar Kamar</h1>
      <p class="text-[#a07332] font-serif italic">Kelola unit kamar dan ketersediaan di Grand Maison.</p>
    </div>
    <button class="btn-primary py-2 px-6 text-xs">
      Tambah Kamar
    </button>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
    {#each data.rooms as room}
      <div class="bg-[#2d1118] border border-[#9a6f08]/20 flex flex-col hover:border-[#d4a017]/30 transition-all group">
        <div class="p-6 flex-1">
          <div class="flex justify-between items-start mb-4">
            <div>
              <div class="text-[10px] text-[#a07332] uppercase tracking-[0.2em] font-body mb-1">{room.code}</div>
              <h3 class="font-serif text-xl text-[#faf5e8] group-hover:text-[#d4a017] transition-colors">{room.name}</h3>
            </div>
            <span class="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter border 
              {room.is_available ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}">
              {room.is_available ? 'Tersedia' : 'Terisi'}
            </span>
          </div>
          
          <div class="space-y-2 mb-6">
            <div class="flex justify-between text-xs">
              <span class="text-[#faf5e8]/40">Kategori</span>
              <span class="text-[#faf5e8]/80">{room.category}</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-[#faf5e8]/40">Kapasitas</span>
              <span class="text-[#faf5e8]/80">{room.max_guests} Tamu</span>
            </div>
            <div class="flex justify-between text-xs">
              <span class="text-[#faf5e8]/40">Ukuran</span>
              <span class="text-[#faf5e8]/80">{room.size_sqm} m²</span>
            </div>
          </div>

          <div class="pt-4 border-t border-[#9a6f08]/10 flex justify-between items-center">
            <div class="font-serif text-[#d4a017]">{formatCurrency(room.price_per_night)} <span class="text-[10px] text-[#faf5e8]/40 uppercase">/ Malam</span></div>
          </div>
        </div>
        <div class="bg-[#1a0a0f]/50 p-4 border-t border-[#9a6f08]/10 flex gap-2">
          <button class="flex-1 py-2 text-[10px] uppercase tracking-widest font-serif border border-[#9a6f08]/30 text-[#faf5e8]/60 hover:bg-[#d4a017] hover:text-[#1a0a0f] hover:border-[#d4a017] transition-all">Edit</button>
          <button class="flex-1 py-2 text-[10px] uppercase tracking-widest font-serif border border-[#9a6f08]/30 text-[#faf5e8]/60 hover:bg-[#d4a017] hover:text-[#1a0a0f] hover:border-[#d4a017] transition-all">Status</button>
        </div>
      </div>
    {:else}
      <div class="col-span-full py-20 text-center text-[#faf5e8]/30 italic font-serif border border-dashed border-[#9a6f08]/20">
        Belum ada data kamar.
      </div>
    {/each}
  </div>
</div>
