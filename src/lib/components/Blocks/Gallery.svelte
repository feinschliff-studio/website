<script lang="ts">
  import ContentSection from "$lib/components/ContentSection.svelte";
  import Slider, { type Slide } from "$lib/components/Slider.svelte";
  import type { GalleryStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: GalleryStoryblok;
  let anchor = blok.anchor;
  let items = blok.items.map((item): Slide => ({
    src: item.filename,
    alt: item.alt ?? "",
  }));
  let animationDuration = Number(blok.animationDuration ?? 500);
  let autoplay: number | false = Number(blok.autoplay ?? 5_000) || false;
  let bullets = blok.bullets ?? false;
  let control = blok.control ?? true;
  let direction = blok.direction ?? "ltr";
  let hoverpause = blok.hoverpause ?? true;
  let keyboard = blok.keyboard ?? true;
  let peek = Number(blok.peek ?? 0);
  let perView = Number(blok.perView ?? 1);
  let perViewMobile = Number(blok.perViewMobile ?? 1);
  let breakpoints = {
    768: {
      perView: perViewMobile,
    },
    1024: {
      perView: Math.min(3, perView),
    },
    2048: {
      perView: Math.min(5, perView),
    },
  };
  let rewind = blok.rewind ?? true;
  let rewindDuration = Number(blok.rewindDuration ?? 800);
  let startAt = Number(blok.startAt ?? 0);
  let swipeThreshold = Number(blok.swipeTreshold ?? 80);
  let dragThreshold = Number(blok.dragThreshold ?? 120);
  let type = blok.type ?? "carousel";
</script>

<section class="contents" use:storyblokEditable={blok}>
  <ContentSection id={anchor} bleed={blok.bleed ?? true} popOut={blok.popOut ?? true}>
    <Slider
      {animationDuration}
      {autoplay}
      {breakpoints}
      {bullets}
      {control}
      {direction}
      {dragThreshold}
      gap={0}
      {hoverpause}
      {items}
      {keyboard}
      {peek}
      {rewind}
      {rewindDuration}
      {startAt}
      {swipeThreshold}
      {type}
    />
  </ContentSection>
</section>
