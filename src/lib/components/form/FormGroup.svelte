<!-- src\lib\components\form\FormGroup.svelte -->
<script lang="ts">
    import type { Snippet } from 'svelte';
    import type { HTMLFieldsetAttributes } from 'svelte/elements';

    interface Props extends Omit<HTMLFieldsetAttributes, 'class'> {
        children: Snippet;
        legend?: string;
        label?: string;
        class?: string;
    }

    let {
        children,
        legend = '',
        label = '',
        class: className = '',
        ...restProps
    }: Props = $props();
</script>

<fieldset
    class={`border border-cyan-300 dark:border-cyan-700 rounded-md p-4 mb-4 ${className}`}
    {...restProps}
>
    {#if legend}
        <legend class="px-2 text-cyan-600 dark:text-cyan-300 font-semibold">{legend}</legend>
    {/if}
    {#if label}
        <div class="mb-2 text-gray-900 dark:text-gray-100 font-medium">{label}</div>
    {/if}
    <div class="space-y-2">
        {@render children()}
    </div>
</fieldset>