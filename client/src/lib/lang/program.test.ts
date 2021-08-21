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
	
	// test('complex', async () => {
	// 	const result = await runProgram(`
	// 		socrates, why not? "if _ else _"
	// 			| kanye, you are beautiful. "false"
	// 			| kanye, everyone loves you. "2"    
	// 			| kanye, you are quite beautiful. "true"
	// 	`, [
	// 		Left('question'),
	// 		Left('compliment'),
	// 		Left('compliment'),
	// 		Left('compliment'),
	// 	])
	
	// 	assertEq(result, 'true')
	// })
})
