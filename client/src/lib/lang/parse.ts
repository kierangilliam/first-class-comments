import type { Res } from '$lib/trust';
import { Err, Ok, Option } from '$lib/trust';
import type { Comment, ComparisonOperator, ExpressionAST } from './types';

// expression ast, rest of input
export type ParseResult = [Res<ExpressionAST>, string]

type ParseExp<T> = (comment: Comment, expString: string, rest: string) => 
	[Res<ExpressionAST & { type: T }>, string]

const debug = (...args) => {
	const d = false
	if (d) console.debug(args)
}

/**
kanye, you are beautiful "window.alert('thank you')"

** fails
reginald, you suck "1 + 3"

socrates, what is the best drive-through chicken? "let best = 'raising canes'; best"

maria, you will die soon. "'false'"

tina, want to hear a dirty joke? the clean horse fell in a dirty puddle "'lmao'"

linus, Google's Secret Initiative – Project Hug "3"
linus, Patterns in Confusing Explanations  "2"
 */
const parseStatement = (input: string): Res<{ comment: Comment, toParse: string }> => {
	const matches = /^(\w+)\s*,\s*(.*)\s*"(.*)"$/g.exec(input.trim())

	if (matches?.length != 4) 
		return Err('Bad input. Syntax: <citizen\'s name>, <your comment> "<js code>"')

	const [_, to, comment, toParse] = matches.map(x => x.trim())

	return Ok({ comment: { to, comment }, toParse })
}

export const parse = (input: string): ParseResult => {
	const [first, ...restPieces] = input.replace(/(\t|\n)/g, '').split('|')
	const rest = restPieces.join(' | ')

	// parse fns can throw because they use expect
	try {
		const { comment, toParse } = parseStatement(first).unwrap

		if (toParse === 'if _ else _') {
			return parseIf(comment, toParse, rest)		
		} 
		else if (comparisonMatch(toParse).isSome) {
			return parseComparison(comment, toParse, rest)
		} 
		else if (literalMatch(toParse).isSome) {
			const value = literalMatch(toParse).unwrap
			debug('literal match', value)
			return [Ok({ type: 'literal', value, comment }), rest]
		}

		return [Err(`${toParse} unrecognized`), rest]
	} catch (e) {
		return [Err(e.message), rest]
	}
}

// 1 '213' true false
const literalMatch = (input: string): Option<string> => {
	try {
		const [_, match] = /^(\d+|true|'.*'|false)$/g.exec(input.trim())
		return Option.Some(match)
	} catch (e) {
		return Option.None
	}
}

const comparisonMatch = (input: string): Option<ComparisonOperator> => {
	try {
		const [_, match] = /^_ (<|>|<=|>=|&&|\|\|) _$/g.exec(input.trim())
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return Option.Some(match)
	} catch (e) {
		return Option.None
	}
}

const parseComparison: ParseExp<'comparison'> = (comment, operatorString, nestedInput) => {
	const operator = comparisonMatch(operatorString).expect('comparison operator')

	const [l, rest1] = parse(nestedInput)
	const left = l.expect('left')

	const [r, rest2] = parse(rest1)
	const right = r.expect('right')

	debug('comparison match', operator, left, right)

	return [Ok({ type: 'comparison', operator, comment, left, right }), rest2]
}

/**
socrates, why not? "if _ else _"
	| kanye, you are beautiful. "false"   < condition                (should eval to truthy value)
	| kanye, you are beautiful. "2"       < followed by consequence  (any exp)
	| kanye, you are beautiful. "false"   < followed by alternative  (any exp)
 */
const parseIf: ParseExp<'if'> = (comment, _, nestedInput) => {
	const [cond, rest1] = parse(nestedInput)
	const condition = cond.expect('condition')
	const [cons, rest2] = parse(rest1)
	const consequence = cons.expect('consequence')
	const [alt, rest] = parse(rest2)
	const alternative = alt.expect('alternative')

	// console.debug('if _ else _', {condition, consequence, alternative})

	return [Ok({
		type: 'if',
		condition,
		consequence,
		alternative,
		comment,
	}), rest]
}

export default parse