import { Trash2, Key, Calendar, ShieldCheck, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useApiKeys } from "../../context/ApiKeyContext";

export default function ApiKeyList() {
  const { apiKeys, deleteApiKey, loading } = useApiKeys();

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Optional: Add toast notification here
  };

  if (loading) {
    return <div className="p-8 text-center text-muted-foreground animate-pulse">Loading API Keys...</div>;
  }

  if (apiKeys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 border border-dashed rounded-lg bg-gray-50/50">
        <div className="bg-blue-100 p-3 rounded-full mb-3">
          <Key className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="text-lg font-semibold">No API Keys Found</h3>
        <p className="text-sm text-muted-foreground text-center max-w-xs mt-1">
          You haven't created any API keys yet. Create one to start building.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* --- DESKTOP VIEW (Table) --- */}
      <div className="hidden md:block border rounded-lg bg-white shadow-sm overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[300px]">Project Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((key) => (
              <TableRow key={key.id} className="hover:bg-gray-50/50 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    {key.name}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={key.status} />
                </TableCell>
                <TableCell className="text-muted-foreground text-sm">
                  {key.createdAt}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-red-600 hover:bg-red-50"
                    onClick={() => {
                      if (confirm(`Are you sure you want to revoke "${key.name}"?`))
                        deleteApiKey(key.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* --- MOBILE VIEW (Cards) --- */}
      <div className="md:hidden grid gap-4">
        {apiKeys.map((key) => (
          <div key={key.id} className="bg-white border rounded-xl p-4 shadow-sm space-y-3">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-md">
                  <Key className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{key.name}</h4>
                </div>
              </div>
              <StatusBadge status={key.status} />
            </div>

            <div className="flex items-center justify-between pt-2 border-t mt-2">
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                {key.createdAt}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 px-2 text-red-500 hover:text-red-600 hover:bg-red-50"
                onClick={() => {
                  if (confirm("Revoke this key?")) deleteApiKey(key.id);
                }}
              >
                <Trash2 className="h-4 w-4 mr-1" /> Revoke
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Small helper component for consistent badges
function StatusBadge({ status }) {
  const styles =
    status === "active"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";

  return (
    <span
      className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${styles}`}
    >
      {status}
    </span>
  );
}