<!-- src\lib\components\form\Slider.svelte -->
<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    type SliderVariant = 'default' | 'success' | 'warning' | 'danger';

    interface Props extends Omit<HTMLInputAttributes, 'class'> {
        value?: number;
        min?: number;
        max?: number;
        step?: number;
        label?: string;
        error?: string;
        warning?: string;
        success?: string;
        helpText?: string;
        disabled?: boolean;
        required?: boolean;
        id?: string;
        variant?: SliderVariant;
        class?: string;
    }

    let {
        value = $bindable(),
        min = 0,
        max = 100,
        step = 1,
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

    const sliderId: string = id || `slider-${Math.random().toString(36).slice(2, 11)}`;
    const currentVariant: SliderVariant = error ? 'danger' : warning ? 'warning' : success ? 'success' : variant;

    const trackClasses: Record<SliderVariant, string> = {
        default: 'accent-cyan-600 dark:accent-cyan-900',
        success: 'accent-green-600 dark:accent-green-700',
        warning: 'accent-orange-600 dark:accent-orange-700',
        danger: 'accent-red-600 dark:accent-red-700'
    };

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
        <label for={sliderId} class={labelClasses}>
            {label}
            {#if required}
                <span class={requiredClasses}>*</span>
            {/if}
        </label>
    {/if}

    <div class="flex items-center gap-3">
        <input
            type="range"
            id={sliderId}
            bind:value
            min={min}
            max={max}
            step={step}
            {disabled}
            {required}
            class={`w-full h-2 rounded-lg outline-none transition-all duration-200 ${trackClasses[currentVariant]} ${className}`}
            {...restProps}
        />
        <span class="text-sm text-gray-900 dark:text-gray-100 font-medium w-12 text-right">{value}</span>
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