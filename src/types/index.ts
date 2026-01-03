import React from 'react';

export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string; // ISO string
  duration: number; // in minutes
  host: User;
  participants: User[];
  recordingStatus: 'Processing' | 'Ready' | 'No Recording';
  aiSummaryStatus: 'Analyzing' | 'Completed' | 'Pending';
  type: 'instant' | 'scheduled';
}

export interface ActionItem {
  id: string;
  description: string;
  dueDate: string;
  meetingOriginId: string;
  meetingTitle: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
  assignee: User;
}

export interface Notification {
  id: string;
  type: 'invite' | 'recording_ready' | 'report' | 'task' | 'join_request';
  message: string;
  timestamp: string;
  read: boolean;
  userId?: string; // User ID của người yêu cầu join
  userName?: string; // Tên người yêu cầu
  roomId?: string; // ID phòng
  status?: 'pending' | 'approved' | 'rejected'; // Status của yêu cầu
}

export interface StatMetric {
  label: string;
  value: string | number;
  trend: 'up' | 'down' | 'neutral';
  trendValue: string;
  icon: React.ElementType;
}

export type ApiResponse<T> = {
  data: T
  message?: string
}
