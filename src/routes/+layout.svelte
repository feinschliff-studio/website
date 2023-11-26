<script context="module" lang="ts">
  import type { SerializedChoices } from "$lib/consent";
  import type { Readable } from "svelte/store";

  export interface ConsentChoices extends SerializedChoices {
    necessary: boolean;
    tracking: boolean;
    analytics: boolean;
    marketing: boolean;
  }

  export type ConsentContext = {
    consent: Readable<ConsentChoices>,
    show: () => void,
  }
</script>

<script lang="ts">
  import ConfiguredCookieBanner from "$lib/components/ConfiguredCookieBanner.svelte";
  import JsonLd from "$lib/components/JsonLd.svelte";
  import type { BeautySalon, DayOfWeek, WithContext } from "schema-dts";
  import { setContext } from "svelte";
  import { derived, writable } from "svelte/store";
  import type { LayoutData } from "./$types";

  // This is the primary stylesheet used to integrate Tailwind
  import "../style.pcss";

  export let data: LayoutData;
  let open: boolean = false;

  const consent = writable({
    necessary: true,
    tracking: false,
    analytics: false,
    marketing: false,
  } as ConsentChoices);

  setContext<ConsentContext>("consent", {
    consent: derived(consent, c => c),
    show: () => {
      open = true;
    },
  });

  const organizationSchema: WithContext<BeautySalon> = {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": `${data.siteConfig.website}#organization`,
    name: data.siteConfig.companyName,
    url: data.siteConfig.website,
    telephone: data.siteConfig.phoneNumber,
    email: data.siteConfig.emailAdress,
    priceRange: data.siteConfig.priceRange,
    paymentAccepted: data.siteConfig.paymentAccepted,
    // TODO: logo: data.siteConfig.logo,
    address: {
      "@type": "PostalAddress",
      addressCountry: data.siteConfig.addressCountry,
      addressLocality: data.siteConfig.addressLocality,
      postalCode: data.siteConfig.postalCode,
      streetAddress: data.siteConfig.streetAddress,
    },
    location: {
      "@type": "Place",
      geo: {
        "@type": "GeoCoordinates",
        latitude: data.siteConfig.latitude,
        longitude: data.siteConfig.longitude,
      },
    },
    founder: {
      "@type": "Person",
      name: `${data.siteConfig.founderGivenName} ${data.siteConfig.founderFamilyName}`,
      givenName: data.siteConfig.founderGivenName,
      familyName: data.siteConfig.founderFamilyName,
      email: data.siteConfig.founderEmail,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Terminvereinbarung",
      telephone: data.siteConfig.phoneNumber,
      email: data.siteConfig.emailAdress,
    },
    openingHoursSpecification: [
      {
        dayOfWeek: "Monday",
        open: data.siteConfig.openOnMonday,
        opens: data.siteConfig.openingTimeMonday,
        closes: data.siteConfig.closingTimeMonday,
      },
      {
        dayOfWeek: "Tuesday",
        open: data.siteConfig.openOnTuesday,
        opens: data.siteConfig.openingTimeTuesday,
        closes: data.siteConfig.closingTimeTuesday,
      },
      {
        dayOfWeek: "Wednesday",
        open: data.siteConfig.openOnWednesday,
        opens: data.siteConfig.openingTimeWednesday,
        closes: data.siteConfig.closingTimeWednesday,
      },
      {
        dayOfWeek: "Thursday",
        open: data.siteConfig.openOnThursday,
        opens: data.siteConfig.openingTimeThursday,
        closes: data.siteConfig.closingTimeThursday,
      },
      {
        dayOfWeek: "Friday",
        open: data.siteConfig.openOnFriday,
        opens: data.siteConfig.openingTimeFriday,
        closes: data.siteConfig.closingTimeFriday,
      },
      {
        dayOfWeek: "Saturday",
        open: data.siteConfig.openOnSaturday,
        opens: data.siteConfig.openingTimeSaturday,
        closes: data.siteConfig.closingTimeSaturday,
      },
      {
        dayOfWeek: "Sunday",
        open: data.siteConfig.openOnSunday,
        opens: data.siteConfig.openingTimeSunday,
        closes: data.siteConfig.closingTimeSunday,
      },
    ]
      .filter(({ open }) => open)
      .map(({ dayOfWeek, opens, closes }) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: dayOfWeek as DayOfWeek,
        opens: opens,
        closes: closes,
      })),
  };
</script>

<article class="relative">
  <slot />

  <ConfiguredCookieBanner blok={data.cookieBanner} {consent} bind:open />
  <JsonLd schema={organizationSchema} />
</article>
