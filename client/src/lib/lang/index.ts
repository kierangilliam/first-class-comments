import type { Readable } from 'svelte/store'
import { get, writable } from 'svelte/store'
import maybeEmote from './maybe-emote'
import parse from './parse'
import type { ProgramState } from './types'

export type { Comment, ProgramState } from './types'

// parse comment, maybe emote, loop
export const startProgram = (input: Readable<string>): Readable<ProgramState> => {
	const store = writable<ProgramState>({ working: false, evaluation: '', history: [] })	

	input.subscribe(async $input => {
		if (!$input) return

		const done = (output: string) => store.set({ 
			working: false, 
			history: [...get(store).history, { input: $input, output }],
			evaluation: output,
		})		

		store.update(store => ({ ...store, working: true }))

		const comment = parse($input)

		if (comment.error) 			
			return done(comment.error.message)

		const result = await maybeEmote(comment.unwrap)

		if (result.type === 'err') 
			done(result.reason)
		else 
			done(result.evaluation)
	})

	return store
}