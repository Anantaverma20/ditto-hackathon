import { Server as HttpServer } from 'http';
import { WebSocketServer } from 'ws';

export type BroadcastPayload = Record<string, unknown>;

export function createWebSocket(server: HttpServer) {
	const wss = new WebSocketServer({ server, path: '/ws' });

	wss.on('connection', (socket) => {
		socket.send(JSON.stringify({ type: 'connected', ts: Date.now() }));
	});

	function broadcast(payload: BroadcastPayload) {
		const data = JSON.stringify(payload);
		for (const client of wss.clients) {
			if ((client as any).readyState === 1) {
				(client as any).send(data);
			}
		}
	}

	return { wss, broadcast };
}
