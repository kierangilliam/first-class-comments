<script lang='ts'>
	import type { Readable } from 'svelte/store'
	import type { ProgramState } from '$lib/lang'

	export let program: Readable<ProgramState>
</script>

<div class='wrapper'>
	<div class='container'>
		<img src='/seats.png' alt='seats'>		
		{#each Object.entries($program.world.citizens) as [name, state]}
			<img src={`${name}-${state.type}.png`} alt={`${name}-${state.type}`}>
		{/each}
		<img src='/plane.png' alt='seats'>
	</div>
	<div class='people'>
		{#each Object.entries($program.world.citizens) as [name, state]}
			<div class='person'>
				<strong>{name}</strong> is {state.type}
			</div>
		{/each}
	</div>
</div>

<style>
	.wrapper {
		z-index: var(--z-index);
		position: relative;
		width: 750px;
		height: 250px;
	}

	.container, img {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
	}

	.people {
		position: fixed;
		top: 50px;
		left: 0;
	}
	.person {
		font-size: var(--h3);
	}

	.container {
		width: 500%;
		height: 500%;
		transform: translate(-15%, -50%);
	}
</style>