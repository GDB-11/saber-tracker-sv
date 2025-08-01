<!-- src/lib/components/ui/Loading.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'spinner' | 'dots' | 'pulse' | 'bars';
		size?: 'small' | 'medium' | 'large';
		color?: 'primary' | 'secondary' | 'success' | 'danger' | 'white' | 'gray';
		centered?: boolean;
		overlay?: boolean;
		text?: string;
		class?: string;
		children?: Snippet;
	}

	let {
		variant = 'spinner',
		size = 'medium',
		color = 'primary',
		centered = false,
		overlay = false,
		text,
		class: className = '',
		children
	}: Props = $props();

	const sizeClasses = {
		small: 'w-4 h-4',
		medium: 'w-6 h-6',
		large: 'w-8 h-8'
	};

	const colorClasses = {
		primary: 'text-cyan-600 dark:text-cyan-400',
		secondary: 'text-orange-600 dark:text-orange-400',
		success: 'text-green-600 dark:text-green-400',
		danger: 'text-red-600 dark:text-red-400',
		white: 'text-white',
		gray: 'text-gray-500 dark:text-gray-400'
	};

	const textSizeClasses = {
		small: 'text-sm',
		medium: 'text-base',
		large: 'text-lg'
	};

	const containerClasses = $derived(
		`
    ${centered ? 'flex items-center justify-center' : 'inline-flex items-center'}
    ${overlay ? 'fixed inset-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-50' : ''}
    ${className}
  `
			.trim()
			.replace(/\s+/g, ' ')
	);
</script>

<div class={containerClasses}>
	<div class="flex flex-col items-center gap-3">
		<!-- Spinner Variant -->
		{#if variant === 'spinner'}
			<svg
				class={`animate-spin ${sizeClasses[size]} ${colorClasses[color]}`}
				fill="none"
				viewBox="0 0 24 24"
			>
				<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"
				></circle>
				<path
					class="opacity-75"
					fill="currentColor"
					d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
				></path>
			</svg>

			<!-- Dots Variant -->
		{:else if variant === 'dots'}
			<div class="flex space-x-1">
				{#each [0, 1, 2] as i}
					<div
						class={`rounded-full bg-current ${size === 'small' ? 'h-1 w-1' : size === 'medium' ? 'h-2 w-2' : 'h-3 w-3'} ${colorClasses[color]} animate-pulse`}
						style={`animation-delay: ${i * 0.2}s`}
					></div>
				{/each}
			</div>

			<!-- Pulse Variant -->
		{:else if variant === 'pulse'}
			<div
				class={`rounded-full bg-current ${sizeClasses[size]} ${colorClasses[color]} animate-pulse`}
			></div>

			<!-- Bars Variant -->
		{:else if variant === 'bars'}
			<div class="flex space-x-1">
				{#each [0, 1, 2, 3] as i}
					<div
						class={`bg-current ${size === 'small' ? 'h-4 w-1' : size === 'medium' ? 'h-6 w-1' : 'h-8 w-2'} ${colorClasses[color]} animate-pulse`}
						style={`animation-delay: ${i * 0.15}s; animation-duration: 1s;`}
					></div>
				{/each}
			</div>
		{/if}

		<!-- Text or Custom Content -->
		{#if text}
			<p class={`font-medium ${textSizeClasses[size]} ${colorClasses[color]}`}>
				{text}
			</p>
		{:else if children}
			<div class={`${textSizeClasses[size]} ${colorClasses[color]}`}>
				{@render children()}
			</div>
		{/if}
	</div>
</div>

<style>
	@keyframes pulse {
		0%,
		80%,
		100% {
			transform: scale(0);
			opacity: 0.5;
		}
		40% {
			transform: scale(1);
			opacity: 1;
		}
	}

	.animate-pulse {
		animation: pulse 1.5s ease-in-out infinite;
	}
</style>
