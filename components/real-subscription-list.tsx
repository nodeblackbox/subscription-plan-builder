"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, ExternalLink, Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Subscription } from "@/lib/types"

export default function RealSubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null)
  const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const fetchSubscriptions = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/stripe/subscriptions")
      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to fetch subscriptions")
      }

      setSubscriptions(data.subscriptions)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const createCheckoutSession = async (priceId: string) => {
    try {
      setCheckoutLoading(priceId)
      setCheckoutUrl(null)

      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          priceId,
          mode: "subscription",
          successUrl: `${window.location.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancelUrl: `${window.location.origin}/canceled`,
        }),
      })

      const data = await response.json()

      if (!data.success) {
        throw new Error(data.error || "Failed to create checkout session")
      }

      setCheckoutUrl(data.url)
      setDialogOpen(true)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setCheckoutLoading(null)
    }
  }

  const formatInterval = (subscription: Subscription) => {
    const price = subscription.items.data[0]?.price
    if (!price?.recurring) return "One-time"

    const interval = price.recurring.interval
    const count = price.recurring.interval_count

    if (count === 1) {
      switch (interval) {
        case "day":
          return "Daily"
        case "week":
          return "Weekly"
        case "month":
          return "Monthly"
        case "year":
          return "Yearly"
        default:
          return `Every ${interval}`
      }
    }
    return `Every ${count} ${interval}${count > 1 ? "s" : ""}`
  }

  const formatPrice = (subscription: Subscription) => {
    const price = subscription.items.data[0]?.price
    const amount = price?.unit_amount ? price.unit_amount / 100 : 0
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "usd",
    }).format(amount)
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Active</Badge>
      case "trialing":
        return <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30">Trial</Badge>
      case "past_due":
        return <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">Past Due</Badge>
      case "canceled":
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

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center p-8 border rounded-lg bg-muted/20">
        <p className="text-muted-foreground">
          No subscription plans found. Create your first plan in Stripe Dashboard.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.map((subscription) => {
          const price = subscription.items.data[0]?.price
          const product = typeof price?.product === "object" ? price.product : null

          return (
            <div
              key={subscription.id}
              className="border border-white/20 rounded-lg overflow-hidden flex flex-col bg-white/5"
            >
              <div className="aspect-video relative bg-muted">
                {product?.images && product.images[0] ? (
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    <span className="text-white">No image</span>
                  </div>
                )}
              </div>
              <div className="p-4 flex-grow">
                <h3 className="font-semibold line-clamp-1 text-white">
                  {product?.name || `Subscription ${subscription.id.substring(0, 8)}`}
                </h3>
                <p className="text-sm text-gray-300 line-clamp-2 mt-1">{product?.description || "No description"}</p>
                <div className="flex flex-wrap gap-2 mt-3 mb-2">
                  <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                    {formatInterval(subscription)}
                  </Badge>
                  {getStatusBadge(subscription.status)}
                  <Badge variant="outline" className="text-xs border-white/20 text-gray-300">
                    Customer:{" "}
                    {typeof subscription.customer === "string" ? subscription.customer.substring(0, 8) + "..." : "N/A"}
                  </Badge>
                </div>
              </div>
              <div className="p-4 border-t border-white/20">
                <div className="w-full flex justify-between items-center mb-3">
                  <span className="font-bold text-lg text-white">{formatPrice(subscription)}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => {
                      navigator.clipboard.writeText(subscription.id)
                    }}
                  >
                    Copy ID
                  </Button>
                </div>
                <div className="flex space-x-2">
                  <Button
                    className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={() =>
                      window.open(`https://dashboard.stripe.com/subscriptions/${subscription.id}`, "_blank")
                    }
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View in Stripe
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-slate-900 border-white/20">
          <DialogHeader>
            <DialogTitle className="text-white">Checkout URL Generated</DialogTitle>
            <DialogDescription className="text-gray-300">
              Your checkout URL has been generated. You can use this URL to test the subscription checkout flow.
            </DialogDescription>
          </DialogHeader>
          <div className="bg-muted p-3 rounded-md overflow-x-auto">
            <code className="text-xs break-all text-white">{checkoutUrl}</code>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="sm:flex-1 border-white/20 text-white hover:bg-white/10 bg-transparent"
              onClick={() => {
                if (checkoutUrl) {
                  navigator.clipboard.writeText(checkoutUrl)
                }
              }}
            >
              Copy URL
            </Button>
            <Button
              className="sm:flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              onClick={() => {
                if (checkoutUrl) {
                  window.open(checkoutUrl, "_blank")
                }
              }}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Checkout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
