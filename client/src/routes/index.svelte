<svelte:head>
	<title>Home</title>
</svelte:head>

<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	import { CMEL } from '$lib/CMEL'
	import { onMount } from 'svelte'
	import { writable } from 'svelte/store'

	// TODO enable decorators

	let textInput: string
	const input = writable<string>(null)
	const program = CMEL(input)	

	const onTerminalKeyUp = (e: KeyboardEvent) => {
		if (e.key === 'Enter') {
			input.set(textInput)
		}
	}
</script>

<section>
	<h1>yeet</h1>
</section>

<div class='terminal' on:keyup={onTerminalKeyUp}>
	{#each $program.history as { input, output } }
		<p>> {input}</p>
		<p>{output}</p>
	{/each}

	{#if $program.working}
		<p>...</p>
	{:else}
		<input bind:value={textInput} type="text">
	{/if}
</div>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
