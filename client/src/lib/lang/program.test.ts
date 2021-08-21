import { Left } from '$lib/trust';
import { DefaultWorld } from './constants';
import { runProgram } from './program';
import { assertEq } from './test-utilts';
import { updateCitizen } from './world';

describe('if _ else _', () => {

	test('simple', async () => {
		const result = await runProgram(`
			socrates, why not? "if _ else _"
				| kanye, you are beautiful. "false"
				| kanye, everyone loves you. "2"    
				| kanye, you are quite beautiful. "true"
		`, 
		DefaultWorld,
		{
			sentiments: [
				Left('question'),
				Left('compliment'),
				Left('compliment'),
				Left('compliment'),
			]
		})
	
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
		`, 
		DefaultWorld,
		{
			sentiments: [
				Left('question'),
				Left('joke'),
				Left('compliment'), // a
				Left('compliment'), // b
				Left('compliment'), // c
				Left('compliment'), // d
			]
		})
	
		assertEq(result, '2')
	})	
})

describe('world', () => {
	test('sleeping basic', async () => {
		const world = updateCitizen(DefaultWorld, 'kanye', 'sleeping')

		const result = await runProgram(
			'kanye, compliment a. "100"', 
			world,
			{ sentiments: [Left('compliment')] },
		)
	
		assertEq(result, 'kanye is asleep.')
	})
})


// TODO
/**
done
Sleeping citizens

MathOperator

6pm
deploy
collect more data

Better terminal
Basic plane

go through TODOs
 */