export interface User {
  id: string;
  name: string;
  initials: string;
  colorIndex: number;
  status: 'online' | 'away' | 'busy' | 'offline';
}

export interface Event {
  id: string;
  userId: string;
  displayName: string;
  action: string;
  messageText: string;
  preview: string;
  relativeTime: string;
  timestamp: number;
  mediaUrl?: string;
  type?: 'event' | 'error';
  errorMessage?: string;
}

export interface IncomingEventPayload {
  userId: string;
  displayName: string;
  action: string;
  messageText: string;
  mediaUrl?: string;
  timestamp?: number;
}

export const mockUsers: User[] = [
  { id: '1', name: 'Alex Chen', initials: 'AC', colorIndex: 0, status: 'online' },
  { id: '2', name: 'Sarah Wilson', initials: 'SW', colorIndex: 1, status: 'away' },
  { id: '3', name: 'Mike Rodriguez', initials: 'MR', colorIndex: 2, status: 'online' },
  { id: '4', name: 'Emma Thompson', initials: 'ET', colorIndex: 3, status: 'busy' },
  { id: '5', name: 'David Park', initials: 'DP', colorIndex: 4, status: 'online' },
  { id: '6', name: 'Lisa Johnson', initials: 'LJ', colorIndex: 5, status: 'online' },
  { id: '7', name: 'Chris Miller', initials: 'CM', colorIndex: 0, status: 'away' },
  { id: '8', name: 'Anna Davis', initials: 'AD', colorIndex: 1, status: 'online' },
  { id: '9', name: 'Tom Anderson', initials: 'TA', colorIndex: 2, status: 'offline' },
  { id: '10', name: 'Rachel Green', initials: 'RG', colorIndex: 3, status: 'online' },
  { id: '11', name: 'Kevin Lee', initials: 'KL', colorIndex: 4, status: 'busy' },
  { id: '12', name: 'Maya Patel', initials: 'MP', colorIndex: 5, status: 'online' },
  { id: '13', name: 'Jake Smith', initials: 'JS', colorIndex: 0, status: 'away' },
  { id: '14', name: 'Sophie Brown', initials: 'SB', colorIndex: 1, status: 'online' },
  { id: '15', name: 'Ryan Clark', initials: 'RC', colorIndex: 2, status: 'online' },
  { id: '16', name: 'Zoe Martinez', initials: 'ZM', colorIndex: 3, status: 'offline' },
  { id: '17', name: 'Ben Taylor', initials: 'BT', colorIndex: 4, status: 'online' },
  { id: '18', name: 'Chloe White', initials: 'CW', colorIndex: 5, status: 'busy' },
  { id: '19', name: 'Nick Garcia', initials: 'NG', colorIndex: 0, status: 'online' },
  { id: '20', name: 'Ava Wilson', initials: 'AW', colorIndex: 1, status: 'away' },
];

export const mockEvents: Event[] = [
  {
    id: '1',
    userId: '1',
    displayName: 'Alex Chen',
    action: 'joined',
    messageText: 'Started working on the quarterly report dashboard',
    preview: 'Started working on the quarterly report dashboard',
    relativeTime: '2m ago',
    timestamp: Date.now() - 120000,
  },
  {
    id: '2',
    userId: '2',
    displayName: 'Sarah Wilson',
    action: 'message',
    messageText: 'Hey team, the client meeting has been moved to 3 PM today. Please update your calendars!',
    preview: 'Hey team, the client meeting has been moved to 3 PM today. Please update your calendars!',
    relativeTime: '5m ago',
    timestamp: Date.now() - 300000,
    mediaUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
  },
  {
    id: '3',
    userId: '3',
    displayName: 'Mike Rodriguez',
    action: 'dance',
    messageText: 'Just finished the API integration! Time to celebrate with some moves! 💃🕺',
    preview: 'Just finished the API integration! Time to celebrate with some moves! 💃🕺',
    relativeTime: '8m ago',
    timestamp: Date.now() - 480000,
    mediaUrl: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
  },
  {
    id: '4',
    userId: '4',
    displayName: 'Emma Thompson',
    action: 'party',
    messageText: 'We hit our quarterly goals! 🎉 Team celebration time!',
    preview: 'We hit our quarterly goals! 🎉 Team celebration time!',
    relativeTime: '12m ago',
    timestamp: Date.now() - 720000,
  },
  {
    id: '5',
    userId: '5',
    displayName: 'David Park',
    action: 'cry',
    messageText: 'The deployment failed again... This is so frustrating 😭',
    preview: 'The deployment failed again... This is so frustrating 😭',
    relativeTime: '15m ago',
    timestamp: Date.now() - 900000,
    mediaUrl: 'https://images.unsplash.com/photo-1551033406-611cf9a28f67?w=400&h=300&fit=crop'
  },
  {
    id: '6',
    userId: '6',
    displayName: 'Lisa Johnson',
    action: 'sleep',
    messageText: 'Working late again... need some coffee or maybe just a nap zzz',
    preview: 'Working late again... need some coffee or maybe just a nap zzz',
    relativeTime: '18m ago',
    timestamp: Date.now() - 1080000,
  },
  {
    id: '7',
    userId: '7',
    displayName: 'Chris Miller',
    action: 'rage',
    messageText: 'The server crashed AGAIN during the demo! This is unacceptable! 😡',
    preview: 'The server crashed AGAIN during the demo! This is unacceptable! 😡',
    relativeTime: '25m ago',
    timestamp: Date.now() - 1500000,
    mediaUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
  },
  {
    id: '8',
    userId: '8',
    displayName: 'Anna Davis',
    action: 'message',
    messageText: 'The mockups for the mobile app are ready for feedback. Check them out in Figma!',
    preview: 'The mockups for the mobile app are ready for feedback. Check them out in Figma!',
    relativeTime: '32m ago',
    timestamp: Date.now() - 1920000,
  },
  {
    id: '9',
    userId: '9',
    displayName: 'Tom Anderson',
    action: 'meeting',
    messageText: 'Wrapping up client presentation - great feedback received!',
    preview: 'Wrapping up client presentation - great feedback received!',
    relativeTime: '45m ago',
    timestamp: Date.now() - 2700000,
  },
  {
    id: '10',
    userId: '10',
    displayName: 'Rachel Green',
    action: 'break',
    messageText: 'Quick team building activity in the break room',
    preview: 'Quick team building activity in the break room',
    relativeTime: '1h ago',
    timestamp: Date.now() - 3600000,
  },
];