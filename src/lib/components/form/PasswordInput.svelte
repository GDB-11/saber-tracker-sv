<!-- lib/components/form/PasswordInput.svelte -->
<script lang="ts">
	import type { HTMLInputAttributes } from 'svelte/elements';
	import EyeOffSvg from '../svg/EyeOffSvg.svelte';
	import EyeOnSvg from '../svg/EyeOnSvg.svelte';
	import Input from './Input.svelte';

	type PasswordStrength = 'weak' | 'fair' | 'good' | 'strong';
	type InputSize = 'sm' | 'md' | 'lg';

	interface Props extends Omit<HTMLInputAttributes, 'class' | 'type' | 'size'> {
		value?: string;
		placeholder?: string;
		label?: string;
		error?: string;
		warning?: string;
		success?: string;
		helpText?: string;
		disabled?: boolean;
		required?: boolean;
		id?: string;
		size?: InputSize;
		class?: string;
		// Financial/Security specific props
		showStrengthIndicator?: boolean;
		showRequirements?: boolean;
		minLength?: number;
		requireUppercase?: boolean;
		requireLowercase?: boolean;
		requireNumbers?: boolean;
		requireSpecialChars?: boolean;
	}

	let {
		value = $bindable(),
		placeholder = 'Enter your secure password',
		label = 'Password',
		error = '',
		warning = '',
		success = '',
		helpText = '',
		disabled = false,
		required = false,
		id = '',
		size = 'md',
		class: className = '',
		showStrengthIndicator = false,
		showRequirements = false,
		minLength = 10,
		requireUppercase = true,
		requireLowercase = true,
		requireNumbers = true,
		requireSpecialChars = true,
		...restProps
	}: Props = $props();

	let showPassword: boolean = $state(false);

	const togglePasswordVisibility = (): void => {
		showPassword = !showPassword;
	};

	const inputType = $derived(showPassword ? 'text' : 'password');
	const inputId: string = id || `password-input-${Math.random().toString(36).slice(2, 11)}`;

	// Password strength calculation
	const passwordStrength: () => PasswordStrength = $derived(() => {
    if (!value || !showStrengthIndicator) return 'weak';

    let score = 0;
    const password = value as string;

    // Length check
    if (password.length >= minLength) score += 1;
    if (password.length >= 12) score += 1;

    // Character type checks
    if (requireUppercase && /[A-Z]/.test(password)) score += 1;
    if (requireLowercase && /[a-z]/.test(password)) score += 1;
    if (requireNumbers && /[0-9]/.test(password)) score += 1;
    if (requireSpecialChars && /[^A-Za-z0-9]/.test(password)) score += 1;

    // Complexity bonus
    if (password.length >= 16) score += 1;
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) score += 1;

    if (score <= 2) return 'weak';
    if (score <= 4) return 'fair';
    if (score <= 6) return 'good';
    return 'strong';
});

	// Requirements validation
	const requirements = $derived(() => {
		if (!value || !showRequirements) return [];

		const password = value as string;
		return [
			{
				label: `At least ${minLength} characters`,
				met: password.length >= minLength
			},
			{
				label: 'Uppercase letter (A-Z)',
				met: !requireUppercase || /[A-Z]/.test(password)
			},
			{
				label: 'Lowercase letter (a-z)',
				met: !requireLowercase || /[a-z]/.test(password)
			},
			{
				label: 'Number (0-9)',
				met: !requireNumbers || /[0-9]/.test(password)
			},
			{
				label: 'Special character (!@#$%)',
				met: !requireSpecialChars || /[^A-Za-z0-9]/.test(password)
			}
		];
	});

	// Dynamic styling for toggle button
	const toggleButtonClasses: string =
		'absolute right-3 z-10 flex cursor-pointer items-center text-text-tertiary transition-colors hover:text-text-secondary focus:text-primary-600 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:hover:text-text-secondary dark:focus:text-primary-400';

	// Calculate button position based on label presence
	const buttonPosition = $derived(() => {
		const baseClasses = toggleButtonClasses;
		const sizeMap = { sm: 'h-8', md: 'h-10', lg: 'h-12' };
		const heightClass = sizeMap[size];

		if (label) {
			return `${baseClasses} top-7 ${heightClass}`;
		} else {
			return `${baseClasses} top-0 bottom-0`;
		}
	});

	// Strength indicator colors
	const strengthColors: Record<PasswordStrength, string> = {
		weak: 'bg-danger-500',
		fair: 'bg-warning-500',
		good: 'bg-info-500',
		strong: 'bg-success-500'
	};

	const strengthLabels: Record<PasswordStrength, string> = {
		weak: 'Weak',
		fair: 'Fair',
		good: 'Good',
		strong: 'Strong'
	};
</script>

<div class="space-y-2">
	<div class="relative">
		<Input
			bind:value
			type={inputType}
			{placeholder}
			{label}
			{error}
			{warning}
			{success}
			{helpText}
			{disabled}
			{required}
			id={inputId}
			{size}
			variant={'default'}
			class={`pr-12 ${className}`}
			currency={false}
			percentage={false}
			prefix={''}
			suffix={''}
			{...restProps}
		/>

		<!-- Password visibility toggle button -->
		<button
			type="button"
			class={buttonPosition}
			onclick={togglePasswordVisibility}
			{disabled}
			tabindex="-1"
			aria-label={showPassword ? 'Hide password' : 'Show password'}
		>
			{#if showPassword}
				<EyeOffSvg class="h-5 w-5" />
			{:else}
				<EyeOnSvg class="h-5 w-5" />
			{/if}
		</button>
	</div>

	<!-- Password strength indicator -->
	{#if showStrengthIndicator && value}
	<div class="space-y-2">
		<div class="flex items-center justify-between">
		<span class="text-text-secondary text-sm font-medium">Password Strength</span>
		<span class="text-text-primary text-sm font-semibold"
			>{strengthLabels[passwordStrength]}</span
		>
		</div>

		<!-- Strength bar -->
		<div class="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-700">
		<div
			class={`h-full transition-all duration-300 ${strengthColors[passwordStrength]}`}
			style={`width: ${passwordStrength === 'weak' ? '25%' : passwordStrength === 'fair' ? '50%' : passwordStrength === 'good' ? '75%' : '100%'}`}
		></div>
		</div>
	</div>
	{/if}

	<!-- Password requirements checklist -->
	{#if showRequirements && value}
		<div class="space-y-2">
			<span class="text-text-secondary text-sm font-medium">Password Requirements</span>
			<ul class="space-y-1">
				{#each requirements as requirement}
					<li class="flex items-center space-x-2">
						{#if requirement.met}
							<svg
								class="text-success-500 h-4 w-4 flex-shrink-0"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						{:else}
							<svg
								class="h-4 w-4 flex-shrink-0 text-neutral-400"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						{/if}
						<span
							class={`text-sm ${requirement.met ? 'text-success-700 dark:text-success-400' : 'text-text-tertiary'}`}
						>
							{requirement.label}
						</span>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
