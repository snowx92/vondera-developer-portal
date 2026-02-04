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
  reason: string; // Why the app needs this webhook (required)
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
  type: 'text' | 'textarea' | 'dropdown' | 'amount' | 'checkbox' | 'number' | 'email' | 'url';
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
export type AppType = 'FREE' | 'PREMIUM' | 'PAID' | 'SUBSCRIPTION';

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
  short_description: string; // Short description 10-80 chars (required)
  instructions?: string; // Installation/setup instructions (HTML) - optional
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
  scope_reasons: Record<string, string>; // Map of scope key to reason (required for each scope)
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

// ============================================
// Notification Types
// ============================================

export interface NotificationContent {
  title: string;
  body: string;
}

export interface Notification {
  id: string;
  relatedId: string;
  route: string;
  date: Timestamp;
  icon: string;
  isNew: boolean;
  content: NotificationContent;
}

export interface NotificationsResponse {
  newNotifications: number;
  items: Notification[];
  pageItems: number;
  totalItems: number;
  isLastPage: boolean;
  nextPageNumber: number;
  currentPage: number;
  totalPages: number;
}

// ============================================
// Test Flight / Testing Stores Types
// ============================================

export interface TestStoreBoundAt {
  _seconds: number;
  _nanoseconds: number;
}

export interface TestStore {
  binding_id: string;
  store_id: string;
  store_name: string;
  store_email: string;
  merchant_id: string;
  country: string;
  logo: string;
  bound_at: TestStoreBoundAt;
}

export interface TestStoreResponse {
  stores: TestStore[];
  total: number;
}

// ============================================
// Developer Profile Types
// ============================================

export interface DeveloperCounters {
  appsCount: number;
  totalInstalls: number;
  totalRevenue: number;
}

export interface DeveloperProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  phoneCountryCode: string;
  isBanned: boolean;
  profilePic: string;
  isOnline: boolean;
  status: 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';
  counters: DeveloperCounters;
}

export interface UpdateProfileRequest {
  name: string;
  email: string;
  phone: string;
  phoneCountryCode: string;
  image: string;
}

export interface ChangePasswordRequest {
  oldPassword: string;
  newPassword: string;
}

export interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

// ============================================
// Analytics Types
// ============================================

export interface ChartDataPoint {
  date: string;
  value: number;
}

export interface PerformanceOverview {
  totalInstalls: number;
  lifetimeInstalls: number;
  avgDailyInstalls: number;
  totalRevenue: number;
  avgDailyRevenue: number;
  totalUninstalls: number;
  appsCount?: number;
  installsChart: ChartDataPoint[];
  revenueChart: ChartDataPoint[];
  uninstallsChart: ChartDataPoint[];
  from: string;
  to: string;
  currency: string;
}

// ============================================
// Wallet Types
// ============================================

export interface WalletBalance {
  balance: number;
  currency: string;
}

export type TransactionType = 'PURCHASE' | 'REFUND' | 'WITHDRAWAL' | 'ADJUSTMENT';
export type TransactionStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'CANCELLED';

export interface Transaction {
  id: string;
  appId: string;
  appName: string;
  storeId: string;
  type: TransactionType;
  amount: number;
  currency: string;
  purchaseId: string;
  paymentTransactionId: string;
  status: TransactionStatus;
  createdAt: Timestamp;
}

export interface TransactionsResponse {
  items: Transaction[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
}
