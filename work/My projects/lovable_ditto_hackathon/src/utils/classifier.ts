export type Classification = {
	action: 'cry' | 'rage' | 'dance' | 'sleep' | 'party' | 'neutral';
	matched: string | null;
	confidence: number; // 0-1
};

const rules: Array<{ keywords: string[]; action: Classification['action'] }> = [
	{ keywords: ['deadline', 'due', 'late', 'delay', 'overdue', 'stress', 'overwhelmed', 'tired'], action: 'cry' },
	{ keywords: ['bug', 'error', 'crash', 'issue', 'fail', 'broken', 'angry', 'frustrated', 'mad'], action: 'rage' },
	{ keywords: ['success', 'shipped', 'done', 'fixed', 'win', 'yay', 'hooray', 'celebration'], action: 'dance' },
	{ keywords: ['sleep', 'tired', 'exhausted', 'nap', 'zzz', 'bedtime', 'rest'], action: 'sleep' },
	{ keywords: ['party', 'celebrate', 'fun', 'excited', 'woohoo', 'awesome', 'amazing'], action: 'party' }
];

export function classifyMessage(text: string | undefined | null): Classification {
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

function escapeRegex(input: string): string {
	return input.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
