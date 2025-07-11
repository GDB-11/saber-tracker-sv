<script lang="ts">
	import { toggleTheme, getIsDark } from "$lib/stores/theme.svelte";
	const isDark = getIsDark();
</script>

<button
	class="relative w-14 h-8 rounded-full border border-gray-300 dark:border-gray-700 bg-gray-200 dark:bg-gray-800 transition focus:outline-none"
	aria-label="Toggle light/dark mode"
	on:click={toggleTheme}
>
	<span class="absolute left-1 top-1 w-6 h-6 rounded-full flex items-center justify-center transition-transform duration-300"
		style={`transform: translateX(${isDark() ? '24px' : '0px'}); background: ${isDark() ? '#334155' : '#f1f5f9'};`}>
		{isDark() ? '🌙' : '☀️'}
	</span>
</button>
