import http from 'http';
import express from 'express';
import { config } from './config';
import { slackSignatureVerifier } from './middleware/slackVerifier';
import { createWebSocket } from './websocket';
import type { Request, Response } from 'express';

const app = express();

app.use(express.json({ verify: (req: any, _res: Response, buf: Buffer) => { req.rawBody = buf.toString('utf8'); } }));

const server = http.createServer(app);
const { broadcast } = createWebSocket(server);

app.get('/health', (_req: Request, res: Response) => res.status(200).send('ok'));

import { slackEventsRoute } from './routes/slack';
app.post('/slack/events', slackEventsRoute(broadcast));

server.listen(config.port, () => {
	console.log(`Server listening on http://localhost:${config.port}`);
	console.log(`WebSocket endpoint ws://localhost:${config.port}/ws`);
});
