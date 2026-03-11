<script>
  import '../app.css';
  import Header from '$lib/components/Header.svelte';
  import Footer from '$lib/components/Footer.svelte';
  import ChatWidget from '$lib/components/ChatWidget.svelte';
</script>

<Header />
<main>
  <slot />
</main>
<Footer />
<ChatWidget />
