<!-- src\lib\components\form\RadioGroup.svelte -->
<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    type RadioVariant = 'default' | 'success' | 'warning' | 'danger';

    interface Option {
        value: string | number;
        label: string;
        disabled?: boolean;
    }

    interface Props {
        options: Option[];
        value?: string | number;
        name?: string;
        label?: string;
        error?: string;
        warning?: string;
        success?: string;
        helpText?: string;
        disabled?: boolean;
        required?: boolean;
        id?: string;
        variant?: RadioVariant;
        class?: string;
    }

    let {
        options = [],
        value = $bindable(),
        name = '',
        label = '',
        error = '',
        warning = '',
        success = '',
        helpText = '',
        disabled = false,
        required = false,
        id = '',
        variant = 'default',
        class: className = '',
        ...restProps
    }: Props = $props();

    const groupId: string = id || `radiogroup-${Math.random().toString(36).slice(2, 11)}`;
    const currentVariant: RadioVariant = error ? 'danger' : warning ? 'warning' : success ? 'success' : variant;

    const baseClasses: string =
        'form-radio h-5 w-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantClasses: Record<RadioVariant, string> = {
        default: 'text-cyan-600 focus:ring-cyan-500 border-gray-300 dark:text-cyan-400 dark:focus:ring-cyan-400 dark:border-gray-700',
        success: 'text-green-600 focus:ring-green-500 border-green-400 dark:text-green-400 dark:focus:ring-green-400 dark:border-green-600',
        warning: 'text-orange-600 focus:ring-orange-500 border-orange-400 dark:text-orange-400 dark:focus:ring-orange-400 dark:border-orange-600',
        danger: 'text-red-600 focus:ring-red-500 border-red-400 dark:text-red-400 dark:focus:ring-red-400 dark:border-red-600'
    };

    const radioClasses: string = `${baseClasses} ${variantClasses[currentVariant]} ${className}`;
    const labelClasses: string = 'ml-2 text-sm font-medium text-gray-900 dark:text-gray-100';

    const groupLabelClasses: string = 'block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1';

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
        <label class={groupLabelClasses} for={groupId}>
            {label}
            {#if required}
                <span class={requiredClasses}>*</span>
            {/if}
        </label>
    {/if}

    <div id={groupId} role="radiogroup" class="flex flex-col gap-2">
        {#each options as option, i}
            <label class="flex items-center" for={`${groupId}-${i}`}>
                <input
                    type="radio"
                    id={`${groupId}-${i}`}
                    name={name || groupId}
                    value={option.value}
                    bind:group={value}
                    disabled={option.disabled || disabled}
                    {required}
                    class={radioClasses}
                    {...restProps}
                />
                <span class={labelClasses}>{option.label}</span>
            </label>
        {/each}
    </div>

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