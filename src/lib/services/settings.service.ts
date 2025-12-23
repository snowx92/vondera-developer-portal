import { ApiService } from '../api/services/ApiService';
import type {
  GeneralSettings,
  ListingSettings,
  SlugSettings,
  EndpointSettings,
  ScopeSettings,
  WebhookSettings,
  PricingSettings,
  CountrySettings,
  SetupFormSettings,
} from '../types/api.types';

/**
 * Settings API Service
 * Handles all app settings-related API requests
 */
export class SettingsService extends ApiService {
  // ============================================
  // General Settings
  // ============================================

  /**
   * Get general settings for an app
   * @param appId - The app ID
   * @returns Promise<GeneralSettings>
   */
  async getGeneralSettings(appId: string): Promise<GeneralSettings | null> {
    return await this.get<GeneralSettings>(`/apps/${appId}/settings`);
  }

  /**
   * Update general settings for an app
   * @param appId - The app ID
   * @param data - Updated settings data
   * @returns Promise<GeneralSettings>
   */
  async updateGeneralSettings(appId: string, data: Partial<GeneralSettings>): Promise<GeneralSettings | null> {
    return await this.put<GeneralSettings>(`/apps/${appId}/settings`, data);
  }

  // ============================================
  // Listing Settings
  // ============================================

  /**
   * Get listing settings for an app
   * @param appId - The app ID
   * @returns Promise<ListingSettings>
   */
  async getListingSettings(appId: string): Promise<ListingSettings | null> {
    return await this.get<ListingSettings>(`/apps/${appId}/settings/listing`);
  }

  /**
   * Update listing settings for an app
   * @param appId - The app ID
   * @param data - Updated listing settings
   * @returns Promise<ListingSettings>
   */
  async updateListingSettings(appId: string, data: Partial<ListingSettings>): Promise<ListingSettings | null> {
    return await this.put<ListingSettings>(`/apps/${appId}/settings/listing`, data);
  }

  // ============================================
  // Slug Settings
  // ============================================

  /**
   * Get slug settings for an app
   * @param appId - The app ID
   * @returns Promise<SlugSettings>
   */
  async getSlugSettings(appId: string): Promise<SlugSettings | null> {
    return await this.get<SlugSettings>(`/apps/${appId}/settings/slug`);
  }

  /**
   * Update slug settings for an app
   * @param appId - The app ID
   * @param data - Updated slug settings
   * @returns Promise<SlugSettings>
   */
  async updateSlugSettings(appId: string, data: SlugSettings): Promise<SlugSettings | null> {
    return await this.put<SlugSettings>(`/apps/${appId}/settings/slug`, data as unknown as Record<string, unknown>);
  }

  // ============================================
  // Endpoint Settings
  // ============================================

  /**
   * Get endpoint settings for an app
   * @param appId - The app ID
   * @returns Promise<EndpointSettings>
   */
  async getEndpointSettings(appId: string): Promise<EndpointSettings | null> {
    return await this.get<EndpointSettings>(`/apps/${appId}/settings/endpoints`);
  }

  /**
   * Update endpoint settings for an app
   * @param appId - The app ID
   * @param data - Updated endpoint settings
   * @returns Promise<EndpointSettings>
   */
  async updateEndpointSettings(appId: string, data: Partial<EndpointSettings>): Promise<EndpointSettings | null> {
    return await this.put<EndpointSettings>(`/apps/${appId}/settings/endpoints`, data);
  }

  // ============================================
  // Scope Settings
  // ============================================

  /**
   * Get scope settings for an app
   * @param appId - The app ID
   * @returns Promise<ScopeSettings>
   */
  async getScopeSettings(appId: string): Promise<ScopeSettings | null> {
    return await this.get<ScopeSettings>(`/apps/${appId}/settings/scopes`);
  }

  /**
   * Update scope settings for an app
   * @param appId - The app ID
   * @param data - Updated scope settings
   * @returns Promise<ScopeSettings>
   */
  async updateScopeSettings(appId: string, data: ScopeSettings): Promise<ScopeSettings | null> {
    return await this.put<ScopeSettings>(`/apps/${appId}/settings/scopes`, data as unknown as Record<string, unknown>);
  }

  // ============================================
  // Webhook Settings
  // ============================================

  /**
   * Get webhook settings for an app
   * @param appId - The app ID
   * @returns Promise<WebhookSettings>
   */
  async getWebhookSettings(appId: string): Promise<WebhookSettings | null> {
    return await this.get<WebhookSettings>(`/apps/${appId}/settings/webhooks`);
  }

  /**
   * Update webhook settings for an app
   * @param appId - The app ID
   * @param data - Updated webhook settings
   * @returns Promise<WebhookSettings>
   */
  async updateWebhookSettings(appId: string, data: WebhookSettings): Promise<WebhookSettings | null> {
    return await this.put<WebhookSettings>(`/apps/${appId}/settings/webhooks`, data as unknown as Record<string, unknown>);
  }

  // ============================================
  // Pricing Settings
  // ============================================

  /**
   * Get pricing settings for an app
   * @param appId - The app ID
   * @returns Promise<PricingSettings>
   */
  async getPricingSettings(appId: string): Promise<PricingSettings | null> {
    return await this.get<PricingSettings>(`/apps/${appId}/settings/pricing`);
  }

  /**
   * Update pricing settings for an app
   * @param appId - The app ID
   * @param data - Updated pricing settings
   * @returns Promise<PricingSettings>
   */
  async updatePricingSettings(appId: string, data: PricingSettings): Promise<PricingSettings | null> {
    return await this.put<PricingSettings>(`/apps/${appId}/settings/pricing`, data as unknown as Record<string, unknown>);
  }

  // ============================================
  // Country Settings
  // ============================================

  /**
   * Get country settings for an app
   * @param appId - The app ID
   * @returns Promise<CountrySettings>
   */
  async getCountrySettings(appId: string): Promise<CountrySettings | null> {
    return await this.get<CountrySettings>(`/apps/${appId}/settings/countries`);
  }

  /**
   * Update country settings for an app
   * @param appId - The app ID
   * @param data - Updated country settings
   * @returns Promise<CountrySettings>
   */
  async updateCountrySettings(appId: string, data: CountrySettings): Promise<CountrySettings | null> {
    return await this.put<CountrySettings>(`/apps/${appId}/settings/countries`, data as unknown as Record<string, unknown>);
  }

  // ============================================
  // Setup Form Settings
  // ============================================

  /**
   * Get setup form settings for an app
   * @param appId - The app ID
   * @returns Promise<SetupFormSettings>
   */
  async getSetupFormSettings(appId: string): Promise<SetupFormSettings | null> {
    return await this.get<SetupFormSettings>(`/apps/${appId}/settings/setup-form`);
  }

  /**
   * Update setup form settings for an app
   * @param appId - The app ID
   * @param data - Updated setup form settings
   * @returns Promise<SetupFormSettings>
   */
  async updateSetupFormSettings(appId: string, data: SetupFormSettings): Promise<SetupFormSettings | null> {
    return await this.put<SetupFormSettings>(`/apps/${appId}/settings/setup-form`, data as unknown as Record<string, unknown>);
  }
}
