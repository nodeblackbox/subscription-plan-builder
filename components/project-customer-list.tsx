"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, Loader2, Search, UserPlus, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ProjectCustomerListProps {
  projectId: string
  projectName: string
}

// Mock customer data for a specific project
const mockCustomers = [
  {
    id: "cus_1",
    name: "John Doe",
    email: "john@taskflow.com",
    plan: "Pro",
    status: "active",
    credits: 1250,
    joined: "2024-01-15",
    lastActive: "2024-01-20",
    stripeCustomerId: "cus_stripe_123",
    totalSpent: 299,
  },
  {
    id: "cus_2",
    name: "Jane Smith",
    email: "jane@company.com",
    plan: "Basic",
    status: "trial",
    credits: 500,
    joined: "2024-01-18",
    lastActive: "2024-01-19",
    stripeCustomerId: "cus_stripe_456",
    totalSpent: 0,
  },
]

export function ProjectCustomerList({ projectId, projectName }: ProjectCustomerListProps) {
  const [customers, setCustomers] = useState(mockCustomers)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      // This would be an API call to fetch customers for the specific project
      // const response = await fetch(`/api/projects/${projectId}/customers`)
      // const data = await response.json()
      // setCustomers(data.customers)

      // Simulating API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setCustomers(mockCustomers)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCustomers()
  }, [projectId])

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || customer.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
      case "trial":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Trial</Badge>
      case "cancelled":
        return <Badge className="bg-red-500/20 text-red-300 border-red-500/30">Cancelled</Badge>
      default:
        return <Badge className="bg-gray-500/20 text-gray-300 border-gray-500/30">{status}</Badge>
    }
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
          <CardTitle className="text-white">Customers - {projectName}</CardTitle>
          <CardDescription className="text-gray-300">Manage customers for this specific project</CardDescription>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700 text-white">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Customer
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
              placeholder="Search customers..."
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
              <SelectItem value="trial" className="text-white">
                Trial
              </SelectItem>
              <SelectItem value="cancelled" className="text-white">
                Cancelled
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredCustomers.length === 0 ? (
          <div className="text-center p-8 border rounded-lg bg-muted/20">
            <p className="text-muted-foreground">No customers found for this project.</p>
          </div>
        ) : (
          <div className="rounded-md border border-white/20">
            <Table>
              <TableHeader>
                <TableRow className="border-white/20">
                  <TableHead className="text-gray-300">Customer</TableHead>
                  <TableHead className="text-gray-300">Plan</TableHead>
                  <TableHead className="text-gray-300">Status</TableHead>
                  <TableHead className="text-gray-300">Credits</TableHead>
                  <TableHead className="text-gray-300">Total Spent</TableHead>
                  <TableHead className="text-gray-300">Joined</TableHead>
                  <TableHead className="text-right text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCustomers.map((customer) => (
                  <TableRow key={customer.id} className="border-white/20 hover:bg-white/5">
                    <TableCell>
                      <div>
                        <div className="font-medium text-white">{customer.name}</div>
                        <div className="text-sm text-gray-400">{customer.email}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-white">{customer.plan}</TableCell>
                    <TableCell>{getStatusBadge(customer.status)}</TableCell>
                    <TableCell className="text-white">{customer.credits.toLocaleString()}</TableCell>
                    <TableCell className="text-white">${customer.totalSpent}</TableCell>
                    <TableCell className="text-white">{new Date(customer.joined).toLocaleDateString()}</TableCell>
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
                            window.open(`https://dashboard.stripe.com/customers/${customer.stripeCustomerId}`, "_blank")
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
