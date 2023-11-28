import { init } from "$lib/storyblok";
import type { StoryblokClient } from "@storyblok/svelte";
import type { CookieBannerStoryblok, SiteConfigStoryblok } from "$storyblok/components";
import { dev, version } from "$app/environment";
import type { LayoutServerLoad } from "./$types";
import { STORYBLOK_ACCESS_TOKEN } from "$env/static/private";
import type { BeautySalon, DayOfWeek, WithContext } from "schema-dts";

export const prerender = true;

export const load: LayoutServerLoad = async function load() {
  const storyblokClient = await init(STORYBLOK_ACCESS_TOKEN);
  const [cookieBanner, siteConfig] = await Promise.all([
    loadCookieBanner(storyblokClient),
    loadSiteConfig(storyblokClient),
  ]);
  const schema = buildSchema(siteConfig);

  return {
    cookieBanner,
    siteConfig,
    schema,
  };
};

function buildSchema(siteConfig: SiteConfigStoryblok): WithContext<BeautySalon> {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    "@id": `${siteConfig.website}#organization`,
    name: siteConfig.companyName,
    url: siteConfig.website,
    telephone: siteConfig.phoneNumber,
    email: siteConfig.emailAdress,
    priceRange: siteConfig.priceRange,
    paymentAccepted: siteConfig.paymentAccepted,
    // TODO: logo: siteConfig.logo,
    address: {
      "@type": "PostalAddress",
      addressCountry: siteConfig.addressCountry,
      addressLocality: siteConfig.addressLocality,
      postalCode: siteConfig.postalCode,
      streetAddress: siteConfig.streetAddress,
    },
    location: {
      "@type": "Place",
      geo: {
        "@type": "GeoCoordinates",
        latitude: siteConfig.latitude,
        longitude: siteConfig.longitude,
      },
    },
    founder: {
      "@type": "Person",
      name: `${siteConfig.founderGivenName} ${siteConfig.founderFamilyName}`,
      givenName: siteConfig.founderGivenName,
      familyName: siteConfig.founderFamilyName,
      email: siteConfig.founderEmail,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Terminvereinbarung",
      telephone: siteConfig.phoneNumber,
      email: siteConfig.emailAdress,
    },
    openingHoursSpecification: [
      {
        dayOfWeek: "Monday",
        open: siteConfig.openOnMonday,
        opens: siteConfig.openingTimeMonday,
        closes: siteConfig.closingTimeMonday,
      },
      {
        dayOfWeek: "Tuesday",
        open: siteConfig.openOnTuesday,
        opens: siteConfig.openingTimeTuesday,
        closes: siteConfig.closingTimeTuesday,
      },
      {
        dayOfWeek: "Wednesday",
        open: siteConfig.openOnWednesday,
        opens: siteConfig.openingTimeWednesday,
        closes: siteConfig.closingTimeWednesday,
      },
      {
        dayOfWeek: "Thursday",
        open: siteConfig.openOnThursday,
        opens: siteConfig.openingTimeThursday,
        closes: siteConfig.closingTimeThursday,
      },
      {
        dayOfWeek: "Friday",
        open: siteConfig.openOnFriday,
        opens: siteConfig.openingTimeFriday,
        closes: siteConfig.closingTimeFriday,
      },
      {
        dayOfWeek: "Saturday",
        open: siteConfig.openOnSaturday,
        opens: siteConfig.openingTimeSaturday,
        closes: siteConfig.closingTimeSaturday,
      },
      {
        dayOfWeek: "Sunday",
        open: siteConfig.openOnSunday,
        opens: siteConfig.openingTimeSunday,
        closes: siteConfig.closingTimeSunday,
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
}

async function loadSiteConfig(storyblokClient: StoryblokClient): Promise<SiteConfigStoryblok> {
  const response = await storyblokClient.get("cdn/stories/_settings", {
    version: dev || version.startsWith("preview") ? "draft" : "published",
  });

  return response.data.story.content;
}

async function loadCookieBanner(storyblokClient: StoryblokClient): Promise<CookieBannerStoryblok> {
  const response = await storyblokClient.get("cdn/stories/_cookie-banner", {
    version: dev || version.startsWith("preview") ? "draft" : "published",
  });

  return response.data.story.content;
}
