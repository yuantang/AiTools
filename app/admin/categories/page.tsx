import { CategoryManager } from "@/components/CategoryManager"
import { Header } from "@/components/layout/Header"

export default function AdminCategoriesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentPage="admin" />

      <div className="container mx-auto px-4 py-8">
        <CategoryManager />
      </div>
    </div>
  )
}
