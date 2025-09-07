export interface User {
  id: string;
  name: string;
  initials: string;
  colorIndex: number;
  status: 'online' | 'away' | 'busy' | 'offline';
}

export interface Event {
  id: string;
  displayName: string;
  action: 'joined' | 'left' | 'message' | 'break' | 'meeting';
  preview: string;
  relativeTime: string;
  timestamp: number;
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
    displayName: 'Alex Chen',
    action: 'joined',
    preview: 'Started working on the quarterly report dashboard',
    relativeTime: '2 minutes ago',
    timestamp: Date.now() - 120000,
  },
  {
    id: '2',
    displayName: 'Sarah Wilson',
    action: 'message',
    preview: 'Hey team, the client meeting has been moved to 3 PM today. Please update your calendars!',
    relativeTime: '5 minutes ago',
    timestamp: Date.now() - 300000,
  },
  {
    id: '3',
    displayName: 'Mike Rodriguez',
    action: 'break',
    preview: 'Taking a coffee break after finishing the API integration',
    relativeTime: '8 minutes ago',
    timestamp: Date.now() - 480000,
  },
  {
    id: '4',
    displayName: 'Emma Thompson',
    action: 'meeting',
    preview: 'Started standup meeting with the design team',
    relativeTime: '12 minutes ago',
    timestamp: Date.now() - 720000,
  },
  {
    id: '5',
    displayName: 'David Park',
    action: 'message',
    preview: 'Just pushed the latest changes to the main branch. Ready for review!',
    relativeTime: '15 minutes ago',
    timestamp: Date.now() - 900000,
  },
  {
    id: '6',
    displayName: 'Lisa Johnson',
    action: 'joined',
    preview: 'Back from vacation and ready to tackle the new project requirements',
    relativeTime: '18 minutes ago',
    timestamp: Date.now() - 1080000,
  },
  {
    id: '7',
    displayName: 'Chris Miller',
    action: 'left',
    preview: 'Heading out for lunch after completing the user testing session',
    relativeTime: '25 minutes ago',
    timestamp: Date.now() - 1500000,
  },
  {
    id: '8',
    displayName: 'Anna Davis',
    action: 'message',
    preview: 'The mockups for the mobile app are ready for feedback. Check them out in Figma!',
    relativeTime: '32 minutes ago',
    timestamp: Date.now() - 1920000,
  },
  {
    id: '9',
    displayName: 'Tom Anderson',
    action: 'meeting',
    preview: 'Wrapping up client presentation - great feedback received!',
    relativeTime: '45 minutes ago',
    timestamp: Date.now() - 2700000,
  },
  {
    id: '10',
    displayName: 'Rachel Green',
    action: 'break',
    preview: 'Quick team building activity in the break room',
    relativeTime: '1 hour ago',
    timestamp: Date.now() - 3600000,
  },
];