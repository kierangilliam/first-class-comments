import { dev } from '$app/env'
import type { Citizen } from './types'
import type { WorldState } from './world'

export const API = dev
	? 'http://localhost:8999'
	: 'https://first-class-comments.deno.dev'

// copy pasted from /data/acquisition/get-and-format-data
export const labelMap = { compliment: 0, question: 1, joke: 2, hacker: 3, insult: 4, sad_quote: 5 }

export const citizens: Citizen[] = ['linus', 'socrates', 'tina', 'maria', 'reginald', 'kanye']

export const firstClassCitizens: Record<keyof typeof labelMap, Citizen> = {
	hacker: 'linus',
	question: 'socrates',
	joke: 'tina',
	sad_quote: 'maria',
	insult: 'reginald',
	compliment: 'kanye',
}

const DefaultState: { type: 'idle' } = { type: 'idle' }

export const DefaultWorld: WorldState = {
	totalEvents: 0,
	citizens: {
		linus: DefaultState,
		socrates: DefaultState,
		tina: DefaultState,
		maria: DefaultState,
		reginald: DefaultState,
		kanye: DefaultState,
	}
}