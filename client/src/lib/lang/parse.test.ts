import type { ParseResult } from '$lib/lang/parse';
import parse from '$lib/lang/parse';
import { assertEq, com, comp, lit } from './test-utilts';
import type { ComparisonOperator, ExpressionAST } from './types';

const assertError = (a: ParseResult, message: string): void => 
	assertEq(a[0].error.message, message)

const assertParse = (a: ParseResult, b: ExpressionAST, m?: string): void => 
	assertEq(a[0].unwrap, b, m)

describe('compare', () => {
	const ops: ComparisonOperator[] = ['<', '>', '<=', '>=', 'and', 'or']
	const makeBasic = (o: ComparisonOperator) => comp(o,
		lit('2', com('kanye', 'everyone loves you.')),
		lit('3', com('kanye', 'you are quite beautiful.')),
		com('tina', 'insert joke'),
	)	

	test('basic', () => {
		ops.forEach(o => {
			const result = parse(`
				tina, insert joke "${o}" 
					| kanye, everyone loves you. "2" 
					| kanye, you are quite beautiful. "3"
			`)
			assertParse(result, makeBasic(o), o)
		})
	})
})

describe('if _ else _', () => {
	test('parse failure :: no condition', () => {
		const result = parse('socrates, why not? "if _ else _"')
		assertError(result, "Expected 'condition'")
	})

	test('basic', () => {
		const result = parse(`
			socrates, why not? "if _ else _"
				| kanye, you are beautiful. "false"
				| kanye, everyone loves you. "2"    
				| kanye, you are quite beautiful. "true"
		`)
	
		assertParse(result, {
			type: 'if',
			comment: com('socrates', 'why not?'),
			condition: lit('false', com('kanye', 'you are beautiful.')),
			consequence: lit('2', com('kanye', 'everyone loves you.')),
			alternative: lit('true', com('kanye', 'you are quite beautiful.')),
		})
	})
	
	test('nesting', () => {
		const result = parse(`
			socrates, why not? "if _ else _"
				| tina, some joke. ">="
					| kanye, compliment a. "100"    
					| kanye, compliment b. "200"
				| kanye, compliment c. "2"    
				| kanye, compliment d. "true"
		`)
	
		assertParse(result, {
			type: 'if',
			comment: com('socrates', 'why not?'),
			condition: comp('>=',
				lit('100', com('kanye', 'compliment a.')),
				lit('200', com('kanye', 'compliment b.')),
				com('tina', 'some joke.'),
			),
			consequence: lit('2', com('kanye', 'compliment c.')),
			alternative: lit('true', com('kanye', 'compliment d.')),
		})
	})	
})
