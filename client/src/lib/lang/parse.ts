import type { Res } from "$lib/trust";
import { Err, Ok } from "$lib/trust";
import type { Comment } from "./types";

/**
jerry, "you suck" 1 + 3
 */
const parse = (input: string): Res<Comment> => {
	const matches = /^(\w+)\s*,\s*"(.*)"\s*(.*)$/g.exec(input.trim())

	console.log(input.trim(), matches)
	if (matches?.length != 4) {
		return Err(`Bad input. Syntax: <citizen's name>, "<your comment>" <js code>`)
	}		

	const [_, to, comment, js_payload] = matches

	return Ok({ to, comment, js_payload })
}

export default parse