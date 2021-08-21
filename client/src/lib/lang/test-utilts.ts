import assert from 'assert';
import type { Comment, ComparisonOperator, ExpressionAST } from './types';

export const assertEq = (a: unknown, b: unknown, message?: string): void => {
	assert.deepStrictEqual(a, b, message)
}

export const com = (to: string, comment: string): Comment => ({ to, comment })

export const lit = (value: string, comment: Comment): ExpressionAST => ({
	type: 'literal',
	value,
	comment,
})

export const comp = (
	operator: ComparisonOperator, left: ExpressionAST, right: ExpressionAST, comment: Comment
): ExpressionAST => ({
	type: 'comparison', left, right, operator, comment,
})