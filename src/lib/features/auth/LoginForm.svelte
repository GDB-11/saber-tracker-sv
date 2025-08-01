<!-- src/lib/features/auth/LoginForm.svelte -->
<script lang="ts">
	import Button from '$lib/components/form/Button.svelte';
	import Checkbox from '$lib/components/form/Checkbox.svelte';
	import FormGroup from '$lib/components/form/FormGroup.svelte';
	import Input from '$lib/components/form/Input.svelte';
	import PasswordInput from '$lib/components/form/PasswordInput.svelte';
	import Link from '$lib/components/ui/Link.svelte';
	import { login, type LoginResponse, getRememberedCredentials } from '$lib/stores/user.svelte';
	import { onMount } from 'svelte';

	// Form state
	let usernameOrEmail = $state('');
	let password = $state('');
	let rememberMe = $state(false);
	let loading = $state(false);
	let error = $state('');
	let success = $state(false);

	// Load remembered credentials on component mount
	onMount(() => {
		const rememberedCredentials = getRememberedCredentials();
		if (rememberedCredentials) {
			usernameOrEmail = rememberedCredentials;
			rememberMe = true;
		}
	});

	// Validation state
	let touched = $state({ usernameOrEmail: false, password: false });

	// Helper function to get error message based on status code
	function getErrorMessage(response: LoginResponse): string {
		switch (response.status) {
			case 400:
				return response.message || 'Please check your input and try again.';
			case 401:
				return 'Incorrect password. Please try again.';
			case 404:
				return 'No account found with this username or email.';
			case 500:
				return 'Server error. Please try again later.';
			default:
				return response.message || 'Login failed. Please try again.';
		}
	}

	// Form submission handler
	async function handleSubmit(e: Event) {
		e.preventDefault();

		// Mark all fields as touched
		touched.usernameOrEmail = true;
		touched.password = true;

		// Reset states
		error = '';
		success = false;
		loading = true;

		try {
			const response = await login(usernameOrEmail.trim(), password, rememberMe);

			if (response.success) {
				success = true;
				// Redirect is handled automatically in the store
			} else {
				error = getErrorMessage(response);
			}
		} catch (err) {
			error = 'An unexpected error occurred. Please try again.';
			console.error('Login error:', err);
		} finally {
			loading = false;
		}
	}

	// Input blur handlers
	function handleUsernameBlur() {
		touched.usernameOrEmail = true;
	}

	function handlePasswordBlur() {
		touched.password = true;
	}

	// Form validation using $derived (runes syntax)
	const isFormValid = $derived(usernameOrEmail.trim().length > 0 && password.length > 0);
	const showUsernameError = $derived(
		touched.usernameOrEmail && usernameOrEmail.trim().length === 0
	);
	const showPasswordError = $derived(touched.password && password.length === 0);
</script>

<!-- Login Form -->
<FormGroup class="mt-8 space-y-6">
	<form onsubmit={handleSubmit} class="space-y-6">
		<!-- Username/Email Input -->
		<div>
			<Input
				label="Username or Email"
				bind:value={usernameOrEmail}
				required
				disabled={loading}
				autocomplete="username"
				placeholder="Enter your username or email"
				onblur={handleUsernameBlur}
				class="block w-full"
			/>
			{#if showUsernameError}
				<p class="mt-1 text-sm text-red-600 dark:text-red-400">Username or email is required</p>
			{/if}
		</div>

		<!-- Password Input -->
		<div>
			<PasswordInput
				label="Password"
				bind:value={password}
				required
				disabled={loading}
				autocomplete="current-password"
				placeholder="Enter your password"
				onblur={handlePasswordBlur}
				class="block w-full"
			/>
			{#if showPasswordError}
				<p class="mt-1 text-sm text-red-600 dark:text-red-400">Password is required</p>
			{/if}
		</div>

		<!-- Remember me and Forgot password -->
		<div class="flex items-center justify-between">
			<Checkbox
				bind:checked={rememberMe}
				label="Remember me"
				id="remember-me"
				disabled={loading}
				class="h-4 w-4"
			/>

			<div class="text-sm">
				<Link text={'Forgot your password?'} href={'/forgot-password'} disabled={loading} />
			</div>
		</div>

		<!-- Error Message -->
		{#if error}
			<div class="rounded-md bg-red-50 p-4 dark:bg-red-950">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-red-800 dark:text-red-200">
							{error}
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Success Message -->
		{#if success}
			<div class="rounded-md bg-green-50 p-4 dark:bg-green-950">
				<div class="flex">
					<div class="flex-shrink-0">
						<svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
								clip-rule="evenodd"
							/>
						</svg>
					</div>
					<div class="ml-3">
						<p class="text-sm font-medium text-green-800 dark:text-green-200">
							Login successful! Redirecting to dashboard...
						</p>
					</div>
				</div>
			</div>
		{/if}

		<!-- Submit Button -->
		<div>
			<Button
				type="submit"
				disabled={loading || !isFormValid}
				class="group relative flex w-full justify-center rounded-md border border-transparent bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition-colors duration-200 hover:bg-cyan-700 focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-cyan-900 dark:hover:bg-cyan-800"
			>
				{#if loading}
					<svg
						class="mr-3 -ml-1 h-5 w-5 animate-spin text-white"
						xmlns="http://www.w3.org/2000/svg"
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
					Signing in...
				{:else}
					Sign in
				{/if}
			</Button>
		</div>

		<!-- Sign up link -->
		<div class="text-center">
			<p class="text-sm text-gray-600 dark:text-gray-400">
				Don't have an account?
				<a
					href="/signup"
					class="font-medium text-cyan-600 hover:text-cyan-500 dark:text-cyan-400 dark:hover:text-cyan-300"
				>
					Sign up now
				</a>
			</p>
		</div>
	</form>
</FormGroup>