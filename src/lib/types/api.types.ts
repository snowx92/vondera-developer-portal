// ============================================
// Common Types
// ============================================

export interface ApiResponse<T = unknown> {
  status: boolean;
  message: string;
  data: T;
}

export interface Timestamp {
  _seconds: number;
  _nanoseconds: number;
}

// ============================================
// Scope Types
// ============================================

export interface Scope {
  key: string;
  name: string;
  description: string;
  category: string;
}

// Scope categories are returned as simple strings
export type ScopeCategory = string;

// ============================================
// App Category Types
// ============================================

export interface AppCategory {
  key: string;
  name: string;
  description: string;
  icon: string;
}

// ============================================
// Webhook Types
// ============================================

export interface WebhookEvent {
  event: string;
  url: string;
  reason?: string; // Why the app needs this webhook - NOT YET IMPLEMENTED IN BACKEND
}

// ============================================
// Pricing Types
// ============================================

export interface CountryPricing {
  price: number;
  currency: string;
}

export interface PricingSettings {
  [countryCode: string]: CountryPricing;
}

// ============================================
// Setup Form Types
// ============================================

export interface SetupFormField {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'number' | 'email' | 'url';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
  default_value?: string | number | boolean;
}

// ============================================
// App Types
// ============================================

export type AppStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
export type AppType = 'FREE' | 'PREMIUM' | 'PAID';

export interface App {
  id: string;
  name: string;
  slug: string;
  version: string;
  developer_id: string;
  status: AppStatus;
  category: string;
  app_url: string;
  oauth_redirect_uri: string;
  client_id: string;
  client_secret: string;
  scopes: string[];
  webhook_events: WebhookEvent[];
  app_type: AppType;
  description: string;
  icon: string;
  images: string[];
  pricing: PricingSettings;
  supported_countries: string[];
  setup_form: SetupFormField[];
  installsCount: number;
  totalRevenue?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================
// App Settings Types
// ============================================

export interface GeneralSettings {
  name: string;
  slug: string;
  version: string;
  app_url: string;
  oauth_redirect_uri: string;
  status: AppStatus;
  category: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ListingSettings {
  name: string;
  description: string;
  short_description?: string; // Short description max 80 chars - NOT YET IMPLEMENTED IN BACKEND
  instructions?: string; // Installation/setup instructions (HTML) - NOT YET IMPLEMENTED IN BACKEND
  category: string;
  icon: string;
  images: string[];
}

export interface SlugSettings {
  slug: string;
}

export interface EndpointSettings {
  install_endpoint: string;
  uninstall_endpoint: string;
  form_update_endpoint: string;
  hasPendingChanges: boolean;
}

export interface ScopeSettings {
  scopes: string[];
  scope_reasons?: Record<string, string>; // Map of scope key to reason - NOT YET IMPLEMENTED IN BACKEND
}

export interface WebhookSettings {
  webhook_events: WebhookEvent[];
}

export interface CountrySettings {
  supported_countries: string[];
  hasPendingChanges?: boolean;
}

export interface SetupFormSettings {
  setup_form: SetupFormField[];
  hasPendingChanges?: boolean;
}

export interface PricingSettingsResponse {
  app_type: AppType;
  pricing: PricingSettings;
  supported_countries: string[];
  hasPendingChanges?: boolean;
}

export interface PricingSettingsUpdate {
  app_type: AppType;
  pricing: PricingSettings;
}

// ============================================
// Review Request Types
// ============================================

export type RequestType = 'PUBLISH' | 'UPDATE';
export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

export interface ReviewRequest {
  id: string;
  app_id: string;
  developer_id: string;
  request_type: RequestType;
  current_version: string;
  requested_version: string;
  pending_changes: Partial<App>;
  changes_summary: string;
  changes_diff?: Record<string, { old: unknown; new: unknown }>;
  status: RequestStatus;
  reviewer_notes?: string;
  rejection_reason?: string;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  reviewed_at?: string | Timestamp;
  reviewed_by?: string;
}

// ============================================
// App Steps Types
// ============================================

export interface AppStep {
  step: string;
  field: string;
  message: string;
  completed: boolean;
  optional?: boolean;
}

export interface AppStepsResponse {
  readyForPublish: boolean;
  haveUpdate: boolean;
  completedSteps: number;
  totalSteps: number;
  steps: AppStep[];
  missingFields: string[];
}

// ============================================
// Publish Step Types
// ============================================

export interface PublishStep {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  required: boolean;
  step_number: number;
}

// ============================================
// Create App Types
// ============================================

export interface CreateAppRequest {
  name: string;
  category: string;
  description?: string;
  icon?: string; // Base64 encoded image data
}

// ============================================
// Update App Request Types
// ============================================

export interface UpdateAppRequest {
  notes: string; // Summary of changes made
}

// ============================================
// Publish App Request Types
// ============================================

export interface PublishAppRequest {
  // No body required for publish requests
}
