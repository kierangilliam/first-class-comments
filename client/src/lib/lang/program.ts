import type { Either } from '$lib/trust'
import { choice } from '$lib/utils'
import { evaluate } from './eval'
import parse from './parse'
import type { RespondError } from './respond'
import { respond } from './respond'
import type { Sentiment } from './types'
import type { WorldState } from './world'

interface ProgramPatches {
	sentiments?: Either<Sentiment, RespondError>[]
}

export const runProgram = async (input: string, state: WorldState, patch?: ProgramPatches): Promise<string> => {
	const [parseResult, rest] = parse(input)
	if (parseResult.error) 			
		return handleParseFailure(parseResult.error, input, rest)

	const responseError = await respond(state, parseResult.unwrap, patch?.sentiments)
	if (responseError.isSome) 
		return handlePoorResponse(responseError.unwrap)
	
	const evaluation = evaluate(parseResult.unwrap)
	if (evaluation.isRight) {
		console.error(evaluation.right)
		return `Evaluation failed : ${evaluation.right.type}`
	}

	return evaluation.left
}

const handleParseFailure = (e: Error, input: string, rest: string) => {
	// TODO do a diff on rest to get the position on input that failed
	return 'parse failure: ' + e.message
}

const handlePoorResponse = (e: RespondError): string => {
	switch (e.type) {
		case 'api: unknown error':
			return 'The sentiment inference engine had an unknown error. Try again soon.'

		case 'client is unaware of sentiment': {
			return `${e.comment.to} ` + choice([
				'shrugged you off',
				'ignored your comment',
				'looked confused by your comment',
			])
		}

		case 'recipient is asleep':
			return `${e.to} is asleep.`

		case 'network error':
			return 'Network error. Try again soon.'
		
		case 'inference engine is loading':
			return `inference engine is loading. may take up to ${e.timeLeft} seconds.`

		case 'recipient does not respond well':
			return `${e.comment.to} did not like ${e.sentiment}.`

		default:
			// 'type does not exist on type never'
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			return `program error: unhandled case ${e.type}`
	}
}