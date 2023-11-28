<script lang="ts">
  import { page } from "$app/stores";
  import ContentSection from "$lib/components/ContentSection.svelte";

  const title = $page.status === 404 ? "Seite nicht gefunden" : "Ein Fehler ist aufgetreten";
  const subtitle = $page.status === 404 ? "Die angeforderte Seite konnte nicht gefunden werden." : "Bitte versuchen Sie es später erneut.";
</script>

<svelte:head>
  <title>{$page.status}: {title}</title>
</svelte:head>

<article class="pt-52">
  <ContentSection header>
  <h1 slot="heading" class="text-6xl font-display font-medium">{title}</h1>
  <h2 slot="subheading" class="mt-2">{subtitle}</h2>
</ContentSection>
</article>
