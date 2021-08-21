import type { Citizen } from './types'

// copy pasted from /data/acquisition/get-and-format-data
export const labelMap = { compliment: 0, question: 1, joke: 2, hacker: 3, insult: 4, sad_quote: 5 }

export const firstClassCitizens: Record<keyof typeof labelMap, Citizen> = {
	hacker: 'linus',
	question: 'socrates',
	joke: 'tina',
	sad_quote: 'maria',
	insult: 'reginald',
	compliment: 'kanye',
}