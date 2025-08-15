<!-- src/lib/components/svg/BriefcaseIcon.svelte -->
<script lang="ts">
	interface Props {
		class?: string;
	}

	let { class: className = 'w-6 h-6' }: Props = $props();
</script>

<svg class={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
	<rect x="3" y="7" width="18" height="13" rx="2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
	<path d="M8 7V5a4 4 0 0 1 8 0v2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
	<path d="M3 13h18" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
