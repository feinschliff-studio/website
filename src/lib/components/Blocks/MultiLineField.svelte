<script lang="ts">
  import FormField from "$lib/components/FormField.svelte";
  import type { MultiLineFieldStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: MultiLineFieldStoryblok;
  let label = blok.label;
  let name = blok.name;
  let id = blok._uid;
  let placeholder = blok.placeholder ?? "";
  let required = blok.required ?? false;
  let disabled = blok.disabled ?? false;
  let readonly = blok.readonly ?? false;
  let spellcheck = blok.spellcheck === "default" ? undefined : blok.spellcheck;
  let cols = blok.cols ? Number(blok.cols) : undefined;
  let rows = blok.rows ? Number(blok.rows) : undefined;
  let maxlength = blok.maxlength ? Number(blok.maxlength) : undefined;
  let minlength = blok.minlength ? Number(blok.minlength) : undefined;
  let value = blok.value ?? "";

  $: rows = (value && value.match(/\n/g) || []).length + 1 || 1;

  let textarea = null;

  type ResizeEvent = CustomEvent<{
    rect: DOMRectReadOnly;
    target: HTMLTextAreaElement
  }>;

  function handleResize(event: UIEvent) {
    textarea = event.target;
  }

  function resize(node: HTMLElement) {
    let rect: DOMRectReadOnly;
    let target: Element;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        rect = entry.contentRect;
        target = entry.target;
      }

      node.dispatchEvent(new CustomEvent("resize", {
        detail: { rect, target },
      }) as ResizeEvent);
    });

    resizeObserver.observe(node);

    return {
      destroy: () => resizeObserver.disconnect(),
    };
  }
</script>

<div use:storyblokEditable={blok}>
  <FormField {id} {label} {required}>
    <textarea
      bind:this={textarea}
      {id}
      {name}
      class="p-2 bg-transparent w-full text-inherit h-auto outline-none"
      {cols}
      {disabled}
      {maxlength}
      {minlength}
      {placeholder}
      {readonly}
      {rows}
      {spellcheck}
      on:resize={handleResize}
      bind:value
      use:resize
    />
  </FormField>
</div>
