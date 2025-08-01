<!-- src/lib/components/layout/AuthenticatedLayout.svelte -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { getLoggedIn, getCurrentUser, initializeAuth } from '$lib/stores/user.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
	import Navigation from './Navigation.svelte';
	import Loading from '$lib/components/ui/Loading.svelte';

	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	let isLoading = $state(true);
	let isAuthenticated = $state(false);

	onMount(() => {
		// Initialize auth state from localStorage
		initializeAuth();

		// Initialize theme listener
		const themeCleanup = themeStore.initializeSystemThemeListener();

		// Check authentication status
		const checkAuth = () => {
			const loggedIn = getLoggedIn();
			const currentUser = getCurrentUser();

			isAuthenticated = loggedIn && currentUser !== null;
			isLoading = false;

			// Redirect to login if not authenticated and not already on login page
			if (!isAuthenticated && !page.url.pathname.startsWith('/login')) {
				goto('/login', { replaceState: true });
			}
		};

		// Give a small delay to ensure localStorage is read properly
		setTimeout(() => {
			checkAuth();
		}, 100);

		return () => {
			themeCleanup();
		};
	});

	// Reactive check for authentication changes
	$effect(() => {
		if (!isLoading) {
			const loggedIn = getLoggedIn();
			const currentUser = getCurrentUser();

			if (!loggedIn || !currentUser) {
				isAuthenticated = false;
				if (!page.url.pathname.startsWith('/login')) {
					goto('/login', { replaceState: true });
				}
			} else {
				isAuthenticated = true;
			}
		}
	});
</script>

{#if isLoading}
	<!-- Loading state while checking authentication -->
	<div class="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
		<div class="text-center">
			<Loading size="large" text="Loading..." color="primary" />
		</div>
	</div>
{:else if isAuthenticated}
	<!-- Show navigation for authenticated users -->
	<Navigation>
		{@render children()}
	</Navigation>
{:else}
	<!-- Show basic layout for login/signup pages -->
	<div class="min-h-screen bg-gray-50 dark:bg-gray-950">
		{@render children()}
	</div>
{/if}
