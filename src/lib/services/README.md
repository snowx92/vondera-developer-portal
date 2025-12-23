# API Services

This directory contains all API service implementations for the Vondera Developer Portal.

## Structure

```
services/
├── ApiService.ts       # Base API service class
├── auth.service.ts     # Authentication endpoints
├── apps.service.ts     # App management endpoints
├── settings.service.ts # App settings endpoints
├── reviews.service.ts  # Review & publish endpoints
├── index.ts           # Service exports
└── README.md          # This file
```

## Services Overview

### Base Service (`ApiService.ts`)
Provides common functionality for all API services:
- Automatic authentication token handling
- Request/response logging
- Error handling (401, 403, etc.)
- HTTP methods (GET, POST, PUT, DELETE)
- Session management

### Auth Service (`auth.service.ts`)
Handles user authentication:
- `register()` - User registration
- `login()` - User login
- `logout()` - User logout
- Token management

### Apps Service (`apps.service.ts`)
Manages applications:
- `getApps()` - List all apps
- `getAppById()` - Get single app
- `createApp()` - Create new app
- `getScopes()` - Get available scopes
- `getAppCategories()` - Get app categories
- `getScopeCategories()` - Get scope categories
- `getPublishSteps()` - Get publish checklist

### Settings Service (`settings.service.ts`)
Manages app settings (9 setting categories):
- General settings (name, category, description, icon)
- Listing settings (marketplace info)
- Slug settings (app URL slug)
- Endpoint settings (URLs and OAuth)
- Scope settings (permissions)
- Webhook settings (event subscriptions)
- Pricing settings (country-based pricing)
- Country settings (supported countries)
- Setup form settings (installation form)

Each category has GET and PUT methods.

### Reviews Service (`reviews.service.ts`)
Handles app review process:
- `getReviewRequests()` - List review requests
- `getReviewRequest()` - Get single request
- `submitUpdateRequest()` - Request app update review
- `submitPublishRequest()` - Request app publish

## Usage

### Basic Import

```typescript
import { appsService, settingsService, reviewsService } from '@/lib/services';
```

### Individual Import

```typescript
import { AppsService } from '@/lib/services/apps.service';
const appsService = new AppsService();
```

### Using Pre-instantiated Services

```typescript
import { appsService } from '@/lib/services';

// Ready to use
const apps = await appsService.getApps();
```

## Creating New Services

To add a new service:

1. **Create service file** (e.g., `analytics.service.ts`)

```typescript
import { ApiService } from './ApiService';

export class AnalyticsService extends ApiService {
  async getStats(appId: string) {
    return await this.get(`/apps/${appId}/analytics`);
  }
}
```

2. **Export in index.ts**

```typescript
export { AnalyticsService } from './analytics.service';
export const analyticsService = new AnalyticsService();
```

3. **Use it**

```typescript
import { analyticsService } from '@/lib/services';
const stats = await analyticsService.getStats('appId');
```

## Error Handling

All services use the base ApiService error handling:

```typescript
try {
  const apps = await appsService.getApps();
} catch (error) {
  // Error is automatically handled by ApiService
  // 401 -> Redirects to login
  // 403 -> Throws with message
  // Other -> Throws with status
  console.error(error);
}
```

## Authentication

All requests automatically include:
- `Authorization: Bearer {token}` header
- `Language: en` header
- `Content-Type: application/json` header
- `Client: FETCH` header

## Type Safety

All services use TypeScript types from `@/lib/types/api.types`:

```typescript
import type { App, Scope, ReviewRequest } from '@/lib/types/api.types';

const app: App | null = await appsService.getAppById('id');
const scopes: Scope[] = await appsService.getScopes();
```

## Response Structure

All responses are automatically parsed:

```typescript
// API returns: { status: true, message: "Success", data: [...] }
// Services return: [...] (just the data)

const apps = await appsService.getApps(); // App[]
const app = await appsService.getAppById('id'); // App | null
```

## Logging

Enable logging for debugging:

```typescript
// In ApiService.ts
export const printLogs = true; // Enable
export const printLogs = false; // Disable
```

Logs include:
- Request URL and method
- Request headers
- Request body
- Response status
- Response data

## Testing

Each service should be tested:

```typescript
describe('AppsService', () => {
  it('should get all apps', async () => {
    const apps = await appsService.getApps();
    expect(Array.isArray(apps)).toBe(true);
  });

  it('should create app', async () => {
    const app = await appsService.createApp({
      name: "Test App",
      category: "test"
    });
    expect(app).toHaveProperty('id');
  });
});
```

## Best Practices

1. **Always handle errors**
```typescript
try {
  const data = await service.method();
} catch (error) {
  // Handle error
}
```

2. **Use TypeScript types**
```typescript
import type { App } from '@/lib/types/api.types';
const app: App | null = await appsService.getAppById('id');
```

3. **Check for null returns**
```typescript
const app = await appsService.getAppById('id');
if (!app) {
  // Handle not found
}
```

4. **Use pre-instantiated services**
```typescript
import { appsService } from '@/lib/services'; // ✅
// Instead of:
import { AppsService } from '@/lib/services/apps.service';
const appsService = new AppsService(); // ❌
```

5. **Document new methods**
```typescript
/**
 * Get app statistics
 * @param appId - The app ID
 * @param period - Time period (day, week, month)
 * @returns Promise<Stats>
 */
async getStats(appId: string, period: string): Promise<Stats | null> {
  return await this.get(`/apps/${appId}/stats`, { period });
}
```

## Environment Variables

Required in `.env`:
```
NEXT_PUBLIC_API_BASE_URL=https://us-central1-brands-61c3d.cloudfunctions.net/app-api/api/developer
```

## Dependencies

- ApiService (base class)
- SessionManager (for auth tokens)
- TypeScript types (@/lib/types/api.types)
- Native fetch API

## Rate Limiting

API has rate limits:
- 250 requests per window
- Check `x-ratelimit-*` headers in responses
- Consider caching frequently accessed data

## Support

For issues:
1. Check [API_DOCUMENTATION.md](../../../API_DOCUMENTATION.md)
2. Check [MISSING_API_INFO.md](../../../MISSING_API_INFO.md)
3. Review [API_QUICK_REFERENCE.md](../../../API_QUICK_REFERENCE.md)
4. Test with Postman collection first

## Related Files

- Types: `src/lib/types/api.types.ts`
- Utils: `src/lib/utils/session.ts`
- Docs: Root directory documentation files
