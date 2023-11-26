<script lang="ts">
  import { type Schema, serializeSchema } from "$lib/schema";

  export let schema: Schema;
</script>

<svelte:head>
  {@html serializeSchema(schema)}
</svelte:head>
