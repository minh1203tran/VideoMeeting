import { Notification } from '../types';

// In-memory store for notifications (with localStorage persistence)
let notifications: Notification[] = [];

// Subscribers for real-time updates
const subscribers: ((notifications: Notification[]) => void)[] = [];

// Load notifications from localStorage on startup
const loadFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem('notifications');
    if (stored) {
      notifications = JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading notifications from localStorage:', error);
  }
};

// Save notifications to localStorage
const saveToLocalStorage = () => {
  try {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  } catch (error) {
    console.error('Error saving notifications to localStorage:', error);
  }
};

// Initialize on module load
loadFromLocalStorage();

export const notificationService = {
  // Get all notifications
  getNotifications: () => notifications,

  // Add a new notification
  addNotification: (notification: Notification) => {
    notifications.unshift(notification); // Add to beginning for newest first
    saveToLocalStorage();
    notifySubscribers();
  },

  // Update a notification
  updateNotification: (id: string, updates: Partial<Notification>) => {
    const index = notifications.findIndex(n => n.id === id);
    if (index !== -1) {
      notifications[index] = { ...notifications[index], ...updates };
      saveToLocalStorage();
      notifySubscribers();
    }
  },

  // Remove a notification
  removeNotification: (id: string) => {
    notifications = notifications.filter(n => n.id !== id);
    saveToLocalStorage();
    notifySubscribers();
  },

  // Subscribe to notification changes
  subscribe: (callback: (notifications: Notification[]) => void) => {
    subscribers.push(callback);
    // Return unsubscribe function
    return () => {
      const index = subscribers.indexOf(callback);
      if (index > -1) {
        subscribers.splice(index, 1);
      }
    };
  },

  // Notify all subscribers of changes
  notifySubscribers: () => {
    subscribers.forEach(callback => callback([...notifications]));
  },

  // Mark notification as read
  markAsRead: (id: string) => {
    const notification = notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
      saveToLocalStorage();
      notifySubscribers();
    }
  },

  // Mark all as read
  markAllAsRead: () => {
    notifications.forEach(n => n.read = true);
    saveToLocalStorage();
    notifySubscribers();
  },

  // Get unread count
  getUnreadCount: () => {
    return notifications.filter(n => !n.read).length;
  },

  // Clear all notifications (for testing)
  clearAll: () => {
    notifications = [];
    saveToLocalStorage();
    notifySubscribers();
  }
};

// Helper function to notify subscribers
const notifySubscribers = () => {
  subscribers.forEach(callback => callback([...notifications]));
};
