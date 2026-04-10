<script>
  import { goto } from '$app/navigation';
  import { API_BASE_URL } from '$lib/config/api';

  let email = $state('');
  let password = $state('');
  let showPassword = $state(false);
  let loading = $state(false);
  let error = $state('');
  let focused = $state('');

  const dots = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='0.8' fill='%23d4a017' fill-opacity='0.15'/%3E%3C/svg%3E")`;

  async function handleLogin() {
    if (!email || !password) {
      error = 'Mohon isi semua kolom yang diperlukan.';
      return;
    }

    error = '';
    loading = true;

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        error = data.error ?? 'Gagal login. Silakan coba lagi.';
        return;
      }

      await goto('/booking');
    } catch {
      error = 'Tidak dapat terhubung ke server backend.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Masuk â€” Grand Maison</title>
</svelte:head>

<!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     ROOT
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
<div class="relative min-h-screen flex items-center justify-center p-4 overflow-hidden"
  style="background:#09040c;">

  <!-- Ambient blobs -->
  <div class="absolute inset-0 pointer-events-none"
    style="background:
      radial-gradient(ellipse 55% 45% at 10% 50%,  rgba(120,35,25,0.22) 0%, transparent 65%),
      radial-gradient(ellipse 40% 55% at 90% 15%,  rgba(160,110,8,0.10) 0%, transparent 60%),
      radial-gradient(ellipse 45% 40% at 80% 85%,  rgba(90,20,10,0.14) 0%, transparent 60%),
      radial-gradient(ellipse 30% 30% at 50% 50%,  rgba(50,10,5,0.6)   0%, transparent 100%);">
  </div>

  <!-- Dot grid -->
  <div class="absolute inset-0 pointer-events-none" style="background-image:{dots};"></div>

  <!-- Top / bottom hairlines -->
  <div class="absolute top-0 inset-x-0 h-px"
    style="background:linear-gradient(to right,transparent,rgba(212,160,23,0.35),transparent);"></div>
  <div class="absolute bottom-0 inset-x-0 h-px"
    style="background:linear-gradient(to right,transparent,rgba(212,160,23,0.35),transparent);"></div>

  <!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
       CARD
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
  <div class="relative z-10 w-full max-w-3xl grid lg:grid-cols-[0.95fr_1.05fr]"
    style="
      box-shadow: 0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(212,160,23,0.13);
      min-height: 580px;
    ">

    <!-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
         LEFT â€” Dekoratif
    â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
    <div class="hidden lg:flex flex-col justify-between p-11 relative overflow-hidden"
      style="background:linear-gradient(145deg,#160a0d 0%,#0e0508 55%,#170c05 100%);">

      <!-- Right border -->
      <div class="absolute top-0 right-0 bottom-0 w-px"
        style="background:linear-gradient(to bottom,transparent,rgba(212,160,23,0.18) 25%,rgba(212,160,23,0.18) 75%,transparent);"></div>

      <!-- Bracket corners -->
      <div class="absolute top-6 left-6 w-6 h-6 border-t border-l" style="border-color:rgba(212,160,23,0.28);"></div>
      <div class="absolute top-6 right-6 w-6 h-6 border-t border-r" style="border-color:rgba(212,160,23,0.28);"></div>
      <div class="absolute bottom-6 left-6 w-6 h-6 border-b border-l" style="border-color:rgba(212,160,23,0.28);"></div>
      <div class="absolute bottom-6 right-6 w-6 h-6 border-b border-r" style="border-color:rgba(212,160,23,0.28);"></div>

      <!-- Ghost ornament -->
      <div class="absolute inset-0 flex items-center justify-center select-none pointer-events-none"
        style="font-family:'Cormorant Garamond',serif;font-size:22rem;line-height:1;color:rgba(212,160,23,0.022);">â¦</div>

      <!-- Est. -->
      <p style="font-family:'EB Garamond',serif;font-size:0.58rem;letter-spacing:0.48em;text-transform:uppercase;color:rgba(212,160,23,0.32);">
        Est. 1887
      </p>

      <!-- Logo + tagline -->
      <div class="relative z-10">
        <div style="color:rgba(212,160,23,0.22);font-size:1.3rem;margin-bottom:1.4rem;line-height:1;font-family:'Cormorant Garamond',serif;">âœ¦</div>

        <h1 style="font-family:'Cormorant Garamond',serif;font-size:3.6rem;line-height:0.93;font-weight:300;color:#ede0cc;letter-spacing:-0.02em;">
          Grand
        </h1>
        <h1 style="font-family:'Cormorant Garamond',serif;font-size:3.6rem;line-height:0.93;font-weight:300;font-style:italic;color:#d4a017;letter-spacing:-0.02em;margin-bottom:1.8rem;">
          Maison
        </h1>

        <div style="display:flex;align-items:center;gap:0.7rem;margin-bottom:1.6rem;">
          <div style="flex:1;height:1px;background:rgba(212,160,23,0.14);"></div>
          <span style="color:rgba(212,160,23,0.25);font-size:0.65rem;font-family:'Cormorant Garamond',serif;">â§</span>
          <div style="flex:1;height:1px;background:rgba(212,160,23,0.14);"></div>
        </div>

        <p style="font-family:'EB Garamond',serif;font-size:0.92rem;font-style:italic;color:rgba(160,115,55,0.65);line-height:1.9;max-width:210px;">
          Di mana setiap momen<br/>menjadi kenangan abadi.
        </p>
      </div>

      <!-- Stats -->
      <div style="display:flex;gap:2rem;">
        {#each [['48','Kamar'],['137','Tahun'],['15','Award']] as [n,l]}
          <div>
            <div style="font-family:'Cormorant Garamond',serif;font-size:1.55rem;color:#d4a017;font-weight:300;line-height:1;">{n}</div>
            <div style="font-family:'EB Garamond',serif;font-size:0.52rem;letter-spacing:0.24em;text-transform:uppercase;color:rgba(120,75,25,0.5);margin-top:0.28rem;">{l}</div>
          </div>
        {/each}
      </div>
    </div>

    <!-- â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
         RIGHT â€” Form
    â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€ -->
    <div class="flex flex-col justify-center px-9 py-12 relative"
      style="background:#0c0508;">

      <!-- Top accent -->
      <div class="absolute top-0 inset-x-0 h-px"
        style="background:linear-gradient(to right,transparent,rgba(212,160,23,0.2),transparent);"></div>

      <!-- Mobile logo -->
      <div class="lg:hidden text-center mb-10">
        <div style="color:rgba(212,160,23,0.28);font-size:1.1rem;margin-bottom:0.65rem;font-family:'Cormorant Garamond',serif;">âœ¦</div>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#ede0cc;font-weight:300;">
          Grand <em style="color:#d4a017;">Maison</em>
        </h2>
      </div>

      <!-- Heading -->
      <div style="margin-bottom:2.25rem;">
        <p style="font-family:'EB Garamond',serif;font-size:0.56rem;letter-spacing:0.46em;text-transform:uppercase;color:rgba(212,160,23,0.38);margin-bottom:0.7rem;">
          âœ¦ &nbsp; Portal Tamu
        </p>
        <h2 style="font-family:'Cormorant Garamond',serif;font-size:1.8rem;color:#ede0cc;font-weight:300;line-height:1.1;margin-bottom:0.7rem;">
          Masuk ke Akun Anda
        </h2>
        <div style="width:1.8rem;height:1px;background:rgba(212,160,23,0.38);"></div>
      </div>

      <!-- Error -->
      {#if error}
        <div style="margin-bottom:1.5rem;padding:0.6rem 0.9rem;border-left:2px solid rgba(200,60,75,0.5);background:rgba(200,60,75,0.05);">
          <p style="font-family:'EB Garamond',serif;font-size:0.8rem;font-style:italic;color:rgba(190,100,115,0.85);line-height:1.5;">
            âš  &nbsp;{error}
          </p>
        </div>
      {/if}

      <!-- â”€â”€ Email â”€â”€ -->
      <div style="margin-bottom:1.6rem;">
        <label for="em"
          style="display:block;font-family:'EB Garamond',serif;font-size:0.56rem;letter-spacing:0.38em;text-transform:uppercase;margin-bottom:0.55rem;transition:color 0.25s;color:{focused==='email'?'rgba(212,160,23,0.6)':'rgba(140,88,28,0.55)'};">
          Alamat Email
        </label>
        <div style="position:relative;">
          <input id="em" type="email" bind:value={email}
            onfocus={() => focused='email'} onblur={() => focused=''}
            onkeydown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="nama@contoh.com" autocomplete="email"
            class="login-input"
            style="border-bottom-color:{focused==='email'?'rgba(212,160,23,0.45)':'rgba(80,38,12,0.7)'};"
          />
          <svg style="position:absolute;right:0;top:50%;transform:translateY(-50%);width:0.85rem;height:0.85rem;fill:none;stroke:rgba(140,88,28,0.4);transition:stroke 0.25s;" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
          </svg>
        </div>
      </div>

      <!-- â”€â”€ Password â”€â”€ -->
      <div style="margin-bottom:1.25rem;">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:0.55rem;">
          <label for="pw"
            style="font-family:'EB Garamond',serif;font-size:0.56rem;letter-spacing:0.38em;text-transform:uppercase;transition:color 0.25s;color:{focused==='pw'?'rgba(212,160,23,0.6)':'rgba(140,88,28,0.55)'};">
            Kata Sandi
          </label>
          <a href="/lupa-sandi" class="subtle-link" style="font-family:'EB Garamond',serif;font-size:0.66rem;font-style:italic;">
            Lupa sandi?
          </a>
        </div>
        <div style="position:relative;">
          <input id="pw" type={showPassword?'text':'password'} bind:value={password}
            onfocus={() => focused='pw'} onblur={() => focused=''}
            onkeydown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢" autocomplete="current-password"
            class="login-input"
            style="padding-right:1.75rem;border-bottom-color:{focused==='pw'?'rgba(212,160,23,0.45)':'rgba(80,38,12,0.7)'};"
          />
          <button type="button" onclick={() => showPassword=!showPassword}
            style="position:absolute;right:0;top:50%;transform:translateY(-50%);background:none;border:none;cursor:pointer;padding:0.1rem;color:rgba(140,88,28,0.4);line-height:0;">
            {#if showPassword}
              <svg style="width:0.85rem;height:0.85rem;fill:none;stroke:currentColor;" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"/>
              </svg>
            {:else}
              <svg style="width:0.85rem;height:0.85rem;fill:none;stroke:currentColor;" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
            {/if}
          </button>
        </div>
      </div>

      <!-- â”€â”€ Remember â”€â”€ -->
      <label style="display:flex;align-items:center;gap:0.55rem;cursor:pointer;margin-bottom:2rem;">
        <input type="checkbox" style="width:0.7rem;height:0.7rem;accent-color:#d4a017;cursor:pointer;"/>
        <span style="font-family:'EB Garamond',serif;font-size:0.7rem;color:rgba(115,72,22,0.5);">
          Ingat saya selama 30 hari
        </span>
      </label>

      <!-- â”€â”€ Submit â”€â”€ -->
      <button onclick={handleLogin} disabled={loading} class="btn-gold">
        {#if loading}
          <svg style="width:0.7rem;height:0.7rem;animation:spin 1s linear infinite;fill:none;stroke:currentColor;" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke-width="4" style="opacity:0.25;"/>
            <path style="opacity:0.75;fill:currentColor;" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
          </svg>
          Memverifikasi...
        {:else}
          Masuk ke Akun
          <svg style="width:0.72rem;height:0.72rem;fill:none;stroke:currentColor;margin-left:0.25rem;" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
          </svg>
        {/if}
      </button>

      <!-- â”€â”€ Divider â”€â”€ -->
      <div style="display:flex;align-items:center;gap:0.85rem;margin:1.4rem 0;">
        <div style="flex:1;height:1px;background:rgba(55,22,8,0.9);"></div>
        <span style="font-family:'EB Garamond',serif;font-size:0.53rem;letter-spacing:0.3em;text-transform:uppercase;color:rgba(80,40,12,0.5);">atau</span>
        <div style="flex:1;height:1px;background:rgba(55,22,8,0.9);"></div>
      </div>

      <!-- â”€â”€ Guest â”€â”€ -->
      <a href="/booking" class="btn-ghost">
        Lanjutkan sebagai Tamu
      </a>

      <!-- â”€â”€ Footer links â”€â”€ -->
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:1.75rem;">
        <p style="font-family:'EB Garamond',serif;font-size:0.68rem;font-style:italic;color:rgba(95,55,15,0.45);">
          Belum punya akun?
          <a href="/daftar" class="subtle-link" style="font-family:'EB Garamond',serif;font-style:normal;margin-left:0.2rem;">
            Daftar
          </a>
        </p>
        <a href="/" class="subtle-link"
          style="font-family:'EB Garamond',serif;font-size:0.53rem;letter-spacing:0.32em;text-transform:uppercase;">
          â† Beranda
        </a>
      </div>

    </div>
  </div>
</div>

<style>
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* â”€â”€ Input underline style â”€â”€ */
  :global(.login-input) {
    width: 100%;
    background: transparent;
    border: none;
    border-bottom: 1px solid;
    color: #ede0cc;
    padding: 0.45rem 1.6rem 0.45rem 0;
    font-family: 'EB Garamond', serif;
    font-size: 1rem;
    outline: none;
    transition: border-color 0.28s;
    caret-color: #d4a017;
  }

  :global(.login-input::placeholder) {
    color: rgba(95, 55, 15, 0.32);
  }

  /* Autofill override */
  :global(.login-input:-webkit-autofill),
  :global(.login-input:-webkit-autofill:focus) {
    -webkit-box-shadow: 0 0 0 1000px #0c0508 inset;
    -webkit-text-fill-color: #ede0cc;
    caret-color: #d4a017;
    transition: background-color 9999s;
  }

  /* â”€â”€ Primary button â”€â”€ */
  :global(.btn-gold) {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.85rem 1.5rem;
    font-family: 'EB Garamond', serif;
    font-size: 0.6rem;
    letter-spacing: 0.45em;
    text-transform: uppercase;
    border: 1px solid rgba(212, 160, 23, 0.48);
    background: rgba(212, 160, 23, 0.08);
    color: #d4a017;
    cursor: pointer;
    transition: background 0.32s, border-color 0.32s;
  }
  :global(.btn-gold:hover:not(:disabled)) {
    background: rgba(212, 160, 23, 0.15);
    border-color: rgba(212, 160, 23, 0.65);
  }
  :global(.btn-gold:disabled) {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* â”€â”€ Ghost button â”€â”€ */
  :global(.btn-ghost) {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    font-family: 'EB Garamond', serif;
    font-size: 0.58rem;
    letter-spacing: 0.42em;
    text-transform: uppercase;
    border: 1px solid rgba(55, 22, 8, 0.9);
    color: rgba(140, 85, 28, 0.48);
    text-decoration: none;
    transition: border-color 0.28s, color 0.28s;
  }
  :global(.btn-ghost:hover) {
    border-color: rgba(212, 160, 23, 0.22);
    color: rgba(212, 160, 23, 0.52);
  }

  /* â”€â”€ Subtle link â”€â”€ */
  :global(.subtle-link) {
    color: rgba(212, 160, 23, 0.45);
    text-decoration: none;
    border-bottom: 1px solid rgba(212, 160, 23, 0.18);
    transition: color 0.22s, border-color 0.22s;
  }
  :global(.subtle-link:hover) {
    color: rgba(212, 160, 23, 0.8);
    border-color: rgba(212, 160, 23, 0.4);
  }
</style>

