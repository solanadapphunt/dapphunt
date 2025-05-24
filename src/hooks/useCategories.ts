import { useState, useEffect, useCallback } from 'react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  _count: {
    projects: number;
  };
}

interface CategoriesResponse {
  categories: Category[];
  total: number;
}

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data: CategoriesResponse = await response.json();
      setCategories(data.categories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching categories:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: () => {
      setError(null);
      fetchCategories();
    }
  };
}; 