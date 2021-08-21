import assert from 'assert';
import type { Comment, ExpressionAST } from './types';

export const assertEq = (a: unknown, b: unknown): void => {
	assert.deepStrictEqual(a, b)
}

export const com = (to: string, comment: string): Comment => ({ to, comment })

export const lit = (value: string, comment: Comment): ExpressionAST => ({
	type: 'literal',
	value,
	comment,
})