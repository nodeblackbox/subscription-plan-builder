"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, ExternalLink, Key, Webhook, CreditCard } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface EnvSetupModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function EnvSetupModal({ open, onOpenChange }: EnvSetupModalProps) {
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  const copyToClipboard = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(keyName)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  const envVars = [
    {
      name: "STRIPE_SECRET_KEY",
      value: process.env.STRIPE_SECRET_KEY || "sk_test_...",
      description: "Your Stripe secret key for server-side operations",
      icon: Key,
      color: "bg-red-500/20 text-red-300 border-red-500/30",
    },
    {
      name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY",
      value: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_...",
      description: "Your Stripe publishable key for client-side operations",
      icon: CreditCard,
      color: "bg-blue-500/20 text-blue-300 border-blue-500/30",
    },
    {
      name: "STRIPE_WEBHOOK_SECRET",
      value: process.env.STRIPE_WEBHOOK_SECRET || "whsec_...",
      description: "Your Stripe webhook secret for verifying webhook events",
      icon: Webhook,
      color: "bg-green-500/20 text-green-300 border-green-500/30",
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-slate-900 border-white/20">
        <DialogHeader>
          <DialogTitle className="text-white text-2xl">Stripe Environment Setup</DialogTitle>
          <DialogDescription className="text-gray-300">
            Configure your Stripe API keys to enable real data integration
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Environment Status */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Current Environment Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {envVars.map((envVar) => {
                const isConfigured = process.env[envVar.name] && process.env[envVar.name] !== ""
                const Icon = envVar.icon

                return (
                  <div key={envVar.name} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="text-white font-medium">{envVar.name}</h3>
                        <p className="text-gray-400 text-sm">{envVar.description}</p>
                      </div>
                    </div>
                    <Badge
                      className={
                        isConfigured
                          ? "bg-green-500/20 text-green-300 border-green-500/30"
                          : "bg-red-500/20 text-red-300 border-red-500/30"
                      }
                    >
                      {isConfigured ? "Configured" : "Missing"}
                    </Badge>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Setup Instructions</CardTitle>
              <CardDescription className="text-gray-300">
                Follow these steps to configure your Stripe integration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Get API Keys */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    1
                  </div>
                  <h3 className="text-white font-semibold">Get your Stripe API Keys</h3>
                </div>
                <div className="ml-8 space-y-3">
                  <p className="text-gray-300 text-sm">Go to your Stripe Dashboard and copy your API keys:</p>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => window.open("https://dashboard.stripe.com/apikeys", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Stripe API Keys
                  </Button>
                </div>
              </div>

              {/* Step 2: Environment Variables */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    2
                  </div>
                  <h3 className="text-white font-semibold">Add Environment Variables</h3>
                </div>
                <div className="ml-8 space-y-4">
                  <p className="text-gray-300 text-sm">
                    Add these environment variables to your{" "}
                    <code className="bg-white/10 px-2 py-1 rounded">.env.local</code> file:
                  </p>

                  {envVars.map((envVar) => (
                    <div key={envVar.name} className="space-y-2">
                      <Label className="text-white text-sm">{envVar.name}</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          className="bg-white/10 border-white/20 text-white font-mono text-sm"
                          value={`${envVar.name}=${envVar.value}`}
                          readOnly
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                          onClick={() => copyToClipboard(`${envVar.name}=${envVar.value}`, envVar.name)}
                        >
                          {copiedKey === envVar.name ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 3: Webhook Setup */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    3
                  </div>
                  <h3 className="text-white font-semibold">Setup Webhooks</h3>
                </div>
                <div className="ml-8 space-y-3">
                  <p className="text-gray-300 text-sm">Create a webhook endpoint in your Stripe Dashboard:</p>
                  <div className="space-y-2">
                    <Label className="text-white text-sm">Webhook URL</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        className="bg-white/10 border-white/20 text-white font-mono text-sm"
                        value={`${window.location.origin}/api/webhooks/stripe`}
                        readOnly
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                        onClick={() => copyToClipboard(`${window.location.origin}/api/webhooks/stripe`, "webhook-url")}
                      >
                        {copiedKey === "webhook-url" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                    onClick={() => window.open("https://dashboard.stripe.com/webhooks", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Setup Webhooks in Stripe
                  </Button>
                </div>
              </div>

              {/* Step 4: Restart */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    4
                  </div>
                  <h3 className="text-white font-semibold">Restart Your Application</h3>
                </div>
                <div className="ml-8">
                  <p className="text-gray-300 text-sm">
                    After adding the environment variables, restart your development server to load the new
                    configuration.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Important Notes */}
          <Alert className="bg-yellow-500/10 border-yellow-500/30">
            <AlertDescription className="text-yellow-200">
              <strong>Important:</strong> Make sure to use test keys during development and switch to live keys only in
              production. Never commit your secret keys to version control.
            </AlertDescription>
          </Alert>

          <div className="flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              Close
            </Button>
            <Button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              Refresh Page
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
