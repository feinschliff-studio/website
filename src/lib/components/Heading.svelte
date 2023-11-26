<script lang="ts">
  export let id: string | undefined = undefined;
  export let text: string | undefined = undefined;
  export let level: number;

  const tag = `h${level}`;
</script>

<svelte:element
  this={tag}
  {id}
  class="font-medium font-display"
  class:text-2xl={level === 3}
  class:text-3xl={level === 2}
  class:text-6xl={level === 1}
  class:text-base={level > 4}
  class:text-xl={level === 4}
>
  <slot>{text}</slot>
</svelte:element>
