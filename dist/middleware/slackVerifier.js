"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.slackSignatureVerifier = slackSignatureVerifier;
const crypto_1 = __importDefault(require("crypto"));
const config_1 = require("../config");
const FIVE_MINUTES = 60 * 5;
function slackSignatureVerifier(req, res, next) {
    // Temporarily disable verification for testing when no signing secret is set
    if (!config_1.config.slackSigningSecret || config_1.config.slackSigningSecret === 'your_slack_signing_secret') {
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
        const rawBody = req.rawBody || '';
        const basestring = `v0:${timestamp}:${rawBody}`;
        const hmac = crypto_1.default.createHmac('sha256', config_1.config.slackSigningSecret);
        hmac.update(basestring);
        const mySig = `v0=${hmac.digest('hex')}`;
        const provided = Buffer.from(signature, 'utf8');
        const computed = Buffer.from(mySig, 'utf8');
        if (provided.length !== computed.length || !crypto_1.default.timingSafeEqual(provided, computed)) {
            return res.status(401).send('Slack signature mismatch');
        }
        next();
    }
    catch (err) {
        return res.status(401).send('Slack verification failed');
    }
}
