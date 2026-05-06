<script>
  let { data } = $props();
</script>

<div class="space-y-6 animate-fade-in">
  <div class="flex justify-between items-center">
    <div>
      <h1 class="font-display text-3xl text-[#faf5e8]">Manajemen Tamu</h1>
      <p class="text-[#a07332] font-serif italic">Daftar pengguna terdaftar di Grand Maison.</p>
    </div>
  </div>

  <div class="bg-[#2d1118] border border-[#9a6f08]/20 overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full text-left">
        <thead>
          <tr class="text-[10px] uppercase tracking-widest text-[#a07332] border-b border-[#9a6f08]/10">
            <th class="px-6 py-4 font-body">Nama Lengkap</th>
            <th class="px-6 py-4 font-body">Email</th>
            <th class="px-6 py-4 font-body">Role</th>
            <th class="px-6 py-4 font-body">Terdaftar Pada</th>
            <th class="px-6 py-4 font-body text-right">Aksi</th>
          </tr>
        </thead>
        <tbody class="text-sm">
          {#each data.users as user}
            <tr class="border-b border-[#9a6f08]/10 hover:bg-[#1a0a0f]/50 transition-colors">
              <td class="px-6 py-4 text-[#faf5e8] font-serif">
                {user.first_name} {user.last_name || ''}
              </td>
              <td class="px-6 py-4 text-[#faf5e8]/70">
                {user.email}
              </td>
              <td class="px-6 py-4">
                <span class="px-2 py-0.5 rounded-full text-[10px] uppercase tracking-tighter border 
                  {user.role === 'admin' ? 'bg-gold-500/10 text-gold-500 border-gold-500/20' : 'bg-ivory-500/10 text-ivory-500/50 border-ivory-500/10'}">
                  {user.role}
                </span>
              </td>
              <td class="px-6 py-4 text-[#faf5e8]/50 text-xs">
                {new Date(user.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              </td>
              <td class="px-6 py-4 text-right">
                <button class="text-[#a07332] hover:text-[#d4a017] text-[10px] uppercase tracking-widest font-serif">Kelola</button>
              </td>
            </tr>
          {:else}
            <tr>
              <td colspan="5" class="px-6 py-12 text-center text-[#faf5e8]/30 italic font-serif">
                Belum ada data user.
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
</div>
