"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, Lock, Plus, Trash2, Eye, Settings } from "lucide-react"

interface AuthMiddlewareProps {
  data: any
  setData: (data: any) => void
}

const defaultRoute = {
  id: Date.now(),
  path: "/dashboard",
  protection: "authenticated",
  allowedPlans: [],
  redirectTo: "/auth/signin",
  description: "Dashboard page",
}

const protectionTypes = [
  { value: "public", label: "Public", description: "Anyone can access" },
  { value: "authenticated", label: "Authenticated", description: "Requires login" },
  { value: "subscription", label: "Subscription", description: "Requires active subscription" },
  { value: "plan_specific", label: "Plan Specific", description: "Specific subscription plans only" },
  { value: "admin", label: "Admin Only", description: "Admin users only" },
]

export function AuthMiddleware({ data, setData }: AuthMiddlewareProps) {
  const [routes, setRoutes] = useState(data.protectedRoutes || [])
  const [plans] = useState(data.plans || [])

  const updateRoutes = (updatedRoutes: any[]) => {
    setRoutes(updatedRoutes)
    setData({ ...data, protectedRoutes: updatedRoutes })
  }

  const addRoute = () => {
    const newRoute = { ...defaultRoute, id: Date.now() }
    updateRoutes([...routes, newRoute])
  }

  const updateRoute = (routeId: number, updates: any) => {
    const updatedRoutes = routes.map((route: any) => (route.id === routeId ? { ...route, ...updates } : route))
    updateRoutes(updatedRoutes)
  }

  const removeRoute = (routeId: number) => {
    const updatedRoutes = routes.filter((route: any) => route.id !== routeId)
    updateRoutes(updatedRoutes)
  }

  const togglePlanAccess = (routeId: number, planName: string) => {
    const route = routes.find((r: any) => r.id === routeId)
    if (route) {
      const currentPlans = route.allowedPlans || []
      const updatedPlans = currentPlans.includes(planName)
        ? currentPlans.filter((p: string) => p !== planName)
        : [...currentPlans, planName]
      updateRoute(routeId, { allowedPlans: updatedPlans })
    }
  }

  const getProtectionBadge = (protection: string) => {
    switch (protection) {
      case "public":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Public</Badge>
      case "authenticated":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Auth Required</Badge>
      case "subscription":
        return <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Subscription</Badge>
      case "plan_specific":
        return <Badge className="bg-orange-500/20 text-orange-300 border-orange-500/30">Plan Specific</Badge>
      case "admin":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Admin Only</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{protection}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Route Protection</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Configure which pages require authentication and specific subscription plans
        </p>
      </div>

      {/* Route Protection Configuration */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                Protected Routes
              </CardTitle>
              <CardDescription className="text-gray-300">
                Define access control for your application routes
              </CardDescription>
            </div>
            <Button
              onClick={addRoute}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Route
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {routes.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">No Protected Routes</h3>
              <p className="text-gray-400 mb-6">Add routes to configure access control</p>
              <Button
                onClick={addRoute}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Route
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {routes.map((route: any) => (
                <Card key={route.id} className="bg-white/10 border-white/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Lock className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white text-lg">{route.path}</CardTitle>
                          <CardDescription className="text-gray-300">{route.description}</CardDescription>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getProtectionBadge(route.protection)}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeRoute(route.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-white">Route Path</Label>
                        <Input
                          value={route.path}
                          onChange={(e) => updateRoute(route.id, { path: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="/dashboard"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Protection Type</Label>
                        <Select
                          value={route.protection}
                          onValueChange={(protection) => updateRoute(route.id, { protection })}
                        >
                          <SelectTrigger className="bg-white/10 border-white/20 text-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-slate-800 border-white/20">
                            {protectionTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value} className="text-white">
                                <div>
                                  <div className="font-medium">{type.label}</div>
                                  <div className="text-xs text-gray-400">{type.description}</div>
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
                          value={route.description}
                          onChange={(e) => updateRoute(route.id, { description: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="Page description"
                        />
                      </div>
                      <div>
                        <Label className="text-white">Redirect To</Label>
                        <Input
                          value={route.redirectTo}
                          onChange={(e) => updateRoute(route.id, { redirectTo: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="/auth/signin"
                        />
                      </div>
                    </div>

                    {(route.protection === "plan_specific" || route.protection === "subscription") &&
                      plans.length > 0 && (
                        <div>
                          <Label className="text-white mb-3 block">Allowed Plans</Label>
                          <div className="flex flex-wrap gap-2">
                            {plans.map((plan: any) => {
                              const isAllowed = (route.allowedPlans || []).includes(plan.name)
                              return (
                                <Button
                                  key={plan.id}
                                  variant="outline"
                                  size="sm"
                                  onClick={() => togglePlanAccess(route.id, plan.name)}
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
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Middleware Configuration */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Settings className="w-5 h-5 mr-2" />
            Middleware Settings
          </CardTitle>
          <CardDescription className="text-gray-300">Global authentication and authorization settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Enable Route Protection</Label>
                  <p className="text-sm text-gray-400">Activate middleware for route protection</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Strict Mode</Label>
                  <p className="text-sm text-gray-400">Deny access by default for undefined routes</p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-white">Session Validation</Label>
                  <p className="text-sm text-gray-400">Validate user sessions on each request</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-white">Default Redirect</Label>
                <Input
                  defaultValue="/auth/signin"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="/auth/signin"
                />
              </div>

              <div>
                <Label className="text-white">Admin Role</Label>
                <Input
                  defaultValue="admin"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="admin"
                />
              </div>

              <div>
                <Label className="text-white">Session Cookie Name</Label>
                <Input
                  defaultValue="next-auth.session-token"
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="session-token"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Generated Middleware Preview */}
      {routes.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Generated Middleware</CardTitle>
            <CardDescription className="text-gray-300">
              Preview of the middleware.ts file that will be generated
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-300 overflow-x-auto">
              <pre>{`import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const { pathname } = request.nextUrl

  // Protected routes configuration
  const protectedRoutes = ${JSON.stringify(
    routes.map((r: any) => ({
      path: r.path,
      protection: r.protection,
      allowedPlans: r.allowedPlans,
      redirectTo: r.redirectTo,
    })),
    null,
    2,
  )}

  // Check if current path matches any protected route
  const matchedRoute = protectedRoutes.find(route => 
    pathname.startsWith(route.path)
  )

  if (matchedRoute) {
    // Handle different protection types
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
        if (!token || token.role !== 'admin') {
          return NextResponse.redirect(new URL('/', request.url))
        }
        break
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [${routes.map((r: any) => `'${r.path}/:path*'`).join(", ")}]
}`}</pre>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
