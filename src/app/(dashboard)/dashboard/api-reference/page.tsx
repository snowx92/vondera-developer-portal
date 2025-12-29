'use client';

import { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

type Category = 'overview' | 'authentication' | 'orders' | 'products' | 'customers' | 'store' | 'areas';

export default function ApiReferencePage() {
  const [activeCategory, setActiveCategory] = useState<Category>('overview');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

  const categories = [
    { id: 'overview', name: 'Overview' },
    { id: 'authentication', name: 'Authentication' },
    { id: 'orders', name: 'Orders' },
    { id: 'products', name: 'Products' },
    { id: 'customers', name: 'Customers' },
    { id: 'store', name: 'Store' },
    { id: 'areas', name: 'Areas' },
  ];

  const toggleEndpoint = (endpoint: string) => {
    setExpandedEndpoint(expandedEndpoint === endpoint ? null : endpoint);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">API Reference</h1>
        <p className="text-gray-600">
          Complete reference for the Vondera App Developer API
        </p>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Sidebar Navigation */}
        <div className="col-span-12 lg:col-span-3">
          <div className="bg-white rounded-xl border border-gray-200 p-4 sticky top-6">
            <nav className="space-y-1">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id as Category)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-purple-50 text-vondera-purple'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="col-span-12 lg:col-span-9">
          <div className="bg-white rounded-xl border border-gray-200">
            {activeCategory === 'overview' && <OverviewContent />}
            {activeCategory === 'authentication' && <AuthenticationContent toggleEndpoint={toggleEndpoint} expandedEndpoint={expandedEndpoint} />}
            {activeCategory === 'orders' && <OrdersContent toggleEndpoint={toggleEndpoint} expandedEndpoint={expandedEndpoint} />}
            {activeCategory === 'products' && <ProductsContent toggleEndpoint={toggleEndpoint} expandedEndpoint={expandedEndpoint} />}
            {activeCategory === 'customers' && <CustomersContent toggleEndpoint={toggleEndpoint} expandedEndpoint={expandedEndpoint} />}
            {activeCategory === 'store' && <StoreContent toggleEndpoint={toggleEndpoint} expandedEndpoint={expandedEndpoint} />}
            {activeCategory === 'areas' && <AreasContent toggleEndpoint={toggleEndpoint} expandedEndpoint={expandedEndpoint} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
  return (
    <SyntaxHighlighter
      language={language}
      style={vscDarkPlus}
      customStyle={{
        borderRadius: '0.5rem',
        fontSize: '0.875rem',
        margin: 0,
      }}
    >
      {code}
    </SyntaxHighlighter>
  );
}

function OverviewContent() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Overview</h2>

      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 mb-6">
          The Vondera App Developer API allows you to build apps that integrate with the Vondera platform.
          Access orders, products, customers, and more through our RESTful API.
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Base URL</h3>
          <code className="text-sm text-blue-800">https://api.vondera.com/v1</code>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Installation</h3>
        <p className="text-gray-700 mb-4">Install the official TypeScript SDK:</p>

        <CodeBlock code="npm install vondera-app-developer" language="bash" />

        <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Quick Start</h3>
        <CodeBlock code={`import { VonderaClient } from "vondera-app-developer";

const client = new VonderaClient({
  clientId: "your-client-id",
  clientSecret: "your-client-secret",
  appId: "your-app-id",
});

// Refresh access token
const tokenData = await client.auth.refreshToken("your-refresh-token");
client.setAccessToken(tokenData.access_token);

// Make API calls
const orders = await client.orders.list({ pageNo: 1, limit: 10 });`} />

        <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Response Format</h3>
        <p className="text-gray-700 mb-4">All API responses follow this format:</p>
        <CodeBlock code={`{
  "success": true,
  "data": {...},
  "message": "Success"
}`} language="json" />

        <h3 className="text-lg font-semibold text-gray-900 mb-3 mt-6">Error Handling</h3>
        <p className="text-gray-700 mb-4">Error responses include:</p>
        <CodeBlock code={`{
  "success": false,
  "error": {
    "code": "INVALID_TOKEN",
    "message": "The access token is invalid or expired"
  }
}`} language="json" />
      </div>
    </div>
  );
}

function AuthenticationContent({ toggleEndpoint, expandedEndpoint }: { toggleEndpoint: (id: string) => void; expandedEndpoint: string | null }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication</h2>
      <p className="text-gray-700 mb-6">
        Vondera uses OAuth 2.0 for authentication. Your app receives access and refresh tokens during installation.
      </p>

      {/* Refresh Token Endpoint */}
      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleEndpoint('refresh-token')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">POST</span>
            <code className="text-sm font-mono">/auth/refresh</code>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedEndpoint === 'refresh-token' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedEndpoint === 'refresh-token' && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-gray-700">Refresh the access token using a refresh token.</p>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
              <CodeBlock code={`const tokenData = await client.auth.refreshToken("your-refresh-token");
client.setAccessToken(tokenData.access_token);`} />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Response</h4>
              <CodeBlock code={`{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_at": "2025-01-15T10:30:00Z",
  "token_type": "Bearer"
}`} language="json" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OrdersContent({ toggleEndpoint, expandedEndpoint }: { toggleEndpoint: (id: string) => void; expandedEndpoint: string | null }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Orders</h2>
      <p className="text-gray-700 mb-6">
        Manage orders including listing, creating, updating, and deleting orders.
      </p>

      {/* List Orders */}
      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleEndpoint('orders-list')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
            <code className="text-sm font-mono">/orders</code>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedEndpoint === 'orders-list' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedEndpoint === 'orders-list' && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-gray-700">List orders with filtering and pagination.</p>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
              <CodeBlock code={`const orders = await client.orders.list({
  pageNo: 1,
  limit: 10,
  status: "pending,confirmed",
  courierId: "courier_123",
  keyword: "John Doe"
});`} />
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Query Parameters</h4>
              <div className="text-sm space-y-2">
                <div className="flex gap-2"><code className="text-xs bg-gray-100 px-2 py-1 rounded">pageNo</code><span className="text-gray-700">(required) - Page number</span></div>
                <div className="flex gap-2"><code className="text-xs bg-gray-100 px-2 py-1 rounded">limit</code><span className="text-gray-700">(required) - Items per page</span></div>
                <div className="flex gap-2"><code className="text-xs bg-gray-100 px-2 py-1 rounded">status</code><span className="text-gray-700">Filter by status (comma-separated)</span></div>
                <div className="flex gap-2"><code className="text-xs bg-gray-100 px-2 py-1 rounded">courierId</code><span className="text-gray-700">Filter by courier</span></div>
                <div className="flex gap-2"><code className="text-xs bg-gray-100 px-2 py-1 rounded">keyword</code><span className="text-gray-700">Search keyword</span></div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Response</h4>
              <CodeBlock code={`{
  "data": [
    {
      "id": "order_123",
      "orderNumber": "ORD-12345",
      "customer": {
        "name": "John Doe",
        "phone": "01234567890",
        "email": "john@example.com"
      },
      "total": 500,
      "status": "pending",
      "createdAt": "2025-01-10T10:00:00Z"
    }
  ],
  "pagination": {
    "total": 150,
    "page": 1,
    "limit": 10
  }
}`} language="json" />
            </div>
          </div>
        )}
      </div>

      {/* Get Order */}
      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleEndpoint('orders-get')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
            <code className="text-sm font-mono">/orders/:id</code>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedEndpoint === 'orders-get' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedEndpoint === 'orders-get' && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-gray-700">Get a single order by ID.</p>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
              <CodeBlock code={`const order = await client.orders.get("order_123");`} />
            </div>
          </div>
        )}
      </div>

      {/* Create Order */}
      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleEndpoint('orders-create')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded">POST</span>
            <code className="text-sm font-mono">/orders</code>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedEndpoint === 'orders-create' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedEndpoint === 'orders-create' && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-gray-700">Create a new order.</p>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
              <CodeBlock code={`const order = await client.orders.create({
  customer: {
    name: "John Doe",
    phone: "01234567890",
    email: "john@example.com"
  },
  products: [
    { id: "prod_123", quantity: 2, price: 250 }
  ],
  shippingAddress: {
    address: "123 Main St",
    city: "Cairo",
    governorate: "Cairo"
  }
});`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductsContent({ toggleEndpoint, expandedEndpoint }: { toggleEndpoint: (id: string) => void; expandedEndpoint: string | null }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Products</h2>
      <p className="text-gray-700 mb-6">
        Manage products including listing, creating, updating, and deleting products.
      </p>

      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleEndpoint('products-list')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
            <code className="text-sm font-mono">/products</code>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedEndpoint === 'products-list' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedEndpoint === 'products-list' && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-gray-700">List products with filtering and pagination.</p>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
              <CodeBlock code={`const products = await client.products.list({
  pageNo: 1,
  limit: 10,
  categoryId: "cat_123",
  inStock: true,
  keyword: "T-shirt"
});`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CustomersContent({ toggleEndpoint, expandedEndpoint }: { toggleEndpoint: (id: string) => void; expandedEndpoint: string | null }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Customers</h2>
      <p className="text-gray-700 mb-6">
        Manage customers including listing, creating, updating, and deleting customers.
      </p>

      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleEndpoint('customers-list')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
            <code className="text-sm font-mono">/customers</code>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedEndpoint === 'customers-list' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedEndpoint === 'customers-list' && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-gray-700">List customers with filtering and pagination.</p>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
              <CodeBlock code={`const customers = await client.customers.list({
  pageNo: 1,
  limit: 10,
  keyword: "John"
});`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StoreContent({ toggleEndpoint, expandedEndpoint }: { toggleEndpoint: (id: string) => void; expandedEndpoint: string | null }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Store</h2>
      <p className="text-gray-700 mb-6">
        Get store information including settings, markets, and areas.
      </p>

      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleEndpoint('store-get')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
            <code className="text-sm font-mono">/store</code>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedEndpoint === 'store-get' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedEndpoint === 'store-get' && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-gray-700">Get store information.</p>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
              <CodeBlock code={`const store = await client.store.get();`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AreasContent({ toggleEndpoint, expandedEndpoint }: { toggleEndpoint: (id: string) => void; expandedEndpoint: string | null }) {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Areas</h2>
      <p className="text-gray-700 mb-6">
        Manage delivery areas including listing and updating area configuration.
      </p>

      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleEndpoint('areas-list')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded">GET</span>
            <code className="text-sm font-mono">/areas</code>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedEndpoint === 'areas-list' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedEndpoint === 'areas-list' && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-gray-700">List all delivery areas (enabled and disabled).</p>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
              <CodeBlock code={`const areas = await client.areas.list();`} />
            </div>
          </div>
        )}
      </div>

      <div className="border border-gray-200 rounded-lg mb-4">
        <button
          onClick={() => toggleEndpoint('areas-update')}
          className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50"
        >
          <div className="flex items-center gap-3">
            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded">PUT</span>
            <code className="text-sm font-mono">/areas</code>
          </div>
          <svg className={`w-5 h-5 text-gray-500 transition-transform ${expandedEndpoint === 'areas-update' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {expandedEndpoint === 'areas-update' && (
          <div className="px-4 pb-4 space-y-4">
            <p className="text-sm text-gray-700">Update areas configuration (enable/disable, set fees).</p>

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">Request</h4>
              <CodeBlock code={`await client.areas.update({
  areas: [
    { id: "area_123", enabled: true, fee: 50 },
    { id: "area_456", enabled: false }
  ]
});`} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
