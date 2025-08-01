<!-- src/lib/components/layout/Topbar.svelte -->
<script lang="ts">
	import { navigationStore } from '$lib/stores/navigation.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
	import { user, logout, getCurrentUser, getLoggedIn } from '$lib/stores/user.svelte';
	import MenuIcon from '$lib/components/svg/MenuIcon.svelte';
	import SearchIcon from '$lib/components/svg/SearchIcon.svelte';
	import BellIcon from '$lib/components/svg/BellIcon.svelte';
	import ChevronDownIcon from '$lib/components/svg/ChevronDownIcon.svelte';
	import XIcon from '$lib/components/svg/XIcon.svelte';

	let showPortfolioDropdown = $state(false);
	let showNotifications = $state(false);
	let showUserMenu = $state(false);

	const togglePortfolioDropdown = () => {
		showPortfolioDropdown = !showPortfolioDropdown;
		showNotifications = false;
		showUserMenu = false;
	};

	const toggleNotifications = () => {
		showNotifications = !showNotifications;
		showPortfolioDropdown = false;
		showUserMenu = false;
	};

	const toggleUserMenu = () => {
		showUserMenu = !showUserMenu;
		showPortfolioDropdown = false;
		showNotifications = false;
	};

	const selectPortfolio = (portfolio: any) => {
		navigationStore.selectPortfolio(portfolio);
		showPortfolioDropdown = false;
	};

	const handleSearchKeydown = (event: KeyboardEvent) => {
		if (event.key === 'Escape') {
			navigationStore.toggleSearch();
		}
	};

	const handleOutsideClick = (event: MouseEvent) => {
		const target = event.target as HTMLElement;
		if (!target.closest('.dropdown-container')) {
			showPortfolioDropdown = false;
			showNotifications = false;
			showUserMenu = false;
		}
	};

	const formatCurrency = (value: number, currency: string) => {
		return new Intl.NumberFormat('en-US', {
			style: 'currency',
			currency: currency,
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(value);
	};
</script>

<svelte:window onclick={handleOutsideClick} />

<header
	class="sticky top-0 z-40 border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
>
	<div class="flex h-16 items-center justify-between px-4 lg:px-6">
		<!-- Left side: Menu toggle + Logo + Portfolio selector -->
		<div class="flex items-center space-x-4">
			<!-- Mobile menu toggle -->
			<button
				type="button"
				onclick={navigationStore.toggleSidebar}
				class="rounded-md p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
				aria-label="Toggle sidebar"
			>
				<MenuIcon class="h-6 w-6" />
			</button>

			<!-- Desktop sidebar toggle -->
			<button
				type="button"
				onclick={navigationStore.toggleSidebar}
				class="hidden rounded-md p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 lg:block dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
				aria-label="Toggle sidebar"
			>
				<MenuIcon class="h-5 w-5" />
			</button>

			<!-- Logo -->
			<div class="flex items-center space-x-3">
				<h1 class="hidden text-xl font-bold text-gray-900 sm:block dark:text-white">
					Saber Tracker
				</h1>
			</div>

			<!-- Portfolio Selector -->
			<div class="dropdown-container relative hidden md:block">
				<button
					type="button"
					onclick={togglePortfolioDropdown}
					class="flex items-center space-x-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
				>
					<div class="text-left">
						<div class="text-sm font-medium text-gray-900 dark:text-white">
							{navigationStore.activePortfolio?.name || 'All Portfolios'}
						</div>
						{#if navigationStore.activePortfolio}
							<div class="text-xs text-gray-500 dark:text-gray-400">
								{formatCurrency(
									navigationStore.activePortfolio.value,
									navigationStore.activePortfolio.currency
								)}
							</div>
						{/if}
					</div>
					<ChevronDownIcon class="h-4 w-4 text-gray-500 dark:text-gray-400" />
				</button>

				<!-- Portfolio Dropdown -->
				{#if showPortfolioDropdown}
					<div
						class="absolute top-full left-0 z-50 mt-2 w-64 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
					>
						<div class="p-2">
							<button
								type="button"
								onclick={() => selectPortfolio(null)}
								class="w-full rounded-md px-3 py-2 text-left transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
							>
								<div class="font-medium text-gray-900 dark:text-white">All Portfolios</div>
								<div class="text-sm text-gray-500 dark:text-gray-400">View combined data</div>
							</button>
							<hr class="my-2 border-gray-200 dark:border-gray-700" />
							{#each navigationStore.portfolios as portfolio}
								<button
									type="button"
									onclick={() => selectPortfolio(portfolio)}
									class="w-full rounded-md px-3 py-2 text-left transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
								>
									<div class="font-medium text-gray-900 dark:text-white">{portfolio.name}</div>
									<div class="text-sm text-gray-500 dark:text-gray-400">
										{formatCurrency(portfolio.value, portfolio.currency)}
									</div>
								</button>
							{/each}
						</div>
					</div>
				{/if}
			</div>
		</div>

		<!-- Center: Search -->
		<div class="mx-4 max-w-md flex-1">
			{#if navigationStore.searchOpen}
				<div class="relative">
					<input
						id="global-search"
						type="text"
						placeholder="Search transactions, tokens, addresses..."
						bind:value={navigationStore.searchQuery}
						onkeydown={handleSearchKeydown}
						class="w-full rounded-lg border border-gray-300 bg-white py-2 pr-10 pl-10 text-gray-900 placeholder-gray-500 focus:border-transparent focus:ring-2 focus:ring-cyan-500 focus:outline-none dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder-gray-400 dark:focus:ring-cyan-400"
					/>
					<SearchIcon
						class="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 transform text-gray-400"
					/>
					<button
						type="button"
						onclick={navigationStore.toggleSearch}
						class="absolute top-1/2 right-3 -translate-y-1/2 transform text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
					>
						<XIcon class="h-5 w-5" />
					</button>
				</div>
			{:else}
				<button
					type="button"
					onclick={navigationStore.toggleSearch}
					class="flex w-full items-center space-x-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 transition-colors duration-200 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
				>
					<SearchIcon class="h-5 w-5 text-gray-400" />
					<span class="text-sm text-gray-500 dark:text-gray-400">Search...</span>
				</button>
			{/if}
		</div>

		<!-- Right side: Notifications + Theme toggle + User menu -->
		<div class="flex items-center space-x-3">
			<!-- Notifications -->
			<div class="dropdown-container relative">
				<button
					type="button"
					onclick={toggleNotifications}
					class="relative rounded-md p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
				>
					<BellIcon class="h-6 w-6" />
					{#if navigationStore.unreadCount() > 0}
						<span
							class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-medium text-white"
						>
							{navigationStore.unreadCount() > 9 ? '9+' : navigationStore.unreadCount}
						</span>
					{/if}
				</button>

				<!-- Notifications Dropdown -->
				{#if showNotifications}
					<div
						class="absolute top-full right-0 z-50 mt-2 w-80 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
					>
						<div class="border-b border-gray-200 p-4 dark:border-gray-700">
							<div class="flex items-center justify-between">
								<h3 class="text-lg font-semibold text-gray-900 dark:text-white">Notifications</h3>
								{#if navigationStore.unreadCount() > 0}
									<button
										type="button"
										onclick={navigationStore.clearAllNotifications}
										class="text-sm text-cyan-600 hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
									>
										Clear all
									</button>
								{/if}
							</div>
						</div>
						<div class="max-h-64 overflow-y-auto">
							{#if navigationStore.notifications.length === 0}
								<div class="p-4 text-center text-gray-500 dark:text-gray-400">No notifications</div>
							{:else}
								{#each navigationStore.notifications as notification}
									<div class="border-b border-gray-100 p-4 last:border-b-0 dark:border-gray-700">
										<div class="flex items-start space-x-3">
											<div class="flex-shrink-0">
												{#if notification.type === 'error'}
													<div class="h-2 w-2 rounded-full bg-red-500"></div>
												{:else if notification.type === 'warning'}
													<div class="h-2 w-2 rounded-full bg-yellow-500"></div>
												{:else}
													<div class="h-2 w-2 rounded-full bg-blue-500"></div>
												{/if}
											</div>
											<div class="flex-1">
												<p class="text-sm text-gray-900 dark:text-white">{notification.message}</p>
											</div>
											<button
												type="button"
												onclick={() => navigationStore.removeNotification(notification.id)}
												class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
											>
												<XIcon class="h-4 w-4" />
											</button>
										</div>
									</div>
								{/each}
							{/if}
						</div>
					</div>
				{/if}
			</div>

			<!-- Theme Toggle -->
			<button
				type="button"
				onclick={themeStore.toggle}
				class="rounded-md p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
				aria-label="Toggle theme"
			>
				{#if themeStore.isDark}
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
						/>
					</svg>
				{:else}
					<svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
						/>
					</svg>
				{/if}
			</button>

			<!-- User Menu -->
			<div class="dropdown-container relative">
				<button
					type="button"
					onclick={toggleUserMenu}
					class="flex items-center space-x-2 rounded-md p-1 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
				>
					<div
						class="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-600 to-purple-600"
					>
						<span class="text-sm font-medium text-white">
							{getCurrentUser()?.username.charAt(0).toUpperCase() || 'U'}
						</span>
					</div>
					<ChevronDownIcon class="h-4 w-4 text-gray-500 dark:text-gray-400" />
				</button>

				<!-- User Dropdown -->
				{#if showUserMenu}
					<div
						class="absolute top-full right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-800"
					>
						<div class="border-b border-gray-200 p-4 dark:border-gray-700">
							<div class="text-sm font-medium text-gray-900 dark:text-white">
								{getCurrentUser()?.username || 'User'}
							</div>
							<div class="text-sm text-gray-500 dark:text-gray-400">
								{getCurrentUser()?.email || 'user@example.com'}
							</div>
						</div>
						<div class="p-2">
							<a
								href="/profile"
								class="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
							>
								Profile
							</a>
							<a
								href="/settings"
								class="block rounded-md px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
							>
								Settings
							</a>
							<hr class="my-2 border-gray-200 dark:border-gray-700" />
							<button
								type="button"
								onclick={() => {
									showUserMenu = false;
									logout();
								}}
								class="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-700"
							>
								Sign out
							</button>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</div>
</header>
