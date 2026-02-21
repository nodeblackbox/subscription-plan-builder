"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Settings, Users, CreditCard, Package, BarChart3 } from "lucide-react"
import Link from "next/link"
import RealCustomerList from "@/components/real-customer-list"
import RealSubscriptionList from "@/components/real-subscription-list"
import RealOrderList from "@/components/real-order-list"

// Mock project data
const mockProject = {
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
}

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState("overview")
  const project = mockProject // In real app, fetch by params.id

  const stats = {
    totalCustomers: 1247,
    activeSubscriptions: 892,
    monthlyRevenue: 24580,
    totalOrders: 3456,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 text-white hover:bg-white/10 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Admin
              </Button>
            </Link>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white font-semibold">
                {project.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">{project.name}</h1>
                <p className="text-gray-300 text-sm">{project.domain}</p>
              </div>
            </div>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
            <Settings className="w-4 h-4 mr-2" />
            Project Settings
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-white/10">
            <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="customers" className="data-[state=active]:bg-white/20 text-white">
              <Users className="w-4 h-4 mr-2" />
              Customers
            </TabsTrigger>
            <TabsTrigger value="subscriptions" className="data-[state=active]:bg-white/20 text-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Subscriptions
            </TabsTrigger>
            <TabsTrigger value="orders" className="data-[state=active]:bg-white/20 text-white">
              <Package className="w-4 h-4 mr-2" />
              Orders
            </TabsTrigger>
            <TabsTrigger value="settings" className="data-[state=active]:bg-white/20 text-white">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Project Stats */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Customers</p>
                      <p className="text-2xl font-bold text-white">{stats.totalCustomers.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Active Subscriptions</p>
                      <p className="text-2xl font-bold text-white">{stats.activeSubscriptions.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Monthly Revenue</p>
                      <p className="text-2xl font-bold text-white">${stats.monthlyRevenue.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/5 border-white/10">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Orders</p>
                      <p className="text-2xl font-bold text-white">{stats.totalOrders.toLocaleString()}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Project Configuration */}
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Project Configuration</CardTitle>
                <CardDescription className="text-gray-300">
                  Key settings and integrations for {project.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">Stripe Integration</h3>
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-gray-300 text-sm">Account ID</p>
                        <p className="text-white font-mono text-sm">{project.stripeAccountId}</p>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-2">Domain</h3>
                      <div className="bg-white/10 rounded-lg p-4">
                        <p className="text-white">{project.domain}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-white font-medium mb-2">Features Enabled</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.features.map((feature) => (
                          <span
                            key={feature}
                            className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-sm"
                          >
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-white font-medium mb-2">Status</h3>
                      <div className="bg-white/10 rounded-lg p-4">
                        <span className="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm">
                          {project.status}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="customers" className="space-y-6">
            <RealCustomerList />
          </TabsContent>

          <TabsContent value="subscriptions" className="space-y-6">
            <RealSubscriptionList />
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <RealOrderList />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Project Settings</CardTitle>
                <CardDescription className="text-gray-300">
                  Configure settings specific to {project.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Settings className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Project Settings</h3>
                  <p className="text-gray-400 mb-6">
                    Configure project-specific settings, integrations, and permissions
                  </p>
                  <Button className="bg-purple-600 hover:bg-purple-700 text-white">Open Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
