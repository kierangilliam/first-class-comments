import type { labelMap } from './constants'

export type Sentiment = keyof typeof labelMap

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

// TODO remove js payload
export type Comment = { to: Citizen, comment: string, js_payload?: string }

export type MathOperator = '+' | '-' | '/' | '*'
export type ComparisonOperator = '<' | '>' | '<=' | '>=' | '||' | '&&'

export type ExpressionAST = {
	type: 'if' | 'literal' | 'comparison' | 'operator'
	comment: Comment
} & ({
	type: 'if',
	condition: ExpressionAST,
	consequence: ExpressionAST,
	alternative: ExpressionAST
} | {
	// kanye
	type: 'literal'
	value: string
} | {
	// linus
	// infix only
	type: 'operator'
	operator: '+' | '-' | '/' | '*'
	left: ExpressionAST
	right: ExpressionAST
} | {
	// tina fey
	type: 'comparison'	
	operator: ComparisonOperator
	left: ExpressionAST
	right: ExpressionAST
})