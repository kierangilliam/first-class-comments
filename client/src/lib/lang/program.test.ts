import type { ParseResult } from '$lib/lang/parse';
import { Left } from '$lib/trust';
import { runProgram } from './program';
import { assertEq } from './test-utilts';

export const assertError = (a: ParseResult, message: string): void => 
	assertEq(a[0].error.message, message)

describe('if _ else _', () => {
	test('simple', async () => {
		const result = await runProgram(`
			socrates, why not? "if _ else _"
				| kanye, you are beautiful. "false"
				| kanye, everyone loves you. "2"    
				| kanye, you are quite beautiful. "true"
		`, [
			Left('question'),
			Left('compliment'),
			Left('compliment'),
			Left('compliment'),
		])
	
		assertEq(result, 'true')
	})
	
	test('nesting', async () => {
		const result = await runProgram(`
			socrates, why not? "if _ else _"
				| tina, some joke. "<="
					| kanye, compliment a. "100"    
					| kanye, compliment b. "200"
				| kanye, compliment c. "2"    
				| kanye, compliment d. "true"
		`, [
			Left('question'),
			Left('joke'),
			Left('compliment'), // a
			Left('compliment'), // b
			Left('compliment'), // c
			Left('compliment'), // d
		])
	
		assertEq(result, '2')
	})
})
