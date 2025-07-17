<!-- src\lib\components\form\Checkbox.svelte -->
<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';

	type CheckboxVariant = 'default' | 'success' | 'warning' | 'danger';

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
		variant?: CheckboxVariant;
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

	const checkboxId: string = id || `checkbox-${Math.random().toString(36).slice(2, 11)}`;
	const currentVariant: CheckboxVariant = error
		? 'danger'
		: warning
			? 'warning'
			: success
				? 'success'
				: variant;

	const baseClasses: string =
		'form-checkbox h-5 w-5 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed rounded-sm';

	const variantClasses: Record<CheckboxVariant, string> = {
		default:
			'text-cyan-600 focus:ring-cyan-500 border-gray-300 dark:text-cyan-400 dark:focus:ring-cyan-400 dark:border-gray-700 ',
		success:
			'text-green-600 focus:ring-green-500 border-green-400 dark:text-green-400 dark:focus:ring-green-400 dark:border-green-600',
		warning:
			'text-orange-600 focus:ring-orange-500 border-orange-400 dark:text-orange-400 dark:focus:ring-orange-400 dark:border-orange-600',
		danger:
			'text-red-600 focus:ring-red-500 border-red-400 dark:text-red-400 dark:focus:ring-red-400 dark:border-red-600'
	};

	const checkboxClasses: string = `${baseClasses} ${variantClasses[currentVariant]} ${className}`;
	const labelClasses: string = 'ml-2 text-sm font-medium text-gray-900 dark:text-gray-100';

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
	<label class="flex items-center" for={checkboxId}>
		<input
			type="checkbox"
			id={checkboxId}
			bind:checked
			{disabled}
			{required}
			class={checkboxClasses}
			{...restProps}
		/>
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
