"use client"

import { useState } from "react"
import { Download, FileText, Table, BarChart3, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

const reportTypes = [
  {
    id: "traffic",
    name: "流量报告",
    description: "网站访问量、页面浏览量、用户行为等数据",
    icon: BarChart3,
  },
  {
    id: "users",
    name: "用户报告",
    description: "用户注册、活跃度、留存率等数据",
    icon: FileText,
  },
  {
    id: "tools",
    name: "工具报告",
    description: "工具使用情况、评分、分类分布等数据",
    icon: Table,
  },
  {
    id: "revenue",
    name: "收入报告",
    description: "订阅收入、广告收入、佣金等财务数据",
    icon: Calendar,
  },
]

const exportFormats = [
  { value: "pdf", label: "PDF 报告" },
  { value: "excel", label: "Excel 表格" },
  { value: "csv", label: "CSV 数据" },
  { value: "json", label: "JSON 数据" },
]

export function ReportExporter() {
  const [selectedReports, setSelectedReports] = useState<string[]>([])
  const [exportFormat, setExportFormat] = useState("pdf")
  const [timeRange, setTimeRange] = useState("30d")
  const [isExporting, setIsExporting] = useState(false)

  const handleReportToggle = (reportId: string) => {
    setSelectedReports((prev) => (prev.includes(reportId) ? prev.filter((id) => id !== reportId) : [...prev, reportId]))
  }

  const handleExport = async () => {
    setIsExporting(true)

    // 模拟导出过程
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 在实际应用中，这里会调用API生成和下载报告
    console.log("Exporting reports:", {
      reports: selectedReports,
      format: exportFormat,
      timeRange,
    })

    setIsExporting(false)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          导出报告
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>导出数据报告</DialogTitle>
          <DialogDescription>选择要导出的报告类型和格式，生成详细的数据分析报告</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Types */}
          <div>
            <Label className="text-base font-medium">选择报告类型</Label>
            <div className="grid grid-cols-2 gap-4 mt-3">
              {reportTypes.map((report) => (
                <Card
                  key={report.id}
                  className={`cursor-pointer transition-colors ${
                    selectedReports.includes(report.id) ? "border-blue-500 bg-blue-50" : "hover:bg-gray-50"
                  }`}
                  onClick={() => handleReportToggle(report.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedReports.includes(report.id)}
                        onChange={() => handleReportToggle(report.id)}
                      />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <report.icon className="h-4 w-4 text-blue-600" />
                          <h3 className="font-medium">{report.name}</h3>
                        </div>
                        <p className="text-sm text-gray-600">{report.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Time Range */}
          <div>
            <Label className="text-base font-medium">时间范围</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">最近7天</SelectItem>
                <SelectItem value="30d">最近30天</SelectItem>
                <SelectItem value="90d">最近90天</SelectItem>
                <SelectItem value="1y">最近1年</SelectItem>
                <SelectItem value="custom">自定义范围</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Export Format */}
          <div>
            <Label className="text-base font-medium">导出格式</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger className="mt-2">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {exportFormats.map((format) => (
                  <SelectItem key={format.value} value={format.value}>
                    {format.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Export Button */}
          <div className="flex justify-end space-x-3">
            <Button variant="outline">取消</Button>
            <Button onClick={handleExport} disabled={selectedReports.length === 0 || isExporting}>
              {isExporting ? "导出中..." : "开始导出"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
