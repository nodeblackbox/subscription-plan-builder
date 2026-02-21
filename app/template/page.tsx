"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, Github, Shield, Users, CreditCard, Database, Key, Zap, CheckCircle } from "lucide-react"

interface TemplateGeneratorProps {
  data: any
  setData: (data: any) => void
}

const authProviders = [
  { id: "nextauth", name: "NextAuth.js", description: "Complete auth solution", icon: Shield },
  { id: "supabase", name: "Supabase Auth", description: "Backend-as-a-Service", icon: Database },
  { id: "clerk", name: "Clerk", description: "User management platform", icon: Users },
  { id: "auth0", name: "Auth0", description: "Identity platform", icon: Key },
]

const paymentProviders = [
  { id: "stripe", name: "Stripe", description: "Complete payment solution", icon: CreditCard },
  { id: "paddle", name: "Paddle", description: "Merchant of record", icon: Zap },
]

const features = [
  { id: "auth", name: "Authentication System", description: "User login/signup with multiple providers" },
  { id: "subscriptions", name: "Subscription Management", description: "Plan upgrades, downgrades, cancellations" },
  { id: "admin", name: "Admin Dashboard", description: "Manage users, subscriptions, and analytics" },
  { id: "billing", name: "Billing Portal", description: "Customer billing history and invoices" },
  { id: "webhooks", name: "Webhook Handlers", description: "Process payment and subscription events" },
  { id: "middleware", name: "Route Protection", description: "Protect pages based on subscription plans" },
  { id: "database", name: "Database Schema", description: "Complete database setup with migrations" },
  { id: "emails", name: "Email Templates", description: "Transactional emails for all events" },
]

export default function TemplateGenerator({ data, setData }: TemplateGeneratorProps) {
  const [templateConfig, setTemplateConfig] = useState({
    projectName: "my-saas-app",
    authProvider: "nextauth",
    paymentProvider: "stripe",
    database: "postgresql",
    features: ["auth", "subscriptions", "admin", "billing"],
    deployment: "vercel",
    styling: "tailwind",
  })

  const updateConfig = (updates: any) => {
    setTemplateConfig({ ...templateConfig, ...updates })
  }

  const toggleFeature = (featureId: string) => {
    const currentFeatures = templateConfig.features
    const updatedFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter((f) => f !== featureId)
      : [...currentFeatures, featureId]
    updateConfig({ features: updatedFeatures })
  }

  const generateTemplate = () => {
    // This would trigger the template generation
    console.log("Generating template with config:", templateConfig)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Generate Next.js Template</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Get a complete SaaS template with authentication, subscriptions, and admin dashboard ready to deploy
        </p>
      </div>

      <Tabs defaultValue="config" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="config" className="data-[state=active]:bg-white/20 text-white">
            Configuration
          </TabsTrigger>
          <TabsTrigger value="features" className="data-[state=active]:bg-white/20 text-white">
            Features
          </TabsTrigger>
          <TabsTrigger value="preview" className="data-[state=active]:bg-white/20 text-white">
            Preview
          </TabsTrigger>
          <TabsTrigger value="deploy" className="data-[state=active]:bg-white/20 text-white">
            Deploy
          </TabsTrigger>
        </TabsList>

        <TabsContent value="config" className="space-y-6">
          {/* Project Configuration */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Project Configuration</CardTitle>
              <CardDescription className="text-gray-300">Configure your SaaS application settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-white">Project Name</Label>
                  <Input
                    value={templateConfig.projectName}
                    onChange={(e) => updateConfig({ projectName: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="my-saas-app"
                  />
                </div>
                <div>
                  <Label className="text-white">Database</Label>
                  <Select value={templateConfig.database} onValueChange={(database) => updateConfig({ database })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      <SelectItem value="postgresql" className="text-white">
                        PostgreSQL
                      </SelectItem>
                      <SelectItem value="mysql" className="text-white">
                        MySQL
                      </SelectItem>
                      <SelectItem value="sqlite" className="text-white">
                        SQLite
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Authentication Provider */}
              <div>
                <Label className="text-white mb-4 block">Authentication Provider</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {authProviders.map((provider) => {
                    const Icon = provider.icon
                    const isSelected = templateConfig.authProvider === provider.id

                    return (
                      <Card
                        key={provider.id}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? "bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/30"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                        onClick={() => updateConfig({ authProvider: provider.id })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{provider.name}</h3>
                              <p className="text-gray-400 text-sm">{provider.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>

              {/* Payment Provider */}
              <div>
                <Label className="text-white mb-4 block">Payment Provider</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  {paymentProviders.map((provider) => {
                    const Icon = provider.icon
                    const isSelected = templateConfig.paymentProvider === provider.id

                    return (
                      <Card
                        key={provider.id}
                        className={`cursor-pointer transition-all ${
                          isSelected
                            ? "bg-purple-500/20 border-purple-500/50 ring-2 ring-purple-500/30"
                            : "bg-white/5 border-white/10 hover:bg-white/10"
                        }`}
                        onClick={() => updateConfig({ paymentProvider: provider.id })}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                              <Icon className="w-5 h-5 text-white" />
                            </div>
                            <div>
                              <h3 className="text-white font-semibold">{provider.name}</h3>
                              <p className="text-gray-400 text-sm">{provider.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Template Features</CardTitle>
              <CardDescription className="text-gray-300">
                Select the features you want included in your template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {features.map((feature) => {
                  const isSelected = templateConfig.features.includes(feature.id)

                  return (
                    <Card
                      key={feature.id}
                      className={`cursor-pointer transition-all ${
                        isSelected
                          ? "bg-purple-500/20 border-purple-500/50"
                          : "bg-white/5 border-white/10 hover:bg-white/10"
                      }`}
                      onClick={() => toggleFeature(feature.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-white font-semibold">{feature.name}</h3>
                            <p className="text-gray-400 text-sm">{feature.description}</p>
                          </div>
                          <Switch checked={isSelected} readOnly />
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Template Preview</CardTitle>
              <CardDescription className="text-gray-300">
                Preview of your generated SaaS template structure
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 rounded-lg p-4 text-sm font-mono text-gray-300">
                <div className="space-y-1">
                  <div className="text-blue-400">📁 {templateConfig.projectName}/</div>
                  <div className="ml-4">📁 app/</div>
                  <div className="ml-8">📄 layout.tsx</div>
                  <div className="ml-8">📄 page.tsx</div>
                  {templateConfig.features.includes("auth") && (
                    <>
                      <div className="ml-8">📁 auth/</div>
                      <div className="ml-12">📄 signin/page.tsx</div>
                      <div className="ml-12">📄 signup/page.tsx</div>
                      <div className="ml-12">📄 callback/page.tsx</div>
                    </>
                  )}
                  {templateConfig.features.includes("admin") && (
                    <>
                      <div className="ml-8">📁 admin/</div>
                      <div className="ml-12">📄 dashboard/page.tsx</div>
                      <div className="ml-12">📄 users/page.tsx</div>
                      <div className="ml-12">📄 subscriptions/page.tsx</div>
                    </>
                  )}
                  {templateConfig.features.includes("billing") && (
                    <>
                      <div className="ml-8">📁 billing/</div>
                      <div className="ml-12">📄 page.tsx</div>
                      <div className="ml-12">📄 success/page.tsx</div>
                      <div className="ml-12">📄 cancel/page.tsx</div>
                    </>
                  )}
                  <div className="ml-8">📁 api/</div>
                  {templateConfig.features.includes("webhooks") && (
                    <>
                      <div className="ml-12">📁 webhooks/</div>
                      <div className="ml-16">📄 stripe/route.ts</div>
                    </>
                  )}
                  <div className="ml-12">📁 auth/</div>
                  <div className="ml-16">📄 [...nextauth]/route.ts</div>
                  <div className="ml-4">📁 components/</div>
                  <div className="ml-8">📁 ui/</div>
                  <div className="ml-8">📄 subscription-plans.tsx</div>
                  <div className="ml-8">📄 auth-provider.tsx</div>
                  {templateConfig.features.includes("admin") && <div className="ml-8">📄 admin-dashboard.tsx</div>}
                  <div className="ml-4">📁 lib/</div>
                  <div className="ml-8">📄 auth.ts</div>
                  <div className="ml-8">📄 db.ts</div>
                  <div className="ml-8">📄 stripe.ts</div>
                  {templateConfig.features.includes("middleware") && <div className="ml-8">📄 middleware.ts</div>}
                  <div className="ml-4">📄 .env.example</div>
                  <div className="ml-4">📄 package.json</div>
                  <div className="ml-4">📄 README.md</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Feature Summary */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Included Features</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {templateConfig.features.map((featureId) => {
                  const feature = features.find((f) => f.id === featureId)
                  if (!feature) return null

                  return (
                    <div key={featureId} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div>
                        <h4 className="text-white font-medium">{feature.name}</h4>
                        <p className="text-gray-400 text-sm">{feature.description}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="deploy" className="space-y-6">
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Generate & Deploy</CardTitle>
              <CardDescription className="text-gray-300">
                Generate your template and deploy to your preferred platform
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={generateTemplate}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-auto p-6 flex-col"
                >
                  <Download className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Download ZIP</span>
                  <span className="text-xs opacity-80">Get template files</span>
                </Button>

                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent h-auto p-6 flex-col"
                >
                  <Github className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Create Repository</span>
                  <span className="text-xs opacity-80">Push to GitHub</span>
                </Button>

                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent h-auto p-6 flex-col"
                >
                  <Zap className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Deploy to Vercel</span>
                  <span className="text-xs opacity-80">One-click deploy</span>
                </Button>
              </div>

              {/* Setup Instructions */}
              <Card className="bg-white/10 border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg">Setup Instructions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        1
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Environment Variables</h4>
                        <p className="text-gray-400 text-sm">Configure your .env file with API keys and database URL</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        2
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Database Setup</h4>
                        <p className="text-gray-400 text-sm">Run migrations to set up your database schema</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        3
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Payment Configuration</h4>
                        <p className="text-gray-400 text-sm">Set up your Stripe products and webhooks</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        4
                      </div>
                      <div>
                        <h4 className="text-white font-medium">Deploy</h4>
                        <p className="text-gray-400 text-sm">Deploy to Vercel, Netlify, or your preferred platform</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
