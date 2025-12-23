# Vondera Developer Portal API Documentation

## Overview

This document provides comprehensive documentation for all APIs implemented in the Vondera Developer Portal. The API is organized into three main service categories:

1. **Apps Service** - Managing applications
2. **Settings Service** - Managing app settings
3. **Reviews Service** - Managing review requests and publishing

## Base URL

```
https://us-central1-brands-61c3d.cloudfunctions.net/app-api/api/developer
```

## Authentication

All API requests require authentication using a Bearer token in the Authorization header:

```
Authorization: Bearer {your_token}
```

## Response Structure

All successful API responses follow this structure:

```typescript
{
  "status": true,
  "message": "Success message",
  "data": { /* response data */ }
}
```

Error responses:

```typescript
{
  "status": false,
  "message": "Error message",
  "data": null
}
```

---

## Apps Service

### 1. Get All Apps

**Endpoint:** `GET /apps`

**Description:** Retrieves all apps for the authenticated developer

**Response:**
```typescript
{
  "status": true,
  "message": "Apps fetched successfully",
  "data": App[]
}
```

**Example Response:**
```json
{
  "status": true,
  "message": "Apps fetched successfully",
  "data": [
    {
      "id": "2d3A5TAQ46WOibghLokA",
      "name": "My Analytics App",
      "slug": "my-analytics-app",
      "version": "1.0.0",
      "developer_id": "fmmyV28jDOPZkp88KBtPmJdnKFm1",
      "status": "PENDING",
      "category": "analytics",
      "app_url": "",
      "oauth_redirect_uri": "",
      "scopes": [],
      "webhook_events": [],
      "app_type": "FREE",
      "description": "",
      "icon": "https://vondera-bucket.s3.eu-north-1.amazonaws.com/...",
      "images": [],
      "pricing": {},
      "supported_countries": [],
      "setup_form": [],
      "createdAt": { "_seconds": 1766119111, "_nanoseconds": 313000000 },
      "updatedAt": { "_seconds": 1766119111, "_nanoseconds": 313000000 }
    }
  ]
}
```

**Usage:**
```typescript
import { appsService } from '@/lib/services';

const apps = await appsService.getApps();
```

---

### 2. Get App By ID

**Endpoint:** `GET /apps/:id`

**Description:** Retrieves a single app by its ID

**Parameters:**
- `id` (path) - The app ID

**Response:**
```typescript
{
  "status": true,
  "message": "App fetched successfully",
  "data": App
}
```

**Usage:**
```typescript
const app = await appsService.getAppById('2d3A5TAQ46WOibghLokA');
```

---

### 3. Create App

**Endpoint:** `POST /apps`

**Description:** Creates a new app

**Request Body:**
```typescript
{
  "name": string,        // Required
  "category": string,    // Required
  "description"?: string // Optional
}
```

**Response:**
```typescript
{
  "status": true,
  "message": "App created successfully",
  "data": App
}
```

**Usage:**
```typescript
const newApp = await appsService.createApp({
  name: "My New App",
  category: "analytics",
  description: "A great analytics app"
});
```

---

### 4. Get Available Scopes

**Endpoint:** `GET /apps/scopes/available`

**Description:** Retrieves all available scopes that can be requested by apps

**Query Parameters:**
- `category` (optional) - Filter by category
- `grouped` (optional) - Group by category (true/false)

**Response:**
```typescript
{
  "status": true,
  "message": "Scopes fetched successfully",
  "data": Scope[]
}
```

**Example Response:**
```json
{
  "status": true,
  "message": "Scopes fetched successfully",
  "data": [
    {
      "key": "orders:read",
      "name": "Read Orders",
      "description": "View and read order information",
      "category": "orders"
    },
    {
      "key": "orders:write",
      "name": "Create Orders",
      "description": "Create new orders",
      "category": "orders"
    }
  ]
}
```

**Usage:**
```typescript
// Get all scopes
const scopes = await appsService.getScopes();

// Get scopes by category
const orderScopes = await appsService.getScopes('orders');

// Get grouped scopes
const groupedScopes = await appsService.getScopes(undefined, true);
```

---

### 5. Get App Categories

**Endpoint:** `GET /apps/categories`

**Description:** Retrieves all available app categories

**Response:**
```typescript
{
  "status": true,
  "message": "Categories fetched successfully",
  "data": AppCategory[]
}
```

**Usage:**
```typescript
const categories = await appsService.getAppCategories();
```

---

### 6. Get Scope Categories

**Endpoint:** `GET /apps/scopes/categories`

**Description:** Retrieves all scope categories

**Response:**
```typescript
{
  "status": true,
  "message": "Scope categories fetched successfully",
  "data": ScopeCategory[]
}
```

**Usage:**
```typescript
const scopeCategories = await appsService.getScopeCategories();
```

---

### 7. Get Publish Steps

**Endpoint:** `GET /apps/:id/steps`

**Description:** Retrieves the publish steps and their completion status for an app

**Parameters:**
- `id` (path) - The app ID

**Response:**
```typescript
{
  "status": true,
  "message": "Steps fetched successfully",
  "data": PublishStep[]
}
```

**Usage:**
```typescript
const steps = await appsService.getPublishSteps('2d3A5TAQ46WOibghLokA');
```

---

## Settings Service

### 1. General Settings

#### Get General Settings

**Endpoint:** `GET /apps/:id/settings`

**Description:** Retrieves general settings for an app

**Parameters:**
- `id` (path) - The app ID

**Response:**
```typescript
{
  "status": true,
  "message": "Settings fetched successfully",
  "data": GeneralSettings
}
```

**Usage:**
```typescript
const settings = await settingsService.getGeneralSettings('appId');
```

---

#### Update General Settings

**Endpoint:** `PUT /apps/:id/settings`

**Description:** Updates general settings for an app

**Request Body:**
```typescript
{
  "name"?: string,
  "category"?: string,
  "description"?: string,
  "icon"?: string,
  "images"?: string[]
}
```

**Response:**
```typescript
{
  "status": true,
  "message": "Settings updated successfully",
  "data": GeneralSettings
}
```

**Usage:**
```typescript
const updated = await settingsService.updateGeneralSettings('appId', {
  name: "Updated App Name",
  description: "Updated description"
});
```

---

### 2. Listing Settings

#### Get Listing Settings

**Endpoint:** `GET /apps/:id/settings/listing`

**Description:** Retrieves listing/marketplace settings for an app

**Usage:**
```typescript
const listing = await settingsService.getListingSettings('appId');
```

---

#### Update Listing Settings

**Endpoint:** `PUT /apps/:id/settings/listing`

**Description:** Updates listing/marketplace settings

**Request Body:**
```typescript
{
  "short_description"?: string,
  "full_description"?: string,
  "features"?: string[],
  "screenshots"?: string[],
  "video_url"?: string,
  "support_email"?: string,
  "support_url"?: string,
  "privacy_policy_url"?: string,
  "terms_of_service_url"?: string
}
```

**Usage:**
```typescript
const updated = await settingsService.updateListingSettings('appId', {
  short_description: "A brief description",
  features: ["Feature 1", "Feature 2"]
});
```

---

### 3. Slug Settings

#### Get Slug Settings

**Endpoint:** `GET /apps/:id/settings/slug`

**Description:** Retrieves the app slug

**Usage:**
```typescript
const slug = await settingsService.getSlugSettings('appId');
```

---

#### Update Slug Settings

**Endpoint:** `PUT /apps/:id/settings/listing`

**⚠️ WARNING:** The endpoint path in Postman collection shows `/listing` but this might be incorrect. If this doesn't work, the endpoint should be `/apps/:id/settings/slug`

**Request Body:**
```typescript
{
  "slug": string
}
```

**Usage:**
```typescript
const updated = await settingsService.updateSlugSettings('appId', {
  slug: "my-new-slug"
});
```

---

### 4. Endpoint Settings

#### Get Endpoint Settings

**Endpoint:** `GET /apps/:id/settings/endpoints`

**Description:** Retrieves app URL and OAuth redirect URI

**Usage:**
```typescript
const endpoints = await settingsService.getEndpointSettings('appId');
```

---

#### Update Endpoint Settings

**Endpoint:** `PUT /apps/:id/settings/endpoints`

**Description:** Updates app URL and OAuth redirect URI

**Request Body:**
```typescript
{
  "app_url"?: string,
  "oauth_redirect_uri"?: string
}
```

**Usage:**
```typescript
const updated = await settingsService.updateEndpointSettings('appId', {
  app_url: "https://myapp.com",
  oauth_redirect_uri: "https://myapp.com/oauth/callback"
});
```

---

### 5. Scope Settings

#### Get Scope Settings

**Endpoint:** `GET /apps/:id/settings/scopes`

**Description:** Retrieves scopes requested by the app

**Usage:**
```typescript
const scopes = await settingsService.getScopeSettings('appId');
```

---

#### Update Scope Settings

**Endpoint:** `PUT /apps/:id/settings/scopes`

**Description:** Updates scopes requested by the app

**Request Body:**
```typescript
{
  "scopes": string[]  // Array of scope keys
}
```

**Usage:**
```typescript
const updated = await settingsService.updateScopeSettings('appId', {
  scopes: ["orders:read", "orders:write", "products:read"]
});
```

---

### 6. Webhook Settings

#### Get Webhook Settings

**Endpoint:** `GET /apps/:id/settings/webhooks`

**Description:** Retrieves webhook event subscriptions

**Usage:**
```typescript
const webhooks = await settingsService.getWebhookSettings('appId');
```

---

#### Update Webhook Settings

**Endpoint:** `PUT /apps/:id/settings/webhooks`

**Description:** Updates webhook event subscriptions

**Request Body:**
```typescript
{
  "webhook_events": [
    {
      "event": string,  // e.g., "order.created"
      "url": string     // Webhook URL
    }
  ]
}
```

**Usage:**
```typescript
const updated = await settingsService.updateWebhookSettings('appId', {
  webhook_events: [
    { event: "order.created", url: "https://myapp.com/webhooks/order" },
    { event: "product.updated", url: "https://myapp.com/webhooks/product" }
  ]
});
```

---

### 7. Pricing Settings

#### Get Pricing Settings

**Endpoint:** `GET /apps/:id/settings/pricing`

**Description:** Retrieves pricing configuration for different countries

**Usage:**
```typescript
const pricing = await settingsService.getPricingSettings('appId');
```

---

#### Update Pricing Settings

**Endpoint:** `PUT /apps/:id/settings/pricing`

**Description:** Updates pricing configuration

**Request Body:**
```typescript
{
  "[countryCode]": {
    "price": number,
    "currency": string
  }
}
```

**Example:**
```json
{
  "EG": {
    "price": 200,
    "currency": "EGP"
  },
  "US": {
    "price": 10,
    "currency": "USD"
  }
}
```

**Usage:**
```typescript
const updated = await settingsService.updatePricingSettings('appId', {
  "EG": { price: 200, currency: "EGP" },
  "US": { price: 10, currency: "USD" }
});
```

---

### 8. Country Settings

#### Get Country Settings

**Endpoint:** `GET /apps/:id/settings/countries`

**Description:** Retrieves supported countries

**Usage:**
```typescript
const countries = await settingsService.getCountrySettings('appId');
```

---

#### Update Country Settings

**Endpoint:** `PUT /apps/:id/settings/countries`

**Description:** Updates supported countries

**Request Body:**
```typescript
{
  "supported_countries": string[]  // Array of country codes
}
```

**Usage:**
```typescript
const updated = await settingsService.updateCountrySettings('appId', {
  supported_countries: ["EG", "US", "SA", "AE"]
});
```

---

### 9. Setup Form Settings

#### Get Setup Form Settings

**Endpoint:** `GET /apps/:id/settings/setup-form`

**Description:** Retrieves the installation setup form configuration

**Usage:**
```typescript
const setupForm = await settingsService.getSetupFormSettings('appId');
```

---

#### Update Setup Form Settings

**Endpoint:** `PUT /apps/:id/settings/setup-form`

**Description:** Updates the installation setup form

**Request Body:**
```typescript
{
  "setup_form": [
    {
      "id": string,
      "type": "text" | "textarea" | "select" | "checkbox" | "number" | "email" | "url",
      "label": string,
      "placeholder"?: string,
      "required": boolean,
      "options"?: string[],  // For select type
      "default_value"?: string | number | boolean
    }
  ]
}
```

**Usage:**
```typescript
const updated = await settingsService.updateSetupFormSettings('appId', {
  setup_form: [
    {
      id: "api_key",
      type: "text",
      label: "API Key",
      placeholder: "Enter your API key",
      required: true
    },
    {
      id: "webhook_url",
      type: "url",
      label: "Webhook URL",
      required: false
    }
  ]
});
```

---

## Reviews Service

### 1. Get Review Requests

**Endpoint:** `GET /apps/:id/requests`

**Description:** Retrieves all review requests for an app

**Parameters:**
- `id` (path) - The app ID

**Response:**
```typescript
{
  "status": true,
  "message": "Requests fetched successfully",
  "data": ReviewRequest[]
}
```

**Usage:**
```typescript
const requests = await reviewsService.getReviewRequests('appId');
```

---

### 2. Get Single Review Request

**Endpoint:** `GET /apps/:id/requests/:reqId`

**Description:** Retrieves a specific review request

**Parameters:**
- `id` (path) - The app ID
- `reqId` (path) - The request ID

**Response:**
```typescript
{
  "status": true,
  "message": "Request fetched successfully",
  "data": ReviewRequest
}
```

**Usage:**
```typescript
const request = await reviewsService.getReviewRequest('appId', 'requestId');
```

---

### 3. Submit Update Request

**Endpoint:** `POST /apps/:id/requests/update`

**Description:** Submits an update request for review

**Request Body:**
```typescript
{
  "version": string,                  // New version number
  "changes_summary": string,          // Summary of changes
  "pending_changes": Partial<App>     // Changes to be reviewed
}
```

**Response:**
```typescript
{
  "status": true,
  "message": "Update request submitted successfully",
  "data": ReviewRequest
}
```

**Usage:**
```typescript
const request = await reviewsService.submitUpdateRequest('appId', {
  version: "1.0.1",
  changes_summary: "Added new features and bug fixes",
  pending_changes: {
    name: "Updated App Name",
    description: "New description"
  }
});
```

---

### 4. Submit Publish Request

**Endpoint:** `POST /apps/:id/requests/publish`

**Description:** Submits a publish request to make the app live

**Request Body:**
```typescript
{
  "version": string,          // Version to publish
  "changes_summary": string   // Summary for review
}
```

**Response:**
```typescript
{
  "status": true,
  "message": "Publish request submitted successfully",
  "data": ReviewRequest
}
```

**Example Response:**
```json
{
  "status": true,
  "message": "Publish request submitted successfully",
  "data": {
    "id": "QFd1xlSMEUyd0WccefBl",
    "app_id": "2d3A5TAQ46WOibghLokA",
    "developer_id": "fmmyV28jDOPZkp88KBtPmJdnKFm1",
    "request_type": "PUBLISH",
    "current_version": "1.0.1",
    "requested_version": "1.0.1",
    "status": "PENDING",
    "createdAt": "2025-12-19T05:31:39.010Z",
    "updatedAt": "2025-12-19T05:31:39.010Z"
  }
}
```

**Usage:**
```typescript
const request = await reviewsService.submitPublishRequest('appId', {
  version: "1.0.0",
  changes_summary: "Initial publish request"
});
```

---

## Type Definitions

### App

```typescript
interface App {
  id: string;
  name: string;
  slug: string;
  version: string;
  developer_id: string;
  status: 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
  category: string;
  app_url: string;
  oauth_redirect_uri: string;
  scopes: string[];
  webhook_events: WebhookEvent[];
  app_type: 'FREE' | 'PAID' | 'FREEMIUM';
  description: string;
  icon: string;
  images: string[];
  pricing: PricingSettings;
  supported_countries: string[];
  setup_form: SetupFormField[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### ReviewRequest

```typescript
interface ReviewRequest {
  id: string;
  app_id: string;
  developer_id: string;
  request_type: 'PUBLISH' | 'UPDATE';
  current_version: string;
  requested_version: string;
  pending_changes: Partial<App>;
  changes_summary: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  reviewer_notes?: string;
  rejection_reason?: string;
  createdAt: string;
  updatedAt: string;
  reviewed_at?: string;
  reviewed_by?: string;
}
```

---

## Error Handling

All API methods may throw errors. It's recommended to wrap calls in try-catch blocks:

```typescript
try {
  const apps = await appsService.getApps();
} catch (error) {
  console.error('Failed to fetch apps:', error);
  // Handle error
}
```

The ApiService automatically handles:
- 401 Unauthorized - Redirects to login
- 403 Forbidden - Throws error with message
- Other HTTP errors - Throws error with status code

---

## Rate Limiting

API responses include rate limit headers:
- `x-ratelimit-limit`: Maximum requests per window
- `x-ratelimit-remaining`: Remaining requests
- `x-ratelimit-reset`: Unix timestamp when limit resets

Default limit: **250 requests per window**

---

## Missing Information

### ⚠️ Potential Issues Found

1. **Slug Update Endpoint**
   - The Postman collection shows the slug update endpoint as `/apps/:id/settings/listing`
   - This appears to be incorrect and should likely be `/apps/:id/settings/slug`
   - **Action Required:** Please verify the correct endpoint

2. **Missing Response Bodies**
   - Some endpoints may have incomplete response body examples in the Postman collection
   - Please provide sample responses for:
     - App Categories response structure
     - Scope Categories response structure
     - Publish Steps response structure
     - Various settings GET endpoints

3. **Setup Form Field Types**
   - Need clarification on all possible field types
   - Current types assumed: text, textarea, select, checkbox, number, email, url
   - **Action Required:** Please confirm complete list of field types

4. **Pricing Structure**
   - Need confirmation if pricing can have multiple countries with different currencies
   - **Action Required:** Confirm pricing structure flexibility

5. **Webhook Events**
   - Need complete list of available webhook events
   - **Action Required:** Provide documentation of all webhook event types

---

## Next Steps

To complete the implementation:

1. Verify the slug update endpoint path
2. Provide missing response structures
3. Confirm setup form field types
4. Document all webhook event types
5. Test all endpoints with the actual API
