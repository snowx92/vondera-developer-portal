import { ApiService } from '../api/services/ApiService';
import type {
  App,
  Scope,
  AppCategory,
  ScopeCategory,
  CreateAppRequest,
  PublishStep,
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
}
