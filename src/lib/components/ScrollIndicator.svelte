<script lang="ts">
  export let href: string;
  export let size: number;
</script>

<a
  style:--scroll-indicator-size={`${size}px`}
  style:--backdrop-size={`${size * 3}px`}
  style:--backdrop-offset={`${size * -0.25}px`}
  class="relative z-10 mb-8 flex justify-center items-center -translate-y-[200%] transition-opacity duration-300 after:block
   after:absolute after:top-0 after:left-1/2 after:bg-black/10 hover:after:bg-black/20
   after:translate-x-[calc(-50%_+_var(--backdrop-offset))] after:translate-y-[var(--backdrop-offset)]
   after:hover:scale-105 after:rounded-full after:transition-all after:duration-300 after:w-[var(--backdrop-size)]
   hover:after:w-[var(--backdrop-size)] after:h-[var(--backdrop-size)] hover:after:h-[var(--backdrop-size)]"
  aria-hidden="true"
  href={href}
>
  <span
    class="relative z-20 -rotate-45 border-l-2 border-b-2 border-white w-[var(--scroll-indicator-size)]
      h-[var(--scroll-indicator-size)] ml-[calc((var(--scroll-indicator-size)_/_2)_*_-1)]
      animate-scroll-indicator-fade"
  >
    <slot />
  </span>
</a>
