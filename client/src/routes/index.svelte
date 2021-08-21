<svelte:head>
	<title>Home</title>
</svelte:head>

<script context="module" lang="ts">
	export const ssr = false;
</script>

<script lang="ts">
	import { startProgram } from '$lib/lang'
	import Terminal from '$lib/components/Terminal.svelte';
	import { writable } from 'svelte/store'

	const input = writable<string>(null)
	const program = startProgram(input)	

	const setInput = (e: { detail: string }) => {
		input.set(e.detail)
	}
</script>

<section>
	<h1>yeet</h1>
</section>

<Terminal on:input={setInput} {program} />

{#each Object.entries($program.world.citizens) as [name, state]}
	<p><strong>{name}</strong> is {state.type}</p>
{/each}

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
