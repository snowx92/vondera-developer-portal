import { ApiService } from '../api/services/ApiService';
import type {
  App,
  Scope,
  AppCategory,
  ScopeCategory,
  CreateAppRequest,
  PublishStep,
  AppStepsResponse,
  PerformanceOverview,
  TestStoreResponse,
} from '../types/api.types';

/**
 * Apps API Service
 * Handles all app-related API requests
 */
export class AppsService extends ApiService {
  /**
   * Get all apps for the current developer
   * @returns Promise<App[]>
   */
  async getApps(): Promise<App[]> {
    return await this.get<App[]>('/apps') || [];
  }

  /**
   * Get a single app by ID
   * @param appId - The app ID
   * @returns Promise<App>
   */
  async getAppById(appId: string): Promise<App | null> {
    return await this.get<App>(`/apps/${appId}`);
  }

  /**
   * Create a new app
   * @param data - App creation data
   * @returns Promise<App>
   */
  async createApp(data: CreateAppRequest): Promise<App | null> {
    return await this.post<App>('/apps', data as unknown as Record<string, unknown>);
  }

  /**
   * Get available scopes
   * @param category - Optional category filter
   * @param grouped - Whether to group by category
   * @returns Promise<Scope[]>
   */
  async getScopes(category?: string, grouped?: boolean): Promise<Scope[]> {
    const queryParams: Record<string, string> = {};
    if (category) queryParams.category = category;
    if (grouped !== undefined) queryParams.grouped = String(grouped);

    return await this.get<Scope[]>('/apps/scopes/available', queryParams) || [];
  }

  /**
   * Get app categories
   * @returns Promise<AppCategory[]>
   */
  async getAppCategories(): Promise<AppCategory[]> {
    return await this.get<AppCategory[]>('/apps/categories') || [];
  }

  /**
   * Get scope categories
   * @returns Promise<ScopeCategory[]>
   */
  async getScopeCategories(): Promise<ScopeCategory[]> {
    return await this.get<ScopeCategory[]>('/apps/scopes/categories') || [];
  }

  /**
   * Get publish steps for an app
   * @param appId - The app ID
   * @returns Promise<PublishStep[]>
   */
  async getPublishSteps(appId: string): Promise<PublishStep[]> {
    return await this.get<PublishStep[]>(`/apps/${appId}/steps`) || [];
  }

  /**
   * Get app completion steps
   * @param appId - The app ID
   * @returns Promise<AppStepsResponse>
   */
  async getAppSteps(appId: string): Promise<AppStepsResponse | null> {
    return await this.get<AppStepsResponse>(`/apps/${appId}/steps`);
  }

  /**
   * Delete an app
   * @param appId - The app ID
   * @returns Promise<void>
   */
  async deleteApp(appId: string): Promise<void> {
    await this.delete(`/apps/${appId}`);
  }

  /**
   * Get analytics performance overview for an app
   * @param appId - The app ID or 'all' for all apps
   * @param from - Start date (YYYY-MM-DD)
   * @param to - End date (YYYY-MM-DD)
   * @returns Promise<PerformanceOverview>
   */
  async getPerformanceOverview(appId: string = 'all', from?: string, to?: string): Promise<PerformanceOverview | null> {
    const queryParams: Record<string, string> = {};
    if (from) queryParams.from = from;
    if (to) queryParams.to = to;

    // Use different endpoint path for all apps vs specific app
    const endpoint = appId === 'all'
      ? '/analytics/performance-overview'
      : `/apps/${appId}/analytics/performance-overview`;

    return await this.get<PerformanceOverview>(endpoint, queryParams);
  }

  // ============================================
  // Test Flight / Testing Stores APIs
  // ============================================

  /**
   * Get all test flight stores for the current developer
   * @returns Promise<TestStoreResponse>
   */
  async getTestFlightStores(): Promise<TestStoreResponse | null> {
    return await this.get<TestStoreResponse>('/test-flight/stores');
  }

  /**
   * Remove a test flight store
   * @param storeId - The store ID to remove
   * @returns Promise<void>
   */
  async removeTestFlightStore(storeId: string): Promise<void> {
    await this.delete(`/test-flight/stores/${storeId}`);
  }
}
