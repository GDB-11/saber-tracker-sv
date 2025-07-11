<script lang="ts">
	import LightDarkModeToggle from "$lib/components/ui/LightDarkModeToggle.svelte";
	import { getIsDark } from "$lib/stores/theme.svelte";
    
	const isDark = getIsDark();
</script>

<nav class={`fixed top-0 right-0 m-4 z-50 rounded-lg shadow transition-colors duration-300 ${isDark() ? 'bg-gray-800' : 'bg-white'} ${isDark() ? 'border border-gray-700' : 'border border-gray-200'} p-2 flex items-center justify-end w-auto max-w-xs sm:max-w-sm md:max-w-md`}>
	<LightDarkModeToggle />
</nav>

<div class={`min-h-screen transition-colors duration-300 ${isDark() ? 'bg-gray-900' : 'bg-white'}`}> 
    <slot />
</div>