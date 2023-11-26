<script lang="ts">
  import {
    type Choices,
    enlistChoices,
    execute,
    removeCookie,
    serializeChoices,
    type SerializedChoices,
    setCookie,
    validate,
  } from "$lib/consent";
  import Cookies, { type CookieAttributes } from "js-cookie";
  import { createEventDispatcher, onMount } from "svelte";
  import { fade } from "svelte/transition";

  const dispatch = createEventDispatcher<{
    consent: SerializedChoices;
  }>();

  export let canRejectCookies: boolean | undefined = true;
  export let showEditIcon: boolean | undefined = true;
  export let backdropBlur: boolean | undefined = true;
  export let roundedCorners: boolean | undefined = true;

  export let heading: string;
  export let acceptLabel: string;
  export let rejectLabel: string;
  export let settingsLabel: string;
  export let applyLabel: string;
  export let closeLabel: string;
  export let editLabel: string;

  export let cookieConfig: CookieAttributes = {};
  export let choices: Choices = {};

  /**
   * Whether to show the cookie banner if the user has not yet accepted or rejected your choices.
   */
  export let visible: boolean | undefined = true;

  export let shown = false;
  let settingsShown = false;

  $: choicesMerged = { ...choices } satisfies Choices;
  $: choicesArr = enlistChoices(choicesMerged);
  $: selection = serializeChoices(choicesArr, item => item.value ? item.value : false);

  onMount(() => {
    const cookie = Cookies.get("consent");

    if (!cookie) {
      if (visible) {
        show();
      }

      return;
    }

    try {
      const { choices } = JSON.parse(cookie) as { choices: SerializedChoices };
      const valid = validate(selection, choices);

      if (!valid) {
        throw new Error("Cookie consent has changed");
      }

      execute(choicesMerged, choices, dispatch);
      dispatch("consent", { ...choices });
      hide();
    } catch (error) {
      removeCookie(cookieConfig);

      if (visible) {
        show();
      }
    }
  });

  function show() {
    shown = true;
  }

  function hide() {
    shown = false;
  }

  function closeSettings() {
    settingsShown = false;
  }

  function reject() {
    const presetSelection = serializeChoices(choicesArr, item => item.id === "necessary");

    setCookie(presetSelection);
    execute(choicesMerged, presetSelection, dispatch);
    dispatch("consent", presetSelection);
    hide();
  }

  function choose() {
    setCookie(selection);
    execute(choicesMerged, selection, dispatch);
    dispatch("consent", selection);
    closeSettings();
    hide();
  }

  function acceptAll() {
    const presetSelection = serializeChoices(choicesArr, () => true);

    setCookie(presetSelection);
    execute(choicesMerged, presetSelection, dispatch);
    dispatch("consent", presetSelection);
    hide();
  }
</script>

{#if showEditIcon}
  <button
    class="bottom-8 right-8 w-10 h-10 fixed will-change-transform p-2 rounded-full bg-white/75 backdrop-blur-3xl
    backdrop-saturate-200 text-black hover:text-white hover:bg-black/50 shadow opacity-100 z-10 transition duration-200"
    aria-label={editLabel}
    on:click={show}
    transition:fade>
    <svg fill="currentColor" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M510.52 255.82c-69.97-.85-126.47-57.69-126.47-127.86-70.17 0-127-56.49-127.86-126.45-27.26-4.14-55.13.3-79.72
        12.82l-69.13 35.22a132.221 132.221 0 0 0-57.79 57.81l-35.1 68.88a132.645 132.645 0 0 0-12.82 80.95l12.08
        76.27a132.521 132.521 0 0 0 37.16 72.96l54.77 54.76a132.036 132.036 0 0 0 72.71 37.06l76.71 12.15c27.51 4.36
        55.7-.11 80.53-12.76l69.13-35.21a132.273 132.273 0 0 0 57.79-57.81l35.1-68.88c12.56-24.64 17.01-52.58
        12.91-79.91zM176 368c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm32-160c-17.67
        0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32zm160 128c-17.67 0-32-14.33-32-32s14.33-32 32-32 32
        14.33 32 32-14.33 32-32 32z"
      />
    </svg>
  </button>
{/if}

{#if shown}
  <div
    class="cookieConsentWrapper z-20 fixed right-4 bottom-4 max-w-3xl
    {backdropBlur ? 'bg-black/50 backdrop-blur-3xl' : 'bg-black'} text-white p-6 transition duration-150 shadow-xl"
    class:rounded-2xl={roundedCorners}
    transition:fade
  >
    <article class="cookieConsent flex flex-col">
      <header class="flex justify-between items-center mb-2">
        <strong class="block font-medium font-display leading-none">
          {heading}
        </strong>

        {#if canRejectCookies}
          <button
            class="group flex items-stretch rounded-sm bg-black/50 text-white/75 hover:bg-black focus:bg-black
            hover:text-white focus:text-white outline-none hover:ring-4 focus:ring-4 ring-white/25 whitespace-nowrap
            cursor-pointer transition"
            aria-label={rejectLabel}
            type="submit"
            on:click={reject}
          >
            <span class="block py-1 pl-3 mr-2">{rejectLabel}</span>
            <span
              class="flex items-center bg-black/25 group-hover:bg-white/25 group-focus:bg-white/25 rounded-r-sm
              font-bold text-lg leading-none pt-0.5 px-2.5 transition-colors"
            >
              &times;
            </span>
          </button>
        {/if}
      </header>

      <slot />

      <footer class="mt-4 flex space-x-2">
        <button
          class="py-2 px-6 block rounded-sm bg-white outline-none hover:ring-4 focus:ring-4 ring-white/25 text-black
          whitespace-nowrap cursor-pointer transition duration-200"
          aria-label={acceptLabel}
          type="submit"
          on:click={acceptAll}
        >
          {acceptLabel}
        </button>

        <button
          class="py-2 px-6 block rounded-sm bg-white/75 hover:bg-white outline-none hover:ring-4 focus:ring-4
          ring-white/25 text-black whitespace-nowrap cursor-pointer transition duration-200"
          aria-label={settingsLabel}
          type="button"
          on:click={() => { settingsShown = true } }
        >
          {settingsLabel}
        </button>
      </footer>
    </article>
  </div>
{/if}

{#if settingsShown}
  <div
    class="fixed top-0 right-0 bottom-0 left-0 bg-black/80 backdrop-blur-sm flex
    will-change-transform transition-transform duration-300 z-50"
    transition:fade>
    <article
      class="cookieConsentOperations__List p-6 bg-white/90 backdrop-blur-3xl text-secondary max-w-2xl m-auto
      overflow-y-auto max-h-screen transition-transform duration-200 will-change-transform"
      class:rounded-2xl={roundedCorners}
    >
      {#each Object.entries(choices) as [category, choice]}
        {#if choicesMerged[category]}
          <div
            class="cookieConsentOperations__Item block ml-16 mb-4"
            class:opacity-60={category === 'necessary'}
          >
            <input
              id={`gdpr-check-${category}`}
              class="peer hidden"
              disabled={category === 'necessary'}
              type="checkbox"
              bind:checked={choicesMerged[category].value}
            />
            <label
              class="items-center text-2xl font-medium font-display block relative before:block before:shadow-inner
              before:-left-14 before:-translate-x-0.5 peer-checked:after:translate-x-5 cursor:pointer
              {choicesMerged[category].value ? 'before:bg-primary' : 'before:bg-primary/50'} before:h-5 before:w-10
              before:absolute before:top-1/2 before:-translate-y-1/2 before:rounded-full after:block after:w-4 after:h-4
              after:rounded-full after:bg-black after:absolute after:top-1/2 after:-translate-y-1/2 after:-left-14
              after:transition after:duration-200"
              class:after:opacity-30={category === 'necessary'}
              for={`gdpr-check-${category}`}
            >
              {choice.label}
            </label>
            <span class="cookieConsentOperations__ItemLabel">
              {choice.description}
            </span>
          </div>
        {/if}
      {/each}

      <footer class="mt-6 flex items-center space-x-2">
        <button
          class="py-2 px-6 block rounded-sm bg-black/75 hover:bg-black outline-none hover:ring-4 focus:ring-4
          ring-black/25 text-white whitespace-nowrap cursor-pointer transition duration-200 cookieConsent__Button--Close"
          aria-label={applyLabel}
          type="submit"
          on:click={choose}>
          {applyLabel}
        </button>
        <button
          class="py-2 px-6 block rounded-sm bg-black/75 hover:bg-black outline-none hover:ring-4 focus:ring-4
          ring-black/25 text-white whitespace-nowrap cursor-pointer transition duration-200 cookieConsent__Button--Close"
          aria-label={closeLabel}
          type="submit"
          on:click={() => { settingsShown = false } }>
          {closeLabel}
        </button>
      </footer>
    </article>
  </div>
{/if}
