<!-- +layout.svelte (Login Page Layout) -->
<script lang="ts">
	import LightDarkModeToggle from '$lib/components/ui/LightDarkModeToggle.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';

	// Optional: Add your app name/logo
	const appName = 'Saber Tracker';
	const showLogo = true;

	let { children } = $props();
</script>

<svelte:head>
	<title>Login - {appName}</title>
	<meta name="description" content="Sign in to your {appName} account" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</svelte:head>

<!-- Full screen container with background -->
<div
	class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 transition-all duration-500 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900"
>
	<!-- Theme toggle - positioned absolutely in top right -->
	<div class="absolute top-4 right-4 z-10 sm:top-6 sm:right-6">
		<div class="flex items-center gap-3">
			<!-- Optional theme indicator text on larger screens -->
			<span
				class="hidden text-sm font-medium text-slate-600 capitalize sm:block dark:text-slate-400"
			>
				{themeStore.current} mode
			</span>
			<LightDarkModeToggle size="md" class="shadow-lg backdrop-blur-sm" />
		</div>
	</div>

	<!-- Main content container -->
	<div class="flex min-h-screen">
		<!-- Left side - Hidden on mobile, visible on lg+ screens -->
		<div class="relative hidden overflow-hidden lg:flex lg:w-1/2 xl:w-3/5">
			<!-- Background pattern/gradient -->
			<div
				class="absolute inset-0 bg-gradient-to-br from-cyan-600 via-cyan-700 to-cyan-800 dark:from-cyan-800 dark:via-cyan-900 dark:to-slate-900"
			>
				<!-- Decorative elements -->
				<div
					class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
				></div>

				<!-- Animated background pattern -->
				<div class="absolute inset-0 opacity-10">
					<div
						class="absolute top-1/4 left-1/4 h-64 w-64 animate-pulse rounded-full bg-white blur-3xl"
					></div>
					<div
						class="absolute right-1/4 bottom-1/3 h-96 w-96 animate-pulse rounded-full bg-cyan-300 blur-3xl"
						style="animation-delay: 2s;"
					></div>
					<div
						class="absolute top-2/3 left-1/3 h-48 w-48 animate-pulse rounded-full bg-cyan-100 blur-3xl"
						style="animation-delay: 4s;"
					></div>
				</div>
			</div>

			<!-- Content on the left side -->
			<div class="relative z-10 flex flex-col justify-center px-12 text-white xl:px-16">
				<div class="max-w-md">
					{#if showLogo}
						<div class="mb-8">
							<!-- Logo placeholder - replace with your actual logo -->
							<div
								class="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur"
							>
								<svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
									<path
										d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
									/>
								</svg>
							</div>
							<h1 class="text-3xl font-bold tracking-tight xl:text-4xl">{appName}</h1>
						</div>
					{/if}

					<h2 class="mb-4 text-2xl leading-tight font-semibold xl:text-3xl">
						Welcome back to your financial dashboard
					</h2>
					<p class="text-lg leading-relaxed text-cyan-100">
						Access your portfolio, execute trades, and manage your investments with our professional
						trading platform.
					</p>

					<!-- Feature highlights -->
					<div class="mt-8 space-y-3">
						<div class="flex items-center gap-3">
							<div class="h-2 w-2 rounded-full bg-cyan-300"></div>
							<span class="text-cyan-100">Real-time market data</span>
						</div>
						<div class="flex items-center gap-3">
							<div class="h-2 w-2 rounded-full bg-cyan-300"></div>
							<span class="text-cyan-100">Advanced trading tools</span>
						</div>
						<div class="flex items-center gap-3">
							<div class="h-2 w-2 rounded-full bg-cyan-300"></div>
							<span class="text-cyan-100">Secure transactions</span>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Right side - Login form container -->
		<div class="flex w-full items-center justify-center p-4 sm:p-6 lg:w-1/2 lg:p-8 xl:w-2/5">
			<div class="w-full max-w-md">
				<!-- Mobile logo/header (visible only on smaller screens) -->
				<div class="mb-8 text-center lg:hidden">
					{#if showLogo}
						<div
							class="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-600 to-cyan-700 shadow-lg dark:from-cyan-800 dark:to-cyan-900"
						>
							<svg class="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z"
								/>
							</svg>
						</div>
					{/if}
					<h1 class="mb-2 text-2xl font-bold text-slate-900 sm:text-3xl dark:text-white">
						{appName}
					</h1>
					<p class="text-slate-600 dark:text-slate-400">Sign in to your account</p>
				</div>

				<!-- Login form card -->
				<div
					class="rounded-2xl border border-white/20 bg-white/70 p-6 shadow-2xl backdrop-blur-xl transition-all duration-300 sm:p-8 dark:border-slate-700/50 dark:bg-slate-800/70"
				>
					<!-- Header for larger screens -->
					<div class="mb-8 hidden text-center lg:block">
						<h2 class="mb-2 text-2xl font-bold text-slate-900 xl:text-3xl dark:text-white">
							Welcome back
						</h2>
						<p class="text-slate-600 dark:text-slate-400">Please sign in to your account</p>
					</div>

					<!-- Render login form content -->
					{@render children()}

					<!-- Optional footer content -->
					<div class="mt-8 border-t border-slate-200 pt-6 dark:border-slate-700">
						<p class="text-center text-sm text-slate-600 dark:text-slate-400">
							Protected by enterprise-grade security
						</p>
						<div class="mt-3 flex justify-center space-x-4">
							<div class="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
								<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
									<path
										fill-rule="evenodd"
										d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
										clip-rule="evenodd"
									/>
								</svg>
								SSL Encrypted
							</div>
							<div class="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-500">
								<svg class="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
									<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
								</svg>
								2FA Protected
							</div>
						</div>
					</div>
				</div>

				<!-- Additional links -->
				<div class="mt-6 space-y-2 text-center">
					<p class="text-sm text-slate-600 dark:text-slate-400">
						Don't have an account?
						<a
							href="/register"
							class="font-medium text-cyan-600 transition-colors hover:text-cyan-700 dark:text-cyan-400 dark:hover:text-cyan-300"
						>
							Sign up here
						</a>
					</p>
					<p class="text-xs text-slate-500 dark:text-slate-500">
						<a
							href="/privacy"
							class="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
							>Privacy Policy</a
						>
						•
						<a href="/terms" class="transition-colors hover:text-cyan-600 dark:hover:text-cyan-400"
							>Terms of Service</a
						>
					</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	/* Custom animations for the background elements */
	@keyframes float {
		0%,
		100% {
			transform: translateY(0px) rotate(0deg);
		}
		33% {
			transform: translateY(-10px) rotate(1deg);
		}
		66% {
			transform: translateY(5px) rotate(-1deg);
		}
	}

	/* Enhanced backdrop blur support */
	@supports (backdrop-filter: blur(20px)) {
		.backdrop-blur-xl {
			backdrop-filter: blur(20px);
		}
	}

	/* Smooth theme transitions */
	* {
		transition-property: background-color, border-color, color, fill, stroke;
		transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
		transition-duration: 300ms;
	}
</style>
