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
			'bg-cyan-600 hover:bg-cyan-700 text-white border-transparent focus:ring-cyan-500 dark:bg-cyan-900 dark:hover:bg-cyan-800 dark:text-white',

		// Secondary action - Warm orange accent
		secondary:
			'bg-orange-600 hover:bg-orange-700 text-white border-transparent focus:ring-orange-500 dark:bg-orange-700 dark:hover:bg-orange-600 dark:text-white',

		// Success/positive action - Green
		success:
			'bg-green-600 hover:bg-green-700 text-white border-transparent focus:ring-green-500 dark:bg-green-700 dark:hover:bg-green-600 dark:text-white',

		// Danger/negative action - Red
		danger:
			'bg-red-600 hover:bg-red-700 text-white border-transparent focus:ring-red-500 dark:bg-red-700 dark:hover:bg-red-600 dark:text-white',

		// Financial buy action - Enhanced green
		buy:
			'bg-green-500 hover:bg-green-600 text-white border-transparent focus:ring-green-500 font-semibold dark:bg-green-600 dark:hover:bg-green-500 dark:text-white',

		// Financial sell action - Enhanced red
		sell:
			'bg-red-500 hover:bg-red-600 text-white border-transparent focus:ring-red-500 font-semibold dark:bg-red-600 dark:hover:bg-red-500 dark:text-white',

		// Outline variant with primary color
		outline:
			'bg-transparent text-cyan-600 border-cyan-300 hover:bg-cyan-50 hover:border-cyan-400 focus:ring-cyan-500 dark:bg-transparent dark:text-cyan-300 dark:border-cyan-700 dark:hover:bg-cyan-950 dark:hover:border-cyan-600',

		// Ghost variant - subtle hover
		ghost:
			'bg-transparent text-gray-900 hover:bg-gray-100 border-transparent focus:ring-cyan-500 dark:bg-transparent dark:text-gray-100 dark:hover:bg-gray-900',

		// Premium features - Purple accent
		premium:
			'bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white border-transparent focus:ring-purple-500 font-semibold dark:bg-gradient-to-r dark:from-purple-700 dark:to-cyan-900 dark:hover:from-purple-800 dark:hover:to-cyan-800 dark:text-white'
	};

	const sizes: Record<ButtonSize, string> = {
		sm: 'px-3 py-1.5 text-sm',
		md: 'px-4 py-2 text-sm',
		lg: 'px-6 py-3 text-base'
	};

	const baseClasses: string =
		'inline-flex items-center justify-center border font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

	const borderRadius: string = 'rounded-lg';

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
