"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Filter, X, Clock, TrendingUp, History, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/hooks/useAuth"
import { SearchAPI } from "@/lib/api/search"
import { UserBehaviorsAPI } from "@/lib/api/user-behaviors"

interface EnhancedSearchBarProps {
  onSearch: (query: string, filters?: SearchFilters) => void
  placeholder?: string
  showFilters?: boolean
  autoFocus?: boolean
  className?: string
}

interface SearchFilters {
  category_id?: string
  tags?: string[]
  pricing_type?: string
  platforms?: string[]
  min_rating?: number
  sort_by?: 'relevance' | 'rating' | 'popularity' | 'newest' | 'name'
}

export function EnhancedSearchBar({ 
  onSearch, 
  placeholder = "搜索AI工具...", 
  showFilters = true, 
  autoFocus = false,
  className = ""
}: EnhancedSearchBarProps) {
  const { user } = useAuth()
  const [query, setQuery] = useState("")
  const [filters, setFilters] = useState<SearchFilters>({})
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [popularSearches, setPopularSearches] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const suggestionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus()
    }
  }, [autoFocus])

  useEffect(() => {
    // 获取用户搜索历史和热门搜索
    const fetchInitialData = async () => {
      try {
        const [popularData, historyData] = await Promise.all([
          SearchAPI.getPopularSearches(5),
          user ? SearchAPI.getUserSearchHistory(user.id, 5) : Promise.resolve([])
        ])

        setPopularSearches(popularData.map(p => p.query))
        setSearchHistory(historyData.map(h => h.query))
      } catch (error) {
        console.error('Error fetching search data:', error)
      }
    }

    fetchInitialData()
  }, [user])

  useEffect(() => {
    // 获取搜索建议
    const fetchSuggestions = async () => {
      if (query.length < 2) {
        setSuggestions([])
        return
      }

      try {
        setLoading(true)
        const autocompleteSuggestions = await SearchAPI.getAutocompleteSuggestions(query, 5)
        setSuggestions(autocompleteSuggestions)
      } catch (error) {
        console.error('Error fetching suggestions:', error)
      } finally {
        setLoading(false)
      }
    }

    const debounceTimer = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(debounceTimer)
  }, [query])

  // 点击外部关闭建议
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (searchQuery?: string) => {
    const finalQuery = searchQuery || query
    if (!finalQuery.trim()) return

    // 记录用户行为
    if (user) {
      UserBehaviorsAPI.trackBehavior({
        user_id: user.id,
        tool_id: '', // 搜索行为没有特定工具ID
        behavior_type: 'click',
        behavior_data: {
          source: 'search',
          query: finalQuery,
          filters
        }
      })
    }

    onSearch(finalQuery, filters)
    setShowSuggestions(false)
    
    // 更新搜索历史
    if (finalQuery && !searchHistory.includes(finalQuery)) {
      setSearchHistory(prev => [finalQuery, ...prev.slice(0, 4)])
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    } else if (e.key === "Escape") {
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    setShowSuggestions(value.length > 0 || searchHistory.length > 0 || popularSearches.length > 0)
  }

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion)
    handleSearch(suggestion)
  }

  const clearSearchHistory = async () => {
    if (user) {
      try {
        await SearchAPI.clearUserSearchHistory(user.id)
        setSearchHistory([])
      } catch (error) {
        console.error('Error clearing search history:', error)
      }
    } else {
      setSearchHistory([])
    }
  }

  const clearFilters = () => {
    setFilters({})
  }

  const hasActiveFilters = Object.values(filters).some((value) => 
    value !== undefined && value !== "" && (Array.isArray(value) ? value.length > 0 : true)
  )

  return (
    <div className={`w-full max-w-4xl mx-auto relative ${className}`}>
      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            ref={inputRef}
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            className="pl-10 pr-4 py-2 w-full"
            autoComplete="off"
          />
          
          {/* 搜索建议下拉 */}
          {showSuggestions && (
            <Card 
              ref={suggestionsRef}
              className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto shadow-lg"
            >
              <CardContent className="p-0">
                {/* 智能建议 */}
                {suggestions.length > 0 && (
                  <div>
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b flex items-center space-x-1">
                      <Sparkles className="h-3 w-3" />
                      <span>智能建议</span>
                    </div>
                    {suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2 transition-colors"
                        onClick={() => handleSuggestionClick(suggestion)}
                      >
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{suggestion}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 搜索历史 */}
                {searchHistory.length > 0 && query.length === 0 && (
                  <div>
                    {suggestions.length > 0 && <Separator />}
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b flex items-center justify-between">
                      <span className="flex items-center space-x-1">
                        <History className="h-3 w-3" />
                        <span>搜索历史</span>
                      </span>
                      <button
                        onClick={clearSearchHistory}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                      >
                        清除
                      </button>
                    </div>
                    {searchHistory.map((historyItem, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2 transition-colors"
                        onClick={() => handleSuggestionClick(historyItem)}
                      >
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm">{historyItem}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 热门搜索 */}
                {popularSearches.length > 0 && query.length === 0 && (
                  <div>
                    {(suggestions.length > 0 || searchHistory.length > 0) && <Separator />}
                    <div className="px-4 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b">
                      <span className="flex items-center space-x-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>热门搜索</span>
                      </span>
                    </div>
                    {popularSearches.map((popularItem, index) => (
                      <div
                        key={index}
                        className="px-4 py-2 hover:bg-gray-50 cursor-pointer flex items-center space-x-2 transition-colors"
                        onClick={() => handleSuggestionClick(popularItem)}
                      >
                        <TrendingUp className="h-4 w-4 text-orange-400" />
                        <span className="text-sm">{popularItem}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 空状态 */}
                {suggestions.length === 0 && searchHistory.length === 0 && popularSearches.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-500">
                    <Search className="h-8 w-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">开始输入以获取搜索建议</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
        
        <Button onClick={() => handleSearch()} disabled={loading}>
          {loading ? "搜索中..." : "搜索"}
        </Button>
        
        {showFilters && (
          <Button 
            variant="outline" 
            size="icon" 
            className="relative"
            onClick={() => {/* TODO: 打开筛选面板 */}}
          >
            <Filter className="h-4 w-4" />
            {hasActiveFilters && (
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-blue-600 rounded-full"></div>
            )}
          </Button>
        )}
      </div>

      {/* 活跃筛选器 */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 mt-3">
          {filters.category_id && (
            <Badge variant="secondary" className="flex items-center gap-1">
              分类筛选
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, category_id: undefined })}
              />
            </Badge>
          )}
          {filters.tags && filters.tags.length > 0 && (
            <Badge variant="secondary" className="flex items-center gap-1">
              标签: {filters.tags.slice(0, 2).join(", ")}{filters.tags.length > 2 && "..."}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, tags: undefined })}
              />
            </Badge>
          )}
          {filters.pricing_type && (
            <Badge variant="secondary" className="flex items-center gap-1">
              定价: {filters.pricing_type}
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, pricing_type: undefined })}
              />
            </Badge>
          )}
          {filters.min_rating && (
            <Badge variant="secondary" className="flex items-center gap-1">
              评分: {filters.min_rating}星以上
              <X
                className="h-3 w-3 cursor-pointer"
                onClick={() => setFilters({ ...filters, min_rating: undefined })}
              />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-6 px-2 text-xs"
          >
            清除全部
          </Button>
        </div>
      )}
    </div>
  )
}
