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
  id: string;
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
export type AppType = 'FREE' | 'PAID' | 'FREEMIUM';

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
  scopes: string[];
  webhook_events: WebhookEvent[];
  app_type: AppType;
  description: string;
  icon: string;
  images: string[];
  pricing: PricingSettings;
  supported_countries: string[];
  setup_form: SetupFormField[];
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
}

export interface WebhookSettings {
  webhook_events: WebhookEvent[];
}

export interface CountrySettings {
  supported_countries: string[];
}

export interface SetupFormSettings {
  setup_form: SetupFormField[];
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
  status: RequestStatus;
  reviewer_notes?: string;
  rejection_reason?: string;
  createdAt: string;
  updatedAt: string;
  reviewed_at?: string;
  reviewed_by?: string;
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
}

// ============================================
// Update App Request Types
// ============================================

export interface UpdateAppRequest {
  version: string;
  changes_summary: string;
  pending_changes: Partial<App>;
}

// ============================================
// Publish App Request Types
// ============================================

export interface PublishAppRequest {
  version: string;
  changes_summary: string;
}
