<!-- src/lib/components/ui/Link.svelte -->
<script lang="ts">
	// Props for customization using runes syntax
	let {
		text,
		href,
		disabled = false,
		size = 'sm',
		className = ''
	}: {
		text: string;
		href: string;
		disabled?: boolean;
		size?: 'xs' | 'sm' | 'base' | 'lg';
		className?: string;
	} = $props();

	// Size classes mapping
	const sizeClasses = {
		xs: 'text-xs',
		sm: 'text-sm',
		base: 'text-base',
		lg: 'text-lg'
	};

	// Combine classes using $derived
	const linkClasses = $derived(
		`
        font-medium 
        text-cyan-600 hover:text-cyan-500 
        dark:text-cyan-400 dark:hover:text-cyan-300 
        transition-colors duration-200
        ${sizeClasses[size]}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'}
        ${className}
    `
			.trim()
			.replace(/\s+/g, ' ')
	);
</script>

<a {href} class={linkClasses} aria-disabled={disabled} tabindex={disabled ? -1 : 0}>
	{text}
</a>
