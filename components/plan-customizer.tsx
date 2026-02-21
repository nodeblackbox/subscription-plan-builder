"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Star, Check, X, Calendar } from "lucide-react"

interface PlanCustomizerProps {
  data: any
  setData: (data: any) => void
}

const defaultPlan = {
  id: Date.now(),
  name: "New Plan",
  price: 0,
  billing: "monthly",
  description: "Plan description",
  features: [],
  highlighted: false,
  buttonText: "Get Started",
  color: "purple",
  trialDays: 0,
  setupFee: 0,
  currency: "USD",
}

const colorOptions = [
  {
    name: "Purple",
    value: "purple",
    class: "from-purple-500 to-pink-500",
    bg: "bg-purple-600",
    hover: "hover:bg-purple-700",
  },
  { name: "Blue", value: "blue", class: "from-blue-500 to-cyan-500", bg: "bg-blue-600", hover: "hover:bg-blue-700" },
  {
    name: "Green",
    value: "green",
    class: "from-green-500 to-emerald-500",
    bg: "bg-green-600",
    hover: "hover:bg-green-700",
  },
  {
    name: "Orange",
    value: "orange",
    class: "from-orange-500 to-red-500",
    bg: "bg-orange-600",
    hover: "hover:bg-orange-700",
  },
  {
    name: "Indigo",
    value: "indigo",
    class: "from-indigo-500 to-purple-500",
    bg: "bg-indigo-600",
    hover: "hover:bg-indigo-700",
  },
]

const billingOptions = [
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "weekly", label: "Weekly" },
]

export function PlanCustomizer({ data, setData }: PlanCustomizerProps) {
  const [plans, setPlans] = useState(data.plans || [])

  const addPlan = () => {
    const newPlan = { ...defaultPlan, id: Date.now() }
    const updatedPlans = [...plans, newPlan]
    setPlans(updatedPlans)
    setData({ ...data, plans: updatedPlans })
  }

  const updatePlan = (planId: number, updates: any) => {
    const updatedPlans = plans.map((plan: any) => (plan.id === planId ? { ...plan, ...updates } : plan))
    setPlans(updatedPlans)
    setData({ ...data, plans: updatedPlans })
  }

  const deletePlan = (planId: number) => {
    const updatedPlans = plans.filter((plan: any) => plan.id !== planId)
    setPlans(updatedPlans)
    setData({ ...data, plans: updatedPlans })
  }

  const addFeature = (planId: number) => {
    const plan = plans.find((p: any) => p.id === planId)
    if (plan) {
      const updatedFeatures = [...(plan.features || []), { text: "New feature", included: true }]
      updatePlan(planId, { features: updatedFeatures })
    }
  }

  const updateFeature = (planId: number, featureIndex: number, updates: any) => {
    const plan = plans.find((p: any) => p.id === planId)
    if (plan) {
      const updatedFeatures = plan.features.map((feature: any, index: number) =>
        index === featureIndex ? { ...feature, ...updates } : feature,
      )
      updatePlan(planId, { features: updatedFeatures })
    }
  }

  const removeFeature = (planId: number, featureIndex: number) => {
    const plan = plans.find((p: any) => p.id === planId)
    if (plan) {
      const updatedFeatures = plan.features.filter((_: any, index: number) => index !== featureIndex)
      updatePlan(planId, { features: updatedFeatures })
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-white mb-4">Customize Your Plans</h2>
        <p className="text-gray-300 text-lg max-w-2xl mx-auto">
          Design beautiful pricing cards that convert. Add features, set pricing, trials, and customize the look.
        </p>
      </div>

      {plans.length === 0 && (
        <Card className="bg-white/5 border-white/10 border-dashed">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">No Plans Yet</h3>
            <p className="text-gray-300 mb-6">Create your first pricing plan to get started</p>
            <Button
              onClick={addPlan}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Plan
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        {plans.map((plan: any) => (
          <Card key={plan.id} className="bg-white/5 border-white/10">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white">Plan Configuration</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePlan(plan.id)}
                  className="border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Plan Name</Label>
                  <Input
                    value={plan.name}
                    onChange={(e) => updatePlan(plan.id, { name: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
                <div>
                  <Label className="text-white">Price ($)</Label>
                  <Input
                    type="number"
                    value={plan.price}
                    onChange={(e) => updatePlan(plan.id, { price: Number.parseFloat(e.target.value) || 0 })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Billing and Trial */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white">Billing Cycle</Label>
                  <Select value={plan.billing} onValueChange={(billing) => updatePlan(plan.id, { billing })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-white/20">
                      {billingOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white hover:bg-white/10">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-white flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Trial Days
                  </Label>
                  <Input
                    type="number"
                    value={plan.trialDays}
                    onChange={(e) => updatePlan(plan.id, { trialDays: Number.parseInt(e.target.value) || 0 })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Setup Fee */}
              <div>
                <Label className="text-white">Setup Fee ($)</Label>
                <Input
                  type="number"
                  value={plan.setupFee}
                  onChange={(e) => updatePlan(plan.id, { setupFee: Number.parseFloat(e.target.value) || 0 })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  placeholder="0"
                />
              </div>

              <div>
                <Label className="text-white">Description</Label>
                <Textarea
                  value={plan.description}
                  onChange={(e) => updatePlan(plan.id, { description: e.target.value })}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  rows={2}
                />
              </div>

              {/* Color Selection */}
              <div>
                <Label className="text-white mb-3 block">Color Theme</Label>
                <div className="flex gap-2">
                  {colorOptions.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => updatePlan(plan.id, { color: color.value })}
                      className={`w-8 h-8 rounded-full bg-gradient-to-r ${color.class} ${
                        plan.color === color.value ? "ring-2 ring-white ring-offset-2 ring-offset-slate-900" : ""
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Settings */}
              <div className="flex items-center justify-between">
                <Label className="text-white">Highlight as Popular</Label>
                <Switch
                  checked={plan.highlighted}
                  onCheckedChange={(checked) => updatePlan(plan.id, { highlighted: checked })}
                />
              </div>

              {/* Features */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-white">Features</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => addFeature(plan.id)}
                    className="border-white/20 text-white hover:bg-white/10 bg-transparent"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Feature
                  </Button>
                </div>
                <div className="space-y-2">
                  {(plan.features || []).map((feature: any, index: number) => (
                    <div key={index} className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => updateFeature(plan.id, index, { included: !feature.included })}
                        className={`p-1 h-8 w-8 ${
                          feature.included
                            ? "border-green-500/30 text-green-400 hover:bg-green-500/10 bg-transparent"
                            : "border-red-500/30 text-red-400 hover:bg-red-500/10 bg-transparent"
                        }`}
                      >
                        {feature.included ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                      </Button>
                      <Input
                        value={feature.text}
                        onChange={(e) => updateFeature(plan.id, index, { text: e.target.value })}
                        className="bg-white/10 border-white/20 text-white flex-1 placeholder:text-gray-400"
                        placeholder="Feature description"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeFeature(plan.id, index)}
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10 p-1 h-8 w-8 bg-transparent"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {plans.length > 0 && (
        <div className="text-center">
          <Button
            onClick={addPlan}
            variant="outline"
            className="border-white/20 text-white hover:bg-white/10 bg-transparent"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Another Plan
          </Button>
        </div>
      )}

      {/* Preview */}
      {plans.length > 0 && (
        <Card className="bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Live Preview</CardTitle>
            <CardDescription className="text-gray-300">See how your plans will look to customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plans.map((plan: any) => {
                const colorOption = colorOptions.find((c) => c.value === plan.color) || colorOptions[0]

                return (
                  <Card
                    key={plan.id}
                    className={`relative bg-white/10 border-white/20 ${plan.highlighted ? "ring-2 ring-purple-500/50" : ""}`}
                  >
                    {plan.highlighted && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <CardTitle className="text-white text-xl">{plan.name}</CardTitle>
                      <div className="text-3xl font-bold text-white">
                        ${plan.price}
                        <span className="text-sm text-gray-300 font-normal">/{plan.billing}</span>
                      </div>
                      {plan.trialDays > 0 && (
                        <Badge variant="secondary" className="bg-green-500/20 text-green-300 border-green-500/30">
                          <Calendar className="w-3 h-3 mr-1" />
                          {plan.trialDays} day free trial
                        </Badge>
                      )}
                      <CardDescription className="text-gray-300">{plan.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-2">
                        {(plan.features || []).map((feature: any, index: number) => (
                          <li key={index} className="flex items-center text-sm">
                            {feature.included ? (
                              <Check className="w-4 h-4 text-green-400 mr-3" />
                            ) : (
                              <X className="w-4 h-4 text-red-400 mr-3" />
                            )}
                            <span className={feature.included ? "text-white" : "text-gray-400 line-through"}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                      <Button className={`w-full ${colorOption.bg} ${colorOption.hover} text-white`}>
                        {plan.buttonText || "Get Started"}
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
