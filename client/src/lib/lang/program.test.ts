import { Left } from '$lib/trust';
import { DefaultWorld } from './constants';
import { runProgram } from './program';
import { assertEq } from './test-utilts';
import { updateCitizen } from './world';

describe('if _ else _', () => {

	test('simple', async () => {
		const result = await runProgram(
			{ world: DefaultWorld, inferenceEndpoint: '' },
			`
			socrates, why not? "if _ else _"
				| kanye, you are beautiful. "false"
				| kanye, everyone loves you. "2"    
				| kanye, you are quite beautiful. "true"
			`, 		
			{
				sentiments: [
					Left('question'),
					Left('compliment'),
					Left('compliment'),
					Left('compliment'),
				]
			}
		)
	
		assertEq(result, 'true')
	})
	
	test('nesting', async () => {
		const result = await runProgram(
			{ world: DefaultWorld, inferenceEndpoint: '' },
			`
			socrates, why not? "if _ else _"
				| tina, some joke. "<="
					| kanye, compliment a. "100"    
					| kanye, compliment b. "200"
				| kanye, compliment c. "2"    
				| kanye, compliment d. "true"
			`, 
			{
				sentiments: [
					Left('question'),
					Left('joke'),
					Left('compliment'), // a
					Left('compliment'), // b
					Left('compliment'), // c
					Left('compliment'), // d
				]
			}
		)
	
		assertEq(result, '2')
	})	
})

describe('world', () => {
	test('sleeping basic', async () => {
		const world = updateCitizen(DefaultWorld, 'kanye', 'sleeping')

		const result = await runProgram(
			{ world, inferenceEndpoint: '' },
			'kanye, compliment a. "100"', 
			{ sentiments: [Left('compliment')] },
		)
	
		assertEq(result, 'kanye is asleep.')
	})
})


// TODO
/**
done
Sleeping citizens
deploy

Now:
MathOperator
plane with windows and names in windows
plane on change do update for 1sec
Terminal as computer
plane with images
mobile style
[maybe] visual plane effects (flying)
[maybe] in "<code>" you can write a comment that wakes someone up half the time
collect more data

go through TODOs
 */

/*
kanye: thank you _$eval_

question
can i get that book?
do you have any drink coupons?
will you die?
where are you headed?
are you single?
did you want an extra pillow?

TODO maybe prune questions from insults
*/ 