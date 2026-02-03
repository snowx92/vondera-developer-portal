import { ApiService } from '../api/services/ApiService';
import type { NotificationsResponse } from '../types/api.types';

/**
 * Notifications API Service
 * Handles all notification-related API requests
 */
export class NotificationsService extends ApiService {
  /**
   * Get paginated notifications
   * @param pageNo - Page number (default: 1)
   * @param limit - Items per page (default: 12)
   * @returns Promise<NotificationsResponse>
   */
  async getNotifications(pageNo: number = 1, limit: number = 12): Promise<NotificationsResponse | null> {
    return await this.get<NotificationsResponse>('/notifications', {
      pageNo: String(pageNo),
      limit: String(limit),
    });
  }

  /**
   * Mark all notifications as read
   */
  async readAllNotifications(): Promise<void> {
    await this.post('/notifications/read-all');
  }

  /**
   * Register FCM token for push notifications
   * @param token - The FCM token
   */
  async registerFcmToken(token: string): Promise<void> {
    await this.post('/notifications/fcm', { token });
  }
}
