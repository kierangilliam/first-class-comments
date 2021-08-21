import type { ExpressionAST } from './types';

export const evaluate = (ast: ExpressionAST): string => {
	switch (ast.type) {
		case 'if':
			if (isTruthy(evaluate(ast.condition))) {
				return evaluate(ast.consequence)
			} else {
				return evaluate(ast.alternative)
			}
		case 'literal':
			return ast.value
		default:
			throw new Error(`Unimplemented: AST type ${ast.type}`)
	}
}

const isTruthy = (value: string): boolean => {
	if (value === 'true') return true
	if (value === 'false') return false
}