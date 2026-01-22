import React, { useState } from "react";
import { Menu, X, Copy, Check, ChevronRight, Database, Key, Shield } from "lucide-react";

// --- Configuration: Environment Variable ---
const BASE_URL = import.meta.env.VITE_BACKEND_URL || "https://api.gigadb.com";

// --- Configuration Data ---
const apiDocsData = [
  {
    id: "auth",
    title: "Authentication",
    icon: <Shield className="w-5 h-5" />,
    description: "All API requests must include an API key in the request headers.",
    content: [
      {
        type: "code",
        label: "Header",
        code: "X-API-Key: <YOUR_API_KEY>",
        language: "http",
      },
    ],
  },
  {
    id: "keys",
    title: "API Key Management",
    icon: <Key className="w-5 h-5" />,
    endpoints: [
      {
        title: "Create API Key",
        method: "POST",
        path: `${BASE_URL}/api/keys`,
        body: '{\n  "name": "my-api-key"\n}',
      },
      {
        title: "List API Keys",
        method: "GET",
        path: `${BASE_URL}/api/keys?page=1&limit=10`,
      },
      {
        title: "Revoke API Key",
        method: "POST",
        path: `${BASE_URL}/api/keys/revoke`,
        body: '{\n  "apiKeyId": "key_id"\n}',
      },
    ],
  },
  {
    id: "collections",
    title: "Database Collections",
    icon: <Database className="w-5 h-5" />,
    endpoints: [
      {
        title: "Get Documents",
        method: "GET",
        path: `${BASE_URL}/api/v1/db/collections?collectionName=users`,
      },
      {
        title: "Insert Document",
        method: "POST",
        path: `${BASE_URL}/api/v1/db/collections?collectionName=users`,
        body: '{\n  "data": {\n    "name": "John",\n    "age": 25\n  }\n}',
      },
      {
        title: "Update Document",
        method: "PUT",
        path: `${BASE_URL}/api/v1/db/collections?collectionName=users`,
        body: '{\n  "collectionId": "doc_id",\n  "updatedData": {\n    "age": 26\n  }\n}',
      },
      {
        title: "Delete Document",
        method: "DELETE",
        path: `${BASE_URL}/api/v1/db/collections?collectionName=users`,
        body: '{\n  "collectionId": "doc_id"\n}',
      },
    ],
  },
];

// --- Helper Components ---

// 1. Reusable Copy Button Logic
const CopyButton = ({ text, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`p-1.5 rounded transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
        copied 
          ? "bg-green-100 text-green-600" 
          : "text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
      } ${className}`}
      title="Copy to clipboard"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
    </button>
  );
};

const MethodBadge = ({ method }) => {
  const colors = {
    GET: "bg-blue-100 text-blue-700 border-blue-200",
    POST: "bg-green-100 text-green-700 border-green-200",
    PUT: "bg-orange-100 text-orange-700 border-orange-200",
    DELETE: "bg-red-100 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-1 rounded text-xs font-bold border flex-shrink-0 ${colors[method] || "bg-gray-100"}`}>
      {method}
    </span>
  );
};

const CodeBlock = ({ code }) => {
  return (
    <div className="relative group mt-2 mb-4">
      <pre className="bg-slate-900 text-slate-50 p-4 rounded-lg text-sm overflow-x-auto font-mono leading-relaxed border border-slate-700 shadow-sm pr-12">
        {code}
      </pre>
      {/* Absolute positioned Copy Button for Code Blocks */}
      <div className="absolute top-2 right-2">
        <CopyButton text={code} className="bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white" />
      </div>
    </div>
  );
};

// --- Main Component ---

export default function Docs() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-slate-800">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex justify-between items-center sticky top-0 z-20">
        <h1 className="text-xl font-bold text-indigo-600">GigaDB API</h1>
        <button onClick={toggleSidebar} className="p-2 rounded hover:bg-gray-100">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:h-screen md:sticky md:top-0 overflow-y-auto ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        <div className="p-6">
          <h1 className="text-2xl font-bold text-indigo-600 mb-8 hidden md:block">GigaDB API</h1>
          <nav className="space-y-1">
            {apiDocsData.map((section) => (
              <a
                key={section.id}
                href={`#${section.id}`}
                onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-slate-600 rounded-md hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                {section.icon}
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-12 max-w-5xl mx-auto w-full">
        <div className="space-y-16">
          
          {/* Header */}
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 mb-4">Documentation</h1>
            <p className="text-lg text-slate-600">
              Welcome to the GigaDB API reference. Learn how to authenticate and interact with our database collections.
            </p>
          </div>

          <hr className="border-gray-200" />

          {/* Dynamic Sections */}
          {apiDocsData.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  {section.icon}
                </div>
                <h2 className="text-2xl font-bold text-slate-900">{section.title}</h2>
              </div>
              
              {section.description && <p className="mb-6 text-slate-600 leading-relaxed">{section.description}</p>}

              {/* Static Content (Headers etc) */}
              {section.content?.map((item, idx) => (
                <div key={idx} className="mb-6">
                  {item.label && <span className="text-sm font-semibold text-slate-500 mb-1 block">{item.label}</span>}
                  <CodeBlock code={item.code} />
                </div>
              ))}

              {/* Endpoints List */}
              <div className="space-y-8">
                {section.endpoints?.map((ep, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <h3 className="text-lg font-semibold text-slate-800 w-48 flex-shrink-0">{ep.title}</h3>
                      
                      {/* URL Path Bar with Copy Button */}
                      <div className="flex items-center gap-2 font-mono text-sm bg-slate-50 px-3 py-2 rounded border border-slate-100 w-full overflow-hidden">
                        <MethodBadge method={ep.method} />
                        <span className="text-slate-600 truncate flex-1" title={ep.path}>{ep.path}</span>
                        <div className="flex-shrink-0 border-l border-slate-200 pl-2 ml-1">
                            <CopyButton text={ep.path} />
                        </div>
                      </div>
                    </div>

                    {ep.body && (
                      <div className="mt-4">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Request Body</p>
                        <CodeBlock code={ep.body} />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}

          <hr className="border-gray-200" />

          {/* Footer Notes */}
          <section className="bg-blue-50 border border-blue-100 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Important Notes</h2>
            <ul className="space-y-2">
              {[
                "API keys are shown only once on creation.",
                "Revoked keys lose access immediately.",
                "All data storage is append-only.",
                "Pagination starts from page 1."
              ].map((note, i) => (
                <li key={i} className="flex items-start gap-2 text-blue-700 text-sm">
                  <ChevronRight size={16} className="mt-0.5 flex-shrink-0" />
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </section>

        </div>
      </main>
    </div>
  );
}