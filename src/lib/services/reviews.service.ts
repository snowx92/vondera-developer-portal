import { ApiService } from '../api/services/ApiService';
import type {
  ReviewRequest,
  UpdateAppRequest,
  PublishAppRequest,
} from '../types/api.types';

/**
 * Reviews & Publish API Service
 * Handles app review requests and publishing
 */
export class ReviewsService extends ApiService {
  /**
   * Get all review requests for an app
   * @param appId - The app ID
   * @returns Promise<ReviewRequest[]>
   */
  async getReviewRequests(appId: string): Promise<ReviewRequest[]> {
    return await this.get<ReviewRequest[]>(`/apps/${appId}/requests`) || [];
  }

  /**
   * Get a single review request
   * @param appId - The app ID
   * @param requestId - The request ID
   * @returns Promise<ReviewRequest>
   */
  async getReviewRequest(appId: string, requestId: string): Promise<ReviewRequest | null> {
    return await this.get<ReviewRequest>(`/apps/${appId}/requests/${requestId}`);
  }

  /**
   * Submit an update request for review
   * @param appId - The app ID
   * @param data - Update request data
   * @returns Promise<ReviewRequest>
   */
  async submitUpdateRequest(appId: string, data: UpdateAppRequest): Promise<ReviewRequest | null> {
    return await this.post<ReviewRequest>(`/apps/${appId}/requests/update`, data as unknown as Record<string, unknown>);
  }

  /**
   * Submit a publish request for review
   * @param appId - The app ID
   * @returns Promise<ReviewRequest>
   */
  async submitPublishRequest(appId: string): Promise<ReviewRequest | null> {
    return await this.post<ReviewRequest>(`/apps/${appId}/requests/publish`, {});
  }
}
