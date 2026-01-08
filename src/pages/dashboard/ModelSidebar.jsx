import { useRef } from "react";
import { Table, Database, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useDashboard } from "@/context/DashboardContext";
import { useVirtualizer } from "@tanstack/react-virtual"; // <--- TanStack Virtual

export default function ModelSidebar() {
  const { models, activeModel, setActiveModel, searchQuery, setSearchQuery } = useDashboard();
  
  // 1. Ref for the scrolling container
  const parentRef = useRef(null);

  // 2. Initialize Virtualizer
  const rowVirtualizer = useVirtualizer({
    count: models.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44, // Estimated height of each row (44px)
    overscan: 5, // Render 5 extra items off-screen for smoothness
  });

  return (
    <div className="hidden border-r bg-muted/10 md:block w-64 h-full flex flex-col">
      <div className="flex flex-col h-full py-4">
        
        {/* Header */}
        <div className="px-6 mb-4">
          <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
            <Database className="h-4 w-4 text-blue-600" />
            Cluster-01
          </h2>
          <p className="text-sm text-muted-foreground">Production Database</p>
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

        {/* --- TanStack Virtual List --- */}
        <div 
          ref={parentRef} 
          className="flex-1 overflow-y-auto px-2 contain-strict"
        >
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}
          >
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const model = models[virtualItem.index];
              const isActive = activeModel === model;

              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: `${virtualItem.size}px`,
                    transform: `translateY(${virtualItem.start}px)`,
                  }}
                  className="px-1"
                >
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start font-normal"
                    onClick={() => setActiveModel(model)}
                  >
                    <Table className="mr-2 h-4 w-4" />
                    {model}
                  </Button>
                </div>
              );
            })}
            
            {models.length === 0 && (
               <div className="absolute top-0 w-full text-center text-sm text-muted-foreground py-4">
                 No collections found
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}