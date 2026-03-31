<script>
  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let error = $state('');
  let focused = $state('');

  const subtleLinkClass =
    'border-b border-[rgba(212,160,23,0.18)] text-[rgba(212,160,23,0.45)] no-underline transition-[color,border-color] duration-200 hover:border-[rgba(212,160,23,0.4)] hover:text-[rgba(212,160,23,0.8)]';

  const inputBaseClass =
    'w-full border-0 border-b bg-transparent px-0 py-[0.45rem] pr-6 font-body text-base text-[#ede0cc] caret-gold-500 outline-none transition-colors duration-300 placeholder:text-[rgba(95,55,15,0.32)] autofill:bg-transparent autofill:text-[#ede0cc]';

  const primaryButtonClass =
    'flex w-full items-center justify-center gap-2 border border-[rgba(212,160,23,0.48)] bg-[rgba(212,160,23,0.08)] px-6 py-[0.85rem] font-body text-[0.6rem] uppercase tracking-[0.45em] text-gold-500 transition-[background,border-color,opacity] duration-300 hover:border-[rgba(212,160,23,0.65)] hover:bg-[rgba(212,160,23,0.15)] disabled:cursor-not-allowed disabled:opacity-[0.35]';

  const ghostButtonClass =
    'flex w-full items-center justify-center border border-[rgba(55,22,8,0.9)] px-6 py-3 font-body text-[0.58rem] uppercase tracking-[0.42em] text-[rgba(140,85,28,0.48)] no-underline transition-[border-color,color] duration-300 hover:border-[rgba(212,160,23,0.22)] hover:text-[rgba(212,160,23,0.52)]';

  async function handleLogin() {
    if (!email || !password) {
      error = 'Mohon isi semua kolom yang diperlukan.';
      return;
    }
    error = '';
    loading = true;
    await new Promise((r) => setTimeout(r, 1800));
    loading = false;
    error = 'Email atau kata sandi tidak valid.';
  }
</script>

<svelte:head>
  <title>Masuk — Grand Maison</title>
</svelte:head>

<div class="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09040c] p-4">
  <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_10%_50%,rgba(120,35,25,0.22)_0%,transparent_65%)]"></div>
  <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_40%_55%_at_90%_15%,rgba(160,110,8,0.10)_0%,transparent_60%)]"></div>
  <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_45%_40%_at_80%_85%,rgba(90,20,10,0.14)_0%,transparent_60%)]"></div>
  <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_30%_30%_at_50%_50%,rgba(50,10,5,0.6)_0%,transparent_100%)]"></div>

  <div class="pointer-events-none absolute inset-0 bg-[length:40px_40px] bg-[url('data:image/svg+xml,%3Csvg%20width=%2740%27%20height=%2740%27%20viewBox=%270%200%2040%2040%27%20xmlns=%27http://www.w3.org/2000/svg%27%3E%3Ccircle%20cx=%2720%27%20cy=%2720%27%20r=%270.8%27%20fill=%27%23d4a017%27%20fill-opacity=%270.15%27/%3E%3C/svg%3E')]"></div>

  <div class="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(212,160,23,0.35),transparent)]"></div>
  <div class="absolute inset-x-0 bottom-0 h-px bg-[linear-gradient(to_right,transparent,rgba(212,160,23,0.35),transparent)]"></div>

  <div class="relative z-10 grid min-h-[580px] w-full max-w-3xl shadow-[0_40px_100px_rgba(0,0,0,0.75),0_0_0_1px_rgba(212,160,23,0.13)] lg:grid-cols-[0.95fr_1.05fr]">
    <div class="relative hidden overflow-hidden bg-[linear-gradient(145deg,#160a0d_0%,#0e0508_55%,#170c05_100%)] p-11 lg:flex lg:flex-col lg:justify-between">
      <div class="absolute top-0 right-0 bottom-0 w-px bg-[linear-gradient(to_bottom,transparent,rgba(212,160,23,0.18)_25%,rgba(212,160,23,0.18)_75%,transparent)]"></div>

      <div class="absolute top-6 left-6 size-6 border-t border-l border-[rgba(212,160,23,0.28)]"></div>
      <div class="absolute top-6 right-6 size-6 border-t border-r border-[rgba(212,160,23,0.28)]"></div>
      <div class="absolute bottom-6 left-6 size-6 border-b border-l border-[rgba(212,160,23,0.28)]"></div>
      <div class="absolute right-6 bottom-6 size-6 border-r border-b border-[rgba(212,160,23,0.28)]"></div>

      <div class="pointer-events-none absolute inset-0 flex select-none items-center justify-center font-display text-[22rem] leading-none text-[rgba(212,160,23,0.022)]">
        ❦
      </div>

      <p class="font-body text-[0.58rem] uppercase tracking-[0.48em] text-[rgba(212,160,23,0.32)]">
        Est. 1887
      </p>

      <div class="relative z-10">
        <div class="mb-[1.4rem] font-display text-[1.3rem] leading-none text-[rgba(212,160,23,0.22)]">✦</div>

        <h1 class="font-display text-[3.6rem] leading-[0.93] font-light tracking-tight text-[#ede0cc]">
          Grand
        </h1>
        <h1 class="mb-[1.8rem] font-display text-[3.6rem] leading-[0.93] font-light italic tracking-tight text-gold-500">
          Maison
        </h1>

        <div class="mb-[1.6rem] flex items-center gap-[0.7rem]">
          <div class="h-px flex-1 bg-[rgba(212,160,23,0.14)]"></div>
          <span class="font-display text-[0.65rem] text-[rgba(212,160,23,0.25)]">❧</span>
          <div class="h-px flex-1 bg-[rgba(212,160,23,0.14)]"></div>
        </div>

        <p class="max-w-[210px] font-body text-[0.92rem] leading-[1.9] italic text-[rgba(160,115,55,0.65)]">
          Di mana setiap momen<br />menjadi kenangan abadi.
        </p>
      </div>

      <div class="flex gap-8">
        {#each [['48', 'Kamar'], ['137', 'Tahun'], ['15', 'Award']] as [n, l]}
          <div>
            <div class="font-display text-[1.55rem] leading-none font-light text-gold-500">{n}</div>
            <div class="mt-[0.28rem] font-body text-[0.52rem] uppercase tracking-[0.24em] text-[rgba(120,75,25,0.5)]">
              {l}
            </div>
          </div>
        {/each}
      </div>
    </div>

    <div class="relative flex flex-col justify-center bg-[#0c0508] px-9 py-12">
      <div class="absolute inset-x-0 top-0 h-px bg-[linear-gradient(to_right,transparent,rgba(212,160,23,0.2),transparent)]"></div>

      <div class="mb-10 text-center lg:hidden">
        <div class="mb-[0.65rem] font-display text-[1.1rem] text-[rgba(212,160,23,0.28)]">✦</div>
        <h2 class="font-display text-[1.8rem] font-light text-[#ede0cc]">
          Grand <em class="text-gold-500">Maison</em>
        </h2>
      </div>

      <div class="mb-9">
        <p class="mb-[0.7rem] font-body text-[0.56rem] uppercase tracking-[0.46em] text-[rgba(212,160,23,0.38)]">
          ✦ &nbsp; Portal Tamu
        </p>
        <h2 class="mb-[0.7rem] font-display text-[1.8rem] leading-[1.1] font-light text-[#ede0cc]">
          Masuk ke Akun Anda
        </h2>
        <div class="h-px w-[1.8rem] bg-[rgba(212,160,23,0.38)]"></div>
      </div>

      {#if error}
        <div class="mb-6 border-l-2 border-[rgba(200,60,75,0.5)] bg-[rgba(200,60,75,0.05)] px-[0.9rem] py-[0.6rem]">
          <p class="font-body text-[0.8rem] leading-[1.5] italic text-[rgba(190,100,115,0.85)]">
            ⚠ &nbsp;{error}
          </p>
        </div>
      {/if}

      <div class="mb-[1.6rem]">
        <label
          for="em"
          class={`mb-[0.55rem] block font-body text-[0.56rem] uppercase tracking-[0.38em] transition-colors duration-300 ${
            focused === 'email' ? 'text-[rgba(212,160,23,0.6)]' : 'text-[rgba(140,88,28,0.55)]'
          }`}
        >
          Alamat Email
        </label>
        <div class="relative">
          <input
            id="em"
            type="email"
            bind:value={email}
            on:focus={() => (focused = 'email')}
            on:blur={() => (focused = '')}
            on:keydown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="nama@contoh.com"
            autocomplete="email"
            class={`${inputBaseClass} ${
              focused === 'email' ? 'border-[rgba(212,160,23,0.45)]' : 'border-[rgba(80,38,12,0.7)]'
            }`}
          />
          <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center">
            <svg class="size-[0.85rem] fill-none stroke-[rgba(140,88,28,0.4)] transition-colors duration-300" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
          </div>
        </div>
      </div>

      <div class="mb-5">
        <div class="mb-[0.55rem] flex items-center justify-between">
          <label
            for="pw"
            class={`font-body text-[0.56rem] uppercase tracking-[0.38em] transition-colors duration-300 ${
              focused === 'pw' ? 'text-[rgba(212,160,23,0.6)]' : 'text-[rgba(140,88,28,0.55)]'
            }`}
          >
            Kata Sandi
          </label>
          <a href="/lupa-sandi" class={`${subtleLinkClass} font-body text-[0.66rem] italic`}>
            Lupa sandi?
          </a>
        </div>
        <div class="relative">
          <input
            id="pw"
            type={showPassword ? 'text' : 'password'}
            bind:value={password}
            on:focus={() => (focused = 'pw')}
            on:blur={() => (focused = '')}
            on:keydown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="••••••••"
            autocomplete="current-password"
            class={`${inputBaseClass} pr-7 ${
              focused === 'pw' ? 'border-[rgba(212,160,23,0.45)]' : 'border-[rgba(80,38,12,0.7)]'
            }`}
          />
          <button
            type="button"
            on:click={() => (showPassword = !showPassword)}
            class="absolute inset-y-0 right-0 flex cursor-pointer items-center border-0 bg-transparent p-[0.1rem] leading-none text-[rgba(140,88,28,0.4)]"
          >
            {#if showPassword}
              <svg class="size-[0.85rem] fill-none stroke-current" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            {:else}
              <svg class="size-[0.85rem] fill-none stroke-current" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <label class="mb-8 flex cursor-pointer items-center gap-[0.55rem]">
        <input type="checkbox" class="size-[0.7rem] cursor-pointer accent-gold-500" />
        <span class="font-body text-[0.7rem] text-[rgba(115,72,22,0.5)]">
          Ingat saya selama 30 hari
        </span>
      </label>

      <button on:click={handleLogin} disabled={loading} class={primaryButtonClass}>
        {#if loading}
          <svg class="size-[0.7rem] animate-spin fill-none stroke-current" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke-width="4" />
            <path class="fill-current opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Memverifikasi...
        {:else}
          Masuk ke Akun
          <svg class="ml-1 size-[0.72rem] fill-none stroke-current" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
          </svg>
        {/if}
      </button>

      <div class="my-[1.4rem] flex items-center gap-[0.85rem]">
        <div class="h-px flex-1 bg-[rgba(55,22,8,0.9)]"></div>
        <span class="font-body text-[0.53rem] uppercase tracking-[0.3em] text-[rgba(80,40,12,0.5)]">atau</span>
        <div class="h-px flex-1 bg-[rgba(55,22,8,0.9)]"></div>
      </div>

      <a href="/booking" class={ghostButtonClass}>
        Lanjutkan sebagai Tamu
      </a>

      <div class="mt-7 flex items-center justify-between">
        <p class="font-body text-[0.68rem] italic text-[rgba(95,55,15,0.45)]">
          Belum punya akun?
          <a href="/daftar" class={`${subtleLinkClass} ml-[0.2rem] font-body not-italic`}>
            Daftar
          </a>
        </p>
        <a href="/" class={`${subtleLinkClass} font-body text-[0.53rem] uppercase tracking-[0.32em]`}>
          ← Beranda
        </a>
      </div>
    </div>
  </div>
</div>
