<!-- src/lib/components/layout/Navigation.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { navigationStore } from '$lib/stores/navigation.svelte';
	import Topbar from './Topbar.svelte';
	import Sidebar from './Sidebar.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	onMount(() => {
		// Handle responsive behavior
		const handleResize = () => {
			const newIsMobile = window.innerWidth < 1024; // lg breakpoint
			navigationStore.updateMobileState(newIsMobile);

			if (newIsMobile && navigationStore.isOpen) {
				navigationStore.closeSidebar();
			} else if (!newIsMobile && !navigationStore.isOpen) {
				navigationStore.openSidebar();
			}
		};

		// Initial check
		handleResize();

		// Add event listener
		window.addEventListener('resize', handleResize);

		// Add some demo notifications for authenticated users
		setTimeout(() => {
			navigationStore.addNotification('Welcome to Saber Tracker!', 'info');
		}, 2000);

		// Cleanup
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	});
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
	<!-- Topbar -->
	<Topbar />

	<!-- Sidebar -->
	<Sidebar />

	<!-- Main Content -->
	<main
		class={`
      min-h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out
      ${navigationStore.isMobile ? 'ml-0' : navigationStore.isOpen ? 'ml-64' : 'ml-16'}
    `}
	>
		<div class="p-4 lg:p-6">
			{@render children()}
		</div>
	</main>
</div>
