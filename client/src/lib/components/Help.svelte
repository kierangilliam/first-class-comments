<script lang='ts'>
	import { Spacer } from '@ollopa/cedar'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()
	const maxPages = 5

	let inputElement: HTMLInputElement
	let terminalInput: string
	let controlKeyPressed = false
	let error = null
	let page = 0

	const onTerminalKeyDown = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'Control':
				controlKeyPressed = true
		}
	}

	const onTerminalKeyUp = (e: KeyboardEvent) => {
		switch (e.key) {
			case 'ArrowRight': {
				terminalInput = 'n'
				handleTerminalInput()
				break
			}
			case 'ArrowLeft': {
				terminalInput = 'b'
				handleTerminalInput()
				break
			}
			case 'Control': {
				controlKeyPressed = false
				break
			}				
			case 'Enter': {
				if (controlKeyPressed) {
					handleTerminalInput()
					break;
				}
			}
		}		
	}

	const handleTerminalInput = () => {
		error = null
		terminalInput = terminalInput.trim()

		switch (terminalInput) {
			case 'done':
			case 'skip':
			case 'exit': {
				dispatch('done')
				break
			}
			case 'b':
			case 'back': {
				page = Math.max(0, page - 1)
				break
			}				
			case 'n':
			case 'next': {
				page = Math.min(maxPages, page + 1)
				break
			}	
			default: {
				error = `unrecognized input: ${terminalInput}`
			}		
		}

		terminalInput = ''
		inputElement.focus()
	}
</script>

<div 
	class='container' 
	on:keydown={onTerminalKeyDown}
	on:keyup={onTerminalKeyUp}
	on:dblclick={handleTerminalInput}
>
	<div class="top">
		{#if page == 0}
			<h2>Literally Illiterate</h2>
			<p>a language where comments are first class citizens</p>
			<p>type <strong>next</strong> or <strong>n</strong> to continue to next page</p>
			<p>type <strong>back</strong> or <strong>b</strong> to go back</p>
			<p>type <strong>skip</strong> to bypass the quick intro</p>
			<p>press control+enter or double click the screen to submit</p>
		{:else if page == 1}
			<h2>First Class Comments</h2>
			<p>A comment as a first class citizen to a language can mean many things</p>
			<p>I chose to interpret it quite literally</p>
			<p>
				in <strong>literally illiterate</strong>, you submit comments to celebrities sitting in first class of an airplane
			</p>
			<p>if they <i>like</i> your comment, they will evaluate your code</p>
		{:else if page == 2}
			<h2>Responding to Comments</h2>
			<p>a celeb <i>likes</i> your comment if it fits with their personality</p>
			<p><strong>kanye</strong>, for example, <i>likes</i> his ego being fed (compliments)</p>
			<p>each celeb also owns a part of the language...</p>
		{:else if page == 3}
			<h2>Ownership</h2>
			<p><strong>kanye</strong> owns <i>literals</i></p>
			<p>a literal is </p>
		{:else if page == 4}
			<h2>Syntax</h2>
			<p><strong>(name), (comment) "(code)"</strong></p>
			<p>to tell <strong>kanye</strong> he is beautiful, write</p>
			<p><strong>kanye, you are beautiful "3"</strong></p>
			<p>if <strong>kanye</strong> accepts your comment, he will evaluate your code</p>
		{/if}
	</div>

	<div class='bottom'>
		{#if page == 0}
			<p><a target='_blank' href='https://github.com/langjam/langjam'>a langjam001 submission</a></p>
			<p>(best on desktop)</p>
		{:else if page == 2}
			<p>pssst, you can also arrow right/left to go forward/backward</p>
			<p>i just wanted you to get used to pressing control+enter</p>
		{/if}

		{#if error}
			<div class='error'>{error}</div>
		{/if}

		<Spacer />
	
		<div>
			<span>$</span>
			<input autofocus type='text' bind:this={inputElement} bind:value={terminalInput}>
		</div>
	</div>
</div>

<style>
	.container {
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		width: 100%;
		height: 100%;		
	}

	h2 {
		text-transform: uppercase;
		letter-spacing: .25ch;
		word-spacing: 1ch;
	}

	.top p::before {
		content: '$ ';
		color: var(--gray);
	}
	
	.bottom p {
		font-size: var(--textSmall);
	}

	strong {
		color: var(--gold)
	}

	input {
		width: 90%;
		color: var(--white);
		background: var(--darkerGray);
		color: var(--white);
		outline: 0;
		border: 0;
	}

	.error {
		color: var(--red);
	}

	a {
		color: var(--lightBlue)
	}
</style>