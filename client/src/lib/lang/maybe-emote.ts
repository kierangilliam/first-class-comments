import { choice } from '$lib/utils';
import { firstClassCitizens } from './constants';
import type { Comment, Emotion } from './types';

/**
TODO the following were being miscategorized. 
Add too...

insults:
you suck
 */

const maybeEmote = async ({ comment, js_payload, to }: Comment): Promise<Emotion> => {
	const res = await fetch('http://localhost:8999/emote', { 
		method: 'post',
		body: JSON.stringify({ comment }),
	})

	if (res.status != 200) {
		const reason = await res.text()
		return { type: 'err', reason }
	}

	const emote = await res.text()
	const relevantCitizen = firstClassCitizens[emote]

	console.debug({emote, relevantCitizen})

	if (!relevantCitizen) 
		return { type: 'err', reason: `There is no one in first class to handle ${emote}` }

	if (relevantCitizen !== to) {
		const response = choice([
			'shrugged you off',
			'ignored your comment',
			'looked confused by your comment',
		])

		return { type: 'err', reason: `${to} ${response}.` }
	}		

	// TODO check if sleeping, is mad, etc

	return { type: 'ok', evaluation: eval(js_payload) }
}

export default maybeEmote