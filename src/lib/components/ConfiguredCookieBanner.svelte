<script lang="ts">
  import { dev, version } from "$app/environment";
  import CookieBanner from "$lib/components/CookieBanner.svelte";
  import RichText from "$lib/components/RichText.svelte";
  import type { Choices, SerializedChoices } from "$lib/consent";
  import type { CookieBannerStoryblok } from "$storyblok/components";
  import type { Writable } from "svelte/store";

  export let blok: CookieBannerStoryblok;
  export let consent: Writable<SerializedChoices>;
  export let open: boolean | undefined = undefined;

  const visible = !dev && !version.startsWith("preview");

  const choices = [
    {
      name: "necessary",
      label: blok.necessaryCategoryLabel,
      description: blok.necessaryCategoryDescription,
      enabled: true,
    },
    {
      name: "tracking",
      label: blok.trackingCategoryLabel,
      description: blok.trackingCategoryDescription,
      enabled: blok.trackingCategoryEnabled,
    },
    {
      name: "analytics",
      label: blok.analyticsCategoryLabel,
      description: blok.analyticsCategoryDescription,
      enabled: blok.analyticsCategoryEnabled,
    },
    {
      name: "marketing",
      label: blok.marketingCategoryLabel,
      description: blok.marketingCategoryDescription,
      enabled: blok.marketingCategoryEnabled,
    },
  ].filter((choice) => choice.enabled).reduce<Choices>((choices, choice) => ({
    ...choices,
    [choice.name]: {
      label: choice.label,
      description: choice.description,
      value: choice.name === "necessary" ? true : !!$consent[choice.name],
    },
  }), {});

  function updateConsent(event: CustomEvent<SerializedChoices>) {
    consent.set(event.detail);
  }
</script>

<CookieBanner
  acceptLabel={blok.acceptLabel}
  applyLabel={blok.applyLabel}
  backdropBlur={blok.backdropBlur}
  {choices}
  closeLabel={blok.closeLabel}
  editLabel={blok.editLabel}
  heading={blok.heading}
  rejectLabel={blok.rejectLabel}
  roundedCorners={blok.roundedCorners}
  settingsLabel={blok.settingsLabel}
  {visible}
  bind:shown={open}
  on:consent={updateConsent}
>
  <RichText content={blok.description} />
</CookieBanner>
