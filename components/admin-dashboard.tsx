"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  CreditCard,
  TrendingUp,
  DollarSign,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react"
import { EnvSetupModal } from "@/components/env-setup-modal"
import RealCustomerList from "@/components/real-customer-list"
import RealSubscriptionList from "@/components/real-subscription-list"
import RealOrderList from "@/components/real-order-list"

interface DashboardStats {
  totalCustomers: number
  activeSubscriptions: number
  monthlyRevenue: number
  churnRate: number
}

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const [stats, setStats] = useState<DashboardStats>({
    totalCustomers: 0,
    activeSubscriptions: 0,
    monthlyRevenue: 0,
    churnRate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date())

  const fetchStripeData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Check if Stripe keys are configured
      const hasStripeKeys = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY && process.env.STRIPE_SECRET_KEY

      if (!hasStripeKeys) {
        setError("Stripe API keys not configured. Please set up your environment variables.")
        setLoading(false)
        return
      }

      // Fetch customers
      const customersResponse = await fetch("/api/stripe/customers?limit=100")
      const customersData = await customersResponse.json()

      if (!customersData.success) {
        throw new Error(customersData.error || "Failed to fetch customers")
      }

      // Fetch subscriptions
      const subscriptionsResponse = await fetch("/api/stripe/subscriptions?limit=100")
      const subscriptionsData = await subscriptionsResponse.json()

      if (!subscriptionsData.success) {
        throw new Error(subscriptionsData.error || "Failed to fetch subscriptions")
      }

      // Fetch products for pricing info
      const productsResponse = await fetch("/api/stripe/products")
      const productsData = await productsResponse.json()

      // Calculate stats
      const totalCustomers = customersData.customers.length
      const activeSubscriptions = subscriptionsData.subscriptions.filter(
        (sub: any) => sub.status === "active" || sub.status === "trialing",
      ).length

      // Calculate monthly revenue from active subscriptions
      const monthlyRevenue = subscriptionsData.subscriptions
        .filter((sub: any) => sub.status === "active")
        .reduce((total: number, sub: any) => {
          const price = sub.items.data[0]?.price
          if (price && price.recurring?.interval === "month") {
            return total + (price.unit_amount || 0) / 100
          }
          return total
        }, 0)

      // Calculate churn rate (simplified)
      const canceledSubscriptions = subscriptionsData.subscriptions.filter(
        (sub: any) => sub.status === "canceled",
      ).length
      const churnRate = totalCustomers > 0 ? (canceledSubscriptions / totalCustomers) * 100 : 0

      setStats({
        totalCustomers,
        activeSubscriptions,
        monthlyRevenue,
        churnRate,
      })

      setLastRefresh(new Date())
    } catch (err: any) {
      console.error("Error fetching Stripe data:", err)
      setError(err.message || "Failed to fetch data from Stripe")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStripeData()
  }, [])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
            <CheckCircle className="w-3 h-3 mr-1" />
            Active
          </Badge>
        )
      case "trialing":
        return (
          <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Trial
          </Badge>
        )
      case "past_due":
        return (
          <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
            <AlertCircle className="w-3 h-3 mr-1" />
            Past Due
          </Badge>
        )
      case "canceled":
        return (
          <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
            <XCircle className="w-3 h-3 mr-1" />
            Canceled
          </Badge>
        )
      case "incomplete":
        return (
          <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">
            <Clock className="w-3 h-3 mr-1" />
            Incomplete
          </Badge>
        )
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>
    }
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
            <p className="text-gray-300">Real-time Stripe integration</p>
          </div>
          <div className="flex items-center space-x-4">
            <EnvSetupModal />
            <Button
              onClick={fetchStripeData}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>

        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-8 h-8 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-red-300">Connection Error</h3>
                <p className="text-red-400">{error}</p>
                <p className="text-red-400 text-sm mt-2">
                  Make sure your Stripe API keys are properly configured in your environment variables.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-gray-300">Real-time Stripe integration</p>
          <p className="text-gray-500 text-sm">Last updated: {lastRefresh.toLocaleTimeString()}</p>
        </div>
        <div className="flex items-center space-x-4">
          <EnvSetupModal />
          <Button
            onClick={fetchStripeData}
            disabled={loading}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh Data
          </Button>
          <Button
            onClick={() => window.open("https://dashboard.stripe.com", "_blank")}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
          >
            <ExternalLink className="w-4 h-4 mr-2" />
            View in Stripe
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/10">
          <TabsTrigger value="overview" className="data-[state=active]:bg-white/20 text-white">
            Overview
          </TabsTrigger>
          <TabsTrigger value="customers" className="data-[state=active]:bg-white/20 text-white">
            Customers ({stats.totalCustomers})
          </TabsTrigger>
          <TabsTrigger value="subscriptions" className="data-[state=active]:bg-white/20 text-white">
            Subscriptions ({stats.activeSubscriptions})
          </TabsTrigger>
          <TabsTrigger value="orders" className="data-[state=active]:bg-white/20 text-white">
            Orders
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Real-time Stats */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Customers</p>
                    <p className="text-2xl font-bold text-white">
                      {loading ? "..." : stats.totalCustomers.toLocaleString()}
                    </p>
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
                    <p className="text-2xl font-bold text-white">
                      {loading ? "..." : stats.activeSubscriptions.toLocaleString()}
                    </p>
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
                    <p className="text-2xl font-bold text-white">
                      {loading ? "..." : `$${stats.monthlyRevenue.toLocaleString()}`}
                    </p>
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
                    <p className="text-gray-400 text-sm">Churn Rate</p>
                    <p className="text-2xl font-bold text-white">
                      {loading ? "..." : `${stats.churnRate.toFixed(1)}%`}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Quick Actions</CardTitle>
              <CardDescription className="text-gray-300">Manage your Stripe integration and data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <Button
                  onClick={() => window.open("https://dashboard.stripe.com/customers", "_blank")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent h-auto p-4 flex-col"
                >
                  <Users className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Manage Customers</span>
                  <span className="text-xs opacity-80">View in Stripe Dashboard</span>
                </Button>
                <Button
                  onClick={() => window.open("https://dashboard.stripe.com/subscriptions", "_blank")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent h-auto p-4 flex-col"
                >
                  <CreditCard className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Manage Subscriptions</span>
                  <span className="text-xs opacity-80">View in Stripe Dashboard</span>
                </Button>
                <Button
                  onClick={() => window.open("https://dashboard.stripe.com/webhooks", "_blank")}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent h-auto p-4 flex-col"
                >
                  <RefreshCw className="w-8 h-8 mb-2" />
                  <span className="font-semibold">Configure Webhooks</span>
                  <span className="text-xs opacity-80">Set up real-time events</span>
                </Button>
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
      </Tabs>
    </div>
  )
}
