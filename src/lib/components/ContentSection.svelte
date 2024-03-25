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
  class="flex flex-col w-full {colored ? 'bg-primary text-white' : 'bg-white text-secondary'}
  {recede ? 'min-h-0' : 'min-h-[75vh]'} {bleed ? 'p-0' : 'px-4 py-16 sm:p-8 lg:py-16'} text-2xl leading-relaxed"
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
