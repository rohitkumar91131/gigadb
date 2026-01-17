import { useMemo, useState, useRef, useEffect } from "react"
import { 
  FilePlus2, ChevronLeft, ChevronRight, Plus, 
  Trash2, Code, ListPlus, Loader2, Database, ArrowRight,
  Copy, Pencil, Sprout 
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useDashboard } from "@/context/DashboardContext"
import { useVirtualizer } from "@tanstack/react-virtual" 
import { toast } from "sonner"

const JsonValue = ({ value }) => {
  if (value === null) return <span className="text-zinc-400 italic">null</span>
  if (typeof value === "boolean") return <span className="text-yellow-600 font-bold">{value.toString()}</span>
  if (typeof value === "number") return <span className="text-blue-600">{value}</span>
  if (typeof value === "string") return <span className="text-green-600">"{value}"</span>
  if (Array.isArray(value)) return <span className="text-zinc-600">[ Array({value.length}) ]</span>
  if (typeof value === "object") return <span className="text-zinc-600">{`{ Object }`}</span>
  return <span>{String(value)}</span>
}

const DocumentCard = ({ data, index, onDelete }) => {
  let doc = data
  try {
    if (typeof data === "string") doc = JSON.parse(data)
  } catch (e) {
    // ignore
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(doc, null, 2))
    toast("Document copied!")
  }

  return (
    <div className="group relative border rounded-md bg-white hover:border-blue-400 transition-all shadow-sm mb-3">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-zinc-50/50 rounded-t-md">
        <div className="text-xs font-mono text-zinc-500">
          Document #{index + 1}
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button variant="ghost" size="icon" className="h-6 w-6" onClick={copyToClipboard} title="Copy JSON">
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="icon" className="h-6 w-6" title="Edit">
            <Pencil className="h-3 w-3" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6 text-red-500 hover:text-red-600" 
            title="Delete"
            onClick={onDelete}
          >
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="p-3 font-mono text-sm overflow-x-auto">
        {Object.entries(doc).map(([key, value]) => (
          <div key={key} className="flex items-start hover:bg-zinc-50 py-0.5 px-1 rounded">
            <span className="text-zinc-800 font-semibold min-w-[120px] max-w-[200px] truncate mr-2 select-none">
              {key}:
            </span>
            <span className="break-all whitespace-pre-wrap">
              <JsonValue value={value} />
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function CollectionContent() {
  const { 
    activeCollection, 
    pageData, 
    collections, 
    setActiveCollection, 
    fetchDbPage,
    addRecord,
    createCollection,
    seedCollection,
    deleteRecord, 
    pageSize,
    setPageSize,
    loadingDocs,       
    loadingCollections,
    // --- NEW: Using Context State for Page ---
    currentPage,
    setCurrentPage
  } = useDashboard()
  
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [jsonInput, setJsonInput] = useState("{\n  \n}")
  const [kvFields, setKvFields] = useState([{ key: "", value: "" }])
  const [activeTab, setActiveTab] = useState("builder") 
  
  // REMOVED: const [currentPage, setCurrentPage] = useState(1) // Now coming from Context

  const [newCollectionName, setNewCollectionName] = useState("")
  const [isCreatingCol, setIsCreatingCol] = useState(false)

  const [isSeedDialogOpen, setIsSeedDialogOpen] = useState(false)
  const [seedCount, setSeedCount] = useState(10)
  const [isSeeding, setIsSeeding] = useState(false)

  const parentRef = useRef(null)

  const rowVirtualizer = useVirtualizer({
    count: pageData.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 150,
    overscan: 5,
  })

  useEffect(() => {
    if (parentRef.current) {
      parentRef.current.scrollTo(0, 0)
    }
  }, [pageData])

  const handlePageChange = (newPage) => {
    if (newPage < 1) return
    // Setting state happens inside fetchDbPage now, but we can call it here or inside
    // fetchDbPage calls setCurrentPage internally in the updated Provider
    fetchDbPage(newPage) 
  }

  const addField = () => setKvFields([...kvFields, { key: "", value: "" }])
  const removeField = (index) => {
    const newFields = [...kvFields]; newFields.splice(index, 1); setKvFields(newFields)
  }
  const updateField = (index, field, val) => {
    const newFields = [...kvFields]; newFields[index][field] = val; setKvFields(newFields)
  }

  const handleAddRecord = async () => {
    if (!activeCollection) return
    setIsSubmitting(true)
    let payloadData = {}
    try {
      if (activeTab === "json") {
        try { payloadData = JSON.parse(jsonInput) } catch (e) { alert("Invalid JSON"); setIsSubmitting(false); return }
      } else {
        payloadData = kvFields.reduce((acc, curr) => {
          if (curr.key.trim()) acc[curr.key] = curr.value
          return acc
        }, {})
      }
      const result = await addRecord(payloadData)
      if (result.success) {
        setIsDialogOpen(false); setJsonInput("{\n  \n}"); setKvFields([{ key: "", value: "" }])
      } else { alert("Error: " + result.msg) }
    } catch (e) { alert("Error") } 
    finally { setIsSubmitting(false) }
  }

  const handleInlineCreate = async () => {
    if (!newCollectionName.trim()) return
    setIsCreatingCol(true)
    try {
      const result = await createCollection(newCollectionName)
      if (result.success) {
        setNewCollectionName("")
        toast.success("Collection created successfully")
      } else {
        toast.error(result.msg || "Failed to create")
      }
    } catch (e) {
      toast.error("An unexpected error occurred")
    } finally {
      setIsCreatingCol(false)
    }
  }

  const handleSeed = async () => {
    if(!seedCount || seedCount < 1) return
    setIsSeeding(true)
    try {
      await seedCollection(seedCount)
      setIsSeedDialogOpen(false)
    } catch(e) {
      console.error(e)
    } finally {
      setIsSeeding(false)
    }
  }

  const handleDeleteRecord = async (rawDoc) => {
    let doc = rawDoc;
    if (typeof rawDoc === "string") {
      try {
        doc = JSON.parse(rawDoc);
      } catch (e) {
        toast.error("Error: Could not parse document data.");
        return;
      }
    }

    const docId = doc._id || doc.id;
    
    if (!docId) {
      console.error("Failed to find ID in document:", doc);
      toast.error("Cannot delete: Document has no '_id' or 'id' field.");
      return;
    }

    if (window.confirm("Are you sure you want to delete this document? This cannot be undone.")) {
      await deleteRecord(docId);
    }
  }

  if (!activeCollection) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8 bg-muted/20 h-full overflow-y-auto">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Select a collection to view or manage its records.</p>
        </div>

        <div className="md:hidden w-full p-4 border rounded-xl bg-white shadow-sm space-y-3">
          <h3 className="font-semibold text-sm flex items-center gap-2">
             <Plus className="h-4 w-4 text-blue-600" /> Create New Collection
          </h3>
          <div className="flex w-full items-center gap-2">
            <Input 
              placeholder="e.g. users, products" 
              value={newCollectionName}
              onChange={(e) => setNewCollectionName(e.target.value)}
              className="bg-zinc-50"
              onKeyDown={(e) => e.key === 'Enter' && handleInlineCreate()}
            />
            <Button onClick={handleInlineCreate} disabled={isCreatingCol} size="sm">
              {isCreatingCol ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loadingCollections ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm h-[180px]">
                <div className="space-y-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24 mt-4" />
              </div>
            ))
          ) : (
            <>
              {collections.map((col) => (
                <div 
                  key={col.id} 
                  onClick={() => setActiveCollection(col)}
                  className="group relative flex flex-col justify-between rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-blue-500/50 cursor-pointer"
                >
                  <div className="space-y-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Database className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold leading-none tracking-tight">{col.name}</h3>
                    <p className="text-sm text-muted-foreground">ID: {col.id}</p>
                  </div>
                  <div className="mt-4 flex items-center text-sm font-medium text-blue-600 opacity-0 transition-opacity group-hover:opacity-100">
                    View Records <ArrowRight className="ml-1 h-4 w-4" />
                  </div>
                </div>
              ))}
              
              {collections.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center text-muted-foreground border-2 border-dashed rounded-xl bg-zinc-50/50">
                  <Database className="h-10 w-10 mb-4 opacity-50" />
                  <p>No collections found.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-muted/20 h-full overflow-hidden">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
             <Button variant="ghost" size="sm" className="h-6 px-2 -ml-2 text-muted-foreground hover:text-foreground" onClick={() => setActiveCollection(null)}>
               <ChevronLeft className="h-4 w-4 mr-1" /> Back
             </Button>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">{activeCollection?.name}</h1>
          <p className="text-sm text-muted-foreground">Showing documents {((currentPage - 1) * pageSize) + 1} - {((currentPage - 1) * pageSize) + (pageData?.length || 0)}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Switcher */}
          <div className="md:hidden w-40">
            <Select value={activeCollection?.id || ""} onValueChange={id => { const c = collections.find(x => x.id === id); if(c) setActiveCollection(c) }}>
              <SelectTrigger className="w-full bg-background"><SelectValue placeholder="Collection" /></SelectTrigger>
              <SelectContent>{collections.map(col => (<SelectItem key={col.id} value={col.id}>{col.name}</SelectItem>))}</SelectContent>
            </Select>
          </div>
          
          <Dialog open={isSeedDialogOpen} onOpenChange={setIsSeedDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="hidden sm:flex border-blue-200 text-blue-700 hover:bg-blue-50">
                <Sprout className="mr-2 h-4 w-4" /> Seed
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle>Seed Collection</DialogTitle>
                <DialogDescription>
                  Generate random mock data for <strong>{activeCollection?.name}</strong>.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="flex items-center gap-4">
                   <label className="text-sm font-medium whitespace-nowrap">Count:</label>
                   <Input 
                      type="number" 
                      min="1" 
                      max="1000"
                      value={seedCount} 
                      onChange={(e) => setSeedCount(Number(e.target.value))} 
                   />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsSeedDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleSeed} disabled={isSeeding}>
                  {isSeeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Generate Data"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild><Button className="bg-blue-600 hover:bg-blue-700"><FilePlus2 className="mr-2 h-4 w-4" /> Insert Document</Button></DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader><DialogTitle>Insert Document</DialogTitle><DialogDescription>Add to <strong>{activeCollection?.name}</strong>.</DialogDescription></DialogHeader>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="builder"><ListPlus className="w-4 h-4 mr-2" /> Builder</TabsTrigger>
                  <TabsTrigger value="json"><Code className="w-4 h-4 mr-2" /> JSON</TabsTrigger>
                </TabsList>
                <TabsContent value="builder" className="space-y-4 py-4 max-h-[60vh] overflow-y-auto pr-1">
                  {kvFields.map((field, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <div className="grid gap-1.5 flex-1"><Input placeholder="Key" value={field.key} onChange={(e) => updateField(index, "key", e.target.value)} /></div>
                      <div className="grid gap-1.5 flex-[2]"><Input placeholder="Value" value={field.value} onChange={(e) => updateField(index, "value", e.target.value)} /></div>
                      <Button variant="ghost" size="icon" className="text-red-500" onClick={() => removeField(index)} disabled={kvFields.length === 1}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addField} className="w-full border-dashed"><Plus className="mr-2 h-4 w-4" /> Add Field</Button>
                </TabsContent>
                <TabsContent value="json" className="py-4"><Textarea className="font-mono text-sm min-h-[200px]" value={jsonInput} onChange={(e) => setJsonInput(e.target.value)} /></TabsContent>
              </Tabs>
              <DialogFooter><Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button><Button onClick={handleAddRecord} disabled={isSubmitting}>{isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Insert"}</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 rounded-md border bg-zinc-50/50 shadow-inner overflow-hidden flex flex-col">
        <div ref={parentRef} className="flex-1 overflow-y-auto p-4 space-y-3">
          {loadingDocs ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="border rounded-md bg-white p-0 shadow-sm overflow-hidden mb-3">
                <div className="px-4 py-2 border-b bg-zinc-50/50 flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-6 w-16 rounded-md" />
                </div>
                <div className="p-3 space-y-2">
                   <div className="flex gap-2">
                     <Skeleton className="h-4 w-32" />
                     <Skeleton className="h-4 w-48" />
                   </div>
                   <div className="flex gap-2">
                     <Skeleton className="h-4 w-20" />
                     <Skeleton className="h-4 w-32" />
                   </div>
                </div>
              </div>
            ))
          ) : pageData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <p>No documents found on this page.</p>
            </div>
          ) : (
            <div
              style={{
                height: `${rowVirtualizer.getTotalSize()}px`,
                width: '100%',
                position: 'relative',
              }}
            >
              {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const doc = pageData[virtualRow.index]
                return (
                  <div
                    key={virtualRow.key}
                    data-index={virtualRow.index}
                    ref={rowVirtualizer.measureElement}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      transform: `translateY(${virtualRow.start}px)`,
                      paddingBottom: '12px'
                    }}
                  >
                    <DocumentCard 
                      data={doc} 
                      index={((currentPage - 1) * pageSize) + virtualRow.index} 
                      onDelete={() => handleDeleteRecord(doc)}
                    />
                  </div>
                )
              })}
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between px-4 py-3 border-t bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.03)] z-10">
          <div className="flex items-center gap-4 flex-1">
            <div className="flex items-center gap-2">
               <span className="text-xs text-muted-foreground uppercase font-bold">Limit</span>
               <Select 
                 value={`${pageSize}`} 
                 onValueChange={(val) => {
                   const newSize = Number(val)
                   setPageSize(newSize)
                   // We don't need to manually set currentPage to 1 here because
                   // fetchDbPage(1) will do it.
                   fetchDbPage(1, newSize)
                 }}
               >
                 <SelectTrigger className="h-8 w-[70px] bg-zinc-50 border-zinc-200">
                   <SelectValue placeholder={pageSize} />
                 </SelectTrigger>
                 <SelectContent side="top">
                   {[10, 20, 50, 100].map((size) => (
                     <SelectItem key={size} value={`${size}`}>{size}</SelectItem>
                   ))}
                 </SelectContent>
               </Select>
            </div>
            <span className="text-sm text-zinc-600 hidden md:inline">
               Page <strong>{currentPage}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              disabled={currentPage === 1 || loadingDocs}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              disabled={loadingDocs}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}