import { ApiKeyProvider } from "../../context/ApiKeyContext";
import CreateKeyModal from "./CreateKeyModal";
import ApiKeyList from "./ApiKeyList";

// Yeh component andar ka content render karega
function ApiDashboardContent() {
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8">
      
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">API Management</h1>
          <p className="text-muted-foreground">
            Manage your API keys and access controls.
          </p>
        </div>
        
        {/* Create Button Component */}
        <CreateKeyModal />
      </div>

      {/* List Area */}
      <ApiKeyList />

    </div>
  );
}

// Main Export jo Provider ke sath wrap hai
export default function ApiPageWrapper() {
  return (
    <ApiKeyProvider>
      <ApiDashboardContent />
    </ApiKeyProvider>
  );
}