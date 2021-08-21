import type { ParseResult } from '$lib/lang/parse';
import { parser } from '$lib/lang/parse';
import { Ok } from '$lib/trust';
import assert from 'assert';

const assertEq = (a: ParseResult, b: ParseResult) => {
	assert.deepStrictEqual(a, b)
}

const assertError = (a: ParseResult, message: string) => {
	assert.equal(a[0].error.message, message)
}

describe('if _ else _', () => {
	test('basic', () => {
		const result = parser(`
			socrates, why not? "if _ else _"
				| kanye, you are beautiful. "false"
				| kanye, everyone loves you. "2"    
				| kanye, you are quite beautiful. "true"
		`)
	
		assertEq(result, [Ok({
			type: 'if',
			comment: {
				to: 'socrates',
				comment: 'why not?',
			},
			condition: {
				comment: { to: 'kanye', comment: 'you are beautiful.', },
				type: 'literal',
				literal: 'false',
			},
			consequence: {
				comment: { to: 'kanye', comment: 'everyone loves you.', },
				type: 'literal',
				literal: '2',
			},
			alternative: {
				comment: { to: 'kanye', comment: 'you are quite beautiful.', },
				type: 'literal',
				literal: 'true',
			}
		}) , ''])
	})
	
	test('parse failure :: no condition', () => {
		const result = parser('socrates, why not? "if _ else _"')
		assertError(result, "Expected 'condition'")
	})
})
