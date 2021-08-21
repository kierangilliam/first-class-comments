import { Either, Left, Option, Right } from '$lib/trust';
import { firstClassCitizens, labelMap } from './constants';
import type { Citizen, Comment, ExpressionAST, Sentiment } from './types';
import type { WorldState } from './world';

export type RespondError = ({
	type: 'network error' 
	comment: Comment
} | {
	type: 'api: unknown error'
		| 'client is unaware of sentiment'
		| 'recipient does not respond well'
	sentiment: string
	comment: Comment
} | {
	type: 'inference engine is loading'
	comment: Comment
	timeLeft: string
} | {
	type: 'recipient is asleep'
	to: Citizen
})

const API = 'http://localhost:8999/emote'

// walks the ast to see how citizens respond to comments
// if they all respond okay, return None (yeah thats confusing, should fix)
// else, return reason 
export const respond = async (
	world: WorldState, ast: ExpressionAST, testSentiments?: Either<Sentiment, RespondError>[]
): Promise<Option<RespondError>> => {

	const commentsQueue = getComments(ast)
	
	if (testSentiments) {
		if (testSentiments.length !== commentsQueue.length) 
			throw Error(`respond with test emotes :: ${testSentiments.length} !== ${commentsQueue.length}`)
	}

	for (let i = 0; i < commentsQueue.length; i++) {
		const comment = commentsQueue[i]
		const sentiment = testSentiments 
			// ugly way to monkey patch for testing (see emote.test.ts)
			? testSentiments[i]
			: (await getSentiment(comment))
		
		if (sentiment.isRight) 
			return Option.Some(sentiment.right)

		const response = recipientResponse(world, sentiment.left, comment.to)
		
		if (response.isRight)
			return Option.Some(response.right)

		const respondedWell = response.left

		if (respondedWell == false) 
			return Option.Some({ 
				type: 'recipient does not respond well', 
				comment, 
				sentiment: sentiment.left,
			})
	}

	return Option.None
}

// calls api to get the label for comment
// fixme: sentiment may not be the best word to describe this
const getSentiment = async (comment: Comment): Promise<Either<Sentiment, RespondError>> => {
	let res: Response

	try {
		res = await fetch(API, { 
			method: 'post',
			body: JSON.stringify({ comment: comment.comment }),
		})
	} catch (e) {
		console.error(e)
		return Right({ type: 'network error', comment })
	}

	const sentiment = await res.text()

	if (res.status !== 200) {
		if (sentiment.includes('HuggingFace.loading.')) {
			const timeLeft = sentiment.split('HuggingFace.loading.')[1]
			return Right({ type: 'inference engine is loading', comment, timeLeft })	
		}

		console.error({ comment, text: sentiment })
		return Right({ type: 'api: unknown error', comment, sentiment })
	}

	if (labelMap[sentiment] != null) 
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return Left(sentiment)

	console.error('Server replied with unknown sentiment', sentiment)

	return Right({ type: 'client is unaware of sentiment', comment, sentiment })
}

const getComments = (ast: ExpressionAST): Comment[] => {
	switch (ast.type) {
		case 'if':
			return [
				ast.comment,
				...getComments(ast.condition), 
				...getComments(ast.consequence), 
				...getComments(ast.alternative),
			]
		case 'literal':
			return [ast.comment]
		case 'comparison':
			return [
				ast.comment, 
				...getComments(ast.left),
				...getComments(ast.right),
			]
		default:
			throw new Error(`get comments: unimplemented :: ${ast.type}`)
	}
}

const recipientResponse = (world: WorldState, sentiment: Sentiment, to: Citizen): Either<boolean, RespondError> => {
	const state = world.citizens[to]

	if (state.type === 'sleeping')
		return Right({ type: 'recipient is asleep', to, sentiment })

	return Left(firstClassCitizens[sentiment] === to)
}