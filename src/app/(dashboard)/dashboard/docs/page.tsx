'use client';

import { useState } from 'react';

type Section = 'getting-started' | 'authentication' | 'api-reference' | 'webhooks' | 'examples';

export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState<Section>('getting-started');

  const sections = [
    {
      id: 'getting-started',
      name: 'Getting Started',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'authentication',
      name: 'Authentication',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
    },
    {
      id: 'api-reference',
      name: 'API Reference',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
        </svg>
      ),
    },
    {
      id: 'webhooks',
      name: 'Webhooks',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      id: 'examples',
      name: 'Examples',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-vondera-purple rounded-lg flex items-center justify-center shadow-sm">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">Documentation</h1>
            </div>
          </div>
          <p className="text-gray-600 ml-13">
            Everything you need to build apps on the Vondera platform
          </p>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar Navigation */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm sticky top-6">
              <div className="p-4 border-b border-gray-100">
                <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Contents</h2>
              </div>
              <nav className="p-3 space-y-1">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id as Section)}
                    className={`w-full flex items-center gap-3 text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                      activeSection === section.id
                        ? 'bg-vondera-purple text-white shadow-md'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <span className={activeSection === section.id ? 'text-white' : 'text-gray-400'}>
                      {section.icon}
                    </span>
                    {section.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="col-span-12 lg:col-span-9">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm min-h-[600px]">
              {activeSection === 'getting-started' && <GettingStartedContent />}
              {activeSection === 'authentication' && <AuthenticationContent />}
              {activeSection === 'api-reference' && <ApiReferenceContent />}
              {activeSection === 'webhooks' && <WebhooksContent />}
              {activeSection === 'examples' && <ExamplesContent />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Syntax highlighter for code blocks
function highlightCode(code: string, language: string = 'typescript'): string {
  // First, escape HTML characters
  const escapeHtml = (text: string) => {
    return text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  };

  const escaped = escapeHtml(code);

  // Token types to match (order matters - most specific first)
  const tokenPatterns = [
    // Comments (must be first to prevent highlighting inside comments)
    { regex: /(\/\/.*?$|\/\*[\s\S]*?\*\/)/gm, className: 'text-gray-500' },
    // Strings (must be before other patterns)
    { regex: /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)/g, className: 'text-green-400' },
    // Keywords
    {
      regex: /\b(import|from|export|default|const|let|var|function|async|await|return|if|else|for|while|do|switch|case|break|continue|try|catch|finally|throw|new|class|extends|interface|type|enum|typeof|instanceof)\b/g,
      className: 'text-purple-400'
    },
    // Special values
    { regex: /\b(true|false|null|undefined)\b/g, className: 'text-red-400' },
    // Numbers
    { regex: /\b(\d+\.?\d*)\b/g, className: 'text-orange-400' },
    // Function calls
    { regex: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g, className: 'text-blue-400' },
    // Properties (after a dot)
    { regex: /\.([a-zA-Z_$][a-zA-Z0-9_$]*)/g, className: 'text-cyan-400', keepPrefix: true },
  ];

  // Process tokens in a single pass by finding all matches first
  interface Token {
    start: number;
    end: number;
    text: string;
    className: string;
    keepPrefix?: boolean;
  }

  let tokens: Token[] = [];

  tokenPatterns.forEach(pattern => {
    let match;
    const regex = new RegExp(pattern.regex.source, pattern.regex.flags);
    while ((match = regex.exec(escaped)) !== null) {
      const matchText = match[1] || match[0];
      const matchStart = match.index + (pattern.keepPrefix ? 1 : 0);
      const matchEnd = matchStart + matchText.length;

      // Check if this position is already covered by a higher priority token
      const overlaps = tokens.some(token =>
        (matchStart >= token.start && matchStart < token.end) ||
        (matchEnd > token.start && matchEnd <= token.end) ||
        (matchStart <= token.start && matchEnd >= token.end)
      );

      if (!overlaps) {
        tokens.push({
          start: matchStart,
          end: matchEnd,
          text: matchText,
          className: pattern.className,
          keepPrefix: pattern.keepPrefix
        });
      }
    }
  });

  // Sort tokens by start position
  tokens.sort((a, b) => a.start - b.start);

  // Build the highlighted string
  let result = '';
  let lastIndex = 0;

  tokens.forEach(token => {
    // Add text before this token
    result += escaped.substring(lastIndex, token.start);

    // Add highlighted token
    result += `<span class="${token.className}">${token.text}</span>`;

    lastIndex = token.end;
  });

  // Add remaining text
  result += escaped.substring(lastIndex);

  return result;
}

function CodeBlock({ code, language = 'typescript' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const highlightedCode = highlightCode(code, language);

  return (
    <div className="relative group">
      <div className="bg-[#1e1e1e] rounded-lg p-4 overflow-x-auto border border-gray-700">
        <pre className="text-sm">
          <code dangerouslySetInnerHTML={{ __html: highlightedCode }} className="text-gray-300" />
        </pre>
      </div>
      <button
        onClick={copyToClipboard}
        className="absolute top-3 right-3 p-2 rounded-md bg-gray-800 hover:bg-gray-700 transition-colors opacity-0 group-hover:opacity-100"
        title="Copy code"
      >
        {copied ? (
          <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
        )}
      </button>
    </div>
  );
}

function GettingStartedContent() {
  return (
    <div className="p-8 prose prose-gray max-w-none">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Getting Started</h2>
        <p className="text-gray-600">Learn how to build apps on the Vondera platform</p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-blue-900 mb-2">NPM Package Available</h3>
            <p className="text-sm text-blue-800 leading-relaxed">
              Use our official TypeScript SDK for building apps on the Vondera platform. Get type safety, autocomplete, and a great developer experience.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 text-vondera-purple rounded-lg flex items-center justify-center text-sm font-bold">1</span>
            Installation
          </h3>
          <p className="text-gray-700 mb-4">
            Install the Vondera App Developer SDK using npm or yarn:
          </p>
          <CodeBlock code="npm install vondera-app-developer" />
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 text-vondera-purple rounded-lg flex items-center justify-center text-sm font-bold">2</span>
            Quick Start
          </h3>
          <p className="text-gray-700 mb-4">
            Initialize the client and start making API calls:
          </p>
          <CodeBlock code={`import { VonderaClient } from "vondera-app-developer";

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
const orders = await client.orders.list({ pageNo: 1, limit: 10 });`} />
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="w-8 h-8 bg-purple-100 text-vondera-purple rounded-lg flex items-center justify-center text-sm font-bold">3</span>
            Configuration
          </h3>
          <p className="text-gray-700 mb-4">
            The VonderaClient requires the following configuration:
          </p>
          <div className="bg-gray-50 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Parameter</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Required</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-900">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-vondera-purple">clientId</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      Required
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">Your app&apos;s client ID</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-vondera-purple">clientSecret</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      Required
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">Your app&apos;s client secret</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-vondera-purple">appId</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                      Required
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">Your app ID</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-vondera-purple">locale</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      Optional
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">Language locale (default: &apos;en&apos;)</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-vondera-purple">storefrontId</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      Optional
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">Storefront/country ID</td>
                </tr>
                <tr className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-vondera-purple">timezone</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      Optional
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">Timezone (default: &apos;Africa/Cairo&apos;)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-900 mb-1.5">Important Note</h4>
              <p className="text-sm text-amber-800 leading-relaxed">
                The base URL and platform are automatically configured and cannot be modified.
              </p>
            </div>
          </div>
        </div>

        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Resources</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a
              href="https://www.npmjs.com/package/vondera-app-developer"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-xl hover:border-vondera-purple hover:bg-purple-50 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">NPM Package</div>
                <div className="text-sm text-gray-600">vondera-app-developer</div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-vondera-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
            <a
              href="https://github.com/Vondera/SendGrid-Plugin"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-5 border-2 border-gray-200 rounded-xl hover:border-vondera-purple hover:bg-purple-50 transition-all group shadow-sm hover:shadow-md"
            >
              <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                <svg className="w-7 h-7 text-gray-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
              </div>
              <div className="flex-1">
                <div className="font-semibold text-gray-900 mb-1">Example Project</div>
                <div className="text-sm text-gray-600">SendGrid Plugin</div>
              </div>
              <svg className="w-5 h-5 text-gray-400 group-hover:text-vondera-purple transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}

function AuthenticationContent() {
  return (
    <div className="p-8 prose prose-gray max-w-none">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Authentication</h2>
        <p className="text-gray-600">Learn how to authenticate your app with Vondera</p>
      </div>

      <p className="text-gray-700 mb-8 text-base leading-relaxed">
        Vondera uses OAuth 2.0 for authentication. Your app receives access tokens and refresh tokens during installation.
      </p>

      <div className="space-y-8">
        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Refresh Token</h3>
          <p className="text-gray-700 mb-4">
            Use the refresh token to get a new access token when it expires:
          </p>
          <CodeBlock code={`const tokenData = await client.auth.refreshToken("your-refresh-token");
client.setAccessToken(tokenData.access_token);

// Response format:
{
  access_token: string;
  expires_at: string;
  token_type: string;
}`} />
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Setting Access Token</h3>
          <p className="text-gray-700 mb-4">
            After receiving a new access token, set it on the client:
          </p>
          <CodeBlock code={`client.setAccessToken(accessToken);`} />
        </section>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mt-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-900 mb-1.5">Security Best Practice</h4>
            <p className="text-sm text-amber-800 leading-relaxed">
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
    <div className="p-8 prose prose-gray max-w-none">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">API Reference</h2>
        <p className="text-gray-600">Complete API reference for all available methods</p>
      </div>

      <div className="space-y-10">
        {/* Orders */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-5 flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            Orders
          </h3>

          <div className="space-y-4">
            <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md border border-green-200">GET</span>
                <code className="text-sm font-mono text-vondera-purple">orders.list(query)</code>
              </div>
              <p className="text-sm text-gray-600 mb-4">List orders with filtering and pagination</p>
              <CodeBlock code={`const orders = await client.orders.list({
  pageNo: 1,
  limit: 10,
  status: "pending,confirmed",
  courierId: "courier_123"
});`} />
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-md border border-green-200">GET</span>
                <code className="text-sm font-mono text-vondera-purple">orders.get(id)</code>
              </div>
              <p className="text-sm text-gray-600 mb-4">Get a single order by ID</p>
              <CodeBlock code={`const order = await client.orders.get("order_123");`} />
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-md border border-blue-200">POST</span>
                <code className="text-sm font-mono text-vondera-purple">orders.create(data)</code>
              </div>
              <p className="text-sm text-gray-600 mb-4">Create a new order</p>
              <CodeBlock code={`const order = await client.orders.create({
  customer: { name: "John Doe", phone: "01234567890" },
  products: [{ id: "prod_123", quantity: 2 }],
  // ... other fields
});`} />
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-md border border-yellow-200">PUT</span>
                <code className="text-sm font-mono text-vondera-purple">orders.update(id, data)</code>
              </div>
              <p className="text-sm text-gray-600 mb-4">Update an existing order</p>
              <CodeBlock code={`const order = await client.orders.update("order_123", {
  status: "confirmed"
});`} />
            </div>

            <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all">
              <div className="flex items-center gap-3 mb-3">
                <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded-md border border-red-200">DELETE</span>
                <code className="text-sm font-mono text-vondera-purple">orders.delete(id)</code>
              </div>
              <p className="text-sm text-gray-600 mb-4">Delete an order</p>
              <CodeBlock code={`await client.orders.delete("order_123");`} />
            </div>
          </div>
        </section>

        {/* Products */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-5 flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            Products
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Similar methods available: <code className="text-xs bg-purple-50 px-2 py-1 rounded text-vondera-purple border border-purple-200">list</code>, <code className="text-xs bg-purple-50 px-2 py-1 rounded text-vondera-purple border border-purple-200">get</code>, <code className="text-xs bg-purple-50 px-2 py-1 rounded text-vondera-purple border border-purple-200">create</code>, <code className="text-xs bg-purple-50 px-2 py-1 rounded text-vondera-purple border border-purple-200">update</code>, <code className="text-xs bg-purple-50 px-2 py-1 rounded text-vondera-purple border border-purple-200">delete</code>
          </p>
          <CodeBlock code={`const products = await client.products.list({
  pageNo: 1,
  limit: 10,
  categoryId: "cat_123",
  inStock: true
});`} />
        </section>

        {/* Customers */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-5 flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            Customers
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Similar methods available: <code className="text-xs bg-green-50 px-2 py-1 rounded text-green-700 border border-green-200">list</code>, <code className="text-xs bg-green-50 px-2 py-1 rounded text-green-700 border border-green-200">get</code>, <code className="text-xs bg-green-50 px-2 py-1 rounded text-green-700 border border-green-200">create</code>, <code className="text-xs bg-green-50 px-2 py-1 rounded text-green-700 border border-green-200">update</code>, <code className="text-xs bg-green-50 px-2 py-1 rounded text-green-700 border border-green-200">delete</code>
          </p>
          <CodeBlock code={`const customers = await client.customers.list({
  pageNo: 1,
  limit: 10,
  keyword: "john"
});`} />
        </section>

        {/* Store */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-5 flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            Store
          </h3>
          <CodeBlock code={`const store = await client.store.get();
// Returns store information including settings, markets, and areas`} />
        </section>

        {/* Areas */}
        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-5 flex items-center gap-3 pb-3 border-b border-gray-200">
            <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            Areas
          </h3>
          <CodeBlock code={`// List all areas
const areas = await client.areas.list();

// Get enabled areas only
const enabledAreas = await client.areas.getEnabled();

// Update areas
await client.areas.update({
  areas: [
    { id: "area_123", enabled: true, fee: 50 }
  ]
});`} />
        </section>
      </div>
    </div>
  );
}

function WebhooksContent() {
  return (
    <div className="p-8 prose prose-gray max-w-none">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Webhooks</h2>
        <p className="text-gray-600">Handle plugin lifecycle events with webhooks</p>
      </div>

      <p className="text-gray-700 mb-8 text-base leading-relaxed">
        The SDK provides webhook handling for plugin installation, uninstallation, and updates.
      </p>

      <div className="space-y-8">
        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-5">Webhook Types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-vondera-purple transition-all">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900 mb-2">Install</div>
              <p className="text-sm text-gray-600">Sent when a plugin is installed</p>
            </div>
            <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-vondera-purple transition-all">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900 mb-2">Uninstall</div>
              <p className="text-sm text-gray-600">Sent when a plugin is uninstalled</p>
            </div>
            <div className="border-2 border-gray-200 rounded-xl p-5 hover:border-vondera-purple transition-all">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div className="font-semibold text-gray-900 mb-2">Update</div>
              <p className="text-sm text-gray-600">Sent when a plugin is updated</p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Webhook Middleware</h3>
          <p className="text-gray-700 mb-4">
            Register middleware that runs before webhook handlers. Middleware can validate, log, modify payloads, or throw errors to stop execution.
          </p>
          <CodeBlock code={`// Install webhook middleware
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
});`} />
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">Handling Webhooks</h3>
          <p className="text-gray-700 mb-4">
            Handle all webhook types in a single endpoint:
          </p>
          <CodeBlock code={`app.post('/webhooks/vondera', async (req, res) => {
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
});`} />
        </section>

        <section>
          <h3 className="text-2xl font-semibold text-gray-900 mb-5">Webhook Payloads</h3>

          <div className="space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                Install Webhook
              </h4>
              <CodeBlock code={`{
  action: 'install';
  store_id: string;
  app_id: string;
  installation_id: string;
  access_token: string;
  refresh_token: string;
  scopes: string[];
  expires_at: string;
  setup_data?: Record<string, any>;
}`} />
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-red-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </div>
                Uninstall Webhook
              </h4>
              <CodeBlock code={`{
  action: 'uninstall';
  store_id: string;
  app_id: string;
  installation_id: string;
}`} />
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                Update Webhook
              </h4>
              <CodeBlock code={`{
  action: 'update';
  store_id: string;
  app_id: string;
  installation_id: string;
  access_token?: string;
  refresh_token?: string;
  scopes?: string[];
  expires_at?: string;
  setup_data?: Record<string, any>;
}`} />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

function ExamplesContent() {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const sections = [
    { id: 'features', title: 'Features' },
    { id: 'architecture', title: 'Architecture' },
    { id: 'prerequisites', title: 'Prerequisites' },
    { id: 'installation', title: 'Installation Guide' },
    { id: 'database', title: 'Database Schema' },
    { id: 'how-it-works', title: 'How It Works' },
    { id: 'webhooks-config', title: 'Webhook Configuration' },
  ];

  return (
    <div className="p-8 max-w-none">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Examples</h2>
        <p className="text-gray-600">Production-ready code examples and implementations</p>
      </div>

      <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-green-900 mb-2">Production-Ready Example</h3>
            <p className="text-sm text-green-800 leading-relaxed">
              Complete SendGrid Plugin implementation with Supabase Edge Functions, PostgreSQL, and comprehensive documentation
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 bg-gray-50 rounded-xl p-5 border border-gray-200">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-1">Vondera SendGrid Plugin</h3>
          <p className="text-sm text-gray-600">A production-ready Vondera plugin with Supabase Edge Functions</p>
        </div>
        <a
          href="https://github.com/Vondera/SendGrid-Plugin"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-3 bg-gray-900 text-white text-sm rounded-lg hover:bg-gray-800 transition-all font-medium shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
          </svg>
          View on GitHub
        </a>
      </div>

      <p className="text-gray-700 mb-8 text-base leading-relaxed">
        A production-ready Vondera plugin that automatically sends SendGrid email notifications when new orders are received. Built with Supabase Edge Functions and PostgreSQL.
      </p>

      {/* Accordion Sections */}
      <div className="space-y-3">
        {sections.map((section) => {
          const isExpanded = expandedSection === section.id;
          return (
            <div key={section.id} className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-vondera-purple transition-all">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full flex items-center justify-between p-5 text-left bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-lg">{section.title}</span>
                <svg className={`w-6 h-6 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {isExpanded && (
                <div className="px-5 pb-5 bg-gray-50 border-t border-gray-200">
                  {section.id === 'features' && (
                    <div className="text-sm text-gray-700 space-y-2.5 pt-4">
                      {[
                        'Plugin Installation: Automatically captures and stores access/refresh tokens when users install the plugin',
                        'Plugin Uninstallation: Removes all user data (tokens, settings, orders) when users uninstall',
                        'Order Email Notifications: Automatically sends SendGrid emails when new orders are created',
                        'Settings Management: Handles user settings changes (SendGrid API keys, email preferences)',
                        'Order Tracking: Saves all orders to database with email status tracking (pending, sent, failed)',
                        'Settings Retrieval: Get user settings by storeId via API endpoint',
                        'Comprehensive Logging: Detailed logs for debugging and monitoring',
                      ].map((feature, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-5 h-5 bg-purple-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                            <svg className="w-3 h-3 text-vondera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                          <span className="leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.id === 'architecture' && (
                    <div className="text-sm text-gray-700 space-y-4 pt-4">
                      <div>
                        <p className="font-medium text-gray-900 mb-2">Supabase Edge Functions (serverless Deno runtime):</p>
                        <div className="space-y-2 pl-4">
                          <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-vondera-purple rounded-full mt-2"></span>
                            <p><strong className="text-gray-900">vondera-sendgrid:</strong> Main webhook handler for install/uninstall/settings</p>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 bg-vondera-purple rounded-full mt-2"></span>
                            <p><strong className="text-gray-900">send-order-email:</strong> Order email sender triggered by Vondera webhooks</p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 mb-3">Tech Stack:</p>
                        <div className="grid grid-cols-2 gap-3">
                          {['Supabase Edge Functions', 'PostgreSQL', 'TypeScript', 'SendGrid API', 'Deno Runtime', 'Serverless'].map((tech) => (
                            <div key={tech} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-gray-200">
                              <div className="w-2 h-2 bg-vondera-purple rounded-full"></div>
                              <span className="font-medium">{tech}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                  {section.id === 'prerequisites' && (
                    <div className="text-sm text-gray-700 space-y-3 pt-4">
                      {[
                        { title: 'Supabase Account', desc: 'supabase.com - Free tier works', link: 'https://supabase.com' },
                        { title: 'SendGrid Account', desc: 'sendgrid.com - Free tier: 100 emails/day', link: 'https://sendgrid.com' },
                        { title: 'Vondera Developer Account', desc: 'For plugin registration', link: null },
                        { title: 'Supabase CLI', desc: 'For deployment', link: null },
                        { title: 'Node.js', desc: 'For local development (optional)', link: null },
                      ].map((item, index) => (
                        <div key={index} className="flex items-start gap-3 bg-white rounded-lg p-3 border border-gray-200">
                          <div className="w-6 h-6 bg-purple-100 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-vondera-purple font-bold text-xs">{index + 1}</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{item.title}</p>
                            <p className="text-gray-600 text-xs mt-0.5">
                              {item.link ? (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="text-vondera-purple hover:underline">
                                  {item.desc}
                                </a>
                              ) : (
                                item.desc
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.id === 'installation' && (
                    <div className="text-sm text-gray-700 space-y-5 pt-4">
                      {[
                        { title: 'Install Supabase CLI', code: 'brew install supabase/tap/supabase', note: 'Do NOT use npm install -g supabase' },
                        { title: 'Login to Supabase', code: 'supabase login', note: null },
                        { title: 'Set Up Supabase Project', code: null, note: 'Create a new project at supabase.com and get credentials from Settings → API' },
                        { title: 'Set Up Database', code: null, note: 'Go to SQL Editor in Supabase dashboard and run database/schema.sql' },
                        { title: 'Configure Environment Variables', code: `supabase secrets set VONDERA_CLIENT_ID=your_id --project-ref PROJECT_REF
supabase secrets set VONDERA_CLIENT_SECRET=your_secret --project-ref PROJECT_REF
supabase secrets set VONDERA_APP_ID=your_app_id --project-ref PROJECT_REF`, note: null },
                        { title: 'Deploy Functions', code: `supabase functions deploy vondera-sendgrid --no-verify-jwt
supabase functions deploy send-order-email --no-verify-jwt`, note: null },
                      ].map((step, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-7 h-7 bg-vondera-purple rounded-lg flex items-center justify-center text-white font-bold text-sm">
                              {index + 1}
                            </div>
                            <p className="font-semibold text-gray-900">{step.title}</p>
                          </div>
                          {step.code && (
                            <div className="bg-[#1e1e1e] text-gray-100 rounded-lg p-3 text-xs overflow-x-auto mb-2 border border-gray-700">
                              <pre>{step.code}</pre>
                            </div>
                          )}
                          {step.note && (
                            <p className="text-xs text-gray-600 pl-10">{step.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                  {section.id === 'database' && (
                    <div className="text-sm text-gray-700 space-y-4 pt-4">
                      {[
                        { name: 'user_tokens', desc: 'Stores access and refresh tokens for each store installation', fields: 'store_id, installation_id, app_id, access_token, refresh_token, scopes, expires_at' },
                        { name: 'user_settings', desc: 'Stores per-store SendGrid configuration and preferences', fields: 'store_id, sendgrid_api_key, sendgrid_from_email, email_template, enabled' },
                        { name: 'orders', desc: 'Stores all orders with email status tracking', fields: 'vondera_order_id, store_id, customer_email, order_status, email_status, email_sent_at' },
                      ].map((table, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <div className="flex items-start gap-3 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                              <svg className="w-5 h-5 text-vondera-purple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                              </svg>
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-gray-900 mb-1 font-mono text-vondera-purple">{table.name}</p>
                              <p className="text-xs text-gray-600 mb-2">{table.desc}</p>
                              <p className="text-xs text-gray-500 bg-gray-50 rounded px-2 py-1.5 font-mono">{table.fields}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.id === 'how-it-works' && (
                    <div className="text-sm text-gray-700 space-y-5 pt-4">
                      {[
                        {
                          title: 'Installation Flow',
                          steps: [
                            'User installs plugin in Vondera',
                            'Vondera sends webhook to /webhook/install',
                            'Function stores tokens and settings',
                            'Returns success response',
                          ],
                        },
                        {
                          title: 'Order Email Flow',
                          steps: [
                            'New order created in Vondera',
                            'Vondera sends webhook to send-order-email',
                            'Function saves order with status pending',
                            'Fetches user settings and validates config',
                            'Sends email via SendGrid API',
                            'Updates email_status to sent or failed',
                          ],
                        },
                        {
                          title: 'Uninstallation Flow',
                          steps: [
                            'User uninstalls plugin',
                            'Vondera sends webhook to /webhook/uninstall',
                            'Function deletes all user data',
                            'Returns success response',
                          ],
                        },
                      ].map((flow, index) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                          <p className="font-semibold text-gray-900 text-base mb-4">{flow.title}</p>
                          <div className="space-y-2.5">
                            {flow.steps.map((step, stepIndex) => (
                              <div key={stepIndex} className="flex items-start gap-3 pl-4">
                                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-vondera-purple font-bold text-xs">{stepIndex + 1}</span>
                                </div>
                                <p className="text-gray-700 leading-relaxed pt-0.5">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.id === 'webhooks-config' && (
                    <div className="text-sm text-gray-700 space-y-4 pt-4">
                      <p className="text-base font-medium text-gray-900">Configure these webhook URLs in your Vondera developer dashboard:</p>
                      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                        {[
                          { label: 'Install', path: '/vondera-sendgrid/webhook/install', colorClass: 'bg-green-100 text-green-800 border-green-200' },
                          { label: 'Uninstall', path: '/vondera-sendgrid/webhook/uninstall', colorClass: 'bg-red-100 text-red-800 border-red-200' },
                          { label: 'Settings', path: '/vondera-sendgrid/webhook/settings', colorClass: 'bg-blue-100 text-blue-800 border-blue-200' },
                          { label: 'Order Created', path: '/send-order-email', colorClass: 'bg-purple-100 text-purple-800 border-purple-200' },
                        ].map((webhook) => (
                          <div key={webhook.label} className="flex items-start gap-3">
                            <div className={`px-3 py-1 ${webhook.colorClass} text-xs font-semibold rounded-md border flex-shrink-0`}>
                              {webhook.label}
                            </div>
                            <code className="text-xs bg-gray-50 px-3 py-2 rounded border border-gray-200 flex-1 overflow-x-auto">
                              https://[PROJECT_REF].supabase.co/functions/v1{webhook.path}
                            </code>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-gray-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                        <strong className="text-amber-900">Note:</strong> Replace [PROJECT_REF] with your Supabase project reference ID
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mt-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-sm text-gray-700 leading-relaxed">
              <strong className="text-gray-900">Full Documentation:</strong> Visit the{' '}
              <a href="https://github.com/Vondera/SendGrid-Plugin" target="_blank" rel="noopener noreferrer" className="text-vondera-purple hover:underline font-medium">
                GitHub repository
              </a>{' '}
              for complete documentation, code examples, troubleshooting guides, and more.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
