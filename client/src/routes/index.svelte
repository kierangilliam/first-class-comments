<svelte:head>
	<title>First Class Comments</title>
</svelte:head>

<script context='module' lang='ts'>
	export const ssr = false;
</script>

<script lang='ts'>
	import { startProgram } from '$lib/lang'
	import Terminal from '$lib/components/Terminal.svelte';
	import { writable } from 'svelte/store'
	import { dev } from '$app/env'

	const inferenceEndpoint = dev
		? 'http://localhost:8999/inference'
		: 'https://first-class-comments.deno.dev/inference'

	const input = writable<string>(null)
	const program = startProgram(input, { inferenceEndpoint })	

	const setInput = (e: { detail: string }) => {
		// Force update even if last input === e.detail
		$input = ''
		$input = e.detail
	}
</script>

<section>
	<h1>yeet</h1>
</section>

<Terminal on:input={setInput} {program} />

{#each Object.entries($program.world.citizens) as [name, state]}
	<p><strong>{name}</strong> is {state.type}</p>
{/each}

<a href='https://github.com/kierangilliam/first-class-comments'>Project Link</a>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
