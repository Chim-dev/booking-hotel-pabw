<script>
  let { data } = $props();
  
  function getStatusColor(status) {
    switch (status) {
      case 'confirmed': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'pending': return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'checked_in': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'checked_out': return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      case 'cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  }

  function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  }
</script>

<div class="space-y-6 animate-fade-in">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="font-display text-3xl text-[#faf5e8]">Manajemen Reservasi</h1>
      <p class="text-[#a07332] font-serif italic">Kelola semua pemesanan kamar di Grand Maison.</p>
    </div>
    <button class="btn-primary py-2 px-6 text-xs">
      Reservasi Baru
    </button>
  </div>

  <div class="bg-[#2d1118] border border-[#9a6f08]/20 overflow-hidden">
    <div class="p-4 border-b border-[#9a6f08]/20 flex gap-4">
      <input 
        type="text" 
        placeholder="Cari referensi atau nama tamu..." 
        class="input-baroque py-2 text-sm max-w-sm"
      />
      <select class="input-baroque py-2 text-sm max-w-[150px]">
        <option value="">Semua Status</option>
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>

    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="text-[10px] uppercase tracking-widest text-[#a07332] border-b border-[#9a6f08]/10">
            <th class="px-6 py-4 font-body">Ref / Tanggal</th>
            <th class="px-6 py-4 font-body">Tamu</th>
            <th class="px-6 py-4 font-body">Kamar</th>
            <th class="px-6 py-4 font-body">Durasi</th>
            <th class="px-6 py-4 font-body">Status</th>
            <th class="px-6 py-4 font-body">Total</th>
            <th class="px-6 py-4 font-body text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          {#each data.bookings as booking}
            <tr class="border-b border-[#9a6f08]/10 hover:bg-[#1a0a0f]/50 transition-colors">
              <td class="px-6 py-4">
                <div class="font-serif text-[#d4a017]">{booking.booking_reference}</div>
                <div class="text-[10px] text-[#faf5e8]/40 mt-0.5">{new Date(booking.created_at).toLocaleDateString('id-ID')}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-[#faf5e8] font-medium">{booking.first_name} {booking.last_name}</div>
                <div class="text-[11px] text-[#faf5e8]/50 mt-0.5">{booking.email}</div>
              </td>
              <td class="px-6 py-4">
                <div class="text-[#faf5e8]/80">{booking.room_name}</div>
                <div class="text-[10px] text-[#a07332] uppercase tracking-tighter">{booking.room_code}</div>
              </td>
              <td class="px-6 py-4 text-[#faf5e8]/60">
                <div class="text-xs">{booking.check_in} s/d</div>
                <div class="text-xs">{booking.check_out}</div>
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter border {getStatusColor(booking.status)}">
                  {booking.status.replace('_', ' ')}
                </span>
              </td>
              <td class="px-6 py-4 font-serif text-[#faf5e8]">{formatCurrency(booking.grand_total)}</td>
              <td class="px-6 py-4 text-right">
                <button class="text-[#d4a017] hover:text-[#e8c04a] text-xs font-serif uppercase tracking-widest">Detail</button>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="7" class="px-6 py-12 text-center text-[#faf5e8]/30 italic font-serif">
                Belum ada data reservasi.
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
