import { useEffect, useRef, useState } from "react"
import { Table, Database, Plus, Search, X, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton" 
import { useDashboard } from "@/context/DashboardContext"
import { useVirtualizer } from "@tanstack/react-virtual"

export default function CollectionSidebar() {
  const { 
    collections, 
    activeCollection, 
    setActiveCollection, 
    searchQuery, 
    setSearchQuery, 
    fetchDbPage,
    createCollection,
    loadingCollections
  } = useDashboard()

  const [showModal, setShowModal] = useState(false)
  const [collectionName, setCollectionName] = useState("")
  const [creating, setCreating] = useState(false)

  // Fetch page data whenever active collection changes
  useEffect(() => {
    if (activeCollection) {
      fetchDbPage(1)
    }
  }, [activeCollection])

  const parentRef = useRef(null)

  const rowVirtualizer = useVirtualizer({
    count: collections.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 5,
  })

  // Form Submit Handler
  async function handleSubmit(e) {
    if (e) e.preventDefault() // Prevent form reload
    
    if (!collectionName.trim()) return alert("Collection name required")

    try {
      setCreating(true)
      const result = await createCollection(collectionName)

      if (result.success) {
        setCollectionName("")
        setShowModal(false)
      } else {
        alert(result.msg || "Failed to create collection")
      }
    } finally {
      setCreating(false)
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
              Cluster
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
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Separator className="my-2" />

        {/* List Area */}
        <div ref={parentRef} className="flex-1 overflow-y-auto px-2">
          {loadingCollections ? (
            // --- SKELETON LOADING ---
            <div className="space-y-2 pt-2 px-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 px-2 py-2">
                  <Skeleton className="h-4 w-4 rounded-sm" />
                  <Skeleton className="h-4 w-full rounded-md" />
                </div>
              ))}
            </div>
          ) : (
            // --- VIRTUALIZED LIST ---
            <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: "relative" }}>
              {rowVirtualizer.getVirtualItems().map(v => {
                const collection = collections[v.index]
                if (!collection) return null

                const isActive = activeCollection?.id === collection.id

                return (
                  <div
                    key={collection.id}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: `${v.size}px`,
                      transform: `translateY(${v.start}px)`
                    }}
                  >
                    <Button
                      variant={isActive ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveCollection(collection)}
                    >
                      <Table className="mr-2 h-4 w-4" />
                      {collection.name}
                    </Button>
                  </div>
                )
              })}
              
              {!loadingCollections && collections.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  No collections found.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative">
            <button
              className="absolute right-4 top-4 text-muted-foreground hover:text-black"
              onClick={() => setShowModal(false)}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold mb-4">Create Collection</h2>

            {/* Wrapped in Form for Enter Key Support */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Collection name (e.g. users)"
                value={collectionName}
                onChange={e => setCollectionName(e.target.value)}
                autoFocus
                disabled={creating}
              />

              <Button type="submit" className="w-full" disabled={creating}>
                {creating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating...
                  </>
                ) : (
                  "Create Collection"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}