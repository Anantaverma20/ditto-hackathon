import type { Request, Response } from 'express';
import { classifyMessage } from '../utils/classifier';
import { fetchGifUrlForAction } from '../services/exa';

export function slackEventsRoute(broadcast: (payload: Record<string, unknown>) => void) {
	return async function handler(req: Request, res: Response) {
		const retryNum = req.headers['x-slack-retry-num'];
		const body = req.body as any;

		if (body && body.type === 'url_verification') {
			return res.status(200).json({ challenge: body.challenge });
		}

		if (body && body.type === 'event_callback') {
			const event = body.event || {};
			if (event.type === 'message') {
				if (event.subtype || event.bot_id) {
					return res.status(200).send('ignored');
				}
				const text: string = event.text || '';
				const classification = classifyMessage(text);
				const gifUrl = await fetchGifUrlForAction(classification.action, text);
				broadcast({
					type: 'slack_message_action',
					action: classification.action,
					matched: classification.matched,
					confidence: classification.confidence,
					mediaUrl: gifUrl,
					messageText: text,
					userId: 'user-1', // Fixed user ID
					displayName: 'You', // Better display name
					room: 'office', // Add room field
					channel: event.channel,
					ts: event.ts
				});
			}
			return res.status(200).send('ok');
		}

		if (typeof retryNum !== 'undefined') {
			return res.status(200).send('retry ignored');
		}

		return res.status(200).send('noop');
	};
}
