"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Loader2, Search, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import type { Order } from "@/lib/types"

export default function RealOrderList() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchOrders = async (startingAfter?: string) => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) {
        params.append("customer", searchTerm)
      }
      if (startingAfter) {
        params.append("starting_after", startingAfter)
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const response = await fetch(`/api/stripe/payment-intents?${params.toString()}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch orders")
      }

      if (startingAfter) {
        setOrders((prev) => [...prev, ...data.orders])
      } else {
        setOrders(data.orders)
      }
      setHasMore(data.has_more)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchOrders()
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const formatCurrency = (amount: number | null, currency: string) => {
    if (amount === null) return "N/A"
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "paid":
      case "complete":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "unpaid":
      case "incomplete":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "failed":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const loadMore = () => {
    if (orders.length > 0) {
      fetchOrders(orders[orders.length - 1].id)
    }
  }

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <Card className="w-full bg-white/5 border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Payment Intents (Orders)</CardTitle>
        <CardDescription className="text-gray-300">Real payment data from your Stripe account</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            placeholder="Search by customer ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          />
          <Button
            type="submit"
            variant="outline"
            className="flex items-center gap-2 border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </form>

        {orders.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No orders found.</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border border-white/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-gray-300">Order ID</TableHead>
                    <TableHead className="text-gray-300">Date</TableHead>
                    <TableHead className="text-gray-300">Customer</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-right text-gray-300">Amount</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id} className="border-white/20 hover:bg-white/5">
                      <TableCell className="font-medium text-white font-mono text-sm">
                        {order.id.substring(0, 12)}...
                      </TableCell>
                      <TableCell className="text-white">{formatDate(order.created)}</TableCell>
                      <TableCell className="text-white">
                        {order.customer ? (
                          <span className="font-mono text-sm">
                            {typeof order.customer === "string" ? order.customer.substring(0, 12) + "..." : "Customer"}
                          </span>
                        ) : (
                          "N/A"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(order.payment_status)}>{order.payment_status}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-white">
                        {formatCurrency(order.amount_total, order.currency)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          onClick={() => window.open(`https://dashboard.stripe.com/payments/${order.id}`, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            {hasMore && (
              <div className="mt-4 flex justify-center">
                <Button
                  onClick={loadMore}
                  disabled={loadingMore}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                >
                  {loadingMore ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    "Load More"
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}
