import { Users, Target, Award, Globe, Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const stats = [
  { label: "收录工具", value: "1000+", icon: Target },
  { label: "注册用户", value: "50K+", icon: Users },
  { label: "月访问量", value: "500K+", icon: Globe },
  { label: "合作伙伴", value: "100+", icon: Award },
]

const team = [
  {
    name: "张小明",
    role: "创始人 & CEO",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "前Google工程师，AI领域专家，致力于推动AI工具的普及和应用。",
    social: {
      twitter: "@zhangxiaoming",
      linkedin: "zhangxiaoming",
    },
  },
  {
    name: "李小红",
    role: "产品总监",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "10年产品经验，专注于用户体验设计和产品策略规划。",
    social: {
      twitter: "@lixiaohong",
      linkedin: "lixiaohong",
    },
  },
  {
    name: "王小华",
    role: "技术总监",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "全栈工程师，负责平台技术架构和开发团队管理。",
    social: {
      twitter: "@wangxiaohua",
      linkedin: "wangxiaohua",
    },
  },
  {
    name: "赵小丽",
    role: "运营总监",
    avatar: "/placeholder.svg?height=80&width=80",
    bio: "数字营销专家，负责社区运营和用户增长策略。",
    social: {
      twitter: "@zhaoxiaoli",
      linkedin: "zhaoxiaoli",
    },
  },
]

const milestones = [
  {
    year: "2024",
    title: "平台正式上线",
    description: "AI工具导航平台正式发布，收录首批100个优质AI工具。",
  },
  {
    year: "2024",
    title: "用户突破1万",
    description: "注册用户数突破1万，月活跃用户达到5000+。",
  },
  {
    year: "2024",
    title: "工具库扩展",
    description: "收录工具数量突破500个，覆盖20+个主要分类。",
  },
  {
    year: "2024",
    title: "社区功能上线",
    description: "推出用户评价、收藏、分享等社区功能。",
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">AI工具导航</span>
            </Link>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/tools" className="text-gray-600 hover:text-blue-600 transition-colors">
                工具库
              </Link>
              <Link href="/categories" className="text-gray-600 hover:text-blue-600 transition-colors">
                分类
              </Link>
              <Link href="/submit" className="text-gray-600 hover:text-blue-600 transition-colors">
                提交工具
              </Link>
              <Link href="/about" className="text-blue-600 font-medium">
                关于我们
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button variant="outline" asChild>
                <Link href="/login">登录</Link>
              </Button>
              <Button asChild>
                <Link href="/register">注册</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">关于AI工具导航</h1>
          <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto">
            我们致力于成为全球最全面、最权威的AI工具发现平台，帮助用户找到最适合的AI工具，推动人工智能技术的普及和应用。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/tools">探索工具</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/submit">提交工具</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">我们的使命</h2>
              <p className="text-xl text-gray-600">让每个人都能轻松发现和使用最适合的AI工具</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                    <Target className="h-6 w-6 text-blue-600" />
                  </div>
                  <CardTitle>精准发现</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    通过智能分类和搜索功能，帮助用户快速找到最符合需求的AI工具，节省时间和精力。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle>社区驱动</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    建立活跃的用户社区，通过真实评价和经验分享，为每个工具提供可靠的参考信息。
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                    <Award className="h-6 w-6 text-purple-600" />
                  </div>
                  <CardTitle>质量保证</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    严格的审核机制和持续的质量监控，确保平台上的每个工具都经过验证和测试。
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">核心团队</h2>
            <p className="text-xl text-gray-600">来自全球顶尖科技公司的专业团队</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <Avatar className="w-20 h-20 mx-auto mb-4">
                    <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{member.name}</h3>
                  <Badge variant="secondary" className="mb-3">
                    {member.role}
                  </Badge>
                  <p className="text-sm text-gray-600 mb-4">{member.bio}</p>
                  <div className="flex justify-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://twitter.com/${member.social.twitter}`} target="_blank" rel="noreferrer">
                        Twitter
                      </a>
                    </Button>
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://linkedin.com/in/${member.social.linkedin}`} target="_blank" rel="noreferrer">
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">发展历程</h2>
            <p className="text-xl text-gray-600">见证我们的成长足迹</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {milestone.year.slice(-2)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="bg-white rounded-lg p-6 shadow-md">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{milestone.title}</h3>
                        <Badge variant="outline">{milestone.year}</Badge>
                      </div>
                      <p className="text-gray-600">{milestone.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">联系我们</h2>
            <p className="text-xl text-gray-600">有任何问题或建议，欢迎与我们联系</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">邮箱联系</h3>
                <p className="text-gray-600 mb-4">我们会在24小时内回复您的邮件</p>
                <Button variant="outline" asChild>
                  <a href="mailto:contact@aitools.com">contact@aitools.com</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">电话咨询</h3>
                <p className="text-gray-600 mb-4">工作日 9:00-18:00</p>
                <Button variant="outline" asChild>
                  <a href="tel:+86-400-123-4567">400-123-4567</a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">办公地址</h3>
                <p className="text-gray-600 mb-4">北京市朝阳区科技园区</p>
                <Button variant="outline">查看地图</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">加入我们的社区</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            与数万名AI爱好者一起，发现和分享最新的AI工具，共同推动人工智能的发展
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/register">立即注册</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-white border-white hover:bg-white hover:text-blue-600"
              asChild
            >
              <Link href="/submit">提交工具</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
