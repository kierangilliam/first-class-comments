import type { ParseResult } from '$lib/lang/parse';
import { parse } from '$lib/lang/parse';
import { assertEq, com, lit } from './test-utilts';
import type { ExpressionAST } from './types';

const assertError = (a: ParseResult, message: string): void => 
	assertEq(a[0].error.message, message)

const assertParse = (a: ParseResult, b: ExpressionAST): void => {
	assertEq(a[0].unwrap, b)
}

describe('compare', () => {
	test('basic', () => {
		const result = parse(`
			tina, insert joke "_ < _"
				| kanye, everyone loves you. "2"
				| kanye, you are quite beautiful. "3"
		`)
	
		assertParse(result, {
			type: 'comparison',
			comment: com('tina', 'insert joke'),
			operator: '<',
			left: lit('2', com('kanye', 'everyone loves you.')),
			right: lit('3', com('kanye', 'you are quite beautiful.')),
		})
	})

})

describe('if _ else _', () => {
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
	
	test('parse failure :: no condition', () => {
		const result = parse('socrates, why not? "if _ else _"')
		assertError(result, "Expected 'condition'")
	})
})
