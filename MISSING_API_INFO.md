# Missing API Information

This document lists all the missing or unclear information found while implementing the API services from the Postman collection.

## Critical Issues

### 1. Slug Update Endpoint Path ⚠️

**Issue:** Inconsistent endpoint path in Postman collection

**Details:**
- GET endpoint: `/apps/:id/settings/slug` ✓
- PUT endpoint: `/apps/:id/settings/listing` ❌ (appears incorrect)

**Expected PUT endpoint:** `/apps/:id/settings/slug`

**Request:** Please confirm the correct PUT endpoint for updating slug settings.

---

## Missing Response Structures

The following endpoints are missing complete response body examples in the Postman collection:

### 1. Get App Categories
**Endpoint:** `GET /apps/categories`

**Current Status:** No response body example found
{
    "status": true,
    "message": "App categories fetched successfully",
    "data": [
        {
            "key": "analytics",
            "name": "Analytics",
            "description": "Apps for tracking and analyzing store performance, sales, and customer behavior",
            "icon": "📊"
        },
        {
            "key": "marketing",
            "name": "Marketing",
            "description": "Apps for email marketing, social media, campaigns, and promotions",
            "icon": "📢"
        },
        {
            "key": "payment",
            "name": "Payment",
            "description": "Payment gateways, wallets, and financial transaction apps",
            "icon": "💳"
        },
        {
            "key": "shipping",
            "name": "Shipping & Delivery",
            "description": "Shipping providers, courier integrations, and delivery management",
            "icon": "🚚"
        },
        {
            "key": "inventory",
            "name": "Inventory Management",
            "description": "Stock tracking, warehouse management, and inventory control",
            "icon": "📦"
        },
        {
            "key": "customer-service",
            "name": "Customer Service",
            "description": "Chat support, helpdesk, ticketing, and customer communication tools",
            "icon": "💬"
        },
        {
            "key": "productivity",
            "name": "Productivity",
            "description": "Tools to improve store operations and workflow efficiency",
            "icon": "⚡"
        },
        {
            "key": "social-commerce",
            "name": "Social Commerce",
            "description": "Social media integration, sharing, and social selling tools",
            "icon": "📱"
        },
        {
            "key": "loyalty",
            "name": "Loyalty & Rewards",
            "description": "Customer loyalty programs, points, rewards, and referral systems",
            "icon": "🎁"
        },
        {
            "key": "reviews",
            "name": "Reviews & Ratings",
            "description": "Product reviews, ratings, testimonials, and feedback collection",
            "icon": "⭐"
        },
        {
            "key": "seo",
            "name": "SEO & Marketing",
            "description": "Search engine optimization, meta tags, and marketing automation",
            "icon": "🔍"
        },
        {
            "key": "accounting",
            "name": "Accounting & Finance",
            "description": "Financial reporting, invoicing, tax management, and bookkeeping",
            "icon": "💰"
        },
        {
            "key": "design",
            "name": "Design & Customization",
            "description": "Theme customization, page builders, and design tools",
            "icon": "🎨"
        },
        {
            "key": "integration",
            "name": "Integrations",
            "description": "Third-party service integrations and API connectors",
            "icon": "🔗"
        },
        {
            "key": "automation",
            "name": "Automation",
            "description": "Workflow automation, triggers, and process automation tools",
            "icon": "🤖"
        },
        {
            "key": "other",
            "name": "Other",
            "description": "Apps that don't fit into other categories",
            "icon": "📌"
        }
    ]
}
**Needed:**
```typescript
// Please provide example response
{
  "status": true,
  "message": "Categories fetched successfully",
  "data": [
    {
      "key": "?",
      "name": "?",
      "description": "?",
      "icon": "?"  // Optional?
    }
  ]
}
```

---

### 2. Get Scope Categories
**Endpoint:** `GET /apps/scopes/categories`

{
    "status": true,
    "message": "Categories fetched successfully",
    "data": [
        "analytics",
        "categories",
        "complaints",
        "couriers",
        "customers",
        "expenses",
        "markets",
        "orders",
        "payments",
        "products",
        "settings",
        "subscription",
        "team",
        "warehouse",
        "webhooks",
        "website"
    ]
}
**Current Status:** No response body example found


---

### 3. Get Publish Steps
**Endpoint:** `GET /apps/:id/steps`

**Current Status:** No response body example found
{
    "status": true,
    "message": "App fetched successfully",
    "data": {
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
        "icon": "https://vondera-bucket.s3.eu-north-1.amazonaws.com/developer-apps/2d3A5TAQ46WOibghLokA/icon.png",
        "images": [],
        "pricing": {},
        "supported_countries": [],
        "setup_form": [],
        "createdAt": {
            "_seconds": 1766119111,
            "_nanoseconds": 313000000
        },
        "updatedAt": {
            "_seconds": 1766119111,
            "_nanoseconds": 313000000
        }
    }
}


### 4. Settings GET Endpoints

**Missing response bodies for:**
- `GET /apps/:id/settings` - General settings
{
    "status": true,
    "message": "App general settings fetched successfully",
    "data": {
        "name": "My Analytics App",
        "slug": "my-analytics-app",
        "version": "1.0.0",
        "app_url": "",
        "oauth_redirect_uri": "",
        "status": "PENDING",
        "category": "analytics",
        "createdAt": {
            "_seconds": 1766119111,
            "_nanoseconds": 313000000
        },
        "updatedAt": {
            "_seconds": 1766119111,
            "_nanoseconds": 313000000
        }
    }
}
- `GET /apps/:id/settings/listing` - Listing settings
{
    "status": true,
    "message": "App listing info fetched successfully",
    "data": {
        "name": "Updated App Name",
        "description": "",
        "category": "analytics",
        "icon": "https://vondera-bucket.s3.eu-north-1.amazonaws.com/developer-apps/2d3A5TAQ46WOibghLokA/icon.png",
        "images": []
    }
}
- `GET /apps/:id/settings/slug` - Slug settings
{
    "status": true,
    "message": "App slug fetched successfully",
    "data": {
        "slug": "my-analytics-app"
    }
}
- `GET /apps/:id/settings/endpoints` - Endpoint settings
{
    "status": true,
    "message": "App endpoints fetched successfully",
    "data": {
        "install_endpoint": "",
        "uninstall_endpoint": "",
        "form_update_endpoint": "",
        "hasPendingChanges": false
    }
}
- `GET /apps/:id/settings/scopes` - Scope settings

- `GET /apps/:id/settings/webhooks` - Webhook settings
- `GET /apps/:id/settings/pricing` - Pricing settings
- `GET /apps/:id/settings/countries` - Country settings
- `GET /apps/:id/settings/setup-form` - Setup form settings

**Request:** Please provide example responses for all GET settings endpoints.

---

## Clarifications Needed

### 1. Setup Form Field Types

**Question:** What are all possible field types for the setup form?

**Currently Assumed:**
- text
- textarea
- select
- checkbox
- number
- email
- url

**Request:** Please provide the complete list of supported field types and any specific validation rules for each.

---

### 2. Webhook Events

**Question:** What are all available webhook event types?

**Examples Found:**
- `order.created`
- `product.updated`

**Request:** Please provide the complete list of webhook events that apps can subscribe to, including:
- Event name
- Event description
- When it's triggered
- Payload structure

---

### 3. Pricing Structure

**Question:** Can an app have different currencies for different countries?

**Current Implementation:**
```typescript
{
  "EG": { "price": 200, "currency": "EGP" },
  "US": { "price": 10, "currency": "USD" }
}
```

**Request:** Confirm if this is correct, or if all countries must use the same currency.

---

### 4. App Status Flow

**Question:** What is the complete status flow for an app?

**Currently Known:**
- DRAFT
- PENDING
- APPROVED
- REJECTED
- PUBLISHED

**Request:** Please clarify:
- Can an app go from REJECTED back to PENDING?
- What triggers each status change?
- Can a PUBLISHED app be unpublished?

---

### 5. Request Types

**Question:** What is the difference between UPDATE and PUBLISH request types?

**Currently Understood:**
- PUBLISH: First time publishing
- UPDATE: Updating an already published app

**Request:** Please confirm and provide any additional request types or rules.

---

## Optional Enhancements

These would improve the API but are not critical:

### 1. Pagination
**Question:** Do any list endpoints support pagination?
- `GET /apps`
- `GET /apps/:id/requests`

**Request:** If pagination is supported, please provide:
- Query parameters (page, limit, etc.)
- Response structure with pagination metadata

---

### 2. Filtering and Sorting
**Question:** Can apps be filtered or sorted?

**Potential filters for `GET /apps`:**
- status
- category
- app_type
- createdAt (date range)

**Request:** Please provide available filters and sorting options.

---

### 3. Search
**Question:** Is there a search endpoint for apps?

**Request:** If search is supported, provide:
- Endpoint
- Search parameters
- Response structure

---

### 4. Bulk Operations
**Question:** Are there any bulk operation endpoints?

**Examples:**
- Bulk delete apps
- Bulk update scopes

**Request:** Please provide any bulk operation endpoints.

---

## Validation Rules

Please provide validation rules for:

### 1. App Name
- Min length?
- Max length?
- Allowed characters?
- Unique per developer?

### 2. Slug
- Min length?
- Max length?
- Allowed characters?
- Unique globally or per developer?
- Can it be changed after publishing?

### 3. Version
- Format? (Semantic versioning required?)
- Can versions be skipped?
- Can you go backwards?

### 4. Scopes
- Max number of scopes per app?
- Any scope dependencies?
- Scope approval process?

### 5. Webhooks
- Max number of webhook events?
- Webhook URL validation rules?
- Retry policy?

### 6. Pricing
- Min/max price?
- Price change restrictions?
- Trial period support?

### 7. Countries
- Max number of supported countries?
- Required countries?

### 8. Images
- Max file size?
- Supported formats?
- Max number of images?
- Recommended dimensions?

---

## Security Questions

### 1. OAuth Flow
**Request:** Provide complete OAuth flow documentation:
- Authorization URL
- Token URL
- Refresh token support
- Scope format in OAuth

### 2. API Keys
**Question:** Are there API keys for apps?
**Request:** If yes, provide:
- How to generate API keys
- Key rotation process
- Key permissions

### 3. Webhooks Security
**Request:** Provide webhook security details:
- Signature verification
- IP whitelist
- Rate limiting per webhook

---

## Additional API Endpoints

Are there any additional endpoints not in the Postman collection?

**Potential Missing Endpoints:**
- Delete app
- Archive app
- Duplicate app
- Get app analytics/statistics
- Get app installations
- Manage app collaborators
- Upload images/icons
- Test webhook
- View webhook logs
- Manage API keys
- View API usage/logs

**Request:** Please provide any additional endpoints not in the collection.

---

## Response Times

**Request:** What are the expected response times for each endpoint category?
- GET requests
- PUT requests
- POST requests

---

## Contact

For any questions or clarifications, please provide:
1. API endpoint documentation URL
2. Support contact email
3. Developer community link

---

## Summary

**Critical (Blocking):**
1. ✅ Slug update endpoint path confirmation

**High Priority (Needed for completion):**
1. Response body examples for all GET endpoints
2. Complete list of setup form field types
3. Complete list of webhook events
4. Validation rules for all fields

**Medium Priority (For better implementation):**
1. Pagination support
2. Filtering and sorting options
3. OAuth flow documentation
4. Webhook security details

**Low Priority (Nice to have):**
1. Additional endpoints
2. Bulk operations
3. Search functionality
4. Expected response times

---

**Next Steps:**
1. Please review this document
2. Provide missing information
3. Confirm or correct assumptions
4. We'll update the implementation accordingly
