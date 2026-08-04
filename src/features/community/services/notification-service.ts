import type { Notification, NotificationType } from '@/types/domain';

/**
 * Notification Service
 * Manages user notifications
 */

class NotificationService {
  private notifications: Map<string, Notification> = new Map();

  create(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string
  ): Notification {
    const id = `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newNotification: Notification = {
      id,
      userId,
      type,
      title,
      message,
      link,
      isRead: false,
      createdAt: new Date().toISOString(),
    };

    this.notifications.set(id, newNotification);
    return newNotification;
  }

  getByUser(userId: string, limit: number = 50): Notification[] {
    return Array.from(this.notifications.values())
      .filter((n) => n.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }

  markAsRead(id: string): void {
    const notification = this.notifications.get(id);
    if (notification) {
      notification.isRead = true;
    }
  }

  markAllAsRead(userId: string): void {
    Array.from(this.notifications.values())
      .filter((n) => n.userId === userId && !n.isRead)
      .forEach((n) => {
        n.isRead = true;
      });
  }

  getUnreadCount(userId: string): number {
    return Array.from(this.notifications.values()).filter(
      (n) => n.userId === userId && !n.isRead
    ).length;
  }

  delete(id: string): boolean {
    return this.notifications.delete(id);
  }

  // Notification creators for common events
  notifyNewFollower(userId: string, followerName: string): Notification {
    return this.create(
      userId,
      'new_follower',
      'New Follower',
      `${followerName} started following you`,
      '/profile'
    );
  }

  notifyNewComment(
    userId: string,
    commenterName: string,
    contentType: string,
    contentTitle: string
  ): Notification {
    return this.create(
      userId,
      'comment',
      'New Comment',
      `${commenterName} commented on your ${contentType}: ${contentTitle}`,
      `/community/${contentType}`
    );
  }

  notifyNewLike(
    userId: string,
    likerName: string,
    contentType: string,
    contentTitle: string
  ): Notification {
    return this.create(
      userId,
      'like',
      'New Like',
      `${likerName} liked your ${contentType}: ${contentTitle}`,
      `/community/${contentType}`
    );
  }

  notifyContentApproved(userId: string, contentType: string, contentTitle: string): Notification {
    return this.create(
      userId,
      'guide_approved',
      'Content Approved',
      `Your ${contentType} "${contentTitle}" has been approved`,
      `/community/${contentType}`
    );
  }

  notifyMention(
    userId: string,
    mentionerName: string,
    contentType: string
  ): Notification {
    return this.create(
      userId,
      'mention',
      'You were mentioned',
      `${mentionerName} mentioned you in a ${contentType}`,
      `/community/${contentType}`
    );
  }
}

export const notificationService = new NotificationService();
