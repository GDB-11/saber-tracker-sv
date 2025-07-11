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
		// Financial-specific props
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

	// Generate unique ID if not provided
	const inputId: string = id || `input-${Math.random().toString(36).slice(2, 11)}`;
	
	// Determine the current state
	const currentVariant: InputVariant = error ? 'danger' : warning ? 'warning' : success ? 'success' : variant;
	
	// Set prefix/suffix for financial inputs
	const finalPrefix: string = currency ? '$' : prefix;
	const finalSuffix: string = percentage ? '%' : suffix;

	// Base input classes using financial design tokens
	const baseClasses: string = 
		'w-full border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed placeholder:text-text-tertiary';

	// Size variants
	const sizeClasses: Record<InputSize, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-4 py-3 text-base'
	};

	// Variant classes using the financial palette
	const variantClasses: Record<InputVariant, string> = {
		default: 'border-border bg-input text-text-primary focus:ring-primary-500 focus:border-primary-600 dark:focus:ring-primary-400',
		success: 'border-success-400 bg-success-50 text-success-900 focus:ring-success-500 focus:border-success-600 dark:bg-success-950 dark:text-success-100 dark:border-success-600',
		warning: 'border-warning-400 bg-warning-50 text-warning-900 focus:ring-warning-500 focus:border-warning-600 dark:bg-warning-950 dark:text-warning-100 dark:border-warning-600',
		danger: 'border-danger-400 bg-danger-50 text-danger-900 focus:ring-danger-500 focus:border-danger-600 dark:bg-danger-950 dark:text-danger-100 dark:border-danger-600'
	};

	// Use financial border radius
	const borderRadius: string = 'rounded-[var(--radius-financial)]';

	// Combine all classes
	const inputClasses: string = `${baseClasses} ${borderRadius} ${sizeClasses[size]} ${variantClasses[currentVariant]} ${className}`;

	// Label classes
	const labelClasses: string = 'block text-sm font-medium text-text-primary mb-1';

	// Message classes based on state
	const getMessageClasses = (messageType: 'error' | 'warning' | 'success' | 'help'): string => {
		const baseMessageClasses = 'text-sm mt-1';
		switch (messageType) {
			case 'error':
				return `${baseMessageClasses} text-danger-600 dark:text-danger-400`;
			case 'warning':
				return `${baseMessageClasses} text-warning-600 dark:text-warning-400`;
			case 'success':
				return `${baseMessageClasses} text-success-600 dark:text-success-400`;
			case 'help':
				return `${baseMessageClasses} text-text-secondary`;
			default:
				return baseMessageClasses;
		}
	};

	// Required indicator classes
	const requiredClasses: string = 'text-danger-500 ml-1';
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
		<!-- Prefix -->
		{#if finalPrefix}
			<div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
				<span class="text-text-secondary font-medium">{finalPrefix}</span>
			</div>
		{/if}
		
		<!-- Input field -->
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
		
		<!-- Suffix -->
		{#if finalSuffix}
			<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
				<span class="text-text-secondary font-medium">{finalSuffix}</span>
			</div>
		{/if}
		
		<!-- State icons -->
		{#if currentVariant === 'success'}
			<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
				<svg class="h-4 w-4 text-success-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			</div>
		{:else if currentVariant === 'warning'}
			<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
				<svg class="h-4 w-4 text-warning-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
				</svg>
			</div>
		{:else if currentVariant === 'danger'}
			<div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
				<svg class="h-4 w-4 text-danger-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
				</svg>
			</div>
		{/if}
	</div>
	
	<!-- Messages -->
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