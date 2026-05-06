<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';

  let { children, data } = $props();
  let isSidebarOpen = $state(false);
  
  const navItems = [
    { name: 'Ringkasan', href: '/admin', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { name: 'Reservasi', href: '/admin/bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { name: 'Kamar', href: '/admin/rooms', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { name: 'Tamu', href: '/admin/users', icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
  ];

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  // Close sidebar on navigation (mobile)
  $effect(() => {
    if (page.url.pathname) {
      isSidebarOpen = false;
    }
  });
</script>

<div class="flex min-h-screen bg-[#1a0a0f] text-[#faf5e8] font-body">
  <!-- Mobile Overlay -->
  {#if isSidebarOpen}
    <button 
      class="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
      onclick={() => isSidebarOpen = false}
      aria-label="Close Sidebar"
    ></button>
  {/if}

  <!-- Sidebar -->
  <aside class="w-64 bg-[#2d1118] border-r border-[#9a6f08]/20 flex flex-col fixed inset-y-0 z-50 transition-transform duration-300 lg:translate-x-0 
                {isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}">
    <div class="p-8 flex items-center justify-between">
      <div>
        <h1 class="font-display text-2xl text-[#d4a017] tracking-tight">
          Grand <span class="italic">Maison</span>
        </h1>
        <p class="text-[10px] tracking-[0.3em] uppercase text-[#a07332] mt-1">Admin Panel</p>
      </div>
      <button class="lg:hidden text-[#a07332]" onclick={() => isSidebarOpen = false}>
        <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <nav class="flex-1 px-4 space-y-2 mt-4">
      {#each navItems as item}
        {@const active = page.url.pathname === item.href}
        <a 
          href={item.href}
          class="flex items-center gap-3 px-4 py-3 text-sm font-serif tracking-wide transition-all duration-200 group
                 {active ? 'bg-[#d4a017] text-[#1a0a0f]' : 'hover:bg-[#d4a017]/10 text-[#faf5e8]/70 hover:text-[#d4a017]'}"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 {active ? 'text-[#1a0a0f]' : 'text-[#a07332] group-hover:text-[#d4a017]'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d={item.icon} />
          </svg>
          {item.name}
        </a>
      {/each}
    </nav>

    <div class="p-4 border-t border-[#9a6f08]/20">
      <button 
        onclick={handleLogout}
        class="w-full flex items-center gap-3 px-4 py-3 text-sm font-serif tracking-wide text-red-400 hover:bg-red-500/10 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
        </svg>
        Keluar
      </button>
    </div>
  </aside>

  <!-- Main Content -->
  <div class="flex-1 lg:ml-64 flex flex-col min-w-0">
    <!-- Top Header -->
    <header class="h-16 bg-[#2d1118]/50 backdrop-blur-md border-b border-[#9a6f08]/20 px-4 md:px-8 flex items-center justify-between sticky top-0 z-40">
      <div class="flex items-center gap-4">
        <button class="lg:hidden text-[#d4a017]" onclick={() => isSidebarOpen = true}>
          <svg xmlns="http://www.w3.org/2000/svg" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <h2 class="font-serif text-base md:text-lg text-[#faf5e8]/80 truncate">
          {navItems.find(i => i.href === page.url.pathname)?.name || 'Dashboard'}
        </h2>
      </div>
      
      <div class="flex items-center gap-2 md:gap-4">
        <div class="text-right hidden sm:block">
          <div class="text-xs font-serif text-[#faf5e8]">{data.user.first_name} {data.user.last_name || ''}</div>
          <div class="text-[10px] text-[#a07332] uppercase tracking-tighter">Administrator</div>
        </div>
        <div class="w-8 h-8 rounded-full bg-[#d4a017] flex items-center justify-center text-[#1a0a0f] font-serif font-bold text-sm">
          {data.user.first_name[0]}
        </div>
      </div>
    </header>

    <main class="p-4 md:p-8">
      {@render children()}
    </main>
  </div>
</div>

<style>
  :global(body) {
    background-color: #1a0a0f;
  }
</style>
