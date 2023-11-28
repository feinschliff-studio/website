<script lang="ts">
  export let id: string | undefined = undefined;
  export let bleed: boolean = false;
  export let popOut: boolean = false;
  export let recede: boolean = false;
  export let colored: boolean = false;
  export let header: boolean = true;
</script>

<div
  {id}
  class="flex flex-col w-full min-h-[75vh] px-4 py-16 sm:p-8 lg:py-16 text-2xl leading-relaxed"
  class:bleed={bleed}
  class:colored={colored}
  class:popout={popOut}
  class:recede={recede}
  class:uncolored={!colored}
>
  <div class="w-full max-w-5xl mx-auto" class:contents={popOut}>
    {#if header && $$slots.heading}
      <header class="font-medium empty:hidden">
        <slot name="heading" />
        {#if $$slots.subheading}
          <div class="empty:hidden flex flex-col md:flex-row md:items-center justify-between mt-6 mb-2">
            <slot name="subheading" />
          </div>
        {/if}
      </header>
    {/if}

    <slot />
  </div>
</div>

<style lang="postcss">
    .bleed {
        @apply p-0;
    }

    .recede {
        @apply min-h-0;
    }

    .uncolored {
        @apply bg-white text-secondary;
    }

    .colored {
        @apply bg-primary text-white;
    }
</style>
