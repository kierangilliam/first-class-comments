<svelte:head>
	<title>Home</title>
</svelte:head>

<script context="module" lang="ts">
	export const prerender = true;
</script>

<script lang="ts">
	let comment: string
	let response: string 

	const submit = async () => {
		const res = await fetch('http://localhost:8999/emote', { 
			method: 'post',
			body: JSON.stringify({ comment }),
		})

		response = await res.text()

		console.log(res)
	}	
</script>

<section>
	<h1>yeet</h1>

	<input bind:value={comment} type="text">
	<button on:click={submit}>submit</button>
</section>

<section>
	{response}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 1;
	}
</style>
