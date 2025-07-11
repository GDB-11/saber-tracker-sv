<script lang="ts">
	import Button from "$lib/components/form/Button.svelte";
	import FormGroup from "$lib/components/form/FormGroup.svelte";
	import Input from "$lib/components/form/Input.svelte";
	import { login } from "./stores/userStore.svelte";

    let username = $state('');
    let password = $state('');
    let loading = $state(false);
    let error = $state('');
    let success = $state(false);

    async function handleSubmit(e: Event) {
        e.preventDefault();
        error = '';
        success = false;
        loading = true;
        const res = await login(username, password);
        loading = false;
        if (res.success) {
            success = true;
        } else {
            error = res.error ?? 'Unknown error';
        }
    }
</script>

<FormGroup legend="Login" class="max-w-sm mx-auto mt-10">
    <form onsubmit={handleSubmit} class="space-y-4">
        <Input
            label="Username"
            bind:value={username}
            required
            disabled={loading}
            autocomplete="username"
        />
        <Input
            label="Password"
            type="password"
            bind:value={password}
            required
            disabled={loading}
            autocomplete="current-password"
        />
        {#if error}
            <div class="text-red-600 dark:text-red-400 text-sm">{error}</div>
        {/if}
        {#if success}
            <div class="text-green-600 dark:text-green-400 text-sm">Login successful!</div>
        {/if}
        <Button type="submit" disabled={loading} class="w-full">
            {loading ? 'Logging in...' : 'Login'}
        </Button>
    </form>
</FormGroup>