"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Settings, Trash2, Copy, Download, Play, Users, CreditCard, Zap, Building2 } from "lucide-react"

interface Project {
  id: string
  name: string
  domain: string
  description: string
  status: "active" | "paused" | "development"
  type: "subscription" | "credit" | "hybrid"
  createdAt: string
  lastModified: string
  config: {
    plans: any[]
    creditSystem: any
    routeProtection: any[]
    features: string[]
    styling: any
    integrations: any
  }
  stats: {
    customers: number
    revenue: number
    subscriptions: number
  }
}

interface ProjectManagerProps {
  onSelectProject: (project: Project) => void
  currentProject?: Project
}

export function ProjectManager({ onSelectProject, currentProject }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "proj_1",
      name: "TaskFlow Pro",
      domain: "taskflow.com",
      description: "Project management SaaS with team collaboration",
      status: "active",
      type: "subscription",
      createdAt: "2024-01-15",
      lastModified: "2024-01-20",
      config: {
        plans: [],
        creditSystem: null,
        routeProtection: [],
        features: ["auth", "subscriptions", "admin"],
        styling: { theme: "purple" },
        integrations: { stripe: true, nextauth: true },
      },
      stats: { customers: 1247, revenue: 24580, subscriptions: 892 },
    },
    {
      id: "proj_2",
      name: "AI Content Hub",
      domain: "aicontent.io",
      description: "AI-powered content generation platform",
      status: "development",
      type: "credit",
      createdAt: "2024-01-18",
      lastModified: "2024-01-20",
      config: {
        plans: [],
        creditSystem: { enabled: true, packages: [] },
        routeProtection: [],
        features: ["auth", "credits", "api"],
        styling: { theme: "blue" },
        integrations: { stripe: true, openai: true },
      },
      stats: { customers: 156, revenue: 2340, subscriptions: 0 },
    },
  ])

  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newProject, setNewProject] = useState({
    name: "",
    domain: "",
    description: "",
    type: "subscription" as const,
  })

  const createProject = () => {
    const project: Project = {
      id: `proj_${Date.now()}`,
      name: newProject.name,
      domain: newProject.domain,
      description: newProject.description,
      status: "development",
      type: newProject.type,
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      config: {
        plans: [],
        creditSystem: newProject.type === "credit" ? { enabled: true, packages: [] } : null,
        routeProtection: [],
        features: ["auth"],
        styling: { theme: "purple" },
        integrations: { stripe: true, nextauth: true },
      },
      stats: { customers: 0, revenue: 0, subscriptions: 0 },
    }

    setProjects([...projects, project])
    setNewProject({ name: "", domain: "", description: "", type: "subscription" })
    setShowCreateDialog(false)
    onSelectProject(project)
  }

  const duplicateProject = (project: Project) => {
    const duplicated: Project = {
      ...project,
      id: `proj_${Date.now()}`,
      name: `${project.name} (Copy)`,
      domain: `copy-${project.domain}`,
      status: "development",
      createdAt: new Date().toISOString().split("T")[0],
      lastModified: new Date().toISOString().split("T")[0],
      stats: { customers: 0, revenue: 0, subscriptions: 0 },
    }
    setProjects([...projects, duplicated])
  }

  const deleteProject = (projectId: string) => {
    setProjects(projects.filter((p) => p.id !== projectId))
  }

  const exportProject = (project: Project) => {
    const dataStr = JSON.stringify(project, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = `${project.name.toLowerCase().replace(/\s+/g, "-")}-config.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
      case "development":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Development</Badge>
      case "paused":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Paused</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>
    }
  }

  const getTypeBadge = (type: string) => {
    switch (type) {
      case "subscription":
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Subscription</Badge>
      case "credit":
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Credit-based</Badge>
      case "hybrid":
        return <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30">Hybrid</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{type}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">SaaS Project Manager</h2>
          <p className="text-gray-300">Manage multiple SaaS platforms from one dashboard</p>
        </div>
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              New SaaS Project
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-slate-900 border-white/20 text-white">
            <DialogHeader>
              <DialogTitle>Create New SaaS Project</DialogTitle>
              <DialogDescription className="text-gray-300">
                Set up a new SaaS platform with custom configuration
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-white">Project Name</Label>
                <Input
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="My Awesome SaaS"
                />
              </div>
              <div>
                <Label className="text-white">Domain</Label>
                <Input
                  value={newProject.domain}
                  onChange={(e) => setNewProject({ ...newProject, domain: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="myawesomesaas.com"
                />
              </div>
              <div>
                <Label className="text-white">Description</Label>
                <Input
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white"
                  placeholder="Brief description of your SaaS"
                />
              </div>
              <div>
                <Label className="text-white">Project Type</Label>
                <Select
                  value={newProject.type}
                  onValueChange={(value: any) => setNewProject({ ...newProject, type: value })}
                >
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-white/20">
                    <SelectItem value="subscription" className="text-white">
                      Subscription-based
                    </SelectItem>
                    <SelectItem value="credit" className="text-white">
                      Credit-based
                    </SelectItem>
                    <SelectItem value="hybrid" className="text-white">
                      Hybrid (Both)
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(false)}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  Cancel
                </Button>
                <Button onClick={createProject} className="bg-purple-600 hover:bg-purple-700 text-white">
                  Create Project
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Current Project Banner */}
      {currentProject && (
        <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                  {currentProject.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-white font-semibold text-lg">Currently Editing: {currentProject.name}</h3>
                  <p className="text-gray-300">
                    {currentProject.domain} • {currentProject.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {getStatusBadge(currentProject.status)}
                {getTypeBadge(currentProject.type)}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <Card key={project.id} className="bg-white/5 border-white/10 hover:bg-white/10 transition-all">
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
                  {getTypeBadge(project.type)}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-300 text-sm">{project.description}</p>

              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-white">{project.stats.customers}</p>
                  <p className="text-xs text-gray-400">Customers</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">${project.stats.revenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">Revenue</p>
                </div>
                <div>
                  <p className="text-lg font-bold text-white">{project.stats.subscriptions}</p>
                  <p className="text-xs text-gray-400">Subscriptions</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-1">
                {project.config.features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                    {feature}
                  </Badge>
                ))}
              </div>

              <div className="flex space-x-2">
                <Button
                  size="sm"
                  onClick={() => onSelectProject(project)}
                  className={`flex-1 ${
                    currentProject?.id === project.id
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  } text-white`}
                >
                  {currentProject?.id === project.id ? (
                    <>
                      <Settings className="w-4 h-4 mr-1" />
                      Current
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Edit
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => duplicateProject(project)}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => exportProject(project)}
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => deleteProject(project.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Stats */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Platform Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{projects.length}</p>
              <p className="text-gray-400 text-sm">Total Projects</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{projects.reduce((sum, p) => sum + p.stats.customers, 0)}</p>
              <p className="text-gray-400 text-sm">Total Customers</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <CreditCard className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">
                ${projects.reduce((sum, p) => sum + p.stats.revenue, 0).toLocaleString()}
              </p>
              <p className="text-gray-400 text-sm">Total Revenue</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center mx-auto mb-2">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-white">{projects.filter((p) => p.status === "active").length}</p>
              <p className="text-gray-400 text-sm">Active Projects</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
