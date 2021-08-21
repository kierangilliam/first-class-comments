import type { ParseResult } from '$lib/lang/parse';
import { parse } from '$lib/lang/parse';
import { Ok } from '$lib/trust';
import { assertEq, com, lit } from './test-utilts';

export const assertError = (a: ParseResult, message: string): void => 
	assertEq(a[0].error.message, message)

describe('if _ else _', () => {
	test('basic', () => {
		const result = parse(`
			socrates, why not? "if _ else _"
				| kanye, you are beautiful. "false"
				| kanye, everyone loves you. "2"    
				| kanye, you are quite beautiful. "true"
		`)
	
		assertEq(result, [Ok({
			type: 'if',
			comment: com('socrates', 'why not?'),
			condition: lit('false', com('kanye', 'you are beautiful.')),
			consequence: lit('2', com('kanye', 'everyone loves you.')),
			alternative: lit('true', com('kanye', 'you are quite beautiful.')),
		}) , ''])
	})
	
	test('parse failure :: no condition', () => {
		const result = parse('socrates, why not? "if _ else _"')
		assertError(result, "Expected 'condition'")
	})
})
