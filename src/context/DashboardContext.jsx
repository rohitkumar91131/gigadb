import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"

const DashboardContext = createContext()

export function DashboardProvider({ children }) {
  const [activeCollection, setActiveCollection] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [pageData, setPageData] = useState([])
  const [collections, setCollections] = useState([])
  
  // Loading States
  const [loadingCollections, setLoadingCollections] = useState(true)
  const [loadingDocs, setLoadingDocs] = useState(false)

  // Pagination Config
  const [pageSize, setPageSize] = useState(10)

  // 1. Fetch All Collections
  const fetchCollections = useCallback(async () => {
    try {
      setLoadingCollections(true)
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/db/collections`, {
        credentials: "include"
      })
      const data = await res.json()
      if (data.success) {
        setCollections(data.collections)
        // Note: We do NOT auto-select a collection so the Grid View shows first
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingCollections(false)
    }
  }, [])

  // 2. Fetch Documents (Page Data)
  const fetchDbPage = useCallback(async (page = 1, limitOverride = null) => {
    if (!activeCollection) return 

    const limit = limitOverride || pageSize
    
    try {
      setLoadingDocs(true)
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/db?pageNumber=${page}&pageSize=${limit}`,
        { credentials: "include" }
      )
      const data = await res.json()
      if (data.success) {
        setPageData(data.users)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingDocs(false)
    }
  }, [activeCollection, pageSize])

  // 3. Create New Collection
  const createCollection = useCallback(async (name) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/db/collections`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name })
      })

      const data = await res.json()
      if (data.success) {
        await fetchCollections() 
        return { success: true }
      } else {
        return { success: false, msg: data.msg }
      }
    } catch (e) {
      console.error(e)
      return { success: false, msg: "Network error" }
    }
  }, [fetchCollections])

  // 4. Add Record to Collection
  const addRecord = useCallback(async (payloadData) => {
    if (!activeCollection) return { success: false, msg: "No active collection" }
    console.log(`${import.meta.env.VITE_BACKEND_URL}/db/collections/users`)

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/db/collections/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collectionName: activeCollection.name,
          data: payloadData,
        }),
        credentials: "include",
      })

      if (response.ok) {
        await fetchDbPage(1) // Refresh to first page
        return { success: true }
      } else {
        const err = await response.json()
        return { success: false, msg: err.message || "Unknown error" }
      }
    } catch (error) {
      console.error("Submission error", error)
      return { success: false, msg: "Something went wrong." }
    }
  }, [activeCollection, fetchDbPage])

  // Initial Load
  useEffect(() => {
    fetchCollections()
  }, [])

  // Search Filter Logic
  const filteredCollections = useMemo(() => {
    return collections.filter(c =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [collections, searchQuery])

  return (
    <DashboardContext.Provider value={{
      collections: filteredCollections,
      activeCollection,
      setActiveCollection,
      searchQuery,
      setSearchQuery,
      pageData,
      fetchDbPage,
      fetchCollections,
      createCollection,
      addRecord,
      loadingCollections,
      loadingDocs,
      pageSize,
      setPageSize
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  return useContext(DashboardContext)
}