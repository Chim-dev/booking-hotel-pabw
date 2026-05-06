<script>
  import '../app.css';
  import { page } from '$app/state';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ChatWidget from '$lib/components/ChatWidget.svelte';

  let isAdminRoute = $derived(page.url.pathname.startsWith('/admin'));
</script>

{#if !isAdminRoute}
  <Header />
{/if}

<main class:pt-20={!isAdminRoute}>
  <slot />
</main>

{#if !isAdminRoute}
  <Footer />
  <ChatWidget />
{/if}
