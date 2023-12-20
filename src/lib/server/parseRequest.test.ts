import { describe, expect, it, vi } from 'vitest';

import type { NoteCreateInput } from '$lib/types';
import { NoteCreateInputSchema } from '$lib/types';

import { parseRequest } from './parseRequest';

describe('parseRequest', () => {
	it('should return a NoteCreateInput when parsing succeeds', async () => {
		const noteCreateInput: NoteCreateInput = {
			boardId: 'boardId',
			colour: 'colour',
			id: 'id',
			text: 'text',
			textPlain: 'this is plain text'
		};

		const req = {
			json: vi.fn().mockResolvedValue(noteCreateInput)
		};

		const result = await parseRequest(
			req as any,
			NoteCreateInputSchema,
			'Unable to parse note create input'
		)();

		expect(result).toBeRightStrictEqual(noteCreateInput);
	});

	it('should return a return an error when the parsing fails', async () => {
		const noteCreateInput = {
			badRequest: 'boom'
		};

		const req = {
			json: vi.fn().mockResolvedValue(noteCreateInput)
		};

		const result = await parseRequest(
			req as any,
			NoteCreateInputSchema,
			'Unable to parse note create input'
		)();

		expect(result).toBeLeft('ValidationError');
	});

	it('should return a return an error when the json call rejects', async () => {
		const req = {
			json: vi.fn().mockRejectedValue('boom')
		};

		const result = await parseRequest(
			req as any,
			NoteCreateInputSchema,
			'Unable to parse note create input'
		)();

		expect(result).toBeLeft('ValidationError');
	});
});