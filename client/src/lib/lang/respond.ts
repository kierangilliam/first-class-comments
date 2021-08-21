import { Either, Left, Option, Right } from '$lib/trust';
import { firstClassCitizens, labelMap } from './constants';
import type { Citizen, Comment, ExpressionAST, Sentiment } from './types';

export type RespondError = {
	type: 'network error' 
		| 'api: unknown error'
		| 'client is unaware of sentiment'
		| 'recipient does not respond well'
	comment: Comment
	sentiment: string
}

const API = 'http://localhost:8999/emote'

// walks the ast to see how citizens respond to comments
// if they all respond okay, return None (yeah thats confusing, should fix)
// else, return reason 
export const respond = async (ast: ExpressionAST, testSentiments?: Either<Sentiment, RespondError>[]): Promise<Option<RespondError>> => {

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

		if (!recipientRespondsWellToComment( sentiment.left, comment.to)) 
			return Option.Some({ 
				type: 'recipient does not respond well', 
				comment, 
				sentiment: sentiment.left,
			})
	}

	return Option.None
}

const getSentiment = async (comment: Comment): Promise<Either<Sentiment, RespondError>> => {
	let res: Response

	try {
		res = await fetch(API, { 
			method: 'post',
			body: JSON.stringify({ comment: comment.comment }),
		})
	} catch (e) {
		console.error(e)
		return Right({ type: 'network error', comment, sentiment: 'NONE' })
	}

	const sentiment = await res.text()

	if (res.status !== 200) {
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
		default:
			throw new Error(`get comments: unimplemented :: ${ast.type}`)
	}
}

const recipientRespondsWellToComment = (sentiment: Sentiment, to: Citizen): boolean => {
	return firstClassCitizens[sentiment] === to
}