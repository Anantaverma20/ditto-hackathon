import { config } from '../config';

let exaClientPromise: Promise<any> | null = null;

async function getExaClient() {
	if (!exaClientPromise) {
		exaClientPromise = import('exa-js').then((mod: any) => {
			const Exa = mod.default || mod;
			return new Exa(config.exaApiKey || '');
		});
	}
	return exaClientPromise;
}

export async function fetchGifUrlForAction(action: string, message: string): Promise<string | null> {
	if (!config.exaApiKey) {
		return null;
	}
	const query = buildQuery(action, message);
	try {
		const exa = await getExaClient();
		const results: any = await exa.searchAndContents(query, {
			category: 'image',
			numResults: 3,
			contents: { imageLinks: 3 }
		});
		const first = results?.results?.find((r: any) => r?.extras?.imageLinks?.length);
		const link = first?.extras?.imageLinks?.[0];
		return typeof link === 'string' ? link : null;
	} catch {
		return null;
	}
}

function buildQuery(action: string, message: string): string {
	switch (action) {
		case 'cry':
			return 'cry at desk gif';
		case 'rage':
			return 'angry developer bug meme gif';
		case 'dance':
			return 'celebration success dance gif';
		case 'sleep':
			return 'sleep tired zzz gif';
		case 'party':
			return 'party celebration confetti gif';
		default:
			return `${message || 'reaction'} meme gif`;
	}
}
