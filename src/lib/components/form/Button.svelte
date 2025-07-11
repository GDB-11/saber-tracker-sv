<!-- lib/components/form/Button.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import type { HTMLButtonAttributes } from 'svelte/elements';

	type ButtonVariant =
		| 'primary'
		| 'secondary'
		| 'success'
		| 'danger'
		| 'buy'
		| 'sell'
		| 'outline'
		| 'ghost'
		| 'premium';

	type ButtonSize = 'sm' | 'md' | 'lg';

	interface Props extends Omit<HTMLButtonAttributes, 'class' | 'type'> {
		children: Snippet;
		variant?: ButtonVariant;
		size?: ButtonSize;
		disabled?: boolean;
		loading?: boolean;
		type?: 'button' | 'submit' | 'reset';
		onclick?: (event: MouseEvent) => void;
		class?: string;
	}

	let {
		children,
		variant = 'primary',
		size = 'md',
		disabled = false,
		loading = false,
		type = 'button',
		onclick,
		class: className = '',
		...restProps
	}: Props = $props();

	const variants: Record<ButtonVariant, string> = {
		// Primary brand action - Dark cyan
		primary:
			'bg-primary-600 hover:bg-primary-700 text-white border-transparent focus:ring-primary-500',

		// Secondary action - Warm orange accent
		secondary:
			'bg-secondary-600 hover:bg-secondary-700 text-white border-transparent focus:ring-secondary-500',

		// Success/positive action - Green
		success:
			'bg-success-600 hover:bg-success-700 text-white border-transparent focus:ring-success-500',

		// Danger/negative action - Red
		danger: 'bg-danger-600 hover:bg-danger-700 text-white border-transparent focus:ring-danger-500',

		// Financial buy action - Enhanced green
		buy: 'bg-success-500 hover:bg-success-600 text-white border-transparent focus:ring-success-500 font-semibold',

		// Financial sell action - Enhanced red
		sell: 'bg-danger-500 hover:bg-danger-600 text-white border-transparent focus:ring-danger-500 font-semibold',

		// Outline variant with primary color
		outline:
			'bg-transparent hover:bg-primary-50 text-primary-600 border-primary-300 hover:border-primary-400 dark:hover:bg-primary-950 dark:text-primary-400 dark:border-primary-700 dark:hover:border-primary-600 focus:ring-primary-500',

		// Ghost variant - subtle hover
		ghost:
			'bg-transparent hover:bg-neutral-100 text-text-primary border-transparent dark:hover:bg-neutral-800 dark:text-text-primary focus:ring-primary-500',

		// Premium features - Purple accent
		premium:
			'bg-gradient-to-r from-purple-600 to-primary-600 hover:from-purple-700 hover:to-primary-700 text-white border-transparent focus:ring-purple-500 font-semibold'
	};

	const sizes: Record<ButtonSize, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	const baseClasses: string =
		'inline-flex items-center justify-center border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

	const borderRadius: string = 'rounded-[var(--radius-financial)]';

	const buttonClasses: string = `${baseClasses} ${borderRadius} ${variants[variant]} ${sizes[size]} ${className}`;
</script>

<button {type} {disabled} class={buttonClasses} {onclick} {...restProps}>
	{#if loading}
		<svg class="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
			<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
			></circle>
			<path
				class="opacity-75"
				fill="currentColor"
				d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
			></path>
		</svg>
	{/if}
	{@render children()}
</button>
