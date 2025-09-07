"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyMessage = classifyMessage;
const rules = [
    { keywords: ['deadline', 'due', 'late', 'delay', 'overdue', 'stress', 'overwhelmed', 'tired'], action: 'cry' },
    { keywords: ['bug', 'error', 'crash', 'issue', 'fail', 'broken', 'angry', 'frustrated', 'mad'], action: 'rage' },
    { keywords: ['success', 'shipped', 'done', 'fixed', 'win', 'yay', 'hooray', 'celebration'], action: 'dance' },
    { keywords: ['sleep', 'tired', 'exhausted', 'nap', 'zzz', 'bedtime', 'rest'], action: 'sleep' },
    { keywords: ['party', 'celebrate', 'fun', 'excited', 'woohoo', 'awesome', 'amazing'], action: 'party' }
];
function classifyMessage(text) {
    if (!text) {
        return { action: 'neutral', matched: null, confidence: 0 };
    }
    const normalized = text.toLowerCase();
    for (const rule of rules) {
        for (const kw of rule.keywords) {
            const re = new RegExp(`(?:^|[^a-z])${escapeRegex(kw)}(?:[^a-z]|$)`);
            if (re.test(normalized)) {
                return { action: rule.action, matched: kw, confidence: 0.9 };
            }
        }
    }
    return { action: 'neutral', matched: null, confidence: 0.2 };
}
function escapeRegex(input) {
    return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
