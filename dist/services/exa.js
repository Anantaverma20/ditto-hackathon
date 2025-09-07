"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchGifUrlForAction = fetchGifUrlForAction;
const config_1 = require("../config");
let exaClientPromise = null;
async function getExaClient() {
    if (!exaClientPromise) {
        exaClientPromise = Promise.resolve().then(() => __importStar(require('exa-js'))).then((mod) => {
            const Exa = mod.default || mod;
            return new Exa(config_1.config.exaApiKey || '');
        });
    }
    return exaClientPromise;
}
async function fetchGifUrlForAction(action, message) {
    if (!config_1.config.exaApiKey) {
        return null;
    }
    const query = buildQuery(action, message);
    try {
        const exa = await getExaClient();
        const results = await exa.searchAndContents(query, {
            category: 'image',
            numResults: 3,
            contents: { imageLinks: 3 }
        });
        const first = results?.results?.find((r) => r?.extras?.imageLinks?.length);
        const link = first?.extras?.imageLinks?.[0];
        return typeof link === 'string' ? link : null;
    }
    catch {
        return null;
    }
}
function buildQuery(action, message) {
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
