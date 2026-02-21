"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Coins, Zap, Settings, Plus, Trash2, Clock, Target, Check } from "lucide-react"
import React from "react"

interface CreditSystemBuilderProps {
  data: any
  setData: (data: any) => void
}

const creditTypes = [
  {
    id: "api_calls",
    name: "API Calls",
    icon: Zap,
    description: "REST API requests",
    unit: "calls",
    defaultCost: 0.001,
    workflows: ["rate_limiting", "usage_tracking", "overage_billing"],
  },
  {
    id: "ai_tokens",
    name: "AI Tokens",
    icon: Coins,
    description: "LLM token usage",
    unit: "tokens",
    defaultCost: 0.0001,
    workflows: ["token_counting", "model_pricing", "batch_processing"],
  },
  {
    id: "storage",
    name: "Storage GB",
    icon: Settings,
    description: "File storage space",
    unit: "GB",
    defaultCost: 0.1,
    workflows: ["storage_monitoring", "cleanup_automation", "tiered_storage"],
  },
  {
    id: "compute_hours",
    name: "Compute Hours",
    icon: Clock,
    description: "Processing time",
    unit: "hours",
    defaultCost: 0.5,
    workflows: ["resource_allocation", "auto_scaling", "job_queuing"],
  },
  {
    id: "bandwidth",
    name: "Bandwidth GB",
    icon: Target,
    description: "Data transfer",
    unit: "GB",
    defaultCost: 0.05,
    workflows: ["cdn_integration", "compression", "caching"],
  },
]

const workflowTemplates = {
  rate_limiting: {
    name: "Rate Limiting",
    description: "Control API request frequency",
    settings: ["requests_per_minute", "burst_allowance", "cooldown_period"],
  },
  usage_tracking: {
    name: "Usage Tracking",
    description: "Monitor and log credit consumption",
    settings: ["real_time_tracking", "daily_reports", "alert_thresholds"],
  },
  overage_billing: {
    name: "Overage Billing",
    description: "Handle usage beyond allocated credits",
    settings: ["overage_rate", "billing_frequency", "notification_triggers"],
  },
  token_counting: {
    name: "Token Counting",
    description: "Accurate AI token measurement",
    settings: ["counting_method", "model_multipliers", "batch_optimization"],
  },
}

export function CreditSystemBuilder({ data, setData }: CreditSystemBuilderProps) {
  const [creditSystem, setCreditSystem] = useState(
    data.creditSystem || {
      enabled: true,
      creditTypes: [],
      packages: [],
      rollover: true,
      expiration: 30,
      workflows: {},
      apiEndpoints: [],
      billingSettings: {
        currency: "USD",
        taxRate: 0,
        invoiceFrequency: "monthly",
      },
    },
  )

  const updateCreditSystem = (updates: any) => {
    const updated = { ...creditSystem, ...updates }
    setCreditSystem(updated)
    setData({ ...data, creditSystem: updated })
  }

  const addCreditType = (typeId: string) => {
    const creditType = creditTypes.find((t) => t.id === typeId)
    if (creditType && !creditSystem.creditTypes?.find((ct: any) => ct.id === typeId)) {
      const newCreditType = {
        id: typeId,
        name: creditType.name,
        description: creditType.description,
        unit: creditType.unit,
        costPerCredit: creditType.defaultCost,
        minimumPurchase: 100,
        bulkDiscounts: [],
        workflows: creditType.workflows,
        apiEndpoints: [],
        usageTracking: true,
        rateLimiting: {
          enabled: false,
          requestsPerMinute: 60,
          burstAllowance: 10,
        },
      }
      updateCreditSystem({
        creditTypes: [...(creditSystem.creditTypes || []), newCreditType],
      })
    }
  }

  const updateCreditType = (typeId: string, updates: any) => {
    const updatedTypes = (creditSystem.creditTypes || []).map((ct: any) =>
      ct.id === typeId ? { ...ct, ...updates } : ct,
    )
    updateCreditSystem({ creditTypes: updatedTypes })
  }

  const removeCreditType = (typeId: string) => {
    const updatedTypes = (creditSystem.creditTypes || []).filter((ct: any) => ct.id !== typeId)
    updateCreditSystem({ creditTypes: updatedTypes })
  }

  const addPackage = () => {
    const newPackage = {
      id: Date.now(),
      name: "Credit Package",
      credits: 1000,
      price: 10,
      bonus: 0,
      popular: false,
      validityDays: 30,
      autoRenewal: false,
      stripeProductId: "",
      stripePriceId: "",
    }
    updateCreditSystem({
      packages: [...(creditSystem.packages || []), newPackage],
    })
  }

  const updatePackage = (packageId: number, updates: any) => {
    const updatedPackages = (creditSystem.packages || []).map((pkg: any) =>
      pkg.id === packageId ? { ...pkg, ...updates } : pkg,
    )
    updateCreditSystem({ packages: updatedPackages })
  }

  const removePackage = (packageId: number) => {
    const updatedPackages = (creditSystem.packages || []).filter((pkg: any) => pkg.id !== packageId)
    updateCreditSystem({ packages: updatedPackages })
  }

  const addApiEndpoint = (creditTypeId: string) => {
    const creditType = (creditSystem.creditTypes || []).find((ct: any) => ct.id === creditTypeId)
    if (creditType) {
      const newEndpoint = {
        id: Date.now(),
        path: "/api/v1/endpoint",
        method: "POST",
        creditsPerRequest: 1,
        description: "API endpoint description",
      }
      const updatedEndpoints = [...(creditType.apiEndpoints || []), newEndpoint]
      updateCreditType(creditTypeId, { apiEndpoints: updatedEndpoints })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Configure Credit System</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Set up flexible credit-based pricing for your API services with comprehensive workflows
        </p>
      </div>

      {/* Enable Credit System */}
      <Card className="bg-white/5 border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center">
                <Coins className="w-5 h-5 mr-2" />
                Credit System
              </CardTitle>
              <CardDescription className="text-gray-300">
                Enable pay-per-use pricing with credits and tokens
              </CardDescription>
            </div>
            <Switch checked={creditSystem.enabled} onCheckedChange={(enabled) => updateCreditSystem({ enabled })} />
          </div>
        </CardHeader>
      </Card>

      {creditSystem.enabled && (
        <>
          {/* Credit Types */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Credit Types & Workflows</CardTitle>
              <CardDescription className="text-gray-300">
                Define what users can spend credits on and how it works
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {creditTypes.map((type) => {
                  const Icon = type.icon
                  const isAdded = (creditSystem.creditTypes || []).find((ct: any) => ct.id === type.id)
                  return (
                    <Button
                      key={type.id}
                      variant="outline"
                      size="sm"
                      onClick={() => addCreditType(type.id)}
                      disabled={!!isAdded}
                      className={`border-white/20 text-white hover:bg-white/10 bg-transparent disabled:opacity-50 ${
                        isAdded ? "bg-purple-500/20 border-purple-500/30" : ""
                      }`}
                    >
                      <Icon className="w-4 h-4 mr-1" />
                      {type.name}
                      {isAdded && <Check className="w-4 h-4 ml-1" />}
                    </Button>
                  )
                })}
              </div>

              {(creditSystem.creditTypes || []).map((creditType: any) => (
                <Card key={creditType.id} className="bg-white/10 border-white/20">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-white text-lg flex items-center">
                        {creditTypes.find((ct) => ct.id === creditType.id)?.icon &&
                          React.createElement(creditTypes.find((ct) => ct.id === creditType.id)!.icon, {
                            className: "w-5 h-5 mr-2",
                          })}
                        {creditType.name}
                      </CardTitle>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeCreditType(creditType.id)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Tabs defaultValue="pricing" className="w-full">
                      <TabsList className="grid w-full grid-cols-4 bg-white/10">
                        <TabsTrigger value="pricing" className="data-[state=active]:bg-white/20 text-white">
                          Pricing
                        </TabsTrigger>
                        <TabsTrigger value="workflows" className="data-[state=active]:bg-white/20 text-white">
                          Workflows
                        </TabsTrigger>
                        <TabsTrigger value="endpoints" className="data-[state=active]:bg-white/20 text-white">
                          API Endpoints
                        </TabsTrigger>
                        <TabsTrigger value="limits" className="data-[state=active]:bg-white/20 text-white">
                          Limits
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="pricing" className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label className="text-white">Cost per {creditType.unit} ($)</Label>
                            <Input
                              type="number"
                              step="0.0001"
                              value={creditType.costPerCredit}
                              onChange={(e) =>
                                updateCreditType(creditType.id, {
                                  costPerCredit: Number.parseFloat(e.target.value) || 0,
                                })
                              }
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                          <div>
                            <Label className="text-white">Minimum Purchase</Label>
                            <Input
                              type="number"
                              value={creditType.minimumPurchase}
                              onChange={(e) =>
                                updateCreditType(creditType.id, {
                                  minimumPurchase: Number.parseInt(e.target.value) || 0,
                                })
                              }
                              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                            />
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="workflows" className="space-y-4 mt-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <Label className="text-white">Usage Tracking</Label>
                              <p className="text-sm text-gray-400">Monitor credit consumption in real-time</p>
                            </div>
                            <Switch
                              checked={creditType.usageTracking}
                              onCheckedChange={(usageTracking) => updateCreditType(creditType.id, { usageTracking })}
                            />
                          </div>

                          <div className="space-y-2">
                            <Label className="text-white">Rate Limiting</Label>
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-gray-400">Enable rate limiting</span>
                              <Switch
                                checked={creditType.rateLimiting?.enabled}
                                onCheckedChange={(enabled) =>
                                  updateCreditType(creditType.id, {
                                    rateLimiting: { ...creditType.rateLimiting, enabled },
                                  })
                                }
                              />
                            </div>
                            {creditType.rateLimiting?.enabled && (
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-white text-xs">Requests/min</Label>
                                  <Input
                                    type="number"
                                    value={creditType.rateLimiting?.requestsPerMinute || 60}
                                    onChange={(e) =>
                                      updateCreditType(creditType.id, {
                                        rateLimiting: {
                                          ...creditType.rateLimiting,
                                          requestsPerMinute: Number.parseInt(e.target.value) || 60,
                                        },
                                      })
                                    }
                                    className="bg-white/10 border-white/20 text-white text-xs"
                                  />
                                </div>
                                <div>
                                  <Label className="text-white text-xs">Burst allowance</Label>
                                  <Input
                                    type="number"
                                    value={creditType.rateLimiting?.burstAllowance || 10}
                                    onChange={(e) =>
                                      updateCreditType(creditType.id, {
                                        rateLimiting: {
                                          ...creditType.rateLimiting,
                                          burstAllowance: Number.parseInt(e.target.value) || 10,
                                        },
                                      })
                                    }
                                    className="bg-white/10 border-white/20 text-white text-xs"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="endpoints" className="space-y-4 mt-4">
                        <div className="flex items-center justify-between">
                          <Label className="text-white">API Endpoints</Label>
                          <Button
                            size="sm"
                            onClick={() => addApiEndpoint(creditType.id)}
                            className="bg-purple-600 hover:bg-purple-700 text-white"
                          >
                            <Plus className="w-4 h-4 mr-1" />
                            Add Endpoint
                          </Button>
                        </div>
                        <div className="space-y-2">
                          {(creditType.apiEndpoints || []).map((endpoint: any, index: number) => (
                            <div key={endpoint.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                              <div className="grid grid-cols-3 gap-2 mb-2">
                                <Select
                                  value={endpoint.method}
                                  onValueChange={(method) => {
                                    const updatedEndpoints = [...(creditType.apiEndpoints || [])]
                                    updatedEndpoints[index] = { ...endpoint, method }
                                    updateCreditType(creditType.id, { apiEndpoints: updatedEndpoints })
                                  }}
                                >
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white text-xs">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent className="bg-slate-800 border-white/20">
                                    <SelectItem value="GET" className="text-white">
                                      GET
                                    </SelectItem>
                                    <SelectItem value="POST" className="text-white">
                                      POST
                                    </SelectItem>
                                    <SelectItem value="PUT" className="text-white">
                                      PUT
                                    </SelectItem>
                                    <SelectItem value="DELETE" className="text-white">
                                      DELETE
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                <Input
                                  value={endpoint.path}
                                  onChange={(e) => {
                                    const updatedEndpoints = [...(creditType.apiEndpoints || [])]
                                    updatedEndpoints[index] = { ...endpoint, path: e.target.value }
                                    updateCreditType(creditType.id, { apiEndpoints: updatedEndpoints })
                                  }}
                                  className="bg-white/10 border-white/20 text-white text-xs"
                                  placeholder="/api/v1/endpoint"
                                />
                                <Input
                                  type="number"
                                  value={endpoint.creditsPerRequest}
                                  onChange={(e) => {
                                    const updatedEndpoints = [...(creditType.apiEndpoints || [])]
                                    updatedEndpoints[index] = {
                                      ...endpoint,
                                      creditsPerRequest: Number.parseInt(e.target.value) || 1,
                                    }
                                    updateCreditType(creditType.id, { apiEndpoints: updatedEndpoints })
                                  }}
                                  className="bg-white/10 border-white/20 text-white text-xs"
                                  placeholder="Credits"
                                />
                              </div>
                              <Input
                                value={endpoint.description}
                                onChange={(e) => {
                                  const updatedEndpoints = [...(creditType.apiEndpoints || [])]
                                  updatedEndpoints[index] = { ...endpoint, description: e.target.value }
                                  updateCreditType(creditType.id, { apiEndpoints: updatedEndpoints })
                                }}
                                className="bg-white/10 border-white/20 text-white text-xs"
                                placeholder="Endpoint description"
                              />
                            </div>
                          ))}
                        </div>
                      </TabsContent>

                      <TabsContent value="limits" className="space-y-4 mt-4">
                        <div>
                          <Label className="text-white">Daily Usage Limit</Label>
                          <Input
                            type="number"
                            placeholder="No limit"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <Label className="text-white">Monthly Usage Limit</Label>
                          <Input
                            type="number"
                            placeholder="No limit"
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </TabsContent>
                    </Tabs>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          {/* Credit Packages */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white">Credit Packages</CardTitle>
                  <CardDescription className="text-gray-300">
                    Create pre-defined credit bundles with discounts and Stripe integration
                  </CardDescription>
                </div>
                <Button
                  onClick={addPackage}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Package
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {(creditSystem.packages || []).map((pkg: any) => (
                  <Card key={pkg.id} className="bg-white/10 border-white/20">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between">
                        <Input
                          value={pkg.name}
                          onChange={(e) => updatePackage(pkg.id, { name: e.target.value })}
                          className="bg-transparent border-none text-white font-semibold p-0 h-auto placeholder:text-gray-400"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removePackage(pkg.id)}
                          className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-white text-xs">Credits</Label>
                          <Input
                            type="number"
                            value={pkg.credits}
                            onChange={(e) => updatePackage(pkg.id, { credits: Number.parseInt(e.target.value) || 0 })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-xs">Price ($)</Label>
                          <Input
                            type="number"
                            value={pkg.price}
                            onChange={(e) => updatePackage(pkg.id, { price: Number.parseFloat(e.target.value) || 0 })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-white text-xs">Bonus Credits</Label>
                          <Input
                            type="number"
                            value={pkg.bonus}
                            onChange={(e) => updatePackage(pkg.id, { bonus: Number.parseInt(e.target.value) || 0 })}
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                        <div>
                          <Label className="text-white text-xs">Valid Days</Label>
                          <Input
                            type="number"
                            value={pkg.validityDays}
                            onChange={(e) =>
                              updatePackage(pkg.id, { validityDays: Number.parseInt(e.target.value) || 30 })
                            }
                            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          />
                        </div>
                      </div>
                      <div>
                        <Label className="text-white text-xs">Stripe Product ID</Label>
                        <Input
                          value={pkg.stripeProductId || ""}
                          onChange={(e) => updatePackage(pkg.id, { stripeProductId: e.target.value })}
                          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                          placeholder="prod_..."
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label className="text-white text-xs">Mark as Popular</Label>
                        <Switch
                          checked={pkg.popular}
                          onCheckedChange={(popular) => updatePackage(pkg.id, { popular })}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Credit Settings */}
          <Card className="bg-white/5 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Credit Settings</CardTitle>
              <CardDescription className="text-gray-300">Configure how credits work in your system</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-white">Credit Rollover</Label>
                      <p className="text-sm text-gray-400">Allow unused credits to carry over</p>
                    </div>
                    <Switch
                      checked={creditSystem.rollover}
                      onCheckedChange={(rollover) => updateCreditSystem({ rollover })}
                    />
                  </div>

                  <div>
                    <Label className="text-white mb-4 block">Credit Expiration (days)</Label>
                    <div className="space-y-2">
                      <Slider
                        value={[creditSystem.expiration]}
                        onValueChange={([expiration]) => updateCreditSystem({ expiration })}
                        max={365}
                        min={7}
                        step={1}
                        className="w-full"
                      />
                      <div className="flex justify-between text-sm text-gray-400">
                        <span>7 days</span>
                        <span className="text-white font-medium">{creditSystem.expiration} days</span>
                        <span>365 days</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label className="text-white">Currency</Label>
                    <Select
                      value={creditSystem.billingSettings?.currency || "USD"}
                      onValueChange={(currency) =>
                        updateCreditSystem({
                          billingSettings: { ...creditSystem.billingSettings, currency },
                        })
                      }
                    >
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-white/20">
                        <SelectItem value="USD" className="text-white">
                          USD ($)
                        </SelectItem>
                        <SelectItem value="EUR" className="text-white">
                          EUR (€)
                        </SelectItem>
                        <SelectItem value="GBP" className="text-white">
                          GBP (£)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white">Tax Rate (%)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={creditSystem.billingSettings?.taxRate || 0}
                      onChange={(e) =>
                        updateCreditSystem({
                          billingSettings: {
                            ...creditSystem.billingSettings,
                            taxRate: Number.parseFloat(e.target.value) || 0,
                          },
                        })
                      }
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Preview */}
          {(creditSystem.packages || []).length > 0 && (
            <Card className="bg-white/5 border-white/10">
              <CardHeader>
                <CardTitle className="text-white">Package Preview</CardTitle>
                <CardDescription className="text-gray-300">
                  How your credit packages will appear to customers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {(creditSystem.packages || []).map((pkg: any) => (
                    <Card
                      key={pkg.id}
                      className={`bg-white/10 border-white/20 relative ${pkg.popular ? "ring-2 ring-purple-500/50" : ""}`}
                    >
                      {pkg.popular && (
                        <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                          Popular
                        </Badge>
                      )}
                      <CardHeader className="text-center">
                        <CardTitle className="text-white">{pkg.name}</CardTitle>
                        <div className="text-2xl font-bold text-white">
                          {(pkg.credits + pkg.bonus).toLocaleString()} Credits
                        </div>
                        <div className="text-lg text-purple-400">${pkg.price}</div>
                        {pkg.bonus > 0 && (
                          <Badge variant="secondary" className="bg-green-500/20 text-green-300">
                            +{pkg.bonus} Bonus Credits
                          </Badge>
                        )}
                        <div className="text-xs text-gray-400">Valid for {pkg.validityDays} days</div>
                      </CardHeader>
                      <CardContent>
                        <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white">
                          Purchase Credits
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}
