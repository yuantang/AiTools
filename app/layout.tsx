import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import { Toaster } from "@/components/ui/toaster"
import { NotificationCenter } from "@/components/NotificationCenter"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI工具导航 - 发现最好的AI工具",
  description: "收录全球最新最热门的AI产品，帮助您快速找到适合的AI工具",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN">
      <body className={inter.className}>
        <AuthProvider>
          {children}
          <Toaster />
          <NotificationCenter />
        </AuthProvider>
      </body>
    </html>
  )
}
