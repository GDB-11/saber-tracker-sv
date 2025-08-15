<!-- src/lib/components/svg/WrenchIcon.svelte -->
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
		d="M15.232 5.232a4 4 0 0 1 5.656 5.656l-4.95 4.95a2 2 0 0 1-2.828 0l-1.414-1.414a2 2 0 0 1 0-2.828l4.95-4.95zm-7.07 7.07a2 2 0 0 0 0 2.828l1.414 1.414a2 2 0 0 0 2.828 0l.586-.586"
	/>
	<circle cx="7" cy="17" r="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
</svg>
