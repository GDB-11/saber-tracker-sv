<!-- src/lib/components/ui/LightDarkModeToggle.svelte -->
<script lang="ts">
	import { themeStore } from '$lib/stores/theme.svelte';

	// Optional props for customization
	interface Props {
		size?: 'sm' | 'md' | 'lg';
		showIcons?: boolean;
		class?: string;
	}

	let { size = 'md', showIcons = true, class: className = '' }: Props = $props();

	// Size variants
	const sizeClasses = {
		sm: {
			container: 'w-11 h-6',
			button: 'w-4 h-4',
			translate: 'translate-x-5',
			icon: 'w-3 h-3'
		},
		md: {
			container: 'w-14 h-7',
			button: 'w-5 h-5',
			translate: 'translate-x-7',
			icon: 'w-4 h-4'
		},
		lg: {
			container: 'w-16 h-8',
			button: 'w-6 h-6',
			translate: 'translate-x-8',
			icon: 'w-5 h-5'
		}
	};

	const currentSize = $derived(sizeClasses[size]);
</script>

<button
	onclick={themeStore.toggle}
	class={`
    relative inline-flex items-center rounded-full
    transition-all duration-300 ease-in-out
    focus:ring-2 focus:ring-offset-2 focus:outline-none
	cursor-pointer
    ${currentSize.container}
    ${themeStore.isDark ? 'bg-cyan-900 focus:ring-cyan-800' : 'bg-cyan-600 focus:ring-cyan-300'}
    ${className}
  `}
	aria-label="Toggle theme"
	aria-pressed={themeStore.isDark}
>
	<!-- Background gradient overlay -->
	<div
		class={`
      absolute inset-0 rounded-full transition-opacity duration-300
      ${
				themeStore.isDark
					? 'bg-gradient-to-r from-cyan-900 to-slate-800 opacity-100'
					: 'bg-gradient-to-r from-cyan-500 to-cyan-700 opacity-100'
			}
    `}
	></div>

	<!-- Toggle button -->
	<div
		class={`
      relative inline-block transform
      rounded-full shadow-lg transition-all duration-300
      ease-in-out
      ${currentSize.button}
      ${themeStore.isDark ? `${currentSize.translate} bg-cyan-100` : 'translate-x-1 bg-white'}
    `}
	>
		{#if showIcons}
			<!-- Sun icon (light mode) -->
			<div
				class={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${currentSize.icon}
          ${themeStore.isDark ? 'scale-50 rotate-180 opacity-0' : 'scale-100 rotate-0 opacity-100'}
        `}
			>
				<svg class="h-full w-full text-cyan-600" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
						clip-rule="evenodd"
					/>
				</svg>
			</div>

			<!-- Moon icon (dark mode) -->
			<div
				class={`
          absolute inset-0 flex items-center justify-center
          transition-all duration-300 ease-in-out
          ${currentSize.icon}
          ${themeStore.isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-50 -rotate-180 opacity-0'}
        `}
			>
				<svg class="h-full w-full text-cyan-800" fill="currentColor" viewBox="0 0 20 20">
					<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
				</svg>
			</div>
		{/if}
	</div>

	<!-- Subtle glow effect -->
	<div
		class={`
      absolute inset-0 rounded-full transition-all duration-300
      ${themeStore.isDark ? 'shadow-inner shadow-cyan-900/30' : 'shadow-inner shadow-cyan-800/20'}
    `}
	></div>
</button>

<style>
	/* Custom focus styles for better accessibility */
	button:focus-visible {
		outline: 2px solid currentColor;
		outline-offset: 2px;
	}
</style>
