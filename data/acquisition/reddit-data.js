'use strict';
const snoowrap = require('snoowrap');
const fs = require('fs');
require('dotenv').config()

const { userAgent, clientId, clientSecret, refreshToken, accessToken } = process.env
const r = new snoowrap({ userAgent, clientId, clientSecret, refreshToken, accessToken })

r.config({ debug: true })

const removeTabNewlines = str => str.replace('\n', ' ').replace('\t', ' ')

const getBody = post => post.selftext
const getTitle = post => post.title
const getTitlesFromPosts = posts => posts.map(getTitle)
const topFromSub = (sub, limit) => r.getSubreddit(sub).getTop({ limit, time: 'year' })

async function getQuestions(total) {
	const fromAskReddit = async (limit) => {
		const posts = await topFromSub('AskReddit', limit)
		return getTitlesFromPosts(posts)
	}

	const numReddits = 1

	return (
		await Promise.all([
			fromAskReddit(Math.floor(total / numReddits)),
		])
	).flatMap(x => x)
}

async function getCuriousHacker(total) {
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
		.map(removeTabNewlines)
}

async function main() {
	const categorySize = 200

	const questions = await getQuestions(categorySize)
	const curiousHacker = await getCuriousHacker(categorySize)
	const jokes = await getJokes(categorySize)

	const results = { questions, jokes, curiousHacker }
	
	console.log(results)
	
	Object.entries(results).forEach(([name, res]) => {
		console.log(name, ' : ', res.length)
	})

	fs.writeFileSync('./data.json', JSON.stringify(results))	
}

main()