"use client"

import { useState, useEffect } from "react"
import { CategoriesAPI } from "@/lib/api/categories"
import type { Category } from "@/lib/supabase"

export function useCategories(params: { active?: boolean; withStats?: boolean } = {}) {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await CategoriesAPI.getCategories(params)
      setCategories(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch categories")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [params.active, params.withStats])

  const refetch = () => {
    fetchCategories()
  }

  return {
    categories,
    loading,
    error,
    refetch,
  }
}

export function useCategory(slug: string) {
  const [category, setCategory] = useState<Category | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true)
        setError(null)
        const result = await CategoriesAPI.getCategory(slug)
        setCategory(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch category")
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchCategory()
    }
  }, [slug])

  return {
    category,
    loading,
    error,
  }
}
