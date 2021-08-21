import type { Res } from "$lib/trust";
import { Err, Ok } from "$lib/trust";
import { choice } from "$lib/utils";
import type { Readable } from "svelte/store";
import { get, writable } from "svelte/store";

export type Comment = { to: Citizen, comment: string, js_payload: string }

type Emotion = ({
	type: 'ok' | 'err',	
} & ({
	type: 'ok',
	evaluation: string
} | {
	type: 'err',
	reason: string,
}))

type ProgramState = { 
	working: boolean, 
	evaluation: string, 
	history: { input: string, output: string }[],
}

// copy pasted from /data/acquisition/get-and-format-data
const labelMap = { compliment: 0, question: 1, joke: 2, hacker: 3, insult: 4, sad_quote: 5 }

type Citizen = string
const firstClassCitizens: Record<keyof typeof labelMap, Citizen> = {
	hacker: 'linus',
	question: 'socrates',
	joke: 'kaufman',
	sad_quote: 'maria',
	insult: 'reginald',
	compliment: 'kanye',
}

/**
TODO the following were being miscategorized. 
Add too...

insults:
you suck
 */

const maybeEmote = async ({ comment, js_payload, to }: Comment): Promise<Emotion> => {
	const res = await fetch('http://localhost:8999/emote', { 
		method: 'post',
		body: JSON.stringify({ comment }),
	})

	if (res.status != 200) {
		const reason = await res.text()
		return { type: 'err', reason }
	}

	const emote = await res.text()
	const relevantCitizen = firstClassCitizens[emote]

	console.debug({emote, relevantCitizen})

	if (!relevantCitizen) 
		return { type: 'err', reason: `There is no one in first class to handle ${emote}` }

	if (relevantCitizen !== to) {
		const response = choice([
			'shrugged you off',
			'ignored your comment',
			'looked confused by your comment',
		])

		return { type: 'err', reason: `${to} ${response}.` }
	}		

	// TODO check if sleeping, is mad, etc

	return { type: 'ok', evaluation: eval(js_payload) }
}

/**
jerry "you suck" 1 + 3
 */
const parseInput = (input: string): Res<Comment> => {
	const matches = /^(\w+)\s*"(.*)"\s*(.*)$/g.exec(input.trim())

	console.log(input.trim(), matches)
	if (matches?.length != 4) {
		return Err(`Bad input. Syntax: <citizen's name> "<your comment>" <js code>`)
	}		

	const [_, to, comment, js_payload] = matches
	return Ok({ to, comment, js_payload })
}

// comment, maybe emote, loop
export const CMEL = (input: Readable<string>): Readable<ProgramState> => {
	const store = writable<ProgramState>({ working: false, evaluation: '', history: [] })	

	input.subscribe(async $input => {
		const done = (output: string) => store.set({ 
			working: false, 
			history: [...get(store).history, { input: $input, output }],
			evaluation: output,
		})
		
		if (!$input) return

		store.update(store => ({ ...store, working: true }))

		const comment = parseInput($input)

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