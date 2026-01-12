import { createContext, useContext, useState, useMemo, useCallback, useEffect } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [activeModel, setActiveModel] = useState("Users");
  const [searchQuery, setSearchQuery] = useState("");
  const [pageData, setPageData] = useState([]);

  const allModels = ["Users", "Products", "Orders", "Transactions", "AuditLogs", "Settings", "Invoices"];

  const filteredModels = allModels.filter((model) =>
    model.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const fetchDbPage = useCallback(async (pageNumber = 1, pageSize = 10) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/db?pageNumber=${pageNumber}&pageSize=${pageSize}`
      );
      const data = await res.json();

      if (!data.success) {
        alert(data.msg || "Failed to fetch data");
        return;
      }

      setPageData(data.users);
      return data;
    } catch (err) {
      return { success: false, msg: err.message };
    }
  }, []);

  useEffect(() => {
    fetchDbPage(1, 10);
  }, [fetchDbPage]);

  const value = {
    models: filteredModels,
    activeModel,
    setActiveModel,
    searchQuery,
    setSearchQuery,
    pageData,
    fetchDbPage,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  return useContext(DashboardContext);
}
