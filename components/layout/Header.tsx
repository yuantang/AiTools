"use client"

import Link from "next/link"
import { Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/hooks/useAuth"

interface HeaderProps {
  currentPage?: string
}

export function Header({ currentPage }: HeaderProps) {
  const { user, userProfile, logout } = useAuth()

  // 管理后台导航菜单
  const adminNavItems = [
    { href: "/admin", label: "仪表板", key: "dashboard" },
    { href: "/admin/tools", label: "工具管理", key: "tools" },
    { href: "/admin/users", label: "用户管理", key: "users" },
    { href: "/admin/categories", label: "分类管理", key: "categories" },
    { href: "/admin/settings", label: "系统设置", key: "settings" },
  ]

  // 前台导航菜单
  const frontNavItems = [
    { href: "/tools", label: "工具库", key: "tools" },
    { href: "/categories", label: "分类", key: "categories" },
    { href: "/submit", label: "提交工具", key: "submit" },
    { href: "/about", label: "关于我们", key: "about" },
  ]

  const isAdminPage = currentPage === "admin"
  const navItems = isAdminPage ? adminNavItems : frontNavItems

  return (
    <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI工具导航
              </span>
            </Link>
            {isAdminPage && (
              <Badge className="bg-red-100 text-red-800">管理后台</Badge>
            )}
          </div>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className={`transition-colors ${
                  currentPage === item.key
                    ? "text-blue-600 font-medium"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-3">
            {user ? (
              <div className="flex items-center space-x-3">
                {isAdminPage ? (
                  <>
                    <Button variant="outline" asChild>
                      <Link href="/">返回前台</Link>
                    </Button>
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=32&width=32" />
                      <AvatarFallback>
                        {userProfile?.name?.[0] || user.email?.[0] || 'A'}
                      </AvatarFallback>
                    </Avatar>
                  </>
                ) : (
                  <>
                    <span className="text-sm text-gray-600">
                      欢迎，{userProfile?.name || user.email}
                    </span>
                    {userProfile?.role === "admin" && (
                      <Button variant="outline" size="sm" asChild>
                        <Link href="/admin">管理后台</Link>
                      </Button>
                    )}
                    <Button variant="outline" size="sm" asChild>
                      <Link href="/profile">个人中心</Link>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={logout}
                      className="text-red-600 hover:text-red-700"
                    >
                      退出
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <>
                <Button variant="outline" asChild>
                  <Link href="/login">登录</Link>
                </Button>
                <Button asChild>
                  <Link href="/register">注册</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
