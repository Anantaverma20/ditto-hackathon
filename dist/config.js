"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: parseInt(process.env.PORT || '3000', 10),
    slackSigningSecret: process.env.SLACK_SIGNING_SECRET || '',
    slackBotToken: process.env.SLACK_BOT_TOKEN || '',
    exaApiKey: process.env.EXA_API_KEY || ''
};
