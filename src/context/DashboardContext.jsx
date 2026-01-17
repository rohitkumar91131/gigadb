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

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [loadingCollections, setLoadingCollections] = useState(true)
  const [loadingDocs, setLoadingDocs] = useState(false)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    if (activeCollection) {
      setCurrentPage(1)
      setPageData([])
    }
  }, [activeCollection])

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
    } catch {
      navigate("/auth/login")
    } finally {
      setIsAuthLoading(false)
    }
  }, [navigate, fetchCollections])

  const fetchDbPage = useCallback(async (page = currentPage) => {
    if (!activeCollection) return []

    try {
      setLoadingDocs(true)
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/db/collections?collectionName=${activeCollection.name}&pageNumber=${page}&pageLimit=${pageSize}`,
        { credentials: "include" }
      )
      const data = await res.json()

      if (data.success) {
        setCurrentPage(page)
        setPageData(data.data || [])
        return data.data || []
      }
      return []
    } catch {
      toast.error("Fetch failed")
      return []
    } finally {
      setLoadingDocs(false)
    }
  }, [activeCollection, pageSize, currentPage])

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
        fetchCollections()
        return { success: true }
      }
      return { success: false, msg: data.msg }
    } catch {
      return { success: false }
    }
  }, [fetchCollections])

  const addRecord = useCallback(async (payloadData) => {
    if (!activeCollection) return { success: false }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/db/collections/insert?collectionName=${activeCollection.name}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ data: payloadData })
        }
      )
      const data = await res.json()
      if (!data.success) return { success: false }

      await fetchDbPage(1)
      toast.success("Inserted")
      return { success: true }
    } catch {
      return { success: false }
    }
  }, [activeCollection, fetchDbPage])

  const seedCollection = useCallback(async (count) => {
    if (!activeCollection) return { success: false }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/db/collections/seed?collectionName=${activeCollection.name}&count=${count}`,
        { method: "POST", credentials: "include" }
      )
      const data = await res.json()
      if (!data.success) return { success: false }

      await fetchDbPage(1)
      toast.success("Seeded")
      return { success: true }
    } catch {
      return { success: false }
    }
  }, [activeCollection, fetchDbPage])

  const deleteRecord = useCallback(async (collectionId) => {
    if (!activeCollection) return { success: false }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/db/collections?collectionName=${activeCollection.name}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ collectionId })
        }
      )
      const data = await res.json()
      if (!data.success) return { success: false }

      const list = await fetchDbPage(currentPage)

      if (list.length === 0 && currentPage > 1) {
        await fetchDbPage(currentPage - 1)
      }

      toast.success("Deleted")
      return { success: true }
    } catch {
      toast.error("Delete failed")
      return { success: false }
    }
  }, [activeCollection, currentPage, fetchDbPage])

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

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
      deleteRecord,
      seedCollection,
      loadingCollections,
      loadingDocs,
      pageSize,
      setPageSize,
      user,
      isAuthLoading,
      currentPage,
      setCurrentPage
    }}>
      {!isAuthLoading && children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  return useContext(DashboardContext)
}
