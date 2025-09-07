"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createWebSocket = createWebSocket;
const ws_1 = require("ws");
function createWebSocket(server) {
    const wss = new ws_1.WebSocketServer({ server, path: '/ws' });
    wss.on('connection', (socket) => {
        socket.send(JSON.stringify({ type: 'connected', ts: Date.now() }));
    });
    function broadcast(payload) {
        const data = JSON.stringify(payload);
        for (const client of wss.clients) {
            if (client.readyState === 1) {
                client.send(data);
            }
        }
    }
    return { wss, broadcast };
}
