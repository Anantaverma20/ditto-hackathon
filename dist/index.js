"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const config_1 = require("./config");
const websocket_1 = require("./websocket");
const app = (0, express_1.default)();
app.use(express_1.default.json({ verify: (req, _res, buf) => { req.rawBody = buf.toString('utf8'); } }));
const server = http_1.default.createServer(app);
const { broadcast } = (0, websocket_1.createWebSocket)(server);
app.get('/health', (_req, res) => res.status(200).send('ok'));
const slack_1 = require("./routes/slack");
app.post('/slack/events', (0, slack_1.slackEventsRoute)(broadcast));
server.listen(config_1.config.port, () => {
    console.log(`Server listening on http://localhost:${config_1.config.port}`);
    console.log(`WebSocket endpoint ws://localhost:${config_1.config.port}/ws`);
});
