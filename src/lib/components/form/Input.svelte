<!-- lib/components/form/Input.svelte -->
<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    type InputVariant = 'default' | 'success' | 'warning' | 'danger';
    type InputSize = 'sm' | 'md' | 'lg';

    interface Props extends Omit<HTMLInputAttributes, 'class' | 'size'> {
        value?: string | number;
        type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
        placeholder?: string;
        label?: string;
        error?: string;
        warning?: string;
        success?: string;
        helpText?: string;
        disabled?: boolean;
        required?: boolean;
        id?: string;
        size?: InputSize;
        variant?: InputVariant;
        class?: string;
        currency?: boolean;
        percentage?: boolean;
        prefix?: string;
        suffix?: string;
    }

    let {
        value = $bindable(),
        type = 'text',
        placeholder = '',
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
        currency = false,
        percentage = false,
        prefix = '',
        suffix = '',
        ...restProps
    }: Props = $props();

    const inputId: string = id || `input-${Math.random().toString(36).slice(2, 11)}`;
    const currentVariant: InputVariant = error ? 'danger' : warning ? 'warning' : success ? 'success' : variant;
    const finalPrefix: string = currency ? '$' : prefix;
    const finalSuffix: string = percentage ? '%' : suffix;

    // Standard Tailwind palette only
    const baseClasses: string =
        'w-full border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-gray-400';

    const sizeClasses: Record<InputSize, string> = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-4 py-2 text-sm',
        lg: 'px-4 py-3 text-base'
    };

    const variantClasses: Record<InputVariant, string> = {
        default: 'border-gray-300 bg-white text-gray-900 focus:ring-cyan-500 focus:border-cyan-600 dark:bg-gray-900 dark:text-gray-100 dark:border-gray-700 dark:focus:ring-cyan-400',
        success: 'border-green-400 bg-green-50 text-green-900 focus:ring-green-500 focus:border-green-600 dark:bg-green-950 dark:text-green-100 dark:border-green-600',
        warning: 'border-orange-400 bg-orange-50 text-orange-900 focus:ring-orange-500 focus:border-orange-600 dark:bg-orange-950 dark:text-orange-100 dark:border-orange-600',
        danger: 'border-red-400 bg-red-50 text-red-900 focus:ring-red-500 focus:border-red-600 dark:bg-red-950 dark:text-red-100 dark:border-red-600'
    };

    const borderRadius: string = 'rounded-lg';

    const inputClasses: string = `${baseClasses} ${borderRadius} ${sizeClasses[size]} ${variantClasses[currentVariant]} ${className}`;

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
    const prefixSuffixClasses: string = 'text-gray-500 dark:text-gray-400 font-medium';
</script>

<div class="space-y-1">
    {#if label}
        <label for={inputId} class={labelClasses}>
            {label}
            {#if required}
                <span class={requiredClasses}>*</span>
            {/if}
        </label>
    {/if}

    <div class="relative">
        {#if finalPrefix}
            <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span class={prefixSuffixClasses}>{finalPrefix}</span>
            </div>
        {/if}

        <input
            {type}
            id={inputId}
            bind:value
            {placeholder}
            {disabled}
            {required}
            class={inputClasses}
            style={finalPrefix ? 'padding-left: 2rem;' : finalSuffix ? 'padding-right: 2rem;' : ''}
            {...restProps}
        />

        {#if finalSuffix}
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <span class={prefixSuffixClasses}>{finalSuffix}</span>
            </div>
        {/if}

        {#if currentVariant === 'success'}
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
            </div>
        {:else if currentVariant === 'warning'}
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="h-4 w-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
            </div>
        {:else if currentVariant === 'danger'}
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg class="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </div>
        {/if}
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