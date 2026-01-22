import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

const ApiKeyContext = createContext();

export const ApiKeyProvider = ({ children }) => {
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_BACKEND_URL;

  const formatKey = (k) => ({
    id: k.id,
    name: k.name,
    prefix: k.prefix || k.apiKey?.slice(0, 8) + "...",
    status: k.status || "active",
    createdAt: new Date(k.createdAt).toLocaleDateString("en-IN"),
  });

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/apikey`, { credentials: "include" });
      const data = await res.json();

      if (data.success) {
        setApiKeys(data.data.map(formatKey));
      } else {
        toast.error(data.msg);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load keys");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const createApiKey = async (name) => {
    try {
      const res = await fetch(`${API_URL}/apikey`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name }),
      });
      
      const data = await res.json();

      if (!data.success) throw new Error(data.msg);

      setApiKeys((prev) => [formatKey(data.data), ...prev]);
      toast.success(data.msg || "API Key Created!");

      return data.data.apiKey;

    } catch (error) {
      toast.error(error.message || "Failed to create key");
      throw error;
    }
  };

  const deleteApiKey = async (id) => {
    try {
      setApiKeys((prev) => prev.filter((k) => k.id !== id));

      const res = await fetch(`${API_URL}/apikey/revoke`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ apiKeyId: id }),
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.msg);
      }
      
      toast.success("API Key revoked");

    } catch (error) {
      toast.error(error.message || "Failed to delete");
      fetchApiKeys();
    }
  };

  return (
    <ApiKeyContext.Provider value={{ apiKeys, createApiKey, deleteApiKey, loading }}>
      {children}
    </ApiKeyContext.Provider>
  );
};

export const useApiKeys = () => useContext(ApiKeyContext);