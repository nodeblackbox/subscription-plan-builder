"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Loader2, Search, UserPlus, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { Customer } from "@/lib/types"

export default function RealCustomerList() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [hasMore, setHasMore] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchCustomers = async (startingAfter?: string) => {
    try {
      const params = new URLSearchParams()
      if (searchTerm) {
        params.append("email", searchTerm)
      }
      if (startingAfter) {
        params.append("starting_after", startingAfter)
        setLoadingMore(true)
      } else {
        setLoading(true)
      }

      const response = await fetch(`/api/stripe/customers?${params.toString()}`)
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch customers")
      }

      if (startingAfter) {
        setCustomers((prev) => [...prev, ...data.customers])
      } else {
        setCustomers(data.customers)
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
    fetchCustomers()
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    fetchCustomers()
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString()
  }

  const loadMore = () => {
    if (customers.length > 0) {
      fetchCustomers(customers[customers.length - 1].id)
    }
  }

  if (loading && customers.length === 0) {
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
          <CardTitle className="text-white">Stripe Customers</CardTitle>
          <CardDescription className="text-gray-300">Real customers from your Stripe account</CardDescription>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          New Customer
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

        <form onSubmit={handleSearch} className="flex gap-2 mb-4">
          <Input
            placeholder="Search by email..."
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

        {customers.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No customers found.</p>
          </div>
        ) : (
          <>
            <div className="rounded-md border border-white/20">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/20">
                    <TableHead className="text-gray-300">Name</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Created</TableHead>
                    <TableHead className="text-right text-gray-300">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {customers.map((customer) => (
                    <TableRow key={customer.id} className="border-white/20 hover:bg-white/5">
                      <TableCell className="font-medium text-white">{customer.name || "N/A"}</TableCell>
                      <TableCell className="text-white">{customer.email || "N/A"}</TableCell>
                      <TableCell className="text-white">{formatDate(customer.created)}</TableCell>
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
                              window.open(`https://dashboard.stripe.com/customers/${customer.id}`, "_blank")
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
