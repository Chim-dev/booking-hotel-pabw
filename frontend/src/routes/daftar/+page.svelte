<script>
  import { goto } from '$app/navigation';
  import { API_BASE_URL } from '$lib/config/api';

  let firstName = '';
  let lastName = '';
  let email = '';
  let phone = '';
  let password = '';
  let confirmPassword = '';
  let loading = false;
  let error = '';

  async function handleRegister() {
    if (!firstName || !email || !password) {
      error = 'Nama depan, email, dan password wajib diisi.';
      return;
    }

    if (password.length < 8) {
      error = 'Password minimal 8 karakter.';
      return;
    }

    if (password !== confirmPassword) {
      error = 'Konfirmasi password tidak sama.';
      return;
    }

    loading = true;
    error = '';

    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password
        })
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        error = data.error || 'Registrasi gagal.';
        return;
      }

      await goto('/booking');
    } catch {
      error = 'Tidak dapat terhubung ke server.';
    } finally {
      loading = false;
    }
  }
</script>

<svelte:head>
  <title>Daftar - Grand Maison</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center px-4 py-16">
  <div class="w-full max-w-xl bg-velvet-800 border border-gold-700/30 p-8">
    <h1 class="font-display text-4xl text-gold-400 text-center mb-2">Buat Akun</h1>
    <p class="text-center text-ivory-600 font-body mb-8">Daftar untuk mempercepat proses reservasi.</p>

    {#if error}
      <div class="mb-6 border border-red-500/30 bg-red-900/10 p-3 text-red-200 text-sm">{error}</div>
    {/if}

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
      <div>
        <label for="firstName" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Nama Depan *</label>
        <input id="firstName" bind:value={firstName} type="text" class="input-baroque" />
      </div>
      <div>
        <label for="lastName" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Nama Belakang</label>
        <input id="lastName" bind:value={lastName} type="text" class="input-baroque" />
      </div>
    </div>

    <div class="mb-4">
      <label for="email" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Email *</label>
      <input id="email" bind:value={email} type="email" class="input-baroque" />
    </div>

    <div class="mb-4">
      <label for="phone" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Nomor Telepon</label>
      <input id="phone" bind:value={phone} type="tel" class="input-baroque" />
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
      <div>
        <label for="password" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Password *</label>
        <input id="password" bind:value={password} type="password" class="input-baroque" />
      </div>
      <div>
        <label for="confirmPassword" class="text-xs tracking-widest uppercase text-gold-600 font-body block mb-2">Konfirmasi Password *</label>
        <input id="confirmPassword" bind:value={confirmPassword} type="password" class="input-baroque" />
      </div>
    </div>

    <button
      on:click={handleRegister}
      disabled={loading}
      class="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {#if loading}
        Memproses...
      {:else}
        Daftar
      {/if}
    </button>

    <p class="text-center text-sm text-ivory-600 mt-6">
      Sudah punya akun? <a href="/login" class="text-gold-500 hover:text-gold-400">Masuk</a>
    </p>
  </div>
</div>
