<!-- src\lib\components\form\Switch.svelte -->
<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    type SwitchVariant = 'default' | 'success' | 'warning' | 'danger';

    interface Props extends Omit<HTMLInputAttributes, 'class'> {
        checked?: boolean;
        label?: string;
        error?: string;
        warning?: string;
        success?: string;
        helpText?: string;
        disabled?: boolean;
        required?: boolean;
        id?: string;
        variant?: SwitchVariant;
        class?: string;
    }

    let {
        checked = $bindable(),
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

    const switchId: string = id || `switch-${Math.random().toString(36).slice(2, 11)}`;
    const currentVariant: SwitchVariant = error ? 'danger' : warning ? 'warning' : success ? 'success' : variant;

    const trackClasses: Record<SwitchVariant, string> = {
        default: 'bg-gray-300 dark:bg-gray-700',
        success: 'bg-green-400 dark:bg-green-600',
        warning: 'bg-orange-400 dark:bg-orange-600',
        danger: 'bg-red-400 dark:bg-red-600'
    };

    const checkedTrackClasses: Record<SwitchVariant, string> = {
        default: 'bg-cyan-600 dark:bg-cyan-900',
        success: 'bg-green-600 dark:bg-green-700',
        warning: 'bg-orange-600 dark:bg-orange-700',
        danger: 'bg-red-600 dark:bg-red-700'
    };

    const thumbClasses: string = 'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition duration-200';

    const labelClasses: string = 'ml-3 text-sm font-medium text-gray-900 dark:text-gray-100';

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
    <label class="flex items-center cursor-pointer" for={switchId}>
        <input
            type="checkbox"
            id={switchId}
            bind:checked
            {disabled}
            {required}
            class="sr-only"
            {...restProps}
        />
        <span
            class={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ease-in-out
                ${checked ? checkedTrackClasses[currentVariant] : trackClasses[currentVariant]} ${className}`}
        >
            <span
                class={`${thumbClasses} ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            ></span>
        </span>
        {#if label}
            <span class={labelClasses}>
                {label}
                {#if required}
                    <span class={requiredClasses}>*</span>
                {/if}
            </span>
        {/if}
    </label>

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