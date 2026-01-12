import { createContext, useContext, useState, useCallback, useEffect, useMemo } from "react"

const DashboardContext = createContext()

export function DashboardProvider({ children }) {
  const [activeModel, setActiveModel] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [pageData, setPageData] = useState([])
  const [allModels, setAllModels] = useState([])

  const fetchModels = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/db/collections`, {
        credentials: "include"
      })
      const data = await res.json()
      if (data.success) {
        setAllModels(data.collections)
        if (!activeModel && data.collections.length > 0) {
          setActiveModel(data.collections[0])
        }
      }
    } catch (e) {
      console.error(e)
    }
  }, [activeModel])

  const fetchDbPage = useCallback(async (collectionName, page = 1, limit = 10) => {
    //alert(import.meta.env.VITE_BACKEND_URL)
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/db?pageNumber=${1}&pageSize=${limit}`,

        { credentials: "include" }
      )
      const data = await res.json()
      if (data.success) {
        setPageData(data.users)
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    fetchModels()
  }, [])

  const filteredModels = useMemo(() => {
    return allModels.filter(m =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [allModels, searchQuery])

  return (
    <DashboardContext.Provider value={{
      models: filteredModels,
      activeModel,
      setActiveModel,
      searchQuery,
      setSearchQuery,
      pageData,
      fetchDbPage,
      fetchModels
    }}>
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  return useContext(DashboardContext)
}
