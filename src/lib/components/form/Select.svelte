<!-- src\lib\components\form\Select.svelte -->
<script lang="ts">
    import type { HTMLSelectAttributes } from 'svelte/elements';

    type SelectVariant = 'default' | 'success' | 'warning' | 'danger';
    type SelectSize = 'sm' | 'md' | 'lg';

    interface Option {
        value: string | number;
        label: string;
        disabled?: boolean;
    }

    interface Props extends Omit<HTMLSelectAttributes, 'class' | 'size'> {
        options: Option[];
        value?: string | number;
        label?: string;
        error?: string;
        warning?: string;
        success?: string;
        helpText?: string;
        disabled?: boolean;
        required?: boolean;
        id?: string;
        size?: SelectSize;
        variant?: SelectVariant;
        class?: string;
        placeholder?: string;
    }

    let {
        options = [],
        value = $bindable(),
        label = '',
        error = '',
        warning = '',
        success = '',
        helpText = '',
        disabled = false,
        required = false,
        id = '',
        size = 'md',
        variant = 'default',
        class: className = '',
        placeholder = '',
        ...restProps
    }: Props = $props();

    const selectId: string = id || `select-${Math.random().toString(36).slice(2, 11)}`;
    const currentVariant: SelectVariant = error ? 'danger' : warning ? 'warning' : success ? 'success' : variant;

    const baseClasses: string =
        'w-full border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed bg-white dark:bg-gray-900 placeholder:text-gray-400';

    const sizeClasses: Record<SelectSize, string> = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    const variantClasses: Record<SelectVariant, string> = {
        default: 'border-gray-300 text-gray-900 focus:ring-cyan-500 focus:border-cyan-600 dark:text-gray-100 dark:border-gray-700 dark:focus:ring-cyan-400',
        success: 'border-green-400 text-green-900 focus:ring-green-500 focus:border-green-600 dark:text-green-100 dark:border-green-600',
        warning: 'border-orange-400 text-orange-900 focus:ring-orange-500 focus:border-orange-600 dark:text-orange-100 dark:border-orange-600',
        danger: 'border-red-400 text-red-900 focus:ring-red-500 focus:border-red-600 dark:text-red-100 dark:border-red-600'
    };

    const borderRadius: string = 'rounded-lg';
    const selectClasses: string = `${baseClasses} ${borderRadius} ${sizeClasses[size]} ${variantClasses[currentVariant]} ${className}`;
    const labelClasses: string = 'block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1';

    const getMessageClasses = (messageType: 'error' | 'warning' | 'success' | 'help'): string => {
        const baseMessageClasses = 'text-sm mt-1';
        switch (messageType) {
            case 'error':
                return `${baseMessageClasses} text-red-600 dark:text-red-400`;
            case 'warning':
                return `${baseMessageClasses} text-orange-600 dark:text-orange-400`;
            case 'success':
                return `${baseMessageClasses} text-green-600 dark:text-green-400`;
            case 'help':
                return `${baseMessageClasses} text-gray-500 dark:text-gray-400`;
            default:
                return baseMessageClasses;
        }
    };

    const requiredClasses: string = 'text-red-500 ml-1';
</script>

<div class="space-y-1">
    {#if label}
        <label for={selectId} class={labelClasses}>
            {label}
            {#if required}
                <span class={requiredClasses}>*</span>
            {/if}
        </label>
    {/if}

    <select
        id={selectId}
        bind:value
        {disabled}
        {required}
        class={selectClasses}
        {...restProps}
    >
        {#if placeholder}
            <option value="" disabled selected hidden>{placeholder}</option>
        {/if}
        {#each options as option}
            <option value={option.value} disabled={option.disabled}>
                {option.label}
            </option>
        {/each}
    </select>

    {#if error}
        <p class={getMessageClasses('error')}>
            {error}
        </p>
    {:else if warning}
        <p class={getMessageClasses('warning')}>
            {warning}
        </p>
    {:else if success}
        <p class={getMessageClasses('success')}>
            {success}
        </p>
    {:else if helpText}
        <p class={getMessageClasses('help')}>
            {helpText}
        </p>
    {/if}
</div>