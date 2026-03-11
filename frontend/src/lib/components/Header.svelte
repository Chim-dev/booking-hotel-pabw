<script>
  import { page } from '$app/stores';
  let mobileOpen = false;

  const navLinks = [
    { href: '/',          label: 'Beranda' },
    { href: '/kamar',     label: 'Kamar & Suite' },
    { href: '/fasilitas', label: 'Fasilitas' },
    { href: '/galeri',    label: 'Galeri' },
    { href: '/tentang',   label: 'Tentang Kami' },
  ];
</script>

<header class="fixed top-0 left-0 right-0 z-50 transition-all duration-500" 
  class:bg-velvet-900={true}
  style="border-bottom: 1px solid rgba(212,160,23,0.2); backdrop-filter: blur(12px);">
  
  <!-- Top decorative strip -->
  <div class="h-px bg-linear-to-r from-transparent via-gold-500 to-transparent"></div>

  <div class="max-w-7xl mx-auto px-6">
    <div class="flex items-center justify-between h-20">

      <!-- Logo -->
      <a href="/" class="flex flex-col items-start group">
        <span class="text-gold-500 text-xs tracking-[0.3em] uppercase font-body">Est. 1887</span>
        <span class="font-display text-2xl text-ivory-100 leading-tight tracking-wide group-hover:text-gold-400 transition-colors">
          Grand Maison
        </span>
      </a>

      <!-- Center ornament -->
      <div class="hidden lg:flex items-center gap-3 text-gold-600 text-xl select-none">
        <span>⸻</span>
        <span class="text-gold-500">✦</span>
        <span>⸻</span>
      </div>

      <!-- Nav -->
      <nav class="hidden md:flex items-center gap-8">
        {#each navLinks as link}
          <a href={link.href}
            class="font-body text-sm tracking-widest uppercase transition-colors duration-200 relative group"
            class:text-gold-400={$page.url.pathname === link.href}
            class:text-ivory-300={$page.url.pathname !== link.href}>
            {link.label}
            <span class="absolute -bottom-1 left-0 h-px bg-gold-500 transition-all duration-300 w-0 group-hover:w-full"
              class:w-full={$page.url.pathname === link.href}></span>
          </a>
        {/each}

        <!-- Login Button -->
        <a href="/login"
          class="font-body text-sm tracking-widest uppercase transition-colors duration-200 relative group flex items-center gap-2"
          class:text-gold-400={$page.url.pathname === '/login'}
          class:text-ivory-300={$page.url.pathname !== '/login'}>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3"/>
          </svg>
          Masuk
          <span class="absolute -bottom-1 left-0 h-px bg-gold-500 transition-all duration-300 w-0 group-hover:w-full"
            class:w-full={$page.url.pathname === '/login'}></span>
        </a>

        <a href="/booking" class="btn-primary text-xs py-2.5 px-6">
          Pesan Sekarang
        </a>
      </nav>

      <!-- Mobile hamburger -->
      <button class="md:hidden text-gold-500 p-2" on:click={() => mobileOpen = !mobileOpen}
        aria-label="Toggle menu">
        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {#if mobileOpen}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M6 18L18 6M6 6l12 12"/>
          {:else}
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 6h16M4 12h16M4 18h16"/>
          {/if}
        </svg>
      </button>
    </div>
  </div>

  <!-- Mobile menu -->
  {#if mobileOpen}
    <div class="md:hidden bg-velvet-800 border-t border-gold-700/30 px-6 py-6 flex flex-col gap-4">
      {#each navLinks as link}
        <a href={link.href} class="font-body text-sm tracking-widest uppercase text-ivory-300 hover:text-gold-400 transition-colors"
          on:click={() => mobileOpen = false}>
          {link.label}
        </a>
      {/each}

      <!-- Login di mobile -->
      <a href="/login"
        class="font-body text-sm tracking-widest uppercase text-ivory-300 hover:text-gold-400 transition-colors flex items-center gap-2"
        on:click={() => mobileOpen = false}>
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M18 12H9m0 0l3-3m-3 3l3 3"/>
        </svg>
        Masuk
      </a>

      <a href="/booking" class="btn-primary mt-2 text-xs" on:click={() => mobileOpen = false}>
        Pesan Sekarang
      </a>
    </div>
  {/if}

  <div class="h-px bg-gradient-to-r from-transparent via-gold-700/40 to-transparent"></div>
</header>

<!-- Spacer -->
<div class="h-20"></div>
