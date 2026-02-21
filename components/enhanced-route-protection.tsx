"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Shield, Lock, Plus, Trash2, Eye, Settings, Scan, Code, Download, Upload } from "lucide-react"

interface RouteConfig {
  id: string
  path: string
  protection: "public" | "authenticated" | "subscription" | "plan_specific" | "admin" | "custom"
  allowedPlans: string[]
  allowedRoles: string[]
  redirectTo: string
  description: string
  middleware: string[]
  customLogic?: string
  enabled: boolean
}

interface EnhancedRouteProtectionProps {
  data: any
  setData: (data: any) => void
  projectType: "subscription" | "credit" | "hybrid"
}

// Common Next.js routes that can be auto-detected
const commonRoutes = [
  { path: "/", description: "Home page", protection: "public" },
  { path: "/dashboard", description: "User dashboard", protection: "authenticated" },
  { path: "/profile", description: "User profile", protection: "authenticated" },
  { path: "/settings", description: "User settings", protection: "authenticated" },
  { path: "/billing", description: "Billing management", protection: "subscription" },
  { path: "/admin", description: "Admin panel", protection: "admin" },
  { path: "/admin/users", description: "User management", protection: "admin" },
  { path: "/admin/subscriptions", description: "Subscription management", protection: "admin" },
  { path: "/admin/analytics", description: "Analytics dashboard", protection: "admin" },
  { path: "/api/admin", description: "Admin API routes", protection: "admin" },
  { path: "/api/user", description: "User API routes", protection: "authenticated" },
  { path: "/api/billing", description: "Billing API routes", protection: "subscription" },
  { path: "/pricing", description: "Pricing page", protection: "public" },
  { path: "/docs", description: "Documentation", protection: "authenticated" },
  { path: "/support", description: "Support center", protection: "authenticated" },
]

const protectionTypes = [
  { value: "public", label: "Public", description: "Anyone can access", icon: "🌐" },
  { value: "authenticated", label: "Authenticated", description: "Requires login", icon: "🔐" },
  { value: "subscription", label: "Subscription", description: "Requires active subscription", icon: "💳" },
  { value: "plan_specific", label: "Plan Specific", description: "Specific subscription plans only", icon: "⭐" },
  { value: "admin", label: "Admin Only", description: "Admin users only", icon: "👑" },
  { value: "custom", label: "Custom Logic", description: "Custom middleware logic", icon: "⚙️" },
]

const middlewareOptions = [
  { value: "auth", label: "Authentication Check", description: "Verify user is logged in" },
  { value: "subscription", label: "Subscription Check", description: "Verify active subscription" },
  { value: "role", label: "Role Check", description: "Check user role/permissions" },
  { value: "rate_limit", label: "Rate Limiting", description: "Limit requests per user" },
  { value: "cors", label: "CORS Headers", description: "Handle cross-origin requests" },
  { value: "logging", label: "Request Logging", description: "Log all requests" },
  { value: "analytics", label: "Analytics Tracking", description: "Track page views" },
]

export function EnhancedRouteProtection({ data, setData, projectType }: EnhancedRouteProtectionProps) {
  const [routes, setRoutes] = useState<RouteConfig[]>(data.routeProtection || [])
  const [plans] = useState(data.plans || [])
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showImportDialog, setShowImportDialog] = useState(false)
  const [customRoutes, setCustomRoutes] = useState("")
  const [selectedRoute, setSelectedRoute] = useState<RouteConfig | null>(null)

  const updateRoutes = (updatedRoutes: RouteConfig[]) => {
    setRoutes(updatedRoutes)
    setData({ ...data, routeProtection: updatedRoutes })
  }

  const addRoute = (routeData: Partial<RouteConfig>) => {
    const newRoute: RouteConfig = {
      id: `route_${Date.now()}`,
      path: routeData.path || "/new-route",
      protection: routeData.protection || "authenticated",
      allowedPlans: [],
      allowedRoles: [],
      redirectTo: "/auth/signin",
      description: routeData.description || "New route",
      middleware: ["auth"],
      enabled: true,
      ...routeData,
    }
    updateRoutes([...routes, newRoute])
  }

  const updateRoute = (routeId: string, updates: Partial<RouteConfig>) => {
    const updatedRoutes = routes.map((route) => (route.id === routeId ? { ...route, ...updates } : route))
    updateRoutes(updatedRoutes)
  }

  const removeRoute = (routeId: string) => {
    updateRoutes(routes.filter((route) => route.id !== routeId))
  }

  const scanCommonRoutes = () => {
    const existingPaths = routes.map((r) => r.path)
    const newRoutes = commonRoutes
      .filter((route) => !existingPaths.includes(route.path))
      .map((route) => ({
        id: `route_${Date.now()}_${Math.random()}`,
        path: route.path,
        protection: route.protection as any,
        allowedPlans: [],
        allowedRoles: [],
        redirectTo: "/auth/signin",
        description: route.description,
        middleware: route.protection === "public" ? [] : ["auth"],
        enabled: true,
      }))

    updateRoutes([...routes, ...newRoutes])
  }

  const importCustomRoutes = () => {
    try {
      const routePaths = customRoutes.split("\n").filter((path) => path.trim())
      const newRoutes = routePaths.map((path) => ({
        id: `route_${Date.now()}_${Math.random()}`,
        path: path.trim(),
        protection: "authenticated" as const,
        allowedPlans: [],
        allowedRoles: [],
        redirectTo: "/auth/signin",
        description: `Custom route: ${path.trim()}`,
        middleware: ["auth"],
        enabled: true,
      }))

      updateRoutes([...routes, ...newRoutes])
      setCustomRoutes("")
      setShowImportDialog(false)
    } catch (error) {
      console.error("Error importing routes:", error)
    }
  }

  const exportRouteConfig = () => {
    const config = {
      routes: routes,
      middleware: generateMiddlewareCode(),
      timestamp: new Date().toISOString(),
      projectType,
    }

    const dataStr = JSON.stringify(config, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)
    const exportFileDefaultName = "route-protection-config.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const generateMiddlewareCode = () => {
    return `import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Route protection configuration
  const protectedRoutes = ${JSON.stringify(
    routes
      .filter((r) => r.enabled)
      .map((r) => ({
        path: r.path,
        protection: r.protection,
        allowedPlans: r.allowedPlans,
        allowedRoles: r.allowedRoles,
        redirectTo: r.redirectTo,
        middleware: r.middleware,
      })),
    null,
    2,
  )}

  // Find matching route
  const matchedRoute = protectedRoutes.find(route => 
    pathname.startsWith(route.path) || pathname === route.path
  )

  if (matchedRoute) {
    // Apply middleware checks
    if (matchedRoute.middleware.includes('logging')) {
      console.log(\`[MIDDLEWARE] \${pathname} - User: \${token?.email || 'anonymous'}\`)
    }

    if (matchedRoute.middleware.includes('rate_limit')) {
      // Implement rate limiting logic here
    }

    // Protection logic
    switch (matchedRoute.protection) {
      case 'authenticated':
        if (!token) {
          return NextResponse.redirect(new URL(matchedRoute.redirectTo, request.url))
        }
        break
        
      case 'subscription':
        if (!token || !token.subscription?.active) {
          return NextResponse.redirect(new URL('/billing', request.url))
        }
        break
        
      case 'plan_specific':
        if (!token || !matchedRoute.allowedPlans.includes(token.subscription?.plan)) {
          return NextResponse.redirect(new URL('/upgrade', request.url))
        }
        break
        
      case 'admin':
        if (!token || !matchedRoute.allowedRoles.includes(token.role)) {
          return NextResponse.redirect(new URL('/', request.url))
        }
        break

      case 'custom':
        // Custom logic would go here
        break
    }

    // Apply CORS if needed
    if (matchedRoute.middleware.includes('cors')) {
      const response = NextResponse.next()
      response.headers.set('Access-Control-Allow-Origin', '*')
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [${routes
    .filter((r) => r.enabled)
    .map((r) => `'${r.path}/:path*'`)
    .join(", ")}]
}`
  }

  const getProtectionBadge = (protection: string) => {
    const type = protectionTypes.find((t) => t.value === protection)
    if (!type) return <Badge className="bg-gray-500/20 text-gray-300">{protection}</Badge>

    const colors = {
      public: "bg-green-500/20 text-green-300 border-green-500/30",
      authenticated: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      subscription: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      plan_specific: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      admin: "bg-red-500/20 text-red-300 border-red-500/30",
      custom: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
    }

    return (
      <Badge className={colors[protection as keyof typeof colors]}>
        {type.icon} {type.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Enhanced Route Protection</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Configure comprehensive route protection with middleware, role-based access, and custom logic
        </p>
      </div>

      <Tabs defaultValue="routes" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="routes" className="data-[state=active]:bg-white/20 text-white">
            Routes ({routes.length})
          </TabsTrigger>
          <TabsTrigger value="middleware" className="data-[state=active]:bg-white/20 text-white">
            Middleware
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-white/20 text-white">
            Code Preview
          </TabsTrigger>
          <TabsTrigger value="debug" className="data-[state=active]:bg-white/20 text-white">
            Debug & Export
          </TabsTrigger>
        </TabsList>

        <TabsContent value="routes" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white flex items-center">
                    <Shield className="w-5 h-5 mr-2" />
                    Route Configuration
                  </CardTitle>
                  <CardDescription className="text-gray-300">
                    Manage access control for your application routes
                  </CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={scanCommonRoutes}
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    Scan Common Routes
                  </Button>
                  <Dialog open={showImportDialog} onOpenChange={setShowImportDialog}>
                    <DialogTrigger asChild>
                      <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
                        <Upload className="w-4 h-4 mr-2" />
                        Import Routes
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/20 text-white">
                      <DialogHeader>
                        <DialogTitle>Import Custom Routes</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Enter route paths (one per line) to import
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label className="text-white">Route Paths</Label>
                          <textarea
                            value={customRoutes}
                            onChange={(e) => setCustomRoutes(e.target.value)}
                            className="w-full h-32 bg-white/10 border-white/20 text-white rounded-md p-3 resize-none"
                            placeholder="/custom-dashboard&#10;/api/custom&#10;/special-feature"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setShowImportDialog(false)}
                            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          >
                            Cancel
                          </Button>
                          <Button onClick={importCustomRoutes} className="bg-purple-600 hover:bg-purple-700 text-white">
                            Import Routes
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
                    <DialogTrigger asChild>
                      <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Route
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Add New Route</DialogTitle>
                        <DialogDescription className="text-gray-300">
                          Configure protection for a new route
                        </DialogDescription>
                      </DialogHeader>
                      <RouteConfigForm
                        onSave={(routeData) => {
                          addRoute(routeData)
                          setShowAddDialog(false)
                        }}
                        onCancel={() => setShowAddDialog(false)}
                        plans={plans}
                        projectType={projectType}
                      />
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {routes.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Routes Configured</h3>
                  <p className="text-gray-400 mb-6">Add routes to configure access control</p>
                  <Button
                    onClick={scanCommonRoutes}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  >
                    <Scan className="w-4 h-4 mr-2" />
                    Scan Common Routes
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {routes.map((route) => (
                    <Card key={route.id} className="bg-white/10 border-white/20">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <Switch
                                checked={route.enabled}
                                onCheckedChange={(enabled) => updateRoute(route.id, { enabled })}
                              />
                              <div>
                                <h3 className="text-white font-medium">{route.path}</h3>
                                <p className="text-gray-400 text-sm">{route.description}</p>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getProtectionBadge(route.protection)}
                            <div className="flex space-x-1">
                              {route.middleware.map((mw) => (
                                <Badge key={mw} variant="secondary" className="bg-blue-500/20 text-blue-300 text-xs">
                                  {mw}
                                </Badge>
                              ))}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedRoute(route)}
                              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                            >
                              <Settings className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => removeRoute(route.id)}
                              className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="middleware" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Middleware Configuration</CardTitle>
              <CardDescription className="text-gray-300">Configure middleware options for your routes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {middlewareOptions.map((option) => (
                  <Card key={option.value} className="bg-white/10 border-white/20">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-medium">{option.label}</h3>
                          <p className="text-gray-400 text-sm">{option.description}</p>
                        </div>
                        <Switch defaultChecked={option.value === "auth"} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Generated Middleware Code</CardTitle>
                  <CardDescription className="text-gray-300">
                    Preview of the middleware.ts file that will be generated
                  </CardDescription>
                </div>
                <Button
                  onClick={() => navigator.clipboard.writeText(generateMiddlewareCode())}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  <Code className="w-4 h-4 mr-2" />
                  Copy Code
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto max-h-96">
                <pre>{generateMiddlewareCode()}</pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Debug & Export</CardTitle>
              <CardDescription className="text-gray-300">
                Debug your route configuration and export settings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Configuration Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Routes:</span>
                      <span className="text-white">{routes.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Enabled Routes:</span>
                      <span className="text-white">{routes.filter((r) => r.enabled).length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Protected Routes:</span>
                      <span className="text-white">{routes.filter((r) => r.protection !== "public").length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Admin Routes:</span>
                      <span className="text-white">{routes.filter((r) => r.protection === "admin").length}</span>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white text-lg">Export Options</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button onClick={exportRouteConfig} className="w-full bg-purple-600 hover:bg-purple-700 text-white">
                      <Download className="w-4 h-4 mr-2" />
                      Export Configuration
                    </Button>
                    <Button
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(routes, null, 2))}
                      variant="outline"
                      className="w-full border-white/20 text-white hover:bg-white/10 bg-transparent"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Copy JSON Config
                    </Button>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Route Protection Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {protectionTypes.map((type) => {
                      const count = routes.filter((r) => r.protection === type.value).length
                      if (count === 0) return null

                      return (
                        <div key={type.value} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <span className="text-lg">{type.icon}</span>
                            <div>
                              <h4 className="text-white font-medium">{type.label}</h4>
                              <p className="text-gray-400 text-sm">{type.description}</p>
                            </div>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-300">
                            {count} route{count !== 1 ? "s" : ""}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Route Edit Dialog */}
      {selectedRoute && (
        <Dialog open={!!selectedRoute} onOpenChange={() => setSelectedRoute(null)}>
          <DialogContent className="bg-slate-900 border-white/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Route: {selectedRoute.path}</DialogTitle>
              <DialogDescription className="text-gray-300">Modify route protection settings</DialogDescription>
            </DialogHeader>
            <RouteConfigForm
              initialData={selectedRoute}
              onSave={(routeData) => {
                updateRoute(selectedRoute.id, routeData)
                setSelectedRoute(null)
              }}
              onCancel={() => setSelectedRoute(null)}
              plans={plans}
              projectType={projectType}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

// Route Configuration Form Component
function RouteConfigForm({
  initialData,
  onSave,
  onCancel,
  plans,
  projectType,
}: {
  initialData?: RouteConfig
  onSave: (data: Partial<RouteConfig>) => void
  onCancel: () => void
  plans: any[]
  projectType: string
}) {
  const [formData, setFormData] = useState({
    path: initialData?.path || "",
    protection: initialData?.protection || "authenticated",
    description: initialData?.description || "",
    redirectTo: initialData?.redirectTo || "/auth/signin",
    allowedPlans: initialData?.allowedPlans || [],
    allowedRoles: initialData?.allowedRoles || [],
    middleware: initialData?.middleware || ["auth"],
    customLogic: initialData?.customLogic || "",
    enabled: initialData?.enabled ?? true,
  })

  const togglePlan = (planName: string) => {
    const current = formData.allowedPlans
    const updated = current.includes(planName) ? current.filter((p) => p !== planName) : [...current, planName]
    setFormData({ ...formData, allowedPlans: updated })
  }

  const toggleMiddleware = (mw: string) => {
    const current = formData.middleware
    const updated = current.includes(mw) ? current.filter((m) => m !== mw) : [...current, mw]
    setFormData({ ...formData, middleware: updated })
  }

  return (
    <div className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Route Path</Label>
          <Input
            value={formData.path}
            onChange={(e) => setFormData({ ...formData, path: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            placeholder="/dashboard"
          />
        </div>
        <div>
          <Label className="text-white">Protection Type</Label>
          <Select value={formData.protection} onValueChange={(protection) => setFormData({ ...formData, protection })}>
            <SelectTrigger className="bg-white/10 border-white/20 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-white/20">
              {protectionTypes.map((type) => (
                <SelectItem key={type.value} value={type.value} className="text-white">
                  <div className="flex items-center space-x-2">
                    <span>{type.icon}</span>
                    <div>
                      <div className="font-medium">{type.label}</div>
                      <div className="text-xs text-gray-400">{type.description}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label className="text-white">Description</Label>
          <Input
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            placeholder="Route description"
          />
        </div>
        <div>
          <Label className="text-white">Redirect To</Label>
          <Input
            value={formData.redirectTo}
            onChange={(e) => setFormData({ ...formData, redirectTo: e.target.value })}
            className="bg-white/10 border-white/20 text-white"
            placeholder="/auth/signin"
          />
        </div>
      </div>

      {(formData.protection === "plan_specific" || formData.protection === "subscription") && plans.length > 0 && (
        <div>
          <Label className="text-white mb-3 block">Allowed Plans</Label>
          <div className="flex flex-wrap gap-2">
            {plans.map((plan: any) => {
              const isAllowed = formData.allowedPlans.includes(plan.name)
              return (
                <Button
                  key={plan.id}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => togglePlan(plan.name)}
                  className={`${
                    isAllowed
                      ? "border-purple-500/50 bg-purple-500/20 text-purple-300"
                      : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                  }`}
                >
                  {plan.name}
                  {isAllowed && <Eye className="w-3 h-3 ml-1" />}
                </Button>
              )
            })}
          </div>
        </div>
      )}

      <div>
        <Label className="text-white mb-3 block">Middleware</Label>
        <div className="flex flex-wrap gap-2">
          {middlewareOptions.map((mw) => {
            const isEnabled = formData.middleware.includes(mw.value)
            return (
              <Button
                key={mw.value}
                type="button"
                variant="outline"
                size="sm"
                onClick={() => toggleMiddleware(mw.value)}
                className={`${
                  isEnabled
                    ? "border-blue-500/50 bg-blue-500/20 text-blue-300"
                    : "border-white/20 text-white hover:bg-white/10 bg-transparent"
                }`}
              >
                {mw.label}
              </Button>
            )
          })}
        </div>
      </div>

      {formData.protection === "custom" && (
        <div>
          <Label className="text-white">Custom Logic</Label>
          <textarea
            value={formData.customLogic}
            onChange={(e) => setFormData({ ...formData, customLogic: e.target.value })}
            className="w-full h-24 bg-white/10 border-white/20 text-white rounded-md p-3 resize-none"
            placeholder="// Custom middleware logic here&#10;if (condition) {&#10;  return NextResponse.redirect(new URL('/custom', request.url))&#10;}"
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button
          variant="outline"
          onClick={onCancel}
          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
        >
          Cancel
        </Button>
        <Button onClick={() => onSave(formData)} className="bg-purple-600 hover:bg-purple-700 text-white">
          {initialData ? "Update Route" : "Add Route"}
        </Button>
      </div>
    </div>
  )
}
