<script lang="ts">
  import FormField from "$lib/components/FormField.svelte";
  import type { TextFieldStoryblok } from "$storyblok/components";
  import { storyblokEditable } from "@storyblok/svelte";

  export let blok: TextFieldStoryblok;
  let maxlength = blok.maxlength ? Number(blok.maxlength) : undefined;
  let minlength = blok.minlength ? Number(blok.minlength) : undefined;
  let label = blok.label;
  let required =false;// blok.required || false;
  let type = blok.type;
  let name = blok.name;
  let pattern = blok.pattern || undefined;
  let size = blok.size ? Number(blok.size) : undefined;
  let id = blok._uid;
  let value = blok.value || "";
  let disabled = blok.disabled || false;
  let readonly = blok.readonly || false;
  let autocomplete = blok.autocomplete;
  let autofocus = blok.autofocus || false;
  let autocapitalize = blok.autocapitalize ? "words" : "sentences";
  let placeholder = blok.placeholder || "";
  let spellcheck = blok.spellcheck || undefined;
</script>

<div use:storyblokEditable={blok}>
  <FormField {id} {label} {required}>
    <!-- svelte-ignore a11y-autofocus -->
    <input {id}
           {name}
           class="p-2 bg-transparent w-full text-inherit outline-none placeholder:select-none focus-within:placeholder-transparent placeholder:transition placeholder:text-secondary/40"
           {autocapitalize}
           {autocomplete}
           {autofocus}
           {disabled}
           {maxlength}
           {minlength}
           {pattern}
           {placeholder}
           {readonly}
           {required}
           {size}
           {spellcheck}
           {type}
           {value} />
  </FormField>
</div>
