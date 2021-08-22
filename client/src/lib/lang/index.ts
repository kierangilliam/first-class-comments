import type { Readable } from 'svelte/store'
import { get, writable } from 'svelte/store'
import { DefaultWorld } from './constants'
import { runProgram } from './program'
import type { ProgramCtx, ProgramState } from './types'
import { updateWorld } from './world'

export type { Comment, ProgramState } from './types'

// parse comment, maybe emote, loop
export const startProgram = (
	input: Readable<string>, ctx: Pick<ProgramCtx, 'inferenceEndpoint'>
): Readable<ProgramState> => {
	const store = writable<ProgramState>({ 
		world: DefaultWorld, 
		working: false, 
		evaluation: '', 
		history: [],
	})	

	// Update the world state
	setInterval(() => {
		if (get(store).working) return

		const [world, changes] = updateWorld(get(store).world)

		store.update(s => ({ 
			...s, 
			world,
			history: changes.length == 0
				? s.history
				: [
					...s.history, 
					{ 
						input: `event at ${new Date().toLocaleTimeString()}`, 
						output: changes.join('\n'),
					}
				]
		}))
	}, 10_000)

	input.subscribe(async $input => {
		if (!$input || get(store).working) return

		const done = (output: string) => store.set({ 
			...get(store),
			working: false, 
			history: [...get(store).history, { input: $input, output }],
			evaluation: output,
		})		

		store.update(store => ({ ...store, working: true }))

		done(await runProgram({ ...ctx, world: get(store).world }, $input))	
	})

	return store
}

