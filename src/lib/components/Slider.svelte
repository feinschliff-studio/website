<script context="module" lang="ts">
  export type Slide = {
    src: string;
    alt: string;
  };
</script>

<script generics="T extends Slide" lang="ts">
  import type { Options } from "@glidejs/glide";
  import Glide from "@glidejs/glide";
  import type { Breakpoints as DefaultBreakpoints } from "@glidejs/glide/components/breakpoints";
  import { createEventDispatcher } from "svelte";

  type Breakpoints = Partial<DefaultBreakpoints> & {
    [key: string]: Partial<Options>;
  };

  const dispatch = createEventDispatcher();

  // eslint-disable-next-line no-undef -- ESLint struggles with Svelte generics
  export let items: T[] = [];
  export let type: "slider" | "carousel" = "carousel";
  export let perView = 3;
  export let autoplay: number | false | undefined = false;
  export let gap = 0;
  export let startAt = 0;
  export let focusAt: number | string = 0;
  export let bound = true;
  export let keyboard = true;
  export let animationDuration = 400;
  export let animationTimingFunc = "cubic-bezier(0.165, 0.840, 0.440, 1.000)";
  export let throttle = 25;
  export let dragThreshold = 120;
  export let swipeThreshold = 80;
  export let touchAngle = 45;
  export let touchRatio = 0.5;
  export let breakpoints: Breakpoints = {};
  export let cloningRatio = 0.5;
  export let direction: "ltr" | "rtl" | undefined = "ltr";
  export let hoverpause = true;
  export let peek = 0;
  export let perSwipe: "" | "|" | undefined = "";
  export let rewindDuration = 800;
  export let rewind = true;
  export let options = {
    type,
    perView,
    autoplay,
    gap,
    startAt,
    focusAt,
    bound,
    keyboard,
    animationDuration,
    animationTimingFunc,
    throttle,
    dragThreshold,
    swipeThreshold,
    touchAngle,
    touchRatio,
    breakpoints,
    cloningRatio,
    direction,
    hoverpause,
    peek,
    perSwipe,
    rewindDuration,
    rewind,
  } satisfies Partial<Options>;
  export let bullets = false;
  export let control = false;

  let glide: Glide;

  function initGlide(node: HTMLElement, options: Partial<Options>) {
    const events = [
      "mount.before",
      "run",
      "mount.after",
      "update",
      "play",
      "pause",
      "build.before",
      "build.after",
      "run.before",
      "run.after",
      "run.offset",
      "run.start",
      "run.end",
      "move",
      "move.after",
      "resize",
      "swipe.start",
      "swipe.move",
      "swipe.end",
      "translate.jump",
    ];

    glide = new Glide(node, options);

    // forward glide event
    events.forEach(event => glide.on(event, (...args: unknown[]) => {
      // reactive
      glide = glide;

      // Replace event name from a.b to aB or keep source
      dispatch(event.replace(/\.\w/, (v) => v[1].toUpperCase()), args);
    }));

    glide.mount();

    return {
      update: () => glide.update(),
      destroy: () => glide.destroy(),
    };
  }

  function bulletIn(index: number, glide: Glide) {
    return {
      focus: () => glide.go(`=${index}`),
      isActive: glide.index === index,
    };
  }
</script>

<div class="glide relative" use:initGlide={options}>
  <slot />

  <div class="glide__track relative" data-glide-el="track">
    <ul class="glide__slides">
      {#each items as item, index}
        <li class="glide__slide relative overflow-hidden max-h-[75vh]">
          <slot name="item" {glide} {index} {item}>
            <img
              class="slide__image object-cover object-center max-h-[inherit] max-w-none min-h-full min-w-full"
              alt={item.alt}
              src={item.src}
            />
          </slot>
        </li>
      {/each}
    </ul>
  </div>

  {#if control && glide}
    <div
      class="glide__arrows absolute top-0 px-8 left-0 w-full h-full flex items-center justify-between pointer-events-none">
      <slot name="control" {glide}>
        <button
          class="glide__arrow glide__arrow--left pointer-events-auto border-2 border-white/10 hover:border-white/50 bg-white/20 text-white hover:scale-110 transition backdrop-blur-3xl saturate-200 shadow-lg hover:shadow-xl flex justify-center items-center w-10 h-10 p-2 text-lg rounded-full"
          on:click={() => glide.go('<')}
        >
          ←
        </button>
        <button
          class="glide__arrow glide__arrow--right pointer-events-auto border-2 border-white/10 hover:border-white/50 bg-white/20 text-white hover:scale-110 transition backdrop-blur-3xl saturate-200 shadow-lg hover:shadow-xl flex justify-center items-center w-10 h-10 p-2 text-lg rounded-full"
          on:click={() => glide.go('>')}
        >
          →
        </button>
      </slot>
    </div>
  {/if}

  {#if bullets && glide}
    <nav
      class="glide__bullets w-full bottom-0 left-0 absolute flex justify-center items-center py-4 pointer-events-none space-x-2">
      {#each items as item, index}
        <div class="pointer-events-auto">
          <slot name="bullet" {index} {item} prop={bulletIn(index, glide)}>
            <button
              class="glide__bullet w-4 h-4 rounded-full {bulletIn(index, glide).isActive ? 'bg-white/80 scale-110' : 'bg-white/30'} backdrop-blur-3xl backdrop-saturate-200 shadow hover:scale-110 transition"
              class:focus={bulletIn(index, glide).isActive}
              aria-label="Go to slide {index + 1}"
              aria-pressed={bulletIn(index, glide).isActive}
              on:click={() => bulletIn(index, glide).focus()}
            />
          </slot>
        </div>
      {/each}
    </nav>
  {/if}
</div>
