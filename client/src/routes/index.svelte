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
	import Airplane from '$lib/components/airplane/Airplane.svelte'
	import Computer from '$lib/Computer.svelte'

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

<img class='cloud' id='cloud-1' src='/cloud-1.png' alt='cloud'>
<img class='cloud' id='cloud-2' src='/cloud-1.png' alt='cloud'>

<Airplane --z-index={100} {program} />

<img class='cloud' id='cloud-3' src='/cloud-2.png' alt='cloud'>

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

<img class='cloud' id='cloud-fg-1' src='/cloud-1.png' alt='cloud'>

<style>
	#state {
		position: fixed;
		bottom: var(--s-2);
		left: var(--s-2);
	}
	#state a {
		font-weight: var(--weightBold);
	}

	.cloud {
		position: fixed;
	}

	#cloud-1 {
		top: 20vh;
		width: 400px;
		animation: cloud 30s linear infinite;
	}
	
	#cloud-2 {
		top: 55vh;
		left: 50vw;
		width: 700px;
		animation: cloud 70s linear infinite;
	}

	#cloud-3 {
		top: 25vh;
		left: 50vw;
		width: 700px;
		animation: cloud 55s linear infinite;
	}
	
	#cloud-fg-1 {
		z-index: 300;
		bottom: -65%;
		height: 900px;
		animation: cloud 110s linear infinite;
	}

	@keyframes cloud {
		0%   { 
			left: -50%;
		}
		100% { 
			left: 100%;
		}
	}

	#sky {
		left: 0;
		position: fixed;
		width: 100vw;
		filter: grayscale(40%);
	}
</style>
