<svelte:head>
	<title>Home</title>
</svelte:head>

<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { CMEL } from '$lib/CMEL'
	import Terminal from '$lib/components/Terminal.svelte';
	import { writable } from 'svelte/store'

	// TODO enable decorators

	
	const input = writable<string>(null)
	const program = CMEL(input)	

	const setInput = (e: { detail: string }) => {
		input.set(e.detail)
	}
</script>

<section>
	<h1>yeet</h1>
</section>

<Terminal on:input={setInput} {program} />

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
