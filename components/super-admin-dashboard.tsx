"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  Search,
  Plus,
  Settings,
  Shield,
  BarChart3,
  Building2,
  Key,
  Zap,
} from "lucide-react"
import { EnvSetupModal } from "@/components/env-setup-modal"
import RealCustomerList from "@/components/real-customer-list"

// Mock data for multiple SaaS projects
const mockProjects = [
  {
    id: "proj_1",
    name: "TaskFlow Pro",
    domain: "taskflow.com",
    status: "active",
    plan: "enterprise",
    customers: 1247,
    revenue: 24580,
    stripeAccountId: "acct_1234567890",
    createdAt: "2024-01-15",
    lastActive: "2024-01-20",
    features: ["subscriptions", "credits", "analytics"],
  },
  {
    id: "proj_2",
    name: "DataSync Hub",
    domain: "datasync.io",
    status: "active",
    plan: "pro",
    customers: 892,
    revenue: 15420,
    stripeAccountId: "acct_0987654321",
    createdAt: "2024-01-10",
    lastActive: "2024-01-19",
    features: ["subscriptions", "api_limits"],
  },
  {
    id: "proj_3",
    name: "CloudStore",
    domain: "cloudstore.app",
    status: "trial",
    plan: "starter",
    customers: 156,
    revenue: 2340,
    stripeAccountId: "acct_1122334455",
    createdAt: "2024-01-18",
    lastActive: "2024-01-20",
    features: ["subscriptions"],
  },
]

function getStatusBadge(status: string) {
  switch (status) {
    case "active":
      return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
    case "trial":
      return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Trial</Badge>
    case "suspended":
      return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Suspended</Badge>
    default:
      return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>
  }
}

function getPlanBadge(plan: string) {
  switch (plan) {
    case "enterprise":
      return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Enterprise</Badge>
    case "pro":
      return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Pro</Badge>
    case "starter":
      return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Starter</Badge>
    default:
      return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{plan}</Badge>
  }
}

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const totalStats = {
    totalProjects: mockProjects.length,
    totalCustomers: mockProjects.reduce((sum, p) => sum + p.customers, 0),
    totalRevenue: mockProjects.reduce((sum, p) => sum + p.revenue, 0),
    activeProjects: mockProjects.filter((p) => p.status === "active").length,
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Super Admin Dashboard</h1>
          <p className="text-gray-300">Manage all your SaaS projects and customers</p>
        </div>
        <div className="flex items-center space-x-4">
          <EnvSetupModal />
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Plus className="w-4 h-4 mr-2" />
            New SaaS Project
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-white/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="projects" className="data-[state=active]:bg-white/20 text-white">
            Projects
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-white/20 text-white">
            All Customers
          </TabsTrigger>
          <TabsTrigger value="analytics" className="data-[state=active]:bg-white/20 text-white">
            Analytics
          </TabsTrigger>
          <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 text-white">
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Global Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Projects</p>
                    <p className="text-2xl font-bold text-white">{totalStats.totalProjects}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Customers</p>
                    <p className="text-2xl font-bold text-white">{totalStats.totalCustomers.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-white">${totalStats.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Projects</p>
                    <p className="text-2xl font-bold text-white">{totalStats.activeProjects}</p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Recent Projects</CardTitle>
              <CardDescription className="text-gray-300">Latest SaaS projects and their performance</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockProjects.slice(0, 3).map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold">
                        {project.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{project.name}</h3>
                        <p className="text-gray-400 text-sm">{project.domain}</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <p className="text-white font-medium">{project.customers}</p>
                        <p className="text-gray-400 text-xs">Customers</p>
                      </div>

                      <div className="text-center">
                        <p className="text-white font-medium">${project.revenue.toLocaleString()}</p>
                        <p className="text-gray-400 text-xs">Revenue</p>
                      </div>

                      {getStatusBadge(project.status)}
                      {getPlanBadge(project.plan)}

                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        onClick={() => setSelectedProject(project.id)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="projects" className="space-y-6">
          {/* Project Management */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">SaaS Projects</CardTitle>
                  <CardDescription className="text-gray-300">Manage all your SaaS applications</CardDescription>
                </div>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Search and Filters */}
              <div className="flex items-center space-x-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <Select defaultValue="all">
                  <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    <SelectItem value="all" className="text-white">
                      All Status
                    </SelectItem>
                    <SelectItem value="active" className="text-white">
                      Active
                    </SelectItem>
                    <SelectItem value="trial" className="text-white">
                      Trial
                    </SelectItem>
                    <SelectItem value="suspended" className="text-white">
                      Suspended
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Projects Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockProjects.map((project) => (
                  <Card key={project.id} className="bg-white/10 border-white/20 hover:bg-white/15 transition-all">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold">
                            {project.name.charAt(0)}
                          </div>
                          <div>
                            <CardTitle className="text-white text-lg">{project.name}</CardTitle>
                            <CardDescription className="text-gray-300">{project.domain}</CardDescription>
                          </div>
                        </div>
                        <div className="flex flex-col space-y-1">
                          {getStatusBadge(project.status)}
                          {getPlanBadge(project.plan)}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">{project.customers}</p>
                          <p className="text-gray-400 text-xs">Customers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-white">${project.revenue.toLocaleString()}</p>
                          <p className="text-gray-400 text-xs">Revenue</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-gray-400 text-xs mb-2">Features</p>
                        <div className="flex flex-wrap gap-1">
                          {project.features.map((feature) => (
                            <Badge key={feature} variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                          onClick={() => setSelectedProject(project.id)}
                        >
                          <Settings className="w-4 h-4 mr-1" />
                          Manage
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <BarChart3 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="customers" className="space-y-6">
          <RealCustomerList />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Global Analytics */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Platform Analytics</CardTitle>
              <CardDescription className="text-gray-300">Performance metrics across all projects</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Revenue by Project</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockProjects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {project.name.charAt(0)}
                            </div>
                            <span className="text-white">{project.name}</span>
                          </div>
                          <span className="text-white font-medium">${project.revenue.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Customer Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {mockProjects.map((project) => (
                        <div key={project.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                              {project.name.charAt(0)}
                            </div>
                            <span className="text-white">{project.name}</span>
                          </div>
                          <span className="text-white font-medium">{project.customers}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Platform Settings */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Platform Settings
              </CardTitle>
              <CardDescription className="text-gray-300">
                Global settings for your SaaS management platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Authentication</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Multi-Factor Authentication</Label>
                        <p className="text-sm text-gray-400">Require MFA for admin access</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div>
                      <Label className="text-white">Session Timeout (hours)</Label>
                      <Input className="bg-white/10 border-white/20 text-white mt-1" defaultValue="8" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Billing</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white">Master Stripe Account</Label>
                      <Input className="bg-white/10 border-white/20 text-white mt-1" placeholder="acct_1234567890" />
                    </div>
                    <div>
                      <Label className="text-white">Platform Fee (%)</Label>
                      <Input className="bg-white/10 border-white/20 text-white mt-1" defaultValue="2.5" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Notifications</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Email Alerts</Label>
                        <p className="text-sm text-gray-400">Get notified of important events</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Slack Integration</Label>
                        <p className="text-sm text-gray-400">Send alerts to Slack</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">API Access</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-white">API Key</Label>
                      <div className="flex space-x-2 mt-1">
                        <Input
                          className="bg-white/10 border-white/20 text-white"
                          value="pk_live_••••••••••••••••"
                          readOnly
                        />
                        <Button
                          variant="outline"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-white">Rate Limiting</Label>
                        <p className="text-sm text-gray-400">1000 requests per hour</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex justify-end space-x-4">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                  Cancel
                </Button>
                <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                  Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Selected Project Modal/Sidebar would go here */}
      {selectedProject && (
        <ProjectManagementModal projectId={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  )
}

// Project Management Modal Component
function ProjectManagementModal({ projectId, onClose }: { projectId: string; onClose: () => void }) {
  const project = mockProjects.find((p) => p.id === projectId)

  if (!project) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <Card className="bg-slate-900 border-white/20 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white text-2xl">{project.name}</CardTitle>
              <CardDescription className="text-gray-300">{project.domain}</CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-white/10">
              <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">
                Overview
              </TabsTrigger>
              <TabsTrigger value="customers" className="data-[state=active]:bg-white/20 text-white">
                Customers
              </TabsTrigger>
              <TabsTrigger value="subscriptions" className="data-[state=active]:bg-white/20 text-white">
                Subscriptions
              </TabsTrigger>
              <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 text-white">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Customers</p>
                        <p className="text-xl font-bold text-white">{project.customers}</p>
                      </div>
                      <Users className="w-8 h-8 text-blue-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Revenue</p>
                        <p className="text-xl font-bold text-white">${project.revenue.toLocaleString()}</p>
                      </div>
                      <DollarSign className="w-8 h-8 text-green-400" />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm">Status</p>
                        <div className="mt-1">{getStatusBadge(project.status)}</div>
                      </div>
                      <Zap className="w-8 h-8 text-purple-400" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Project Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Stripe Account ID</Label>
                      <Input
                        className="bg-white/10 border-white/20 text-white mt-1"
                        value={project.stripeAccountId}
                        readOnly
                      />
                    </div>
                    <div>
                      <Label className="text-white">Domain</Label>
                      <Input className="bg-white/10 border-white/20 text-white mt-1" value={project.domain} readOnly />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="customers" className="space-y-4">
              <div className="text-center py-8">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Customer Management</h3>
                <p className="text-gray-400 mb-6">This would show the customer list component for {project.name}</p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">View All Customers</Button>
              </div>
            </TabsContent>

            <TabsContent value="subscriptions" className="space-y-4">
              <div className="text-center py-8">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-white mb-2">Subscription Management</h3>
                <p className="text-gray-400 mb-6">This would show the subscription list component for {project.name}</p>
                <Button className="bg-purple-600 hover:bg-purple-700 text-white">View All Subscriptions</Button>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Project Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-white">Project Name</Label>
                      <Input className="bg-white/10 border-white/20 text-white mt-1" defaultValue={project.name} />
                    </div>
                    <div>
                      <Label className="text-white">Domain</Label>
                      <Input className="bg-white/10 border-white/20 text-white mt-1" defaultValue={project.domain} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Project Status</Label>
                      <p className="text-sm text-gray-400">Enable or disable this project</p>
                    </div>
                    <Switch defaultChecked={project.status === "active"} />
                  </div>

                  <div className="flex justify-end space-x-4">
                    <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                      Cancel
                    </Button>
                    <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                      Save Changes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
