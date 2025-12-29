'use client';

import { useState } from 'react';

type Section = 'getting-started' | 'authentication' | 'api-reference' | 'webhooks' | 'examples';

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<Section>('getting-started');

  const sections = [
    { id: 'getting-started', name: 'Getting Started' },
    { id: 'authentication', name: 'Authentication' },
    { id: 'api-reference', name: 'API Reference' },
    { id: 'webhooks', name: 'Webhooks' },
    { id: 'examples', name: 'Examples' },
  ];

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Documentation</h1>
        <p className="text-gray-600">
          Everything you need to build apps on the Vondera platform
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-6">
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id as Section)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? 'bg-purple-50 text-vondera-purple'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {section.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-xl border border-gray-200">
            {activeSection === 'getting-started' && <GettingStartedContent />}
            {activeSection === 'authentication' && <AuthenticationContent />}
            {activeSection === 'api-reference' && <ApiReferenceContent />}
            {activeSection === 'webhooks' && <WebhooksContent />}
            {activeSection === 'examples' && <ExamplesContent />}
          </div>
        </div>
      </div>
    </div>
  );
}

function GettingStartedContent() {
  return (
    <div className="p-6 prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">NPM Package Available</h3>
            <p className="text-sm text-blue-800">
              Use our official TypeScript SDK for building apps on the Vondera platform
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">Installation</h3>
      <p className="text-gray-700 mb-4">
        Install the Vondera App Developer SDK using npm:
      </p>
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto">
        <code>npm install vondera-app-developer</code>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">Quick Start</h3>
      <p className="text-gray-700 mb-4">
        Initialize the client and start making API calls:
      </p>
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto">
        <pre className="text-sm"><code>{`import { VonderaClient } from "vondera-app-developer";

// Initialize the client
const client = new VonderaClient({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  appId: "your-app-id",
  locale: "en", // Optional
  storefrontId: "EG", // Optional
  timezone: "Africa/Cairo", // Optional
});

// Refresh access token
const tokenData = await client.auth.refreshToken("your-refresh-token");
client.setAccessToken(tokenData.access_token);

// Use the API
const orders = await client.orders.list({ pageNo: 1, limit: 10 });`}</code></pre>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">Configuration</h3>
      <p className="text-gray-700 mb-4">
        The VonderaClient requires the following configuration:
      </p>
      <div className="bg-gray-50 rounded-lg p-4 mb-6">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-2 font-semibold">Parameter</th>
              <th className="text-left py-2 font-semibold">Required</th>
              <th className="text-left py-2 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 font-mono text-xs">clientId</td>
              <td className="py-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Required
                </span>
              </td>
              <td className="py-2 text-gray-600">Your app's client ID</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">clientSecret</td>
              <td className="py-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Required
                </span>
              </td>
              <td className="py-2 text-gray-600">Your app's client secret</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">appId</td>
              <td className="py-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  Required
                </span>
              </td>
              <td className="py-2 text-gray-600">Your app ID</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">locale</td>
              <td className="py-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Optional
                </span>
              </td>
              <td className="py-2 text-gray-600">Language locale (default: 'en')</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">storefrontId</td>
              <td className="py-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Optional
                </span>
              </td>
              <td className="py-2 text-gray-600">Storefront/country ID</td>
            </tr>
            <tr>
              <td className="py-2 font-mono text-xs">timezone</td>
              <td className="py-2">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  Optional
                </span>
              </td>
              <td className="py-2 text-gray-600">Timezone (default: 'Africa/Cairo')</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-amber-900 mb-1">Note</h4>
            <p className="text-sm text-amber-800">
              The base URL and platform are automatically configured and cannot be modified.
            </p>
          </div>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">Resources</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <a
          href="https://www.npmjs.com/package/vondera-app-developer"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-vondera-purple hover:bg-purple-50 transition-colors"
        >
          <svg className="w-8 h-8 text-red-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
          </svg>
          <div>
            <div className="font-semibold text-gray-900">NPM Package</div>
            <div className="text-sm text-gray-600">vondera-app-developer</div>
          </div>
        </a>
        <a
          href="https://github.com/Vondera/SendGrid-Plugin"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-vondera-purple hover:bg-purple-50 transition-colors"
        >
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          <div>
            <div className="font-semibold text-gray-900">Example Project</div>
            <div className="text-sm text-gray-600">SendGrid Plugin</div>
          </div>
        </a>
      </div>
    </div>
  );
}

function AuthenticationContent() {
  return (
    <div className="p-6 prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>

      <p className="text-gray-700 mb-6">
        Vondera uses OAuth 2.0 for authentication. Your app receives access tokens and refresh tokens during installation.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">Refresh Token</h3>
      <p className="text-gray-700 mb-4">
        Use the refresh token to get a new access token when it expires:
      </p>
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto">
        <pre className="text-sm"><code>{`const tokenData = await client.auth.refreshToken("your-refresh-token");
client.setAccessToken(tokenData.access_token);

// Response format:
{
  access_token: string;
  expires_at: string;
  token_type: string;
}`}</code></pre>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">Setting Access Token</h3>
      <p className="text-gray-700 mb-4">
        After receiving a new access token, set it on the client:
      </p>
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto">
        <pre className="text-sm"><code>{`client.setAccessToken(accessToken);`}</code></pre>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <div>
            <h4 className="text-sm font-semibold text-amber-900 mb-1">Important</h4>
            <p className="text-sm text-amber-800">
              Store refresh tokens securely. Never expose them in client-side code or commit them to version control.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApiReferenceContent() {
  return (
    <div className="p-6 prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">API Reference</h2>

      <div className="space-y-8">
        {/* Orders */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Orders</h3>

          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                <code className="text-sm">orders.list(query)</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">List orders with filtering and pagination</p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
                <pre>{`const orders = await client.orders.list({
  pageNo: 1,
  limit: 10,
  status: "pending,confirmed",
  courierId: "courier_123"
});`}</pre>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
                <code className="text-sm">orders.get(id)</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">Get a single order by ID</p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
                <pre>{`const order = await client.orders.get("order_123");`}</pre>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">POST</span>
                <code className="text-sm">orders.create(data)</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">Create a new order</p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
                <pre>{`const order = await client.orders.create({
  customer: { name: "John Doe", phone: "01234567890" },
  products: [{ id: "prod_123", quantity: 2 }],
  // ... other fields
});`}</pre>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">PUT</span>
                <code className="text-sm">orders.update(id, data)</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">Update an existing order</p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
                <pre>{`const order = await client.orders.update("order_123", {
  status: "confirmed"
});`}</pre>
              </div>
            </div>

            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded">DELETE</span>
                <code className="text-sm">orders.delete(id)</code>
              </div>
              <p className="text-sm text-gray-600 mb-3">Delete an order</p>
              <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
                <pre>{`await client.orders.delete("order_123");`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Products */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Products</h3>
          <p className="text-sm text-gray-600 mb-4">
            Similar methods available: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">list</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">get</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">create</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">update</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">delete</code>
          </p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
            <pre>{`const products = await client.products.list({
  pageNo: 1,
  limit: 10,
  categoryId: "cat_123",
  inStock: true
});`}</pre>
          </div>
        </div>

        {/* Customers */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Customers</h3>
          <p className="text-sm text-gray-600 mb-4">
            Similar methods available: <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">list</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">get</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">create</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">update</code>, <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">delete</code>
          </p>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
            <pre>{`const customers = await client.customers.list({
  pageNo: 1,
  limit: 10,
  keyword: "john"
});`}</pre>
          </div>
        </div>

        {/* Store */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Store</h3>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
            <pre>{`const store = await client.store.get();
// Returns store information including settings, markets, and areas`}</pre>
          </div>
        </div>

        {/* Areas */}
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Areas</h3>
          <div className="space-y-3">
            <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
              <pre>{`// List all areas
const areas = await client.areas.list();

// Get enabled areas only
const enabledAreas = await client.areas.getEnabled();

// Update areas
await client.areas.update({
  areas: [
    { id: "area_123", enabled: true, fee: 50 }
  ]
});`}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function WebhooksContent() {
  return (
    <div className="p-6 prose prose-gray max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Webhooks</h2>

      <p className="text-gray-700 mb-6">
        The SDK provides webhook handling for plugin installation, uninstallation, and updates.
      </p>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">Webhook Types</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-semibold text-gray-900 mb-2">Install</div>
          <p className="text-sm text-gray-600">Sent when a plugin is installed</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-semibold text-gray-900 mb-2">Uninstall</div>
          <p className="text-sm text-gray-600">Sent when a plugin is uninstalled</p>
        </div>
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="font-semibold text-gray-900 mb-2">Update</div>
          <p className="text-sm text-gray-600">Sent when a plugin is updated</p>
        </div>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">Webhook Middleware</h3>
      <p className="text-gray-700 mb-4">
        Register middleware that runs before webhook handlers. Middleware can validate, log, modify payloads, or throw errors to stop execution.
      </p>
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto">
        <pre className="text-sm"><code>{`// Install webhook middleware
client.webhooks.useInstallMiddleware(async (payload, next) => {
  console.log('Installing plugin for store:', payload.store_id);

  // Validate scopes
  if (!payload.scopes.includes('orders:read')) {
    throw new Error('Missing required scope: orders:read');
  }

  // Continue to next middleware or handler
  return await next();
});

// Uninstall webhook middleware
client.webhooks.useUninstallMiddleware(async (payload, next) => {
  console.log('Uninstalling plugin for store:', payload.store_id);
  // Perform cleanup operations
  return await next();
});`}</code></pre>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">Handling Webhooks</h3>
      <p className="text-gray-700 mb-4">
        Handle all webhook types in a single endpoint:
      </p>
      <div className="bg-gray-900 text-gray-100 rounded-lg p-4 mb-6 overflow-x-auto">
        <pre className="text-sm"><code>{`app.post('/webhooks/vondera', async (req, res) => {
  try {
    const payload = client.webhooks.parseWebhook(req.body);

    const result = await client.webhooks.handleWebhook(payload, {
      install: async (installPayload) => {
        client.setAccessToken(installPayload.access_token);
        // Save installation data to database
        return { success: true, message: 'Plugin installed' };
      },
      uninstall: async (uninstallPayload) => {
        // Cleanup: remove data, revoke tokens, etc.
        return { success: true, message: 'Plugin uninstalled' };
      },
      update: async (updatePayload) => {
        if (updatePayload.access_token) {
          client.setAccessToken(updatePayload.access_token);
        }
        return { success: true, message: 'Plugin updated' };
      },
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
});`}</code></pre>
      </div>

      <h3 className="text-xl font-semibold text-gray-900 mb-3">Webhook Payloads</h3>

      <div className="space-y-4">
        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Install Webhook</h4>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
            <pre>{`{
  action: 'install';
  store_id: string;
  app_id: string;
  installation_id: string;
  access_token: string;
  refresh_token: string;
  scopes: string[];
  expires_at: string;
  setup_data?: Record<string, any>;
}`}</pre>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Uninstall Webhook</h4>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
            <pre>{`{
  action: 'uninstall';
  store_id: string;
  app_id: string;
  installation_id: string;
}`}</pre>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-gray-900 mb-2">Update Webhook</h4>
          <div className="bg-gray-900 text-gray-100 rounded-lg p-3 text-xs overflow-x-auto">
            <pre>{`{
  action: 'update';
  store_id: string;
  app_id: string;
  installation_id: string;
  access_token?: string;
  refresh_token?: string;
  scopes?: string[];
  expires_at?: string;
  setup_data?: Record<string, any>;
}`}</pre>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExamplesContent() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="p-6 max-w-none">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Examples</h2>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h3 className="text-sm font-semibold text-green-900 mb-1">Production-Ready Example</h3>
            <p className="text-sm text-green-800">
              Complete SendGrid Plugin implementation with Supabase Edge Functions, PostgreSQL, and comprehensive documentation
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Vondera SendGrid Plugin</h3>
        <a
          href="https://github.com/Vondera/SendGrid-Plugin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-colors font-medium"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
      </div>

      <p className="text-gray-700 mb-6">
        A production-ready Vondera plugin that automatically sends SendGrid email notifications when new orders are received. Built with Supabase Edge Functions and PostgreSQL.
      </p>

      {/* Overview */}
      <div className="space-y-4 mb-8">
        {/* Features */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('features')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">Features</span>
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'features' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSection === 'features' && (
            <div className="px-4 pb-4 text-sm text-gray-700 space-y-2">
              <p>• Plugin Installation: Automatically captures and stores access/refresh tokens when users install the plugin</p>
              <p>• Plugin Uninstallation: Removes all user data (tokens, settings, orders) when users uninstall</p>
              <p>• Order Email Notifications: Automatically sends SendGrid emails when new orders are created</p>
              <p>• Settings Management: Handles user settings changes (SendGrid API keys, email preferences)</p>
              <p>• Order Tracking: Saves all orders to database with email status tracking (pending, sent, failed)</p>
              <p>• Settings Retrieval: Get user settings by storeId via API endpoint</p>
              <p>• Comprehensive Logging: Detailed logs for debugging and monitoring</p>
            </div>
          )}
        </div>

        {/* Architecture */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('architecture')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">Architecture</span>
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'architecture' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSection === 'architecture' && (
            <div className="px-4 pb-4 text-sm text-gray-700 space-y-2">
              <p>This plugin is built as Supabase Edge Functions (serverless Deno runtime):</p>
              <p className="pl-4">• <strong>vondera-sendgrid</strong>: Main webhook handler for install/uninstall/settings</p>
              <p className="pl-4">• <strong>send-order-email</strong>: Order email sender triggered by Vondera webhooks</p>
              <div className="mt-4">
                <p className="font-semibold mb-2">Tech Stack:</p>
                <div className="grid grid-cols-2 gap-2 pl-4">
                  <p>• Supabase Edge Functions</p>
                  <p>• PostgreSQL</p>
                  <p>• TypeScript</p>
                  <p>• SendGrid API</p>
                  <p>• Deno Runtime</p>
                  <p>• Serverless</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Prerequisites */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('prerequisites')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">Prerequisites</span>
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'prerequisites' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSection === 'prerequisites' && (
            <div className="px-4 pb-4 text-sm text-gray-700 space-y-2">
              <p>• Supabase Account: <a href="https://supabase.com" target="_blank" rel="noopener noreferrer" className="text-vondera-purple hover:underline">supabase.com</a> - Free tier works</p>
              <p>• SendGrid Account: <a href="https://sendgrid.com" target="_blank" rel="noopener noreferrer" className="text-vondera-purple hover:underline">sendgrid.com</a> - Free tier: 100 emails/day</p>
              <p>• Vondera Developer Account: For plugin registration</p>
              <p>• Supabase CLI: For deployment</p>
              <p>• Node.js (optional): For local development</p>
            </div>
          )}
        </div>

        {/* Installation */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('installation')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">Installation Guide</span>
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'installation' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSection === 'installation' && (
            <div className="px-4 pb-4 text-sm text-gray-700 space-y-4">
              <div>
                <p className="font-semibold mb-2">1. Install Supabase CLI</p>
                <div className="bg-gray-900 text-gray-100 rounded p-2 text-xs overflow-x-auto">
                  <code>brew install supabase/tap/supabase</code>
                </div>
                <p className="text-xs text-gray-600 mt-1">Note: Do NOT use npm install -g supabase</p>
              </div>
              <div>
                <p className="font-semibold mb-2">2. Login to Supabase</p>
                <div className="bg-gray-900 text-gray-100 rounded p-2 text-xs overflow-x-auto">
                  <code>supabase login</code>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">3. Set Up Supabase Project</p>
                <p>• Create a new project at supabase.com</p>
                <p>• Get credentials from Settings → API</p>
              </div>
              <div>
                <p className="font-semibold mb-2">4. Set Up Database</p>
                <p>• Go to SQL Editor in Supabase dashboard</p>
                <p>• Run database/schema.sql to create all tables</p>
              </div>
              <div>
                <p className="font-semibold mb-2">5. Configure Environment Variables</p>
                <div className="bg-gray-900 text-gray-100 rounded p-2 text-xs overflow-x-auto">
                  <pre>{`supabase secrets set VONDERA_CLIENT_ID=your_id --project-ref PROJECT_REF
supabase secrets set VONDERA_CLIENT_SECRET=your_secret --project-ref PROJECT_REF
supabase secrets set VONDERA_APP_ID=your_app_id --project-ref PROJECT_REF`}</pre>
                </div>
              </div>
              <div>
                <p className="font-semibold mb-2">6. Deploy Functions</p>
                <div className="bg-gray-900 text-gray-100 rounded p-2 text-xs overflow-x-auto">
                  <pre>{`supabase functions deploy vondera-sendgrid --no-verify-jwt
supabase functions deploy send-order-email --no-verify-jwt`}</pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Database Schema */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('database')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">Database Schema</span>
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'database' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSection === 'database' && (
            <div className="px-4 pb-4 text-sm text-gray-700 space-y-4">
              <div>
                <p className="font-semibold mb-2">user_tokens</p>
                <p className="text-xs">Stores access and refresh tokens for each store installation</p>
                <p className="text-xs pl-4 mt-1">Fields: store_id, installation_id, app_id, access_token, refresh_token, scopes, expires_at</p>
              </div>
              <div>
                <p className="font-semibold mb-2">user_settings</p>
                <p className="text-xs">Stores per-store SendGrid configuration and preferences</p>
                <p className="text-xs pl-4 mt-1">Fields: store_id, sendgrid_api_key, sendgrid_from_email, email_template, enabled</p>
              </div>
              <div>
                <p className="font-semibold mb-2">orders</p>
                <p className="text-xs">Stores all orders with email status tracking</p>
                <p className="text-xs pl-4 mt-1">Fields: vondera_order_id, store_id, customer_email, order_status, email_status, email_sent_at</p>
              </div>
            </div>
          )}
        </div>

        {/* How It Works */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('how-it-works')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">How It Works</span>
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'how-it-works' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSection === 'how-it-works' && (
            <div className="px-4 pb-4 text-sm text-gray-700 space-y-4">
              <div>
                <p className="font-semibold mb-2">Installation Flow</p>
                <p className="pl-4">1. User installs plugin in Vondera</p>
                <p className="pl-4">2. Vondera sends webhook to /webhook/install</p>
                <p className="pl-4">3. Function stores tokens and settings</p>
                <p className="pl-4">4. Returns success response</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Order Email Flow</p>
                <p className="pl-4">1. New order created in Vondera</p>
                <p className="pl-4">2. Vondera sends webhook to send-order-email</p>
                <p className="pl-4">3. Function saves order with status pending</p>
                <p className="pl-4">4. Fetches user settings and validates config</p>
                <p className="pl-4">5. Sends email via SendGrid API</p>
                <p className="pl-4">6. Updates email_status to sent or failed</p>
              </div>
              <div>
                <p className="font-semibold mb-2">Uninstallation Flow</p>
                <p className="pl-4">1. User uninstalls plugin</p>
                <p className="pl-4">2. Vondera sends webhook to /webhook/uninstall</p>
                <p className="pl-4">3. Function deletes all user data</p>
                <p className="pl-4">4. Returns success response</p>
              </div>
            </div>
          )}
        </div>

        {/* Webhook Configuration */}
        <div className="border border-gray-200 rounded-lg">
          <button
            onClick={() => toggleSection('webhooks-config')}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
          >
            <span className="font-semibold text-gray-900">Webhook Configuration</span>
            <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedSection === 'webhooks-config' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {expandedSection === 'webhooks-config' && (
            <div className="px-4 pb-4 text-sm text-gray-700 space-y-2">
              <p>Configure these webhook URLs in your Vondera developer dashboard:</p>
              <div className="bg-gray-50 rounded p-3 space-y-1 text-xs">
                <p><strong>Install:</strong> https://[PROJECT_REF].supabase.co/functions/v1/vondera-sendgrid/webhook/install</p>
                <p><strong>Uninstall:</strong> https://[PROJECT_REF].supabase.co/functions/v1/vondera-sendgrid/webhook/uninstall</p>
                <p><strong>Settings:</strong> https://[PROJECT_REF].supabase.co/functions/v1/vondera-sendgrid/webhook/settings</p>
                <p><strong>Order Created:</strong> https://[PROJECT_REF].supabase.co/functions/v1/send-order-email</p>
              </div>
              <p className="text-xs text-gray-600">Replace [PROJECT_REF] with your Supabase project reference ID</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-700">
          <strong>Full Documentation:</strong> Visit the <a href="https://github.com/Vondera/SendGrid-Plugin" target="_blank" rel="noopener noreferrer" className="text-vondera-purple hover:underline">GitHub repository</a> for complete documentation, code examples, troubleshooting guides, and more.
        </p>
      </div>
    </div>
  );
}
