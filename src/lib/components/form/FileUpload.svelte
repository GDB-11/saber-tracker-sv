<!-- src\lib\components\form\FileUpload.svelte -->
<script lang="ts">
    import type { HTMLInputAttributes } from 'svelte/elements';

    type FileUploadVariant = 'default' | 'success' | 'warning' | 'danger';

    interface Props extends Omit<HTMLInputAttributes, 'class'> {
        label?: string;
        error?: string;
        warning?: string;
        success?: string;
        helpText?: string;
        disabled?: boolean;
        required?: boolean;
        id?: string;
        variant?: FileUploadVariant;
        class?: string;
        accept?: string;
        multiple?: boolean;
    }

    let {
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
        accept = '',
        multiple = false,
        ...restProps
    }: Props = $props();

    const uploadId: string = id || `fileupload-${Math.random().toString(36).slice(2, 11)}`;
    const currentVariant: FileUploadVariant = error ? 'danger' : warning ? 'warning' : success ? 'success' : variant;

    const borderRadius: string = 'rounded-lg';

    const variantClasses: Record<FileUploadVariant, string> = {
        default: 'border-dashed border-2 border-cyan-600 bg-cyan-50 text-cyan-900 hover:bg-cyan-100 dark:border-cyan-900 dark:bg-cyan-950 dark:text-cyan-100 dark:hover:bg-cyan-900',
        success: 'border-dashed border-2 border-green-500 bg-green-50 text-green-900 hover:bg-green-100 dark:border-green-700 dark:bg-green-950 dark:text-green-100 dark:hover:bg-green-900',
        warning: 'border-dashed border-2 border-orange-500 bg-orange-50 text-orange-900 hover:bg-orange-100 dark:border-orange-700 dark:bg-orange-950 dark:text-orange-100 dark:hover:bg-orange-900',
        danger: 'border-dashed border-2 border-red-500 bg-red-50 text-red-900 hover:bg-red-100 dark:border-red-700 dark:bg-red-950 dark:text-red-100 dark:hover:bg-red-900'
    };

    const labelClasses: string = 'block text-sm font-medium text-gray-900 dark:text-gray-100 mb-1';
    const requiredClasses: string = 'text-red-500 ml-1';

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

    let dragActive = $state(false);
    let files: File[] = $state([]);

    function handleDragOver(event: DragEvent) {
        event.preventDefault();
        dragActive = true;
    }

    function handleDragLeave(event: DragEvent) {
        event.preventDefault();
        dragActive = false;
    }

    function handleDrop(event: DragEvent) {
        event.preventDefault();
        dragActive = false;
        if (event.dataTransfer?.files) {
            files = multiple ? Array.from(event.dataTransfer.files) : [event.dataTransfer.files[0]];
        }
    }

    function handleChange(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files) {
            files = multiple ? Array.from(input.files) : [input.files[0]];
        }
    }
</script>

<div class="space-y-1">
    {#if label}
        <label for={uploadId} class={labelClasses}>
            {label}
            {#if required}
                <span class={requiredClasses}>*</span>
            {/if}
        </label>
    {/if}

    <div
        role="button"
        aria-label="Upload files"
        class={`flex flex-col items-center justify-center cursor-pointer transition-colors duration-200 ${borderRadius} ${variantClasses[currentVariant]} ${dragActive ? 'ring-2 ring-cyan-500 dark:ring-cyan-400' : ''} ${className}`}
        style="min-height: 8rem;"
        tabindex="0"
        ondragover={handleDragOver}
        ondragleave={handleDragLeave}
        ondrop={handleDrop}
        onclick={() => document.getElementById(uploadId)?.click()}
        onkeydown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById(uploadId)?.click();
            }
        }}
    >
        <input
            id={uploadId}
            type="file"
            accept={accept}
            {multiple}
            {disabled}
            {required}
            class="hidden"
            onchange={handleChange}
            {...restProps}
        />
        <div class="flex flex-col items-center gap-2 pointer-events-none">
            <svg class="h-10 w-10 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 48 48">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 32v-8a8 8 0 0116 0v8M12 32h24M24 16v16" />
            </svg>
            <span class="font-semibold text-cyan-700 dark:text-cyan-300">Drag & drop files here</span>
            <span class="text-xs text-gray-500 dark:text-gray-400">or click to select files</span>
        </div>
        {#if files.length > 0}
            <ul class="mt-2 w-full px-4">
                {#each files as file}
                    <li class="flex items-center justify-between py-1 text-sm text-gray-900 dark:text-gray-100">
                        <span>{file.name}</span>
                        <span class="ml-2 text-xs text-gray-500 dark:text-gray-400">{Math.round(file.size / 1024)} KB</span>
                    </li>
                {/each}
            </ul>
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