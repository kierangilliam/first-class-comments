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
import Airplane from '$lib/components/airplane/Airplane.svelte';
import Computer from '$lib/Computer.svelte';

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

<!-- <section>
	TODO: Help
	<p>use control-enter to submit terminal</p>
</section> -->

<img id='sky' src='/sky.jpeg' alt='sky'>

<Airplane --z-index={100} {program} />

<Computer --z-index={200}>
	<Terminal on:input={setInput} {program} />
</Computer>

<div id='state'>
	{#each Object.entries($program.world.citizens) as [name, state]}
		<div class='person'>
			<strong>{name}</strong> is {state.type}
		</div>
	{/each}

	<a href='https://github.com/kierangilliam/first-class-comments'>source</a>
</div>

<style>
	#state {
		position: fixed;
		bottom: var(--s-2);
		left: var(--s-2);
	}
	#state a {
		font-weight: var(--weightBold);
	}

	#sky {
		left: 0;
		position: fixed;
		width: 100vw;
	}
</style>
