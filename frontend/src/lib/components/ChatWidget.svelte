<script>
  import { tick } from 'svelte';
  import { API_BASE_URL } from '$lib/config/api';

  /**
   * @typedef {'assistant' | 'user'} ChatRole
   */

  /**
   * @typedef {{ role: ChatRole; content: string }} ChatMessage
   */

  let isOpen     = $state(false);
  let loading    = $state(false);
  let input      = $state('');
  let messagesEl = $state(/** @type {HTMLDivElement | null} */ (null));

  const WELCOME = /** @type {ChatMessage} */ ({
    role: 'assistant',
    content: 'Selamat datang di Grand Maison.\n\nSaya **Isabelle**, Concierge AI Anda. Saya siap membantu Anda memilih kamar, menghitung harga, atau menjawab pertanyaan seputar hotel kami.\n\nAda yang bisa saya bantu hari ini?'
  });

  let messages = $state(/** @type {ChatMessage[]} */ ([WELCOME]));

  const suggestions = [
    'Kamar apa yang tersedia?',
    'Berapa harga Suite 2 malam?',
    'Fasilitas apa saja yang ada?',
    'Rekomendasi kamar bulan madu',
  ];

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    input = '';

    messages = [...messages, { role: 'user', content: text }];
    loading = true;
    await tick();
    scrollBottom();

    try {
      const history = messages
        .filter((_, i) => i > 0)
        .map(m => ({ role: m.role, content: m.content }));

      const res  = await fetch(`${API_BASE_URL}/api/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ messages: history }),
      });

      const data = await res.json();
      messages = [
        ...messages,
        { role: 'assistant', content: data.reply ?? 'Maaf, terjadi gangguan. Mohon coba lagi.' }
      ];
    } catch {
      messages = [
        ...messages,
        { role: 'assistant', content: 'Maaf, koneksi terputus. Mohon coba lagi.' }
      ];
    } finally {
      loading = false;
      await tick();
      scrollBottom();
    }
  }

  /**
   * @param {KeyboardEvent} e
   */
  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  }

  function scrollBottom() {
    if (messagesEl) messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  /**
   * @param {string} s
   */
  function useSuggestion(s) {
    input = s;
    send();
  }

  /**
   * @param {string} text
   */
  function formatMessage(text) {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br/>');
  }

  /**
   * @param {string} text
   */
  function extractBookingLink(text) {
    const match = text.match(/\/booking\?[^\s"')]+/);
    return match ? match[0] : null;
  }

  $effect(() => {
    if (isOpen) {
      tick().then(scrollBottom);
    }
  });
</script>

<!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     FLOATING BUTTON
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
<div class="cw-fab-wrap">

  {#if !isOpen}
    <div class="cw-tooltip">Concierge AI</div>
  {/if}

  <button
    class="cw-fab"
    class:cw-fab--open={isOpen}
    onclick={() => (isOpen = !isOpen)}
    aria-label={isOpen ? 'Tutup chat' : 'Buka Concierge AI'}
  >
    {#if isOpen}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 18L18 6M6 6l12 12"/>
      </svg>
    {:else}
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"/>
      </svg>
    {/if}
  </button>
</div>

<!--
     CHAT PANEL
 -->
{#if isOpen}
  <div class="cw-panel">

    <!-- gold hairline top -->
    <div class="cw-hairline"></div>

    <!-- â”€â”€ Header â”€â”€ -->
    <div class="cw-header">
      <div class="cw-avatar">I</div>
      <div class="cw-header-info">
        <div class="cw-name">Isabelle</div>
        <div class="cw-sub">Concierge AI - Grand Maison</div>
      </div>
      <div class="cw-status">
        <span class="cw-dot"></span>
        <span class="cw-status-label">Aktif</span>
      </div>
    </div>

    <!-- â”€â”€ Messages â”€â”€ -->
    <div class="cw-messages" bind:this={messagesEl}>
      {#each messages as msg (msg)}
        <div class="cw-msg-row" class:cw-msg-row--user={msg.role === 'user'}>
          <div
            class="cw-bubble"
            class:cw-bubble--ai={msg.role === 'assistant'}
            class:cw-bubble--user={msg.role === 'user'}
          >
            <!-- eslint-disable-next-line svelte/no-at-html-tags -->
            {@html formatMessage(msg.content)}

            {#if msg.role === 'assistant' && extractBookingLink(msg.content)}
              <a href={extractBookingLink(msg.content)} class="cw-booking-btn">
                Lanjut ke Booking ->
              </a>
            {/if}
          </div>
        </div>
      {/each}

      <!-- Typing indicator -->
      {#if loading}
        <div class="cw-msg-row">
          <div class="cw-bubble cw-bubble--ai cw-typing">
            <span class="cw-dot-typing" style="animation-delay:0s"></span>
            <span class="cw-dot-typing" style="animation-delay:0.2s"></span>
            <span class="cw-dot-typing" style="animation-delay:0.4s"></span>
          </div>
        </div>
      {/if}
    </div>

    <!-- â”€â”€ Quick suggestions (hanya saat awal) â”€â”€ -->
    {#if messages.length === 1 && !loading}
      <div class="cw-suggestions">
        {#each suggestions as s}
          <button class="cw-suggestion" onclick={() => useSuggestion(s)}>
            {s}
          </button>
        {/each}
      </div>
    {/if}

    <!-- â”€â”€ Input â”€â”€ -->
    <div class="cw-input-area">
      <textarea
        class="cw-textarea"
        bind:value={input}
        onkeydown={handleKey}
        placeholder="Tulis pesan Anda..."
        rows="1"
        disabled={loading}
      ></textarea>

      <button
        class="cw-send"
        class:cw-send--active={!loading && input.trim()}
        onclick={send}
        disabled={loading || !input.trim()}
        aria-label="Kirim pesan"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"/>
        </svg>
      </button>
    </div>

    <!-- gold hairline bottom -->
    <div class="cw-hairline cw-hairline--dim"></div>
  </div>
{/if}

<!-- â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     STYLES
â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• -->
<style>
  /* â”€â”€ Keyframes â”€â”€ */
  @keyframes bounce-dot {
    0%, 60%, 100% { transform: translateY(0);   opacity: 0.35; }
    30%           { transform: translateY(-5px); opacity: 1; }
  }

  @keyframes fade-up {
    from { opacity: 0; transform: translateY(12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     FAB (Floating Button)
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  .cw-fab-wrap {
    position: fixed;
    bottom: 1.5rem;
    right: 1.5rem;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.6rem;
  }

  .cw-tooltip {
    font-family: 'EB Garamond', serif;
    font-size: 0.58rem;
    letter-spacing: 0.35em;
    text-transform: uppercase;
    color: rgba(212, 160, 23, 0.6);
    background: rgba(14, 4, 8, 0.92);
    border: 1px solid rgba(212, 160, 23, 0.2);
    padding: 0.28rem 0.7rem;
    backdrop-filter: blur(8px);
    pointer-events: none;
    white-space: nowrap;
  }

  .cw-fab {
    width: 3.1rem;
    height: 3.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(212, 160, 23, 0.92);
    border: 1px solid rgba(212, 160, 23, 0.85);
    color: #0c0508;
    cursor: pointer;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(212, 160, 23, 0.12);
    transition: background 0.28s, box-shadow 0.28s, transform 0.2s;
  }
  .cw-fab svg { width: 1.1rem; height: 1.1rem; }
  .cw-fab:hover {
    background: rgba(212, 160, 23, 1);
    box-shadow: 0 10px 36px rgba(212, 160, 23, 0.22), 0 0 0 1px rgba(212, 160, 23, 0.2);
    transform: translateY(-1px);
  }
  .cw-fab--open {
    background: rgba(212, 160, 23, 0.1);
    border-color: rgba(212, 160, 23, 0.32);
    color: #d4a017;
  }
  .cw-fab--open:hover {
    background: rgba(212, 160, 23, 0.18);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.55);
    transform: translateY(-1px);
  }

  /* â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•
     CHAT PANEL
  â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â•â• */
  .cw-panel {
    position: fixed;
    bottom: 5.5rem;
    right: 1.5rem;
    z-index: 9998;
    display: flex;
    flex-direction: column;
    width: min(390px, calc(100vw - 2rem));
    height: min(570px, calc(100vh - 9rem));
    background: #0d0508;
    border: 1px solid rgba(212, 160, 23, 0.17);
    box-shadow:
      0 40px 90px rgba(0, 0, 0, 0.8),
      0 0 0 1px rgba(212, 160, 23, 0.06);
    animation: fade-up 0.25s ease forwards;
  }

  /* â”€â”€ Hairlines â”€â”€ */
  .cw-hairline {
    height: 1px;
    flex-shrink: 0;
    background: linear-gradient(to right, transparent, rgba(212, 160, 23, 0.5), transparent);
  }
  .cw-hairline--dim {
    background: linear-gradient(to right, transparent, rgba(212, 160, 23, 0.22), transparent);
  }

  /* â”€â”€ Header â”€â”€ */
  .cw-header {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.85rem 1rem;
    background: rgba(16, 6, 10, 0.85);
    border-bottom: 1px solid rgba(212, 160, 23, 0.08);
    flex-shrink: 0;
  }
  .cw-avatar {
    width: 2rem;
    height: 2rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(212, 160, 23, 0.28);
    background: rgba(212, 160, 23, 0.07);
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.9rem;
    color: #d4a017;
  }
  .cw-header-info { flex: 1; min-width: 0; }
  .cw-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 0.98rem;
    font-weight: 300;
    color: #ede0cc;
    line-height: 1.1;
  }
  .cw-sub {
    font-family: 'EB Garamond', serif;
    font-size: 0.52rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: rgba(212, 160, 23, 0.36);
    margin-top: 0.1rem;
  }
  .cw-status {
    display: flex;
    align-items: center;
    gap: 0.28rem;
    flex-shrink: 0;
  }
  .cw-dot {
    width: 0.38rem;
    height: 0.38rem;
    border-radius: 50%;
    background: #4ade80;
    box-shadow: 0 0 5px rgba(74, 222, 128, 0.55);
    display: inline-block;
  }
  .cw-status-label {
    font-family: 'EB Garamond', serif;
    font-size: 0.5rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: rgba(74, 222, 128, 0.52);
  }

  /* â”€â”€ Messages â”€â”€ */
  .cw-messages {
    flex: 1;
    overflow-y: auto;
    padding: 1rem 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    scroll-behavior: smooth;
  }
  .cw-messages::-webkit-scrollbar { width: 2px; }
  .cw-messages::-webkit-scrollbar-track { background: transparent; }
  .cw-messages::-webkit-scrollbar-thumb {
    background: rgba(212, 160, 23, 0.15);
    border-radius: 2px;
  }

  .cw-msg-row {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .cw-msg-row--user { align-items: flex-end; }

  .cw-bubble {
    max-width: 90%;
    padding: 0.6rem 0.82rem;
    font-family: 'EB Garamond', serif;
    font-size: 0.9rem;
    line-height: 1.65;
  }
  .cw-bubble--ai {
    background: rgba(28, 10, 16, 0.85);
    border: 1px solid rgba(212, 160, 23, 0.1);
    color: #ddd0b8;
  }
  .cw-bubble--user {
    background: rgba(212, 160, 23, 0.88);
    border: 1px solid rgba(212, 160, 23, 0.95);
    color: #0d0508;
  }

  /* â”€â”€ Typing dots â”€â”€ */
  .cw-typing {
    display: flex;
    align-items: center;
    gap: 0.28rem;
    padding: 0.6rem 0.82rem;
  }
  .cw-dot-typing {
    display: inline-block;
    width: 0.3rem;
    height: 0.3rem;
    border-radius: 50%;
    background: rgba(212, 160, 23, 0.5);
    animation: bounce-dot 1.2s infinite;
  }

  /* â”€â”€ Booking CTA â”€â”€ */
  .cw-booking-btn {
    display: inline-flex;
    align-items: center;
    margin-top: 0.7rem;
    padding: 0.36rem 0.68rem;
    font-family: 'EB Garamond', serif;
    font-size: 0.58rem;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    background: rgba(212, 160, 23, 0.09);
    border: 1px solid rgba(212, 160, 23, 0.3);
    color: #d4a017;
    text-decoration: none;
    transition: background 0.25s, border-color 0.25s;
  }
  .cw-booking-btn:hover {
    background: rgba(212, 160, 23, 0.17);
    border-color: rgba(212, 160, 23, 0.55);
  }

  /* â”€â”€ Quick suggestions â”€â”€ */
  .cw-suggestions {
    padding: 0 0.85rem 0.65rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    flex-shrink: 0;
  }
  .cw-suggestion {
    padding: 0.27rem 0.58rem;
    font-family: 'EB Garamond', serif;
    font-size: 0.63rem;
    letter-spacing: 0.02em;
    color: rgba(212, 160, 23, 0.48);
    background: rgba(212, 160, 23, 0.04);
    border: 1px solid rgba(212, 160, 23, 0.13);
    cursor: pointer;
    transition: color 0.2s, border-color 0.2s, background 0.2s;
  }
  .cw-suggestion:hover {
    color: rgba(212, 160, 23, 0.85);
    border-color: rgba(212, 160, 23, 0.35);
    background: rgba(212, 160, 23, 0.08);
  }

  /* â”€â”€ Input area â”€â”€ */
  .cw-input-area {
    display: flex;
    align-items: flex-end;
    gap: 0.55rem;
    padding: 0.7rem 0.85rem;
    border-top: 1px solid rgba(212, 160, 23, 0.08);
    background: rgba(10, 4, 7, 0.92);
    flex-shrink: 0;
  }

  .cw-textarea {
    flex: 1;
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(75, 35, 10, 0.55);
    color: #ede0cc;
    font-family: 'EB Garamond', serif;
    font-size: 0.9rem;
    line-height: 1.5;
    padding: 0.28rem 0;
    resize: none;
    outline: none;
    caret-color: #d4a017;
    max-height: 80px;
    overflow-y: auto;
    transition: border-color 0.25s;
    scrollbar-width: thin;
  }
  .cw-textarea:focus {
    border-bottom-color: rgba(212, 160, 23, 0.42);
  }
  .cw-textarea::placeholder {
    color: rgba(100, 52, 16, 0.38);
  }
  .cw-textarea:-webkit-autofill {
    -webkit-box-shadow: 0 0 0 1000px #0d0508 inset;
    -webkit-text-fill-color: #ede0cc;
  }
  .cw-textarea::-webkit-scrollbar { width: 2px; }
  .cw-textarea::-webkit-scrollbar-thumb { background: rgba(212,160,23,0.15); }

  /* â”€â”€ Send button â”€â”€ */
  .cw-send {
    width: 1.95rem;
    height: 1.95rem;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(212, 160, 23, 0.07);
    border: 1px solid rgba(212, 160, 23, 0.13);
    color: rgba(212, 160, 23, 0.28);
    cursor: not-allowed;
    transition: background 0.25s, border-color 0.25s, color 0.25s, transform 0.18s;
  }
  .cw-send svg { width: 0.82rem; height: 0.82rem; }

  .cw-send--active {
    background: rgba(212, 160, 23, 0.88);
    border-color: rgba(212, 160, 23, 0.92);
    color: #0d0508;
    cursor: pointer;
  }
  .cw-send--active:hover {
    background: rgba(212, 160, 23, 1);
    transform: scale(1.05);
  }
</style>


