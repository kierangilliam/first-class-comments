<script lang='ts'>
	import { createEventDispatcher } from 'svelte'
	import { writable } from 'svelte/store'
	import type { Readable } from 'svelte/store'
	import type { ProgramState } from '$lib/lang'
	import { blink, clickOutside } from '$lib/actions'

	export let program: Readable<ProgramState>

	const dispatch = createEventDispatcher()
	const INPUT_PADDING = 18
	const focused = writable(true)	

	let terminalInput: string = ''
	let historyOffset = 0

	let inputElement: HTMLInputElement
	let inputSizeElement: HTMLInputElement

	focused.subscribe($focused => {
		if ($focused && inputElement) {
			inputElement.focus()
		}
	})

	const onInput = ({ resetHistory=false }) => (_?) => {
		if (resetHistory) historyOffset = 0

		if (inputElement) {
			inputSizeElement.innerHTML = terminalInput
			inputElement.style.width = inputSizeElement.offsetWidth + INPUT_PADDING + 'px' 
		}
	}

	const onTerminalClick = () => {
		$focused = true
	}

	const onTerminalKeyUp = (e: KeyboardEvent) => {
		const onArrowUpDown = () => {
			if (historyOffset > 0) {
				terminalInput = $program.history[$program.history.length - historyOffset].input
				onInput({ resetHistory: false })()
			} else {
				terminalInput = ''
			}
		}

		switch (e.key) {
			case 'ArrowUp': {
				historyOffset = Math.min($program.history.length, historyOffset + 1)
				onArrowUpDown()
				break;
			}
			case 'ArrowDown': {
				historyOffset = Math.max(0, historyOffset - 1)
				onArrowUpDown()
				break;
			}
			case 'Enter': {
				dispatch('input', terminalInput)
				terminalInput = ''
				break;
			}
		}		
	}

	const onClickOutside = () => {
		$focused = false
	}
</script>

<div 
	class='terminal' 
	on:click={onTerminalClick} 
	on:keyup={onTerminalKeyUp}
	use:clickOutside={onClickOutside}
>
	{#each $program.history as { input, output } }
		<p>> {input}</p>
		<p>{output}</p>
	{/each}

	{#if $program.working}
		<p>...</p>
	{:else}
		<div class='terminal-input'>
			<span>></span>
			<!-- used to calc the size of the input field -->
			<span bind:this={inputSizeElement} class='hidden'></span>
			<input 
				bind:this={inputElement} 
				bind:value={terminalInput} 
				on:input={onInput({ resetHistory: true })}
				autofocus
				type='text'
			>
			<span class='cursor' use:blink={{ interval: 1000, blinking: focused }}>❚</span>
		</div>
	{/if}	
</div>

<style>
	.terminal {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		width: 600px;
		height: 400px;
		background: var(--black);
		color: var(--white);
		font-family: var(--monoFont);
		font-size: var(--h4);
	}

	.terminal-input {
		display: flex;
		width: 100%;
	}

	.hidden { 
		position: absolute;
        left: -9999px;
        display: inline-block;
        min-width: 2em;
	}

	input {
		background: var(--black);
		color: var(--white);
		outline: 0;
		width: 2em;
	}
</style>