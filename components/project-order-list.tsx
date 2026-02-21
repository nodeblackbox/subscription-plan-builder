"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Loader2, Search, ExternalLink, Package } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectOrderListProps {
  projectId: string
  projectName: string
}

// Mock order data for a specific project
const mockOrders = [
  {
    id: "order_1",
    customer: "John Doe",
    customerEmail: "john@taskflow.com",
    status: "paid",
    amount: 29,
    currency: "usd",
    items: ["Pro Monthly Subscription"],
    created: "2024-01-15",
    stripeOrderId: "pi_stripe_123",
  },
  {
    id: "order_2",
    customer: "Jane Smith",
    customerEmail: "jane@company.com",
    status: "pending",
    amount: 9,
    currency: "usd",
    items: ["Basic Monthly Subscription"],
    created: "2024-01-18",
    stripeOrderId: "pi_stripe_456",
  },
]

export function ProjectOrderList({ projectId, projectName }: ProjectOrderListProps) {
  const [orders, setOrders] = useState(mockOrders)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchOrders = async () => {
    try {
      setLoading(true)
      // This would be an API call to fetch orders for the specific project
      // const response = await fetch(`/api/projects/${projectId}/orders`)
      // const data = await response.json()
      // setOrders(data.orders)

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOrders(mockOrders)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [projectId])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
      case "succeeded":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Paid</Badge>
      case "pending":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Pending</Badge>
      case "failed":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Failed</Badge>
      case "refunded":
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">Refunded</Badge>
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
      <CardHeader>
        <CardTitle className="text-white">Orders - {projectName}</CardTitle>
        <CardDescription className="text-gray-300">View and manage orders for this specific project</CardDescription>
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
              placeholder="Search orders..."
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
              <SelectItem value="paid" className="text-white">
                Paid
              </SelectItem>
              <SelectItem value="pending" className="text-white">
                Pending
              </SelectItem>
              <SelectItem value="failed" className="text-white">
                Failed
              </SelectItem>
              <SelectItem value="refunded" className="text-white">
                Refunded
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No orders found for this project.</p>
          </div>
        ) : (
          <div className="rounded-md border border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-gray-300">Order ID</TableHead>
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Items</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Amount</TableHead>
                  <TableHead className="text-gray-300">Date</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order.id} className="border-white/20 hover:bg-white/5">
                    <TableCell className="font-mono text-white text-sm">{order.id.substring(0, 12)}...</TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{order.customer}</div>
                        <div className="text-sm text-gray-400">{order.customerEmail}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="text-white text-sm">{order.items.join(", ")}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-white">{formatCurrency(order.amount, order.currency)}</TableCell>
                    <TableCell className="text-white">{new Date(order.created).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        >
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          onClick={() =>
                            window.open(`https://dashboard.stripe.com/payments/${order.stripeOrderId}`, "_blank")
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
