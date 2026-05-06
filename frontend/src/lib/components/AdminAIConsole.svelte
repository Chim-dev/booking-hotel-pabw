<script>
  import { onMount } from 'svelte';

  let { onCommand } = $props();
  let query = $state('');
  let logs = $state([
    { role: 'system', text: 'Admin AI Console aktif. Gunakan bahasa natural untuk mengelola hotel.' },
    { role: 'system', text: 'Contoh: "Tambah kamar Deluxe code DLX-101", "Cari reservasi Siti", "Ubah status kamar SUP-01 jadi maintenance"' }
  ]);
  let isProcessing = $state(false);
  let logContainer;

  function scrollToBottom() {
    if (logContainer) {
      logContainer.scrollTop = logContainer.scrollHeight;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!query.trim() || isProcessing) return;

    const userMsg = query.trim();
    logs = [...logs, { role: 'user', text: userMsg }];
    query = '';
    isProcessing = true;
    
    setTimeout(scrollToBottom, 10);

    // Placeholder for Agentic AI Logic
    // In a real implementation, this would call a specialized endpoint
    try {
      // Simulating processing delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let response = "Maaf, fitur Agentic AI sedang dalam tahap integrasi. Saya memahami perintah Anda: \"" + userMsg + "\"";
      
      // Basic mock logic for demonstration
      if (userMsg.toLowerCase().includes('tambah kamar')) {
        response = "Membuka formulir penambahan kamar berdasarkan instruksi Anda...";
      } else if (userMsg.toLowerCase().includes('cari')) {
        response = "Mencari data yang relevan di database...";
      }

      logs = [...logs, { role: 'assistant', text: response }];
    } catch (err) {
      logs = [...logs, { role: 'system', text: 'Error: Gagal memproses perintah.' }];
    } finally {
      isProcessing = false;
      setTimeout(scrollToBottom, 10);
    }
  }
</script>

<div class="bg-[#2d1118] border border-[#d4a017]/30 flex flex-col h-[400px] shadow-2xl relative overflow-hidden">
  <!-- Header -->
  <div class="p-3 bg-[#d4a017]/10 border-b border-[#d4a017]/20 flex items-center justify-between">
    <div class="flex items-center gap-2">
      <div class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
      <span class="text-[10px] font-serif tracking-[0.2em] uppercase text-[#d4a017]">Agentic AI Console</span>
    </div>
    <span class="text-[9px] text-[#a07332]">v1.0-alpha</span>
  </div>

  <!-- Terminal Logs -->
  <div 
    bind:this={logContainer}
    class="flex-1 p-4 overflow-y-auto space-y-3 font-mono text-[11px] leading-relaxed scrollbar-thin"
  >
    {#each logs as log}
      <div class="flex gap-2 {log.role === 'user' ? 'text-ivory-100' : log.role === 'system' ? 'text-[#a07332]' : 'text-[#d4a017]'}">
        <span class="opacity-50 select-none">
          {log.role === 'user' ? '>' : log.role === 'system' ? '#' : 'AI:'}
        </span>
        <span class="break-words">{log.text}</span>
      </div>
    {/each}
    {#if isProcessing}
      <div class="flex gap-2 text-[#d4a017]">
        <span class="opacity-50 select-none">AI:</span>
        <span class="animate-pulse">Mengetik...</span>
      </div>
    {/if}
  </div>

  <!-- Input Area -->
  <form onsubmit={handleSubmit} class="p-3 bg-[#1a0a0f] border-t border-[#d4a017]/20">
    <div class="flex gap-2">
      <input 
        bind:value={query}
        placeholder="Ketik perintah..."
        class="flex-1 bg-transparent border-none text-xs text-[#faf5e8] focus:ring-0 placeholder:text-[#a07332]/40 font-mono"
        disabled={isProcessing}
      />
      <button 
        type="submit"
        disabled={isProcessing}
        class="text-[#d4a017] hover:text-[#e8c04a] transition-colors disabled:opacity-30"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </button>
    </div>
  </form>
</div>

<style>
  .scrollbar-thin::-webkit-scrollbar {
    width: 4px;
  }
  .scrollbar-thin::-webkit-scrollbar-track {
    background: transparent;
  }
  .scrollbar-thin::-webkit-scrollbar-thumb {
    background: rgba(212, 160, 23, 0.2);
    border-radius: 10px;
  }
</style>
