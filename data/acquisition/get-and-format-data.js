'use strict';
const snoowrap = require('snoowrap');
const fs = require('fs');
const {readFile} = require('fs/promises');
const assert = require('assert');
// const fetch = require('node-fetch');
require('dotenv').config()

const labelMap = { compliment: 0, question: 1, joke: 2, hacker: 3, insult: 4, sad_quote: 5 }

const { userAgent, clientId, clientSecret, refreshToken, accessToken } = process.env
const r = new snoowrap({ userAgent, clientId, clientSecret, refreshToken, accessToken })

r.config({ debug: true })

const removeTabNewlines = str => str.replace(/\n/g, ' ').replace(/\t/, ' ')

const fromFile = async (filename) => {
	const data = await readFile(filename, 'utf8')
	return data.split('\n')
}

const getBody = post => post.selftext
const getTitle = post => post.title
const getTitlesFromPosts = posts => posts.map(getTitle)
const topFromSub = (sub, limit) => r.getSubreddit(sub).getTop({ limit, time: 'year' })

async function getQuestions(total) {
	const numReddits = 1
	const limit = Math.floor(total / numReddits)

	const fromAskReddit = async () => {
		const posts = await topFromSub('AskReddit', limit)
		return getTitlesFromPosts(posts)
	}

	return (
		await Promise.all([ fromAskReddit(),  ])
	).flatMap(x => x)
}

async function getHacker(total) {
	const posts = await topFromSub('hackernews', total)
	return getTitlesFromPosts(posts)
}

async function getJokes(total) {
	const posts = await topFromSub('jokes', total * 2)
	
	return posts
		.map(post => getTitle(post) + ' ' + getBody(post))
		// FIXME this causes the number of jokes to be cut in half..roughly. 
		// Dirty fix is the above * 2
		.filter(joke => joke.length < 200)		
}

async function getCompliments() {
	// const printMantelligence = async () => {
	// 	const res = await fetch('https://www.mantelligence.com/compliments/')
	// 	const html = await res.text()
	// 	const r = /<h4 class="quest compliments">\d*\.(.*?)<\/h4>/g
	// 	const matches = html.match(r)
	// 		.map(match => { const res = r.exec(match); return res ? res[1] : null })
	// 		.filter(match => typeof match === 'string' && match != null)
	// 		.map(x => x.replace(/&rsquo;/g, '\''))

	// 	console.log(matches.length)
	// 	return matches.join('\n')
	// }
	// printMantelligence().then(console.log)

	return fromFile('./data/compliments')
}

async function getInsults() {
	return fromFile('./data/insults')
}

async function getSadQuotes() {
	return fromFile('./data/sad')
}

async function main() {
	const categorySize = 600
	const trainSize = .80	
	
	// TODO history fact
	const [compliment, question, hacker, joke, insult, sad_quote] = await Promise.all([
		getCompliments(),
		getQuestions(categorySize),
		getHacker(categorySize),
		// TODO use https://pun.me/funny/
		getJokes(categorySize),
		getInsults(),
		getSadQuotes(),
	])

	const results = { compliment, question, joke, hacker, insult, sad_quote }		
	
	assert(Object.keys(results).join() == Object.keys(labelMap).join())

	/** From https://huggingface.co/docs/datasets/v1.1.3/loading_datasets.html#json-files 
		 The most efficient format is to have JSON files consisting of multiple JSON objects, 
		one per line, representing individual data rows:
		```
		{"a": 1, "b": 2.0, "c": "foo", "d": false}
		{"a": 4, "b": -5.5, "c": null, "d": true}
		```
	 */
	const formattedForHuggingFace = Object.entries(results)
		.flatMap(([labelKey, sentences]) => {
			const label = labelMap[labelKey]

			if (label == null) throw new Error(`Unknown label id ${label}`)

			return sentences
				.map(removeTabNewlines)
				// syntax uses " to delineate comment (<name>, "<comment>"...)
				// so it must be replaced
				.map(sentence => sentence.replace('"', '\''))
				.map(sentence => JSON.stringify({ label, sentence }))
		})
		
	shuffle(formattedForHuggingFace)

	const partition = (start, end) => formattedForHuggingFace.slice(start, end)
	
	const trainEnd = Math.floor(formattedForHuggingFace.length * trainSize)
	const train = partition(0, trainEnd)
	
	// split test and validate set evenly
	const mid = Math.floor((formattedForHuggingFace.length - trainEnd) / 2) + trainEnd
	const test = partition(trainEnd, mid)
	const validation = partition(mid)	

	const stats = Object.entries(results)
		.map(([name, res]) => name + ' : ' + res.length)
		.join('\n') 
		+ `\ntotal: ${formattedForHuggingFace.length}`
		+ `\ntrain: ${train.length}`
		+ `\ntest: ${test.length}`
		+ `\nvalidation: ${validation.length}`

	console.log(results)
	console.log(stats)

	fs.writeFileSync('./data/train.json', train.join('\n'))	
	fs.writeFileSync('./data/test.json', test.join('\n'))	
	fs.writeFileSync('./data/validation.json', validation.join('\n'))	
	fs.writeFileSync('./data/data.stats', stats)	
}

main()

// https://stackoverflow.com/a/12646864
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}
