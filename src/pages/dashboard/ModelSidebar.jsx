import { useEffect, useRef, useState } from "react";
import { Table, Database, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDashboard } from "@/context/DashboardContext";
import { useVirtualizer } from "@tanstack/react-virtual";

export default function ModelSidebar() {
  const { models, activeModel, setActiveModel, searchQuery, setSearchQuery, fetchDbPage } = useDashboard();
  const [showModal, setShowModal] = useState(false);
  const [modelName, setModelName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDbPage();
  }, []);

  const parentRef = useRef(null);

  const rowVirtualizer = useVirtualizer({
    count: models.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 5,
  });

  async function submitModel() {
    if (!modelName.trim()) {
      alert("Collection name required");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/userid/models`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: modelName }),
      });

      const data = await res.json();

      if (!data.success) {
        alert(data.msg || "Failed to create");
        return;
      }

      setModelName("");
      setShowModal(false);
      fetchDbPage();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hidden border-r bg-muted/10 md:block w-64 h-full flex flex-col">
      <div className="flex flex-col h-full py-4">
        
        {/* Header */}
        <div className="px-6 mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <Database className="h-4 w-4 text-blue-600" />
              Cluster-01
            </h2>
            <p className="text-sm text-muted-foreground">Production Database</p>
          </div>

          <Button size="icon" variant="ghost" onClick={() => setShowModal(true)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Search */}
        <div className="px-4 mb-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Find collection..."
              className="pl-8 h-9 bg-background"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Separator className="my-2" />

        {/* Virtualized List */}
        <div ref={parentRef} className="flex-1 overflow-y-auto px-2">
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const model = models[virtualItem.index];
              const isActive = activeModel === model;

              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveModel(model)}
                  >
                    <Table className="mr-2 h-4 w-4" />
                    {model}
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full-screen Add Collection Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              className="absolute right-4 top-4 text-muted-foreground hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold mb-2">Create Collection</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Enter a name for your new database collection.
            </p>

            <Input
              placeholder="Collection name (e.g. users, orders)"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
            />

            <Button
              className="w-full mt-4"
              onClick={submitModel}
              disabled={loading}
            >
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
