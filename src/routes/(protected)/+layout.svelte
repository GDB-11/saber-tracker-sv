<!-- src/routes/(protected)/+layout.svelte -->
<script lang="ts">
	import AuthenticatedLayout from '$lib/components/layout/AuthenticatedLayout.svelte';
	let { children } = $props();
</script>

<AuthenticatedLayout>
	{@render children()}
</AuthenticatedLayout>
