# API Quick Reference Guide

## Import Services

```typescript
import { appsService, settingsService, reviewsService } from '@/lib/services';
```

## Apps Service

```typescript
// Get all apps
const apps = await appsService.getApps();

// Get single app
const app = await appsService.getAppById('appId');

// Create app
const newApp = await appsService.createApp({
  name: "App Name",
  category: "analytics"
});

// Get scopes
const scopes = await appsService.getScopes();
const orderScopes = await appsService.getScopes('orders');

// Get categories
const categories = await appsService.getAppCategories();
const scopeCategories = await appsService.getScopeCategories();

// Get publish steps
const steps = await appsService.getPublishSteps('appId');
```

## Settings Service

```typescript
const appId = 'your-app-id';

// General Settings
await settingsService.getGeneralSettings(appId);
await settingsService.updateGeneralSettings(appId, { name: "New Name" });

// Listing Settings
await settingsService.getListingSettings(appId);
await settingsService.updateListingSettings(appId, {
  short_description: "Brief description",
  features: ["Feature 1", "Feature 2"]
});

// Slug Settings
await settingsService.getSlugSettings(appId);
await settingsService.updateSlugSettings(appId, { slug: "my-slug" });

// Endpoint Settings
await settingsService.getEndpointSettings(appId);
await settingsService.updateEndpointSettings(appId, {
  app_url: "https://myapp.com",
  oauth_redirect_uri: "https://myapp.com/callback"
});

// Scope Settings
await settingsService.getScopeSettings(appId);
await settingsService.updateScopeSettings(appId, {
  scopes: ["orders:read", "products:read"]
});

// Webhook Settings
await settingsService.getWebhookSettings(appId);
await settingsService.updateWebhookSettings(appId, {
  webhook_events: [
    { event: "order.created", url: "https://myapp.com/webhook" }
  ]
});

// Pricing Settings
await settingsService.getPricingSettings(appId);
await settingsService.updatePricingSettings(appId, {
  "EG": { price: 200, currency: "EGP" },
  "US": { price: 10, currency: "USD" }
});

// Country Settings
await settingsService.getCountrySettings(appId);
await settingsService.updateCountrySettings(appId, {
  supported_countries: ["EG", "US", "SA"]
});

// Setup Form Settings
await settingsService.getSetupFormSettings(appId);
await settingsService.updateSetupFormSettings(appId, {
  setup_form: [
    {
      id: "api_key",
      type: "text",
      label: "API Key",
      required: true
    }
  ]
});
```

## Reviews Service

```typescript
const appId = 'your-app-id';

// Get review requests
const requests = await reviewsService.getReviewRequests(appId);

// Get single request
const request = await reviewsService.getReviewRequest(appId, 'requestId');

// Submit update request
await reviewsService.submitUpdateRequest(appId, {
  version: "1.0.1",
  changes_summary: "Bug fixes",
  pending_changes: { name: "Updated Name" }
});

// Submit publish request
await reviewsService.submitPublishRequest(appId, {
  version: "1.0.0",
  changes_summary: "Initial release"
});
```

## Error Handling

```typescript
try {
  const apps = await appsService.getApps();
} catch (error) {
  if (error.status === 403) {
    console.error('Permission denied');
  } else if (error.status === 404) {
    console.error('Not found');
  } else {
    console.error('Unknown error:', error);
  }
}
```

## Type Imports

```typescript
import type {
  App,
  Scope,
  AppCategory,
  ReviewRequest,
  GeneralSettings,
  WebhookEvent,
  PricingSettings,
  SetupFormField
} from '@/lib/types/api.types';
```

## Common Patterns

### Loading Pattern
```typescript
const [apps, setApps] = useState<App[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState<string | null>(null);

useEffect(() => {
  async function loadApps() {
    try {
      setLoading(true);
      const data = await appsService.getApps();
      setApps(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }
  loadApps();
}, []);
```

### Update Pattern
```typescript
async function updateAppName(appId: string, newName: string) {
  try {
    await settingsService.updateGeneralSettings(appId, { name: newName });
    toast.success('App name updated');
  } catch (error) {
    toast.error('Failed to update app name');
  }
}
```

### Form Submit Pattern
```typescript
async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
  setIsLoading(true);

  try {
    const app = await appsService.createApp(formData);
    router.push(`/apps/${app.id}`);
  } catch (error) {
    setError(error.message);
  } finally {
    setIsLoading(false);
  }
}
```

## Status Types

```typescript
type AppStatus = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'PUBLISHED';
type AppType = 'FREE' | 'PAID' | 'FREEMIUM';
type RequestType = 'PUBLISH' | 'UPDATE';
type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
```

## Validation Examples

```typescript
// Slug validation
const isValidSlug = (slug: string) => /^[a-z0-9-]+$/.test(slug);

// Email validation
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// URL validation
const isValidUrl = (url: string) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
```

## Available Scopes

```
orders:read, orders:write, orders:update, orders:delete, orders:export
products:read, products:write, products:update, products:delete, products:export
customers:read, customers:update, customers:delete, customers:export
categories:read, categories:write, categories:update, categories:delete
statistics:read, statistics:export
expenses:read, expenses:add, expenses:remove, expenses:export
complaints:read, complaints:add, complaints:update, complaints:delete
warehouse:read, warehouse:add, warehouse:export
vpay:read, vpay:payouts, vpay:refund, vpay:export
team:read, team:add, team:update, team:delete
couriers:read, couriers:add, couriers:assign, couriers:remove
store:read, store:update
website:read, website:update
subscription:read, subscription:update
markets:read, markets:update, markets:add, markets:delete
webhooks:read, webhooks:write, webhooks:update, webhooks:delete
```

## Response Structure

All responses follow this structure:

```typescript
{
  status: boolean,
  message: string,
  data: T  // Your data here
}
```

## Rate Limiting

- Limit: 250 requests per window
- Check headers: `x-ratelimit-limit`, `x-ratelimit-remaining`, `x-ratelimit-reset`

## Base URL

```
https://us-central1-brands-61c3d.cloudfunctions.net/app-api/api/developer
```
