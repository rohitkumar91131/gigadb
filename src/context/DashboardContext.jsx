import { createContext, useContext, useState, useMemo } from "react";

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [activeModel, setActiveModel] = useState("Users");
  const [searchQuery, setSearchQuery] = useState("");

  const allModels = ["Users", "Products", "Orders", "Transactions", "AuditLogs", "Settings", "Invoices"];

  // Filter Models based on Search Query
  const filteredModels = allModels.filter((model) => 
    model.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // --- GENERATE 100 ROWS OF DUMMY DATA ---
  const tableData = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => {
      const id = i + 1;
      
      if (activeModel === "Users") {
        const roles = ["Admin", "Editor", "Viewer", "Moderator"];
        const statuses = ["Active", "Offline", "Banned", "Pending"];
        return {
          id: id,
          col1: `User ${id} - Rohit ${String.fromCharCode(65 + (i % 26))}`, // Example: Rohit A, Rohit B
          col2: roles[i % roles.length],
          status: statuses[i % statuses.length],
        };
      }
      
      if (activeModel === "Products") {
        const categories = ["Electronics", "Furniture", "Clothing", "Accessories"];
        const statuses = ["In Stock", "Low Stock", "Out of Stock"];
        return {
          id: id + 1000,
          col1: `Product Item ${id}`,
          col2: `$${(Math.random() * 100).toFixed(2)} - ${categories[i % categories.length]}`,
          status: statuses[i % statuses.length],
        };
      }

      // Default for other models
      return {
        id: id,
        col1: `${activeModel} Item ${id}`,
        col2: "Description here",
        status: "Active"
      };
    });
  }, [activeModel]);

  const value = {
    models: filteredModels,
    activeModel,
    setActiveModel,
    searchQuery,
    setSearchQuery,
    tableData, // Now returns 100 rows
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