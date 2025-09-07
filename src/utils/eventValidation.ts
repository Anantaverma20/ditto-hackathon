import { IncomingEventPayload, Event } from '@/data/mockData';

export interface ValidationError {
  field: string;
  message: string;
}

export function validateEventPayload(payload: any): { isValid: boolean; errors: ValidationError[]; validatedPayload?: IncomingEventPayload } {
  const errors: ValidationError[] = [];

  // Check required fields
  if (!payload.userId || typeof payload.userId !== 'string' || payload.userId.trim() === '') {
    errors.push({ field: 'userId', message: 'userId is required and must be a non-empty string' });
  }

  if (!payload.displayName || typeof payload.displayName !== 'string' || payload.displayName.trim() === '') {
    errors.push({ field: 'displayName', message: 'displayName is required and must be a non-empty string' });
  }

  if (!payload.action || typeof payload.action !== 'string' || payload.action.trim() === '') {
    errors.push({ field: 'action', message: 'action is required and must be a non-empty string' });
  }

  if (!payload.messageText || typeof payload.messageText !== 'string' || payload.messageText.trim() === '') {
    errors.push({ field: 'messageText', message: 'messageText is required and must be a non-empty string' });
  }

  // Check optional fields
  if (payload.mediaUrl && (typeof payload.mediaUrl !== 'string' || payload.mediaUrl.trim() === '')) {
    errors.push({ field: 'mediaUrl', message: 'mediaUrl must be a non-empty string if provided' });
  }

  if (payload.timestamp && (!Number.isInteger(payload.timestamp) || payload.timestamp < 0)) {
    errors.push({ field: 'timestamp', message: 'timestamp must be a positive integer if provided' });
  }

  if (errors.length > 0) {
    return { isValid: false, errors };
  }

  const validatedPayload: IncomingEventPayload = {
    userId: payload.userId.trim(),
    displayName: payload.displayName.trim(),
    action: payload.action.trim(),
    messageText: payload.messageText.trim(),
    mediaUrl: payload.mediaUrl?.trim(),
    timestamp: payload.timestamp || Date.now()
  };

  return { isValid: true, errors: [], validatedPayload };
}

export function createValidEvent(payload: IncomingEventPayload): Event {
  const id = `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const preview = payload.messageText.length > 120 
    ? payload.messageText.substring(0, 117) + '...' 
    : payload.messageText;
  
  const relativeTime = formatRelativeTime(payload.timestamp!);

  return {
    id,
    userId: payload.userId,
    displayName: payload.displayName,
    action: payload.action,
    messageText: payload.messageText,
    preview,
    relativeTime,
    timestamp: payload.timestamp!,
    mediaUrl: payload.mediaUrl,
    type: 'event'
  };
}

export function createErrorEvent(errors: ValidationError[], rawPayload: any): Event {
  const id = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const errorMessage = errors.map(e => `${e.field}: ${e.message}`).join('; ');
  const preview = `Validation failed: ${errorMessage}`;
  
  return {
    id,
    userId: 'system',
    displayName: 'System Error',
    action: 'error',
    messageText: `Invalid event payload received: ${JSON.stringify(rawPayload)}`,
    preview: preview.length > 120 ? preview.substring(0, 117) + '...' : preview,
    relativeTime: 'just now',
    timestamp: Date.now(),
    type: 'error',
    errorMessage
  };
}

function formatRelativeTime(timestamp: number): string {
  const now = Date.now();
  const diff = now - timestamp;
  
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  return `${days} day${days !== 1 ? 's' : ''} ago`;
}