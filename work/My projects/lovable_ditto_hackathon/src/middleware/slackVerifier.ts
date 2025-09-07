import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { config } from '../config';

const FIVE_MINUTES = 60 * 5;

export function slackSignatureVerifier(req: Request, res: Response, next: NextFunction) {
	// Temporarily disable verification for testing when no signing secret is set
	if (!config.slackSigningSecret || config.slackSigningSecret === 'your_slack_signing_secret') {
		return next();
	}
	
	try {
		const timestamp = req.headers['x-slack-request-timestamp'];
		const signature = req.headers['x-slack-signature'];
		if (!timestamp || !signature || typeof timestamp !== 'string' || typeof signature !== 'string') {
			return res.status(401).send('Missing Slack signature headers');
		}

		const ts = parseInt(timestamp, 10);
		if (!Number.isFinite(ts) || Math.abs(Date.now() / 1000 - ts) > FIVE_MINUTES) {
			return res.status(401).send('Invalid Slack request timestamp');
		}

		const rawBody: string = (req as any).rawBody || '';
		const basestring = `v0:${timestamp}:${rawBody}`;
		const hmac = crypto.createHmac('sha256', config.slackSigningSecret);
		hmac.update(basestring);
		const mySig = `v0=${hmac.digest('hex')}`;

		const provided = Buffer.from(signature, 'utf8');
		const computed = Buffer.from(mySig, 'utf8');
		if (provided.length !== computed.length || !crypto.timingSafeEqual(provided, computed)) {
			return res.status(401).send('Slack signature mismatch');
		}
		next();
	} catch (err) {
		return res.status(401).send('Slack verification failed');
	}
}
