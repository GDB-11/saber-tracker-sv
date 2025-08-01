<!-- src/lib/components/layout/Sidebar.svelte -->
<script lang="ts">
	import { page } from '$app/state';
	import { navigationStore } from '$lib/stores/navigation.svelte';
	import ChartBarIcon from '$lib/components/svg/ChartBarIcon.svelte';
	import BriefcaseIcon from '$lib/components/svg/BriefcaseIcon.svelte';
	import CreditCardIcon from '$lib/components/svg/CreditCardIcon.svelte';
	import CurrencyDollarIcon from '$lib/components/svg/CurrencyDollarIcon.svelte';
	import ChartLineIcon from '$lib/components/svg/ChartLineIcon.svelte';
	import DocumentTextIcon from '$lib/components/svg/DocumentTextIcon.svelte';
	import TagIcon from '$lib/components/svg/TagIcon.svelte';
	import CogIcon from '$lib/components/svg/CogIcon.svelte';
	import WrenchIcon from '$lib/components/svg/WrenchIcon.svelte';

	// Icon mapping
	const iconComponents: Record<string, any> = {
		'chart-bar': ChartBarIcon,
		briefcase: BriefcaseIcon,
		'credit-card': CreditCardIcon,
		'currency-dollar': CurrencyDollarIcon,
		'chart-line': ChartLineIcon,
		'document-text': DocumentTextIcon,
		tag: TagIcon,
		cog: CogIcon,
		wrench: WrenchIcon
	};

	const handleItemClick = (item: any) => {
		navigationStore.setActiveItem(item.id);
		if (navigationStore.isMobile) {
			navigationStore.closeSidebar();
		}
	};

	const handleBackdropClick = () => {
		if (navigationStore.isMobile) {
			navigationStore.closeSidebar();
		}
	};

	// Determine if an item is active based on current route
	const isActiveItem = (item: any) => {
		const currentPath = page.url.pathname;
		return currentPath.startsWith(item.href) || item.id === navigationStore.activeItem;
	};
</script>

<!-- Mobile backdrop -->
{#if navigationStore.isMobile && navigationStore.isOpen}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="fixed inset-0 z-40 bg-black/40 lg:hidden"
		onclick={handleBackdropClick}
	></div>
{/if}

<!-- Sidebar -->
<aside
	class={`
    fixed left-0 z-50 border-r border-gray-200 bg-white transition-all duration-300 ease-in-out dark:border-gray-700 dark:bg-gray-900
    ${navigationStore.isOpen ? 'translate-x-0' : '-translate-x-full'}
    ${navigationStore.isMobile ? 'top-0 h-full w-64' : navigationStore.isOpen ? 'top-16 h-[calc(100vh-4rem)] w-64' : 'top-16 h-[calc(100vh-4rem)] w-16'}
    lg:translate-x-0
  `}
>
	<div class="flex h-full flex-col">
		<!-- Sidebar Header (mobile only) -->
		{#if navigationStore.isMobile}
			<div
				class="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700"
			>
				<div class="flex items-center space-x-3">
					<div
						class="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-600 to-purple-600"
					>
						<span class="text-lg font-bold text-white">S</span>
					</div>
					<h1 class="text-xl font-bold text-gray-900 dark:text-white">Saber Tracker</h1>
				</div>
			</div>
		{/if}

		<!-- Navigation Menu -->
		<nav class="flex-1 space-y-2 overflow-y-auto p-4">
			{#each navigationStore.menuItems as item}
				{@const IconComponent = iconComponents[item.icon]}
				{@const isActive = isActiveItem(item)}

				<a
					href={item.href}
					onclick={() => handleItemClick(item)}
					class={`
            group flex items-center space-x-3 rounded-lg px-3 py-2.5 transition-all duration-200
            ${
							isActive
								? 'border-r-2 border-cyan-600 bg-cyan-50 text-cyan-700 dark:border-cyan-400 dark:bg-cyan-900/20 dark:text-cyan-300'
								: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
						}
            ${!navigationStore.isOpen && !navigationStore.isMobile ? 'justify-center' : ''}
          `}
					title={!navigationStore.isOpen && !navigationStore.isMobile ? item.label : ''}
				>
					<div
						class={`flex-shrink-0 ${isActive ? 'text-cyan-600 dark:text-cyan-400' : 'text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300'}`}
					>
						<IconComponent class="h-5 w-5" />
					</div>

					{#if navigationStore.isOpen || navigationStore.isMobile}
						<span class="truncate font-medium">{item.label}</span>

						{#if item.badge && item.badge > 0}
							<span
								class="ml-auto min-w-[1.25rem] rounded-full bg-red-500 px-2 py-0.5 text-center text-xs text-white"
							>
								{item.badge > 99 ? '99+' : item.badge}
							</span>
						{/if}
					{/if}
				</a>
			{/each}
		</nav>

		<!-- Sidebar Footer -->
		<div class="border-t border-gray-200 p-4 dark:border-gray-700">
			{#if navigationStore.isOpen || navigationStore.isMobile}
				<!-- Portfolio Summary -->
				{#if navigationStore.activePortfolio}
					<div class="mb-4 rounded-lg bg-gray-50 p-3 dark:bg-gray-800">
						<div
							class="text-xs font-medium tracking-wide text-gray-500 uppercase dark:text-gray-400"
						>
							Active Portfolio
						</div>
						<div class="mt-1 text-sm font-semibold text-gray-900 dark:text-white">
							{navigationStore.activePortfolio.name}
						</div>
						<div class="text-xs text-gray-600 dark:text-gray-400">
							{new Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: navigationStore.activePortfolio.currency,
								minimumFractionDigits: 2,
								maximumFractionDigits: 2
							}).format(navigationStore.activePortfolio.value)}
						</div>
					</div>
				{/if}

				<!-- Help & Support -->
				<div class="space-y-2">
					<a
						href="/help"
						class="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
						<span>Help & Support</span>
					</a>

					<a
						href="/docs"
						class="flex items-center space-x-3 rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
					>
						<svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
							/>
						</svg>
						<span>Documentation</span>
					</a>
				</div>

				<!-- Version Info -->
				<div class="mt-4 border-t border-gray-200 pt-4 dark:border-gray-700">
					<div class="text-center text-xs text-gray-500 dark:text-gray-400">Version 1.0.0</div>
				</div>
			{:else}
				<!-- Collapsed state - just icons -->
				<div class="flex flex-col space-y-2">
					<a
						href="/help"
						aria-label="application-links"
						class="rounded-lg p-2 text-gray-600 transition-colors duration-200 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
						title="Help & Support"
					>
						<svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
							/>
						</svg>
					</a>
				</div>
			{/if}
		</div>
	</div>
</aside>
