"use client"

import { useState, useEffect, useRef } from "react"
import { Search, X, Clock, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ToolsAPI } from "@/lib/api/tools"
import type { Tool } from "@/lib/supabase"

interface SearchBarProps {
  onSearch?: (query: string) => void
  placeholder?: string
  className?: string
}

export function SearchBar({ onSearch, placeholder = "搜索AI工具...", className = "" }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [suggestions, setSuggestions] = useState<Tool[]>([])
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [trendingSearches] = useState([
    "ChatGPT",
    "Midjourney",
    "Stable Diffusion",
    "GitHub Copilot",
    "Claude",
    "Gemini",
  ])
  const [loading, setLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    // 加载历史搜索
    const saved = localStorage.getItem("recent-searches")
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  useEffect(() => {
    // 点击外部关闭搜索建议
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    // 防抖搜索建议
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    if (query.trim().length > 1) {
      debounceRef.current = setTimeout(async () => {
        setLoading(true)
        try {
          const result = await ToolsAPI.getTools({
            search: query,
            limit: 5,
          })
          setSuggestions(result.data)
        } catch (error) {
          console.error("Search suggestions failed:", error)
        } finally {
          setLoading(false)
        }
      }, 300)
    } else {
      setSuggestions([])
    }

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return

    // 保存到历史搜索
    const newRecentSearches = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5)

    setRecentSearches(newRecentSearches)
    localStorage.setItem("recent-searches", JSON.stringify(newRecentSearches))

    // 执行搜索
    onSearch?.(searchQuery)
    setIsOpen(false)
    setQuery("")
  }

  const clearRecentSearches = () => {
    setRecentSearches([])
    localStorage.removeItem("recent-searches")
  }

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSearch(query)
            }
          }}
          placeholder={placeholder}
          className="pl-10 pr-10"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* 搜索建议下拉框 */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 max-h-96 overflow-y-auto">
          <CardContent className="p-0">
            {/* 搜索结果 */}
            {query.trim().length > 1 && (
              <div className="border-b">
                <div className="p-3 text-sm font-medium text-gray-700">搜索结果</div>
                {loading ? (
                  <div className="p-3">
                    <div className="animate-pulse space-y-2">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-12 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : suggestions.length > 0 ? (
                  <div>
                    {suggestions.map((tool) => (
                      <button
                        key={tool.id}
                        onClick={() => handleSearch(tool.name)}
                        className="w-full p-3 hover:bg-gray-50 flex items-center space-x-3 text-left"
                      >
                        <img
                          src={tool.logo_url || "/placeholder.svg?height=32&width=32"}
                          alt={tool.name}
                          className="w-8 h-8 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{tool.name}</div>
                          <div className="text-sm text-gray-500 truncate">{tool.description}</div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {tool.category?.name}
                        </Badge>
                      </button>
                    ))}
                    <button
                      onClick={() => handleSearch(query)}
                      className="w-full p-3 hover:bg-gray-50 text-left border-t"
                    >
                      <div className="flex items-center space-x-2">
                        <Search className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">搜索 "{query}"</span>
                      </div>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 text-sm text-gray-500">未找到相关工具</div>
                )}
              </div>
            )}

            {/* 历史搜索 */}
            {recentSearches.length > 0 && query.trim().length <= 1 && (
              <div className="border-b">
                <div className="p-3 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    最近搜索
                  </span>
                  <button onClick={clearRecentSearches} className="text-xs text-gray-500 hover:text-gray-700">
                    清除
                  </button>
                </div>
                <div>
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full p-3 hover:bg-gray-50 text-left flex items-center space-x-2"
                    >
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700">{search}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 热门搜索 */}
            {query.trim().length <= 1 && (
              <div>
                <div className="p-3 text-sm font-medium text-gray-700 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  热门搜索
                </div>
                <div className="p-3 pt-0">
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((search, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(search)}
                        className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
                      >
                        {search}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
