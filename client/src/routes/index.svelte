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

<a href='https://github.com/kierangilliam/first-class-comments'>Project Link</a>

<div class="container">
	<Airplane --z-index={100} {program} />
	<Terminal --z-index={200} on:input={setInput} {program} />
</div>


<style>
	.container {
		height: 100vh;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: center;
	}

	a {
		position: absolute;
		top: 0;
		left: 0;
	}
</style>
