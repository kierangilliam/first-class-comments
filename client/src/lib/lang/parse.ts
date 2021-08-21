import type { Res } from '$lib/trust';
import { Err, Ok, Option } from '$lib/trust';
import type { Comment } from './types';

// expression ast, rest of input
export type ParseResult = [Res<ExpressionAST>, string]
type ExpRes<T> = [Res<ExpressionAST & { type: T }>, string]

/**
kanye, you are beautiful "window.alert('thank you')"

** fails
reginald, you suck "1 + 3"

socrates, what is the best drive-through chicken? "let best = 'raising canes'; best"

maria, you will die soon. "'false'"

kaufman, want to hear a dirty joke? the clean horse fell in a dirty puddle "'lmao'"

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

export const parser = (input: string): ParseResult => {
	const [first, ...restPieces] = input.replace(/(\t|\n)/g, '').split('|')
	const rest = restPieces.join(' | ')

	// parse fns can throw because they use expect
	try {
		const { comment, toParse } = parseStatement(first).unwrap

		if (toParse === 'if _ else _') {
			return parseIf(comment, rest)
		} else if (literalMatch(toParse).isSome) {
			const literal = literalMatch(toParse).unwrap
			console.debug('literal match', literal)
			return [Ok({ type: 'literal', literal, comment }), rest]
		}

		return [Err(`${toParse} unrecognized`), rest]
	} catch (e) {
		return [Err(e.message), rest]
	}
}

/**
1
'213'
true
false
 */
const literalMatch = (input: string): Option<string> => {
	try {
		const [_, match] = /^(\d+|true|'.*'|false)$/g.exec(input.trim())
		return Option.Some(match)
	} catch (e) {
		return Option.None
	}
}

/**
socrates, why not? "if _ else _"
	| kanye, you are beautiful. "false"   < condition                (should eval to truthy value)
	| kanye, you are beautiful. "2"       < followed by consequence  (any exp)
	| kanye, you are beautiful. "false"   < followed by alternative  (any exp)
 */
const parseIf = (comment: Comment, nestedInput: string): ExpRes<'if'> => {
	const [cond, rest1] = parser(nestedInput)
	const condition = cond.expect('condition')
	const [cons, rest2] = parser(rest1)
	const consequence = cons.expect('consequence')
	const [alt, rest] = parser(rest2)
	const alternative = alt.expect('alternative')

	console.debug('if _ else _', {condition, consequence, alternative})

	return [Ok({
		type: 'if',
		condition,
		consequence,
		alternative,
		comment,
	}), rest]
}

/***
piping
`
socrates, why not? "if _ else _"
	| kanye, you are beautiful. "false"
		| kanye, your shirt is soo cool. "2"
    | linus, Citation File Format "_ && _"
  		| tina, I invented a new word! Plagiarism! "_ < _"
			| reginald, i hope you die.
  			| kanye, your shirt is soo cool. "42"
  		| kanye, i love your eyes. "false"
	"
`

turns into
`
if (false) { 2 }
else { random() < 42 && false }
`
 */

// interface BlockStatementAST {
// 	statements: 
// }

type ExpressionAST = {
	type: 'if' | 'literal' | 'comparison' | 'operator'
	comment: Comment
} & ({
	type: 'if',
	condition: ExpressionAST,
	consequence: ExpressionAST,
	alternative: ExpressionAST
} | {
	// kanye
	type: 'literal'
	literal: Literal
} | {
	// linus
	// infix only
	type: 'operator'
	operator: '+' | '-' | '/' | '*'
	left: ExpressionAST
	right: ExpressionAST
} | {
	// tina fey
	type: 'comparison'	
	operator: '<=' | '>=' | '<' | '>' | '||' | '&&'
	left: ExpressionAST
	right: ExpressionAST
})

type Literal = string

export default parseStatement