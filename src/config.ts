import dotenv from 'dotenv';

dotenv.config();

export const config = {
	port: parseInt(process.env.PORT || '3000', 10),
	slackSigningSecret: process.env.SLACK_SIGNING_SECRET || '',
	slackBotToken: process.env.SLACK_BOT_TOKEN || '',
	exaApiKey: process.env.EXA_API_KEY || ''
};

export type AppConfig = typeof config;
