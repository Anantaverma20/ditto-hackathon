"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackEventsRoute = slackEventsRoute;
const classifier_1 = require("../utils/classifier");
const exa_1 = require("../services/exa");
function slackEventsRoute(broadcast) {
    return async function handler(req, res) {
        const retryNum = req.headers['x-slack-retry-num'];
        const body = req.body;
        if (body && body.type === 'url_verification') {
            return res.status(200).json({ challenge: body.challenge });
        }
        if (body && body.type === 'event_callback') {
            const event = body.event || {};
            if (event.type === 'message') {
                if (event.subtype || event.bot_id) {
                    return res.status(200).send('ignored');
                }
                const text = event.text || '';
                const classification = (0, classifier_1.classifyMessage)(text);
                const gifUrl = await (0, exa_1.fetchGifUrlForAction)(classification.action, text);
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
