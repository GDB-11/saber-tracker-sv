<!-- src/lib/components/svg/MenuIcon.svelte -->
<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = 'w-6 h-6' }: Props = $props();
</script>

<svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
	<path
		stroke-linecap="round"
		stroke-linejoin="round"
		stroke-width="2"
		d="M4 6h16M4 12h16M4 18h16"
	/>
</svg>
