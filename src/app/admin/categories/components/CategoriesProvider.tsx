    "use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchCategories, fetchSubCategories } from "@/lib/api";
import { toast } from "react-toastify";

type CategoriesContextType = {
  categories: any[];
  subCategories: any[];
  isLoading: boolean;
  refresh: () => Promise<void>;
};

const CategoriesContext = createContext<CategoriesContextType | undefined>(undefined);

export function CategoriesProvider({ children, token }: { children: ReactNode; token: string | null }) {
  const [categories, setCategories] = useState<any[]>([]);
  const [subCategories, setSubCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [cats, subs] = await Promise.all([
        fetchCategories(),
        fetchSubCategories(),
      ]);
      setCategories(cats);
      setSubCategories(subs);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <CategoriesContext.Provider value={{ categories, subCategories, isLoading, refresh: loadData }}>
      {children}
    </CategoriesContext.Provider>
  );
}

export const useCategories = () => {
  const context = useContext(CategoriesContext);
  if (!context) throw new Error("useCategories must be used within CategoriesProvider");
  return context;
};