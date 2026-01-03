import { Meeting, ActionItem, User } from '../types';

export const CURRENT_USER: User = {
  id: 'u1',
  name: 'Alex Pham',
  email: 'alex.pham@example.com',
  avatar: 'https://picsum.photos/seed/alex/100/100',
};

export const MOCK_USERS: User[] = [
  CURRENT_USER,
  { id: 'u2', name: 'User 2', email: 'user2@example.com', avatar: '' },
  { id: 'u3', name: 'User 3', email: 'user3@example.com', avatar: '' },
  { id: 'u4', name: 'User 4', email: 'user4@example.com', avatar: '' },
];

export const UPCOMING_MEETINGS: Meeting[] = [
  {
    id: 'm1',
    title: 'Product Roadmap Review',
    date: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
    duration: 60,
    host: MOCK_USERS[1],
    participants: [CURRENT_USER, MOCK_USERS[1], MOCK_USERS[2]],
    recordingStatus: 'No Recording',
    aiSummaryStatus: 'Pending',
    type: 'scheduled',
  },
  {
    id: 'm2',
    title: 'Design Sync',
    date: new Date(new Date().setHours(14, 30, 0, 0)).toISOString(),
    duration: 45,
    host: CURRENT_USER,
    participants: [CURRENT_USER, MOCK_USERS[3]],
    recordingStatus: 'No Recording',
    aiSummaryStatus: 'Pending',
    type: 'scheduled',
  },
  {
    id: 'm3',
    title: 'Client Onboarding',
    date: new Date(new Date().setHours(16, 0, 0, 0)).toISOString(),
    duration: 30,
    host: MOCK_USERS[2],
    participants: [CURRENT_USER, MOCK_USERS[2]],
    recordingStatus: 'No Recording',
    aiSummaryStatus: 'Pending',
    type: 'scheduled',
  }
];

export const RECENT_MEETINGS: Meeting[] = [
  {
    id: 'rm1',
    title: 'Q3 Marketing Strategy',
    date: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    duration: 90,
    host: CURRENT_USER,
    participants: [CURRENT_USER, MOCK_USERS[1], MOCK_USERS[2], MOCK_USERS[3]],
    recordingStatus: 'Ready',
    aiSummaryStatus: 'Completed',
    type: 'scheduled',
  },
  {
    id: 'rm2',
    title: 'Weekly Standup',
    date: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    duration: 15,
    host: MOCK_USERS[1],
    participants: [CURRENT_USER, MOCK_USERS[1], MOCK_USERS[2], MOCK_USERS[3]],
    recordingStatus: 'Ready',
    aiSummaryStatus: 'Completed',
    type: 'scheduled',
  },
  {
    id: 'rm3',
    title: 'Emergency Bug Fix',
    date: new Date(Date.now() - 200000000).toISOString(),
    duration: 45,
    host: MOCK_USERS[2],
    participants: [CURRENT_USER, MOCK_USERS[2]],
    recordingStatus: 'Processing',
    aiSummaryStatus: 'Analyzing',
    type: 'instant',
  },
];

export const ACTION_ITEMS: ActionItem[] = [
  {
    id: 'a1',
    description: 'Update Figma prototypes for Dashboard',
    dueDate: new Date(new Date().setHours(17, 0, 0, 0)).toISOString(), // Today
    meetingOriginId: 'rm1',
    meetingTitle: 'Q3 Marketing Strategy',
    priority: 'High',
    status: 'Pending',
    assignee: CURRENT_USER,
  },
  {
    id: 'a2',
    description: 'Send Q3 Report to Stakeholders',
    dueDate: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    meetingOriginId: 'rm1',
    meetingTitle: 'Q3 Marketing Strategy',
    priority: 'Medium',
    status: 'In Progress',
    assignee: CURRENT_USER,
  },
  {
    id: 'a3',
    description: 'Fix login bug on Safari',
    dueDate: new Date(Date.now() - 86400000).toISOString(), // Yesterday (Overdue)
    meetingOriginId: 'rm3',
    meetingTitle: 'Emergency Bug Fix',
    priority: 'High',
    status: 'Pending',
    assignee: CURRENT_USER,
  },
  {
    id: 'a4',
    description: 'Schedule team building event',
    dueDate: new Date(Date.now() + 400000000).toISOString(),
    meetingOriginId: 'rm2',
    meetingTitle: 'Weekly Standup',
    priority: 'Low',
    status: 'Pending',
    assignee: CURRENT_USER,
  },
    {
    id: 'a5',
    description: 'Review new hiring candidates',
    dueDate: new Date(Date.now() + 200000000).toISOString(),
    meetingOriginId: 'rm2',
    meetingTitle: 'Weekly Standup',
    priority: 'Medium',
    status: 'Completed',
    assignee: CURRENT_USER,
  }
];
