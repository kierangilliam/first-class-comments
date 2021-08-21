export type Emotion = ({
	type: 'ok' | 'err',	
} & ({
	type: 'ok',
	evaluation: string
} | {
	type: 'err',
	reason: string,
}))

export type Citizen = string

export type ProgramState = { 
	working: boolean, 
	evaluation: string, 
	history: { input: string, output: string }[],
}

export type Comment = { to: Citizen, comment: string, js_payload: string }