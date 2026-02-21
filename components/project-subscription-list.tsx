"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Loader2, Search, Plus, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectSubscriptionListProps {
  projectId: string
  projectName: string
}

// Mock subscription data for a specific project
const mockSubscriptions = [
  {
    id: "sub_1",
    customer: "John Doe",
    customerEmail: "john@taskflow.com",
    plan: "Pro Monthly",
    status: "active",
    amount: 29,
    currency: "usd",
    currentPeriodStart: "2024-01-15",
    currentPeriodEnd: "2024-02-15",
    stripeSubscriptionId: "sub_stripe_123",
    created: "2024-01-15",
  },
  {
    id: "sub_2",
    customer: "Jane Smith",
    customerEmail: "jane@company.com",
    plan: "Basic Monthly",
    status: "trialing",
    amount: 9,
    currency: "usd",
    currentPeriodStart: "2024-01-18",
    currentPeriodEnd: "2024-01-25",
    stripeSubscriptionId: "sub_stripe_456",
    created: "2024-01-18",
  },
]

export function ProjectSubscriptionList({ projectId, projectName }: ProjectSubscriptionListProps) {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      // This would be an API call to fetch subscriptions for the specific project
      // const response = await fetch(`/api/projects/${projectId}/subscriptions`)
      // const data = await response.json()
      // setSubscriptions(data.subscriptions)

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setSubscriptions(mockSubscriptions)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [projectId])

  const filteredSubscriptions = subscriptions.filter((subscription) => {
    const matchesSearch =
      subscription.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subscription.plan.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || subscription.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
      case "trialing":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Trial</Badge>
      case "past_due":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Past Due</Badge>
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="w-full bg-white/5 border-white/10">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-white">Subscriptions - {projectName}</CardTitle>
          <CardDescription className="text-gray-300">Manage subscriptions for this specific project</CardDescription>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <Plus className="h-4 w-4 mr-2" />
          Create Subscription
        </Button>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Search and Filters */}
        <div className="flex gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search subscriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
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
              <SelectItem value="trialing" className="text-white">
                Trial
              </SelectItem>
              <SelectItem value="past_due" className="text-white">
                Past Due
              </SelectItem>
              <SelectItem value="cancelled" className="text-white">
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredSubscriptions.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No subscriptions found for this project.</p>
          </div>
        ) : (
          <div className="rounded-md border border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Plan</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Current Period</TableHead>
                  <TableHead className="text-gray-300">Created</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSubscriptions.map((subscription) => (
                  <TableRow key={subscription.id} className="border-white/20 hover:bg-white/5">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{subscription.customer}</div>
                        <div className="text-sm text-gray-400">{subscription.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{subscription.plan}</TableCell>
                    <TableCell>{getStatusBadge(subscription.status)}</TableCell>
                    <TableCell className="text-white">
                      {formatCurrency(subscription.amount, subscription.currency)}/month
                    </TableCell>
                    <TableCell className="text-white">
                      <div className="text-sm">
                        <div>{new Date(subscription.currentPeriodStart).toLocaleDateString()}</div>
                        <div className="text-gray-400">
                          to {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{new Date(subscription.created).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          Manage
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          onClick={() =>
                            window.open(
                              `https://dashboard.stripe.com/subscriptions/${subscription.stripeSubscriptionId}`,
                              "_blank",
                            )
                          }
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
