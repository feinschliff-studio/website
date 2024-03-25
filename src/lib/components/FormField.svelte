<script lang="ts">
  export let id: string;
  export let label: string;
  export let required: boolean;
</script>

<label
  class="group flex-grow flex flex-col bg-white shadow focus-within:shadow-lg focus-within:shadow-primary focus-within:ring focus-within:ring-secondary rounded-sm text-primary transition"
  for={id}
>
  <span class="block order-2 mt-1 text-secondary">
    <slot {required} />
  </span>
  <span
    class="order-1 text-primary mt-2 mx-2 font-normal pointer-events-none select-none group-focus-within:text-secondary transition {required ? `after:content-['*']` : 'content-none'} after:text-red-500"
    class:after:ml-0.5={required}
  >
    {label}
  </span>
</label>
