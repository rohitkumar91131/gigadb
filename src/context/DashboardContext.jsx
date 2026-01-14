import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const DashboardContext = createContext()

export function DashboardProvider({ children }) {
  const navigate = useNavigate()
  
  const [activeCollection, setActiveCollection] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [pageData, setPageData] = useState([])
  const [collections, setCollections] = useState([])
  const [user, setUser] = useState(null)
  
  const [loadingCollections, setLoadingCollections] = useState(true)
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  const [pageSize, setPageSize] = useState(10)

  const fetchCollections = useCallback(async () => {
    try {
      setLoadingCollections(true)
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sys/collections`, {
        credentials: "include"
      })
      const data = await res.json()
      if (data.success) {
        setCollections(data.collections)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoadingCollections(false)
    }
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      setIsAuthLoading(true)
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sys/auth/me`, {
        credentials: "include"
      })
      
      const data = await res.json()

      if (data.success) {
        setUser(data.user)
        fetchCollections()
      } else {
        navigate("/auth/login")
      }
    } catch (e) {
      toast.error("Please login to continue")
      console.error("Auth verification failed:", e)
      navigate("/auth/login")
    } finally {
      setIsAuthLoading(false)
    }
  }, [navigate, fetchCollections]) 

  const fetchDbPage = useCallback(async (page = 1, limitOverride = null) => {
    if (!activeCollection) return 

    const limit = limitOverride || pageSize
    
    try {
      setLoadingDocs(true)
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/db/${activeCollection.name}?pageNumber=${page}&pageSize=${limit}`,
        { credentials: "include" }
      )
      const data = await res.json()
      if (data.success) {
        setPageData(data.docs || data.users || []) 
      }
    } catch (e) {
      console.error(e)
      toast.error("Failed to fetch documents")
    } finally {
      setLoadingDocs(false)
    }
  }, [activeCollection, pageSize])

  // 4. Create New Collection
  const createCollection = useCallback(async (name) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/sys/collections/create`, {
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

  const addRecord = useCallback(async (payloadData) => {
    if (!activeCollection) return { success: false, msg: "No active collection" }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/db/${activeCollection.name}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: payloadData,
        }),
        credentials: "include",
      })

      if (response.ok) {
        await fetchDbPage(1) 
        toast.success("Document added successfully")
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
    checkAuth()
  }, [checkAuth])

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
      setPageSize,
      user,           
      isAuthLoading   
    }}>
      {!isAuthLoading && children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  return useContext(DashboardContext)
}