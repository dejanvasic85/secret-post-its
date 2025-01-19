import { error, type RequestHandler } from '@sveltejs/kit';
import { pipe } from 'fp-ts/lib/function';
import { taskEither as TE } from 'fp-ts';

import { mapToApiError } from '$lib/server/mapApi';
import { removeConnection } from '$lib/server/services/friendService';

export const DELETE: RequestHandler = ({ locals, params }) => {
	if (!locals.user) {
		return error(401, { message: 'Unauthorized' });
	}

	const friendId = params.id!;
	return pipe(
		removeConnection(locals.user!.id, friendId),
		TE.mapLeft(mapToApiError),
		TE.match(
			(err) => error(err.status, { message: err.message }),
			() => new Response(null, { status: 204 })
		)
	)();
};