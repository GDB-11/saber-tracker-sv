<!-- src/lib/components/svg/ChartLineIcon.svelte -->
<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = 'w-6 h-6' }: Props = $props();
</script>

<svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4" />
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 21l4-4 4 4" />
	<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4h18v14H3z" />
</svg>
