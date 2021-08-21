import type { Readable } from 'svelte/store'

// modified from: https://svelte.dev/repl/0ace7a508bd843b798ae599940a91783?version=3.16.7
export const clickOutside = (node: HTMLElement, handler: () => any): any => {
	const handleClick = event => {
			if (node && !node.contains(event.target) && !event.defaultPrevented) {
				handler()
			}
	}
	
	document.addEventListener('click', handleClick, true)

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		}
	}
}

export const blink = (node: HTMLElement, opts: { interval: number, blinking: Readable<boolean> }): void => {
	const show = () => node.style.opacity = '1'
	const hide = () => node.style.opacity = '0'

	let timer = null

	opts.blinking.subscribe($blink => {
		if (!$blink && timer) {
			clearInterval(timer)
			node.style.opacity = '1'
			return
		}

		timer = setInterval(() => {
			show()
			setTimeout(hide, opts.interval / 2)
		}, opts.interval)
	})
}