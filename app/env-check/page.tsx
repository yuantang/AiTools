'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CheckCircle, XCircle, AlertCircle, Copy } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EnvCheck {
  name: string
  value: string | undefined
  required: boolean
  description: string
}

export default function EnvCheckPage() {
  const [envVars, setEnvVars] = useState<EnvCheck[]>([])
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    const checks: EnvCheck[] = [
      {
        name: 'NEXT_PUBLIC_SUPABASE_URL',
        value: process.env.NEXT_PUBLIC_SUPABASE_URL,
        required: true,
        description: 'Supabase项目URL'
      },
      {
        name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        value: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        required: true,
        description: 'Supabase匿名密钥'
      },
      {
        name: 'NEXT_PUBLIC_SITE_URL',
        value: process.env.NEXT_PUBLIC_SITE_URL,
        required: false,
        description: '网站URL'
      },
      {
        name: 'NEXT_PUBLIC_SITE_NAME',
        value: process.env.NEXT_PUBLIC_SITE_NAME,
        required: false,
        description: '网站名称'
      }
    ]
    setEnvVars(checks)
  }, [])

  const getStatus = (envVar: EnvCheck) => {
    if (envVar.required && !envVar.value) {
      return { icon: XCircle, color: 'text-red-500', status: '缺失', variant: 'destructive' as const }
    }
    if (envVar.value) {
      return { icon: CheckCircle, color: 'text-green-500', status: '已配置', variant: 'default' as const }
    }
    return { icon: AlertCircle, color: 'text-yellow-500', status: '可选', variant: 'secondary' as const }
  }

  const copyToClipboard = (text: string, name: string) => {
    navigator.clipboard.writeText(text)
    setCopied(name)
    setTimeout(() => setCopied(null), 2000)
  }

  const requiredEnvVars = envVars.filter(env => env.required)
  const missingRequired = requiredEnvVars.filter(env => !env.value)
  const allRequiredConfigured = missingRequired.length === 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">环境变量检查</h1>
          <p className="text-muted-foreground">
            检查AI工具导航项目的环境变量配置状态
          </p>
        </div>

        {/* 总体状态 */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {allRequiredConfigured ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              配置状态
            </CardTitle>
            <CardDescription>
              {allRequiredConfigured 
                ? '所有必需的环境变量都已正确配置' 
                : `缺少 ${missingRequired.length} 个必需的环境变量`
              }
            </CardDescription>
          </CardHeader>
        </Card>

        {/* 环境变量列表 */}
        <div className="space-y-4">
          {envVars.map((envVar) => {
            const status = getStatus(envVar)
            const StatusIcon = status.icon

            return (
              <Card key={envVar.name}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <StatusIcon className={`h-5 w-5 ${status.color}`} />
                      <div>
                        <CardTitle className="text-lg">{envVar.name}</CardTitle>
                        <CardDescription>{envVar.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant={status.variant}>{status.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">值:</span>
                      {envVar.value ? (
                        <div className="flex items-center gap-2">
                          <code className="bg-muted px-2 py-1 rounded text-sm">
                            {envVar.value.substring(0, 20)}...
                          </code>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => copyToClipboard(envVar.value!, envVar.name)}
                          >
                            <Copy className="h-4 w-4" />
                            {copied === envVar.name ? '已复制' : '复制'}
                          </Button>
                        </div>
                      ) : (
                        <span className="text-muted-foreground text-sm">未设置</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">必需:</span>
                      <span className="text-sm">{envVar.required ? '是' : '否'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* 配置指南 */}
        {!allRequiredConfigured && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>配置指南</CardTitle>
              <CardDescription>
                如何在Vercel中配置缺失的环境变量
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-medium">步骤 1: 访问Vercel项目设置</h4>
                <p className="text-sm text-muted-foreground">
                  登录Vercel Dashboard → 选择ai-tools项目 → Settings → Environment Variables
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">步骤 2: 添加环境变量</h4>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm">
{`NEXT_PUBLIC_SUPABASE_URL=https://xnhfhzuolbiqdrnyuwda.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}
                  </pre>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">步骤 3: 重新部署</h4>
                <p className="text-sm text-muted-foreground">
                  配置完成后，在Deployments标签中点击Redeploy重新部署项目
                </p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
